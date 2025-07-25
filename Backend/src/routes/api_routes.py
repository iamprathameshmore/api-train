from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header, UploadFile, File, Request
from src.model.api_model import APIModel, APIKeyModel, AuditLogModel
from src.model.common_response_model import CommonResponse
from src.services.model_trainer_service import train_and_save_model
import pickle
import os, shutil
from src.middleware.rate_limit_middleware import limiter
from src.dto.api_dto import CreateAPIRequest
from pydantic import conint, constr
from src.model.api_usage_model import APIUsage
from typing import List
from src.services.analytics_service import log_api_usage
import pandas as pd
from src.services.google_sheets_service import fetch_sheet_as_dataframe
from src.services.send_mail_service import send_notification_email
import requests
from src.model.user_model import UserModel
from src.utils.jwt_util import decode_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from beanie.odm.documents import DocumentNotFound
import razorpay
import hmac
import hashlib
import base64
from src.services.razorpay_service import create_order, verify_webhook_signature

security = HTTPBearer()

async def get_current_user_role(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials
    payload = decode_token(token)
    user_id = payload["sub"]
    user = await UserModel.get(user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

apiRouter = APIRouter(prefix="/api", tags=["API"])

UPLOAD_DIR = "uploads"
MODEL_DIR = "models"
ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls", ".json"}

def is_valid_file(filename: str) -> bool:
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXTENSIONS

@apiRouter.post("/create", response_model=CommonResponse)
@limiter.limit("5/minute")
async def create_api_entry(
    payload: CreateAPIRequest = Depends(),
    file: UploadFile = File(...),
    request: Request = None,
    user=Depends(get_current_user_role),
):
    email = payload.email
    if user.role != "admin" and user.email != email:
        raise HTTPException(status_code=403, detail="Not authorized to create model for this user.")
    api_name = payload.api_name
    model_name = payload.model_name
    model_type = payload.model_type
    if "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email format")
    username = email.split("@")[0]
    if not is_valid_file(file.filename):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only CSV, Excel, and JSON files are allowed.",
        )
    existing_versions = await APIModel.find(
        APIModel.username == username, APIModel.model_name == model_name
    ).to_list()
    version = 1
    if existing_versions:
        version = max([m.version for m in existing_versions]) + 1
        for m in existing_versions:
            if m.is_active:
                m.is_active = False
                await m.save()
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, f"{username}_{model_name}_{file.filename}")
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    os.makedirs(MODEL_DIR, exist_ok=True)
    model_path = os.path.join(MODEL_DIR, f"{username}_{model_name}.pkl")
    try:
        train_and_save_model(file_path, model_type, model_path)
    except Exception as e:
        await log_api_usage(api_id="0", user_id="0", endpoint=str(request.url.path), status_code=500)
        raise HTTPException(status_code=500, detail=f"Model training failed: {str(e)}")
    api_path = f"/api/{username}/models/{model_name}/predict"
    api = APIModel(
        email=email,
        username=username,
        api_name=api_name,
        api_path=api_path,
        model_name=model_name,
        model_type=model_type,
        model_path=model_path,
        version=version,
        is_active=True,
        createdAt=datetime.utcnow()
    )
    await api.insert()
    api_key = APIKeyModel(api_model=api)
    await api_key.insert()
    try:
        send_notification_email(
            email=email,
            subject=f"Model '{model_name}' Created",
            body=f"Your model '{model_name}' (version {version}) has been created and is ready to use."
        )
    except Exception as e:
        print(f"[WARN] Could not send model creation notification: {e}")
    user_obj = await UserModel.find_one(UserModel.email == email)
    if user_obj and user_obj.webhook_url:
        try:
            requests.post(user_obj.webhook_url, json={
                "event": "model_created",
                "model_name": model_name,
                "version": version,
                "timestamp": datetime.utcnow().isoformat()
            }, timeout=5)
        except Exception as e:
            print(f"[WARN] Could not send model creation webhook: {e}")
    await log_api_usage(api_id=str(api.id), user_id=str(api.id), endpoint=str(request.url.path), status_code=200)
    audit = AuditLogModel(
        user_id=str(user.id),
        action="create_model",
        target_type="model",
        target_id=str(api.id),
        details=f"Model '{model_name}' version {version} created."
    )
    await audit.insert()
    return CommonResponse(success=True, message="API created successfully", data=api.dict())

