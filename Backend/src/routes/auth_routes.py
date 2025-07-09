from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlmodel import Session, select
from datetime import datetime, timedelta
from fastapi.responses import JSONResponse


from src.utils.jwt_util import *
from src.model.user_model import UserModel
from src.database.database_config import get_session
from src.model.common_response_model import CommonResponse
from src.utils.generate_otp_util import generate_otp
from src.dto.auth_dto import SignupDTO, LoginDTO, VerifyOtpDTO
from src.services.send_mail_service import send_otp

authRouter = APIRouter(prefix="/auth", tags=["auth"])


@authRouter.post("/signup", response_model=CommonResponse)
def signup(payload: SignupDTO, session: Session = Depends(get_session)):
    existing = session.exec(
        select(UserModel).where(UserModel.email == payload.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    otp = generate_otp()
    send_otp(payload.email, otp)

    user = UserModel(
        name=payload.name,
        email=payload.email,
        phoneNumber=payload.phoneNumber,
        otp=otp,
        purpose="signup",
        expires_at=datetime.utcnow() + timedelta(minutes=5),
    )
    session.add(user)
    session.commit()

    return CommonResponse(success=True, message="OTP sent to email", data=None)


@authRouter.post("/login", response_model=CommonResponse)
def login(payload: LoginDTO, session: Session = Depends(get_session)):
    user = session.exec(
        select(UserModel).where(UserModel.email == payload.email)
    ).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    otp = generate_otp()
    send_otp(user.email, otp)

    user.otp = otp
    user.expires_at = datetime.utcnow() + timedelta(minutes=5)
    user.purpose = "login"
    session.add(user)
    session.commit()

    return CommonResponse(
        success=True, message="OTP sent to registered email", data=None
    )


@authRouter.post("/verify", response_model=None)
def verify_otp(payload: VerifyOtpDTO, session: Session = Depends(get_session)):
    user = session.exec(
        select(UserModel).where(UserModel.email == payload.email)
    ).first()
    if not user or user.otp != payload.otp or user.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Invalid or expired OTP")

    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    # Clear OTP after use
    user.otp = None
    user.expires_at = None
    session.add(user)
    session.commit()

    response = JSONResponse(
        content={
            "success": True,
            "message": "OTP verified",
            "data": {"access_token": access_token},
        }
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=7 * 24 * 60 * 60,
    )
    return response


@authRouter.post("/refresh-token")
def refresh_token(request: Request, session: Session = Depends(get_session)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    try:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=403, detail="Invalid token type")
    except Exception:
        raise HTTPException(status_code=403, detail="Invalid or expired refresh token")

    user = session.get(UserModel, payload.get("sub"))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_access_token = create_access_token({"sub": str(user.id)})
    return {"success": True, "access_token": new_access_token}
