from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.dto.auth_dto import UserLogin
from app.model.user_model import UserModel
from app.database.database_config import get_session
from app.model.common_response_model import CommonResponse

from app.utils.hash_password_utils import *

authRouter = APIRouter(prefix="/auth", tags=["auth"])

@authRouter.post(
    "/login",
    summary="Log in a user",
    description="Logs in a user and returns a JWT access token.",
    response_model=CommonResponse,
    
    responses={
        401: {"description": "Invalid credentials"},
        200: {"description": "Login successful"},
    },
)
def logIn(user: Annotated[UserLogin, Depends(UserLogin.as_form)], session: Session = Depends(get_session)):
    ex_user = session.exec(
        select(UserModel).where(
            (UserModel.username == user.username) 
        )
    ).first()

    if ex_user is None:
        raise HTTPException(status_code=401, detail="User does not exist")

    # TODO: Add password check here

    return CommonResponse(
        success=True,
        message="User login successful",
        data={"user_id": ex_user.id, "email": ex_user.email},
    )


# DTO
class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str
    secret_answer: str

@authRouter.post("/signup", response_model=CommonResponse)
def signup(user: UserSignup, session: Session = Depends(get_session)):
    existing = session.exec(select(UserModel).where(UserModel.username == user.username)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    new_user = UserModel(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),  # implement this securely
        secret_answer=hash_password(user.secret_answer),
        createdAt=datetime.utcnow()
    )
    session.add(new_user)
    session.commit()

    return CommonResponse(success=True, message="User registered successfully", data=None)


class ForgotPasswordDTO(BaseModel):
    username: str
    secret_answer: str
    new_password: str

@authRouter.post("/forgot-password", response_model=CommonResponse)
def forgot_password(payload: ForgotPasswordDTO, session: Session = Depends(get_session)):
    user = session.exec(select(UserModel).where(UserModel.username == payload.username)).first()

    if not user or not verify_password(payload.secret_answer, user.secret_answer):
        raise HTTPException(status_code=401, detail="Incorrect secret answer")

    user.password = hash_password(payload.new_password)
    user.updatedAt = datetime.utcnow()
    session.add(user)
    session.commit()

    return CommonResponse(success=True, message="Password reset successful", data=None)

class ChangePasswordDTO(BaseModel):
    old_password: str
    new_password: str

@authRouter.post("/change-password", response_model=CommonResponse)
def change_password(
    payload: ChangePasswordDTO,
    session: Session = Depends(get_session),
    current_user: UserModel = Depends(get_current_user)  # You need JWT auth here
):
    if not verify_password(payload.old_password, current_user.password):
        raise HTTPException(status_code=401, detail="Old password is incorrect")

    current_user.password = hash_password(payload.new_password)
    current_user.updatedAt = datetime.utcnow()
    session.add(current_user)
    session.commit()

    return CommonResponse(success=True, message="Password changed", data=None)