# ✅ Public prediction API (secured by x-api-key)
@apiRouter.post("/{username}/models/{model_name}/predict", response_model=CommonResponse)
async def run_model_prediction(
    username: constr(min_length=1, max_length=100),
    model_name: constr(min_length=1, max_length=100),
    request: Request,
    x_api_key: str = Header(..., alias="x-api-key"),
):
    try:
        record = await APIModel.find_one(
            APIModel.username == username,
            APIModel.model_name == model_name,
            APIModel.is_active == True
        )
    except DocumentNotFound:
        await log_api_usage(api_id="0", user_id="0", endpoint=str(request.url.path), status_code=403)
        raise HTTPException(status_code=403, detail="Model not found or not active")
    try:
        key_record = await APIKeyModel.find_one(
            APIKeyModel.api_model == record,
            APIKeyModel.key == x_api_key,
            APIKeyModel.is_active == True
        )
    except DocumentNotFound:
        await log_api_usage(api_id=str(record.id), user_id=str(record.id), endpoint=str(request.url.path), status_code=403)
        raise HTTPException(status_code=403, detail="Invalid or inactive API key")

    if not os.path.exists(record.model_path):
        await log_api_usage(api_id=str(record.id), user_id=str(record.id), endpoint=str(request.url.path), status_code=404)
        raise HTTPException(status_code=404, detail="Model file not found")

    try:
        with open(record.model_path, "rb") as f:
            model = pickle.load(f)
    except Exception as e:
        await log_api_usage(api_id=str(record.id), user_id=str(record.id), endpoint=str(request.url.path), status_code=500)
        raise HTTPException(status_code=500, detail=f"Failed to load model: {str(e)}")

    try:
        input_data = await request.json()
        if not isinstance(input_data, dict):
            raise ValueError("Input data must be a JSON object")
    except Exception as e:
        await log_api_usage(api_id=str(record.id), user_id=str(record.id), endpoint=str(request.url.path), status_code=400)
        raise HTTPException(status_code=400, detail=f"Invalid JSON input: {str(e)}")

    try:
        input_values = list(input_data.values())
        if hasattr(model, "n_features_in_") and len(input_values) != model.n_features_in_:
            raise ValueError(
                f"Model expects {model.n_features_in_} features, got {len(input_values)}"
            )

        prediction = model.predict([input_values])
    except Exception as e:
        await log_api_usage(api_id=str(record.id), user_id=str(record.id), endpoint=str(request.url.path), status_code=400)
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

    await log_api_usage(api_id=str(record.id), user_id=str(record.id), endpoint=str(request.url.path), status_code=200)
    return CommonResponse(
        success=True,
        message="Prediction successful",
        data={
            "input": input_data,
            "prediction": prediction[0] if hasattr(prediction, "__getitem__") else prediction,
        },
    )

@apiRouter.post("/{username}/models/{model_name}/batch-predict", response_model=CommonResponse)
async def run_batch_prediction(
    username: constr(min_length=1, max_length=100),
    model_name: constr(min_length=1, max_length=100),
    file: UploadFile = File(...),
    x_api_key: str = Header(..., alias="x-api-key"),
    request: Request = None,
):
    try:
        record = await APIModel.find_one(
            APIModel.username == username,
            APIModel.model_name == model_name,
            APIModel.is_active == True
        )
    except DocumentNotFound:
        await log_api_usage(api_id="0", user_id="0", endpoint=str(request.url.path), status_code=403)
        raise HTTPException(status_code=403, detail="Model not found or not active")
    try:
        key_record = await APIKeyModel.find_one(
            APIKeyModel.api_model == record,
            APIKeyModel.key == x_api_key,
            APIKeyModel.is_active == True
        )
    except DocumentNotFound:
        await log_api_usage(api_id=str(record.id), user_id=str(record.id), endpoint=str(request.url.path), status_code=403)
        raise HTTPException(status_code=403, detail="Invalid or inactive API key")

    if not os.path.exists(record.model_path):
        await log_api_usage(api_id=str(record.id), user_id=str(record.id), endpoint=str(request.url.path), status_code=404)
        raise HTTPException(status_code=404, detail="Model file not found")

    try:
        with open(record.model_path, "rb") as f:
            model = pickle.load(f)
    except Exception as e:
        await log_api_usage(api_id=str(record.id), user_id=str(record.id), endpoint=str(request.url.path), status_code=500)
        raise HTTPException(status_code=500, detail=f"Failed to load model: {str(e)}")

    ext = file.filename.lower().split('.')[-1]
    try:
        if ext == "csv":
            df = pd.read_csv(file.file)
        elif ext in ["xlsx", "xls"]:
            df = pd.read_excel(file.file)
        elif ext == "json":
            df = pd.read_json(file.file)
        else:
            raise ValueError("Unsupported file format. Only csv, xlsx, xls, json supported.")
    except Exception as e:
        await log_api_usage(api_id=str(record.id), user_id=str(record.id), endpoint=str(request.url.path), status_code=400)
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

    try:
        predictions = model.predict(df.values)
    except Exception as e:
        await log_api_usage(api_id=str(record.id), user_id=str(record.id), endpoint=str(request.url.path), status_code=400)
        raise HTTPException(status_code=400, detail=f"Batch prediction failed: {str(e)}")

    await log_api_usage(api_id=str(record.id), user_id=str(record.id), endpoint=str(request.url.path), status_code=200)
    return CommonResponse(
        success=True,
        message="Batch prediction successful",
        data={
            "predictions": predictions.tolist(),
        },
    )

