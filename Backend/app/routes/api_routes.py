from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from app.model.api_model import APIModel
from app.database.database_config import get_session
from app.model.common_response_model import CommonResponse
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session, select
from app.model.api_model import APIModel
from app.database.database_config import get_session
from app.model.common_response_model import CommonResponse
import pickle
import os

modelRouter = APIRouter(prefix="/run", tags=["Model Execution"])


apiRouter = APIRouter(prefix="/api", tags=["API"])


@apiRouter.post("/create-api", response_model=CommonResponse)
def create_api_entry(api: APIModel, session: Session = Depends(get_session)):
    api.createdAt = datetime.utcnow()
    session.add(api)
    session.commit()
    session.refresh(api)
    return CommonResponse(success=True, message="API created", data=api)

@apiRouter.get("/all-apis", response_model=CommonResponse)
def get_all_apis(session: Session = Depends(get_session)):
    apis = session.exec(select(APIModel)).all()
    return CommonResponse(success=True, message="List of APIs", data=apis)

@apiRouter.put("/update-api/{api_id}", response_model=CommonResponse)
def update_api(api_id: int, updated_data: APIModel, session: Session = Depends(get_session)):
    api = session.get(APIModel, api_id)
    if not api:
        raise HTTPException(status_code=404, detail="API not found")
    
    for key, value in updated_data.dict(exclude_unset=True).items():
        setattr(api, key, value)
    api.updatedAt = datetime.utcnow()

    session.add(api)
    session.commit()
    session.refresh(api)

    return CommonResponse(success=True, message="API updated", data=api)

@apiRouter.delete("/delete-api/{api_id}", response_model=CommonResponse)
def delete_api(api_id: int, session: Session = Depends(get_session)):
    api = session.get(APIModel, api_id)
    if not api:
        raise HTTPException(status_code=404, detail="API not found")

    session.delete(api)
    session.commit()
    return CommonResponse(success=True, message="API deleted", data={"id": api_id})



@apiRouter.post(
    "/{username}/{api_id}",
    summary="Run a saved ML model",
    description="""
This endpoint allows users to run predictions using their saved machine learning model.
- The model is identified using a unique `api_key` and `model_name`.
- Input should be passed as a JSON object in the request body.
""",
    response_model=CommonResponse,
    responses={
        200: {"description": "Prediction successful"},
        400: {"description": "Invalid input or prediction error"},
        403: {"description": "Unauthorized: Invalid API key or model name"},
        404: {"description": "Model file not found"},
        500: {"description": "Model loading error"},
    }
)
async def run_model(
    username: str,
    api_id: int,
    request: Request,
    api_key: str,               # <-- passed as query param
    model_name: str,            # <-- passed as query param
    session: Session = Depends(get_session)
):
    # Validate API model record from DB
    record = session.exec(
        select(APIModel).where(
            APIModel.api_key == api_key,
            APIModel.model_name == model_name
        )
    ).first()

    if not record:
        raise HTTPException(status_code=403, detail="Invalid API key or model name")

    model_path = record.model_path
    if not os.path.exists(model_path):
        raise HTTPException(status_code=404, detail="Model file not found")

    try:
        model = pickle.load(open(model_path, "rb"))
    except Exception:
        raise HTTPException(status_code=500, detail="Error loading model")

    input_data = await request.json()
    try:
        prediction = model.predict([list(input_data.values())])
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Model prediction failed: {str(e)}")

    return CommonResponse(
        success=True,
        message="Prediction successful",
        data={"input": input_data, "prediction": prediction[0]}
    )
