from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlmodel import Session, select
from typing import List
import shutil
import os

from app.model.user_model import UserModel
from app.model.dataset_model import DatasetModel
from app.model.model_file import ModelFile
from app.database.database_config import get_session
from app.model.common_response_model import CommonResponse

apiRouter = APIRouter(prefix="/api", tags=["API"])

UPLOAD_DIR = "uploads"



@apiRouter.post("/datasets/upload", response_model=CommonResponse)
def upload_dataset(
    name: str,
    file: UploadFile = File(...),
    session: Session = Depends(get_session)
):
    filepath = os.path.join(UPLOAD_DIR, file.filename)
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    dataset = DatasetModel(name=name, file_path=filepath)
    session.add(dataset)
    session.commit()
    session.refresh(dataset)

    return CommonResponse(success=True, message="Dataset uploaded", data={"id": dataset.id})


# 4. View Datasets
@apiRouter.get("/datasets", response_model=CommonResponse)
def list_datasets(session: Session = Depends(get_session)):
    datasets = session.exec(select(DatasetModel)).all()
    return CommonResponse(success=True, message="All datasets", data=datasets)