@apiRouter.post("/import-google-sheet", response_model=CommonResponse)
async def import_google_sheet(sheet_url: str, worksheet_name: str = None):
    try:
        df = await fetch_sheet_as_dataframe(sheet_url, worksheet_name)
    except Exception as e:
        return CommonResponse(success=False, message=f"Failed to import Google Sheet: {str(e)}", data=None)
    return CommonResponse(success=True, message="Sheet imported successfully", data=df.to_dict(orient="records"))

@apiRouter.get("/view-api/{api_id}", response_model=CommonResponse)
async def view_api(api_id: conint(gt=0)):
    try:
        api = await APIModel.get(api_id)
    except DocumentNotFound:
        raise HTTPException(status_code=404, detail="API not found")
    return CommonResponse(success=True, message="API details", data=api.dict())


@apiRouter.delete("/delete-api/{api_id}", response_model=CommonResponse)
async def delete_api(api_id: conint(gt=0)):
    try:
        api = await APIModel.get(api_id)
    except DocumentNotFound:
        raise HTTPException(status_code=404, detail="API not found")

    if api.model_path and os.path.exists(api.model_path):
        os.remove(api.model_path)

    await api.delete()

    return CommonResponse(success=True, message="API deleted", data={"id": api_id})

@apiRouter.get("/usage/{api_id}", response_model=List[APIUsage])
async def get_api_usage(api_id: conint(gt=0)):
    try:
        return await APIUsage.find(APIUsage.api_id == api_id).to_list()
    except DocumentNotFound:
        raise HTTPException(status_code=404, detail="API not found")

@apiRouter.get("/{username}/models/{model_name}/versions", response_model=CommonResponse)
async def list_model_versions(
    username: str,
    model_name: str,
):
    try:
        versions = await APIModel.find(
            APIModel.username == username,
            APIModel.model_name == model_name
        ).order_by("-version").to_list()
    except DocumentNotFound:
        raise HTTPException(status_code=404, detail="No versions found for this model.")
    return CommonResponse(success=True, message="Model versions retrieved", data=versions)

@apiRouter.post("/{username}/models/{model_name}/rollback/{version}", response_model=CommonResponse)
async def rollback_model_version(
    username: str,
    model_name: str,
    version: int,
):
    try:
        versions = await APIModel.find(
            APIModel.username == username,
            APIModel.model_name == model_name
        ).to_list()
    except DocumentNotFound:
        raise HTTPException(status_code=404, detail="No versions found for this model.")
    found = False
    for m in versions:
        if m.version == version:
            m.is_active = True
            found = True
        else:
            m.is_active = False
        await m.save()
    if not found:
        raise HTTPException(status_code=404, detail="Requested version not found.")
    return CommonResponse(success=True, message=f"Rolled back to version {version}", data=None)

