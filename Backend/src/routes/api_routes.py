from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header, UploadFile, Form, File
from sqlmodel import Session, select

from src.model.api_model import APIModel
from src.database.database_config import get_session
from src.model.common_response_model import CommonResponse
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session, select
from src.model.api_model import APIModel
from src.database.database_config import get_session
from src.model.common_response_model import CommonResponse
from src.services.model_trainer_service import train_and_save_model
import pickle
import os, shutil


apiRouter = APIRouter(prefix="/api", tags=["API"])

UPLOAD_DIR = "uploads"
MODEL_DIR = "models"
ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls", ".json"}


def is_valid_file(filename: str) -> bool:
    ext = os.path.splitext(filename)[1].lower()
    return ext in ALLOWED_EXTENSIONS


@apiRouter.post("/create", response_model=CommonResponse)
async def create_api_entry(
    email: str = Form(...),
    api_name: str = Form(...),
    model_name: str = Form(...),
    model_type: str = Form(...),  # e.g., "linear_regression", "decision_tree"
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
):
    # ✅ Validate and extract username
    if "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email format")
    username = email.split("@")[0]

    # ✅ Validate file
    if not is_valid_file(file.filename):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only CSV, Excel, and JSON files are allowed.",
        )

    # ✅ Check for duplicate model
    existing = session.exec(
        select(APIModel).where(
            APIModel.username == username,
            APIModel.model_name == model_name
        )
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Model name already exists for this user")

    # ✅ Save uploaded dataset
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, f"{username}_{model_name}_{file.filename}")
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # ✅ Train and save model
    os.makedirs(MODEL_DIR, exist_ok=True)
    model_path = os.path.join(MODEL_DIR, f"{username}_{model_name}.pkl")
    try:
        train_and_save_model(file_path, model_type, model_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model training failed: {str(e)}")

    # ✅ Build API path
    api_path = f"/api/{username}/models/{model_name}/predict"

    # ✅ Save to DB
    api = APIModel(
        email=email,
        username=username,
        api_name=api_name,
        api_path=api_path,
        model_name=model_name,
        model_type=model_type,
        model_path=model_path,
        createdAt=datetime.utcnow()
    )

    session.add(api)
    session.commit()
    session.refresh(api)

    return CommonResponse(success=True, message="API created successfully", data=api)

# ✅ Public prediction API (secured by x-api-key)
@apiRouter.post("/{username}/models/{model_name}/predict", response_model=CommonResponse)
async def run_model_prediction(
    username: str,
    model_name: str,
    request: Request,
    x_api_key: str = Header(..., alias="x-api-key"),
    session: Session = Depends(get_session),
):
    # ✅ 1. Validate API credentials
    record = session.exec(
        select(APIModel).where(
            APIModel.username == username,
            APIModel.model_name == model_name,
            APIModel.api_key == x_api_key,
        )
    ).first()

    if not record:
        raise HTTPException(status_code=403, detail="Invalid API key or model credentials")

    # ✅ 2. Check model file exists
    if not os.path.exists(record.model_path):
        raise HTTPException(status_code=404, detail="Model file not found")

    # ✅ 3. Load model from disk
    try:
        with open(record.model_path, "rb") as f:
            model = pickle.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load model: {str(e)}")

    # ✅ 4. Parse input data
    try:
        input_data = await request.json()
        if not isinstance(input_data, dict):
            raise ValueError("Input data must be a JSON object")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON input: {str(e)}")

    # ✅ 5. Predict with model
    try:
        input_values = list(input_data.values())
        if hasattr(model, "n_features_in_") and len(input_values) != model.n_features_in_:
            raise ValueError(
                f"Model expects {model.n_features_in_} features, got {len(input_values)}"
            )

        prediction = model.predict([input_values])
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

    return CommonResponse(
        success=True,
        message="Prediction successful",
        data={
            "input": input_data,
            "prediction": prediction[0] if hasattr(prediction, "__getitem__") else prediction,
        },
    )

@apiRouter.get("/view-api/{api_id}", response_model=CommonResponse)
def view_api(api_id: int, session: Session = Depends(get_session)):
    api = session.get(APIModel, api_id)
    if not api:
        raise HTTPException(status_code=404, detail="API not found")
    return CommonResponse(success=True, message="API details", data=api)


@apiRouter.delete("/delete-api/{api_id}", response_model=CommonResponse)
def delete_api(api_id: int, session: Session = Depends(get_session)):
    api = session.get(APIModel, api_id)
    if not api:
        raise HTTPException(status_code=404, detail="API not found")

    # Delete model file
    if api.model_path and os.path.exists(api.model_path):
        os.remove(api.model_path)

    session.delete(api)
    session.commit()

    return CommonResponse(success=True, message="API deleted", data={"id": api_id})
