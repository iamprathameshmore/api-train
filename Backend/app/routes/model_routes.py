from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
import os


from app.model.model_file import ModelFile
from app.database.database_config import get_session

apiRouter = APIRouter(prefix="/api", tags=["API"])

UPLOAD_DIR = "uploads"


# 5. Download model file
@apiRouter.get("/models/{model_name}", response_model=None)
def download_model(model_name: str, session: Session = Depends(get_session)):
    model = session.exec(select(ModelFile).where(ModelFile.name == model_name)).first()
    if not model or not os.path.exists(model.file_path):
        raise HTTPException(status_code=404, detail="Model not found")
    
    return FileResponse(path=model.file_path, filename=os.path.basename(model.file_path))
