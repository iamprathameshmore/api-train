from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session, select
from datetime import datetime, timedelta
from fastapi.responses import JSONResponse


from app.utils.jwt_util import *
from app.model.user_model import UserModel
from app.model.otp_model import OtpModel
from app.database.database_config import get_session
from app.model.common_response_model import CommonResponse
from app.utils.generate_otp_util import generate_otp
from app.dto.auth_dto import SignupDTO, LoginDTO, VerifyOtpDTO
from app.services.send_mail_service import send_otp

authRouter = APIRouter(prefix="/auth", tags=["auth"])


@authRouter.post("/signup", response_model=CommonResponse)
def signup(payload: SignupDTO, session: Session = Depends(get_session)):
    existing = session.exec(select(UserModel).where(UserModel.email == payload.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    otp = generate_otp()
    send_otp(payload.email, otp)

    session.add(OtpModel(
        email=payload.email,
        otp=otp,
        expires_at=datetime.utcnow() + timedelta(minutes=5),
        purpose="signup",  # Optional: useful if you're tracking purpose
    ))
    session.commit()

    return CommonResponse(success=True, message="OTP sent to email", data=None)


@authRouter.post("/login", response_model=CommonResponse)
def login(payload: LoginDTO, session: Session = Depends(get_session)):
    user = session.exec(select(UserModel).where(UserModel.email == payload.email)).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    otp = generate_otp()
    send_otp(user.email, otp)

    session.add(OtpModel(
        email=user.email,
        otp=otp,
        expires_at=datetime.utcnow() + timedelta(minutes=5),
        purpose="login",
    ))
    session.commit()

    return CommonResponse(success=True, message="OTP sent to registered email", data=None)



@authRouter.post("/verify", response_model=None)
def verify_otp(payload: VerifyOtpDTO, session: Session = Depends(get_session)):
    otp_record = session.exec(
        select(OtpModel)
        .where(OtpModel.email == payload.email)
        .order_by(OtpModel.created_at.desc())
    ).first()

    if not otp_record or otp_record.otp != payload.otp or otp_record.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Invalid or expired OTP")

    user = session.exec(select(UserModel).where(UserModel.email == payload.email)).first()

    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    session.delete(otp_record)
    session.commit()

    response = JSONResponse(
        content={"success": True, "message": "OTP verified", "data": {"access_token": access_token}}
    )
    # Set HttpOnly refresh token
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=7 * 24 * 60 * 60  # 7 days
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

    user_id = payload.get("sub")
    user = session.get(UserModel, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_access_token = create_access_token({"sub": str(user.id)})

    return {"success": True, "access_token": new_access_token}
