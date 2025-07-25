from fastapi import APIRouter, HTTPException, Request, Header
from datetime import datetime, timedelta
from fastapi.responses import JSONResponse
from beanie.odm.documents import DocumentNotFound

from src.utils.jwt_util import *
from src.model.user_model import UserModel
from src.model.common_response_model import CommonResponse
from src.utils.generate_otp_util import generate_otp
from src.config.settings import JWT_SECRET_KEY, SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, FROM_EMAIL, APP_NAME
from src.dto.auth_dto import SignupDTO, LoginDTO, VerifyOtpDTO
from src.services.send_mail_service import send_otp

authRouter = APIRouter(prefix="/auth", tags=["auth"])

@authRouter.post("/signup", response_model=CommonResponse)
async def signup(payload: SignupDTO):
    existing = await UserModel.find_one({"email": payload.email})
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
    await user.insert()
    return CommonResponse(success=True, message="OTP sent to email", data=None)

@authRouter.post("/login", response_model=CommonResponse)
async def login(payload: LoginDTO):
    user = await UserModel.find_one({"email": payload.email})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    otp = generate_otp()
    send_otp(user.email, otp)
    user.otp = otp
    user.expires_at = datetime.utcnow() + timedelta(minutes=5)
    user.purpose = "login"
    await user.save()
    return CommonResponse(success=True, message="OTP sent to registered email", data=None)

@authRouter.post("/verify", response_model=None)
async def verify_otp(payload: VerifyOtpDTO):
    user = await UserModel.find_one({"email": payload.email})
    if not user or user.otp != payload.otp or user.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Invalid or expired OTP")
    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id), "role": user.role})
    user.otp = None
    user.expires_at = None
    await user.save()
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
async def refresh_token(request: Request):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")
    try:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=403, detail="Invalid token type")
    except Exception:
        raise HTTPException(status_code=403, detail="Invalid or expired refresh token")
    user = await UserModel.get(payload.get("sub"))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    new_access_token = create_access_token({"sub": str(user.id)})
    return {"success": True, "access_token": new_access_token}
