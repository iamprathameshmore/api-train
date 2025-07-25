from fastapi import APIRouter, HTTPException, Path, Depends
from datetime import datetime
from beanie.odm.documents import DocumentNotFound
from src.model.user_model import UserModel
from src.model.common_response_model import CommonResponse
from pydantic import BaseModel
from src.model.api_model import APIModel, APIKeyModel
from src.routes.api_routes import AuditLogModel
from src.routes.api_routes import get_current_user_role

userRouter = APIRouter(prefix="/users", tags=["Users"])

class UpdateUserDTO(BaseModel):
    name: str | None = None
    email: str | None = None
    phoneNumber: str | None = None
    webhook_url: str | None = None

@userRouter.get("/{user_id}", response_model=CommonResponse)
async def get_user_by_id(user_id: str = Path(..., description="ID of the user")):
    user = await UserModel.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return CommonResponse(success=True, message="User retrieved", data=user.dict())

@userRouter.put("/{user_id}", response_model=CommonResponse)
async def update_user_by_id(user_id: str, updated_data: UpdateUserDTO):
    user = await UserModel.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    update_data = updated_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)
    user.updatedAt = datetime.utcnow()
    await user.save()
    return CommonResponse(success=True, message="User updated", data=user.dict())

@userRouter.delete("/{user_id}/delete-account", response_model=CommonResponse)
async def delete_account(user_id: str, user=Depends(get_current_user_role)):
    if user.role != "admin" and str(user.id) != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this account.")
    user_obj = await UserModel.get(user_id)
    if not user_obj:
        raise HTTPException(status_code=404, detail="User not found")
    # Delete all models and API keys
    models = await APIModel.find(APIModel.email == user_obj.email).to_list()
    for m in models:
        keys = await APIKeyModel.find(APIKeyModel.api_model == m).to_list()
        for k in keys:
            await k.delete()
        await m.delete()
    # Delete audit logs
    await AuditLogModel.find(AuditLogModel.user_id == user_id).delete()
    # Delete user
    await user_obj.delete()
    return CommonResponse(success=True, message="Account and all related data deleted.", data=None)