@apiRouter.get("/{username}/models/{model_name}/keys", response_model=CommonResponse)
async def list_api_keys(
    username: str,
    model_name: str,
):
    try:
        model = await APIModel.find_one(
            APIModel.username == username,
            APIModel.model_name == model_name,
            APIModel.is_active == True
        )
    except DocumentNotFound:
        raise HTTPException(status_code=404, detail="Model not found or not active")
    try:
        keys = await APIKeyModel.find(APIKeyModel.api_model == model).to_list()
    except DocumentNotFound:
        raise HTTPException(status_code=404, detail="No keys found for this model.")
    return CommonResponse(success=True, message="API keys retrieved", data=keys)

@apiRouter.post("/{username}/models/{model_name}/keys", response_model=CommonResponse)
async def regenerate_api_key(
    username: str,
    model_name: str,
):
    try:
        model = await APIModel.find_one(
            APIModel.username == username,
            APIModel.model_name == model_name,
            APIModel.is_active == True
        )
    except DocumentNotFound:
        raise HTTPException(status_code=404, detail="Model not found or not active")
    new_key = APIKeyModel(api_model=model)
    await new_key.insert()
    try:
        send_notification_email(
            email=model.email,
            subject=f"New API Key Generated for '{model_name}'",
            body=f"A new API key has been generated for your model '{model_name}' (version {model.version}). Key: {new_key.key}"
        )
    except Exception as e:
        print(f"[WARN] Could not send API key generation notification: {e}")

    user_obj = await UserModel.find_one(UserModel.email == model.email)
    if user_obj and user_obj.webhook_url:
        try:
            requests.post(user_obj.webhook_url, json={
                "event": "api_key_generated",
                "model_name": model_name,
                "version": model.version,
                "key": new_key.key,
                "timestamp": datetime.utcnow().isoformat()
            }, timeout=5)
        except Exception as e:
            print(f"[WARN] Could not send API key generation webhook: {e}")
    audit = AuditLogModel(
        user_id=str(user_obj.id),
        action="regenerate_key",
        target_type="api_key",
        target_id=str(new_key.id),
        details=f"API key generated for model '{model_name}' version {model.version}."
    )
    await audit.insert()
    return CommonResponse(success=True, message="New API key generated", data=new_key.dict())

@apiRouter.delete("/{username}/models/{model_name}/keys/{key_id}", response_model=CommonResponse)
async def revoke_api_key(
    username: str,
    model_name: str,
    key_id: int,
):
    try:
        model = await APIModel.find_one(
            APIModel.username == username,
            APIModel.model_name == model_name,
            APIModel.is_active == True
        )
    except DocumentNotFound:
        raise HTTPException(status_code=404, detail="Model not found or not active")
    try:
        key = await APIKeyModel.find_one(
            APIKeyModel.api_model == model,
            APIKeyModel.id == key_id
        )
    except DocumentNotFound:
        raise HTTPException(status_code=404, detail="API key not found")
    key.is_active = False
    await key.save()
    try:
        send_notification_email(
            email=model.email,
            subject=f"API Key Revoked for '{model_name}'",
            body=f"An API key (ID: {key_id}) for your model '{model_name}' (version {model.version}) has been revoked."
        )
    except Exception as e:
        print(f"[WARN] Could not send API key revocation notification: {e}")

    user_obj = await UserModel.find_one(UserModel.email == model.email)
    if user_obj and user_obj.webhook_url:
        try:
            requests.post(user_obj.webhook_url, json={
                "event": "api_key_revoked",
                "model_name": model_name,
                "version": model.version,
                "key_id": key_id,
                "timestamp": datetime.utcnow().isoformat()
            }, timeout=5)
        except Exception as e:
            print(f"[WARN] Could not send API key revocation webhook: {e}")
    audit = AuditLogModel(
        user_id=str(user_obj.id),
        action="revoke_key",
        target_type="api_key",
        target_id=str(key.id),
        details=f"API key revoked for model '{model_name}' version {model.version}."
    )
    await audit.insert()
    return CommonResponse(success=True, message="API key revoked", data=None)

@apiRouter.get("/audit-logs", response_model=CommonResponse)
async def get_audit_logs(
    user=Depends(get_current_user_role),
):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized.")
    logs = await AuditLogModel.find().order_by("-timestamp").to_list()
    return CommonResponse(success=True, message="Audit logs retrieved", data=logs)
