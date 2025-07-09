from fastapi import APIRouter, Depends, HTTPException, Path
from sqlmodel import Session, select
# from typing import Optional
from datetime import datetime

from src.model.user_model import UserModel
from src.model.common_response_model import CommonResponse
from src.database.database_config import get_session

userRouter = APIRouter(prefix="/users", tags=["Users"])

# ✅ Get user by ID
@userRouter.get("/{user_id}", response_model=CommonResponse)
def get_user_by_id(
    user_id: int = Path(..., description="ID of the user"),
    session: Session = Depends(get_session),
):
    user = session.get(UserModel, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return CommonResponse(success=True, message="User retrieved", data=user)


# ✅ Update user
@userRouter.put("/{user_id}", response_model=CommonResponse)
def update_user_by_id(
    user_id: int,
    updated_data: UserModel,
    session: Session = Depends(get_session),
):
    user = session.get(UserModel, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = updated_data.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(user, key, value)

    user.updatedAt = datetime.utcnow()

    session.add(user)
    session.commit()
    session.refresh(user)

    return CommonResponse(success=True, message="User updated", data=user)
