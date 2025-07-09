import smtplib
from email.message import EmailMessage
import os

def send_otp(email: str, otp: str):
    SMTP_SERVER = os.getenv("SMTP_SERVER")
    SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
    SMTP_USERNAME = os.getenv("SMTP_USERNAME")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
    FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USERNAME)
    APP_NAME = os.getenv("APP_NAME", "API Train")
    
    print(SMTP_SERVER, APP_NAME)

    subject = f"Your OTP for {APP_NAME}"
    body = f"""
    Hello,

    Your One-Time Password (OTP) for {APP_NAME} is: {otp}

    This code is valid for 5 minutes.

    If you did not request this, please ignore the email.

    Regards,  
    {APP_NAME} Team
    """

    message = EmailMessage()
    message["From"] = FROM_EMAIL
    message["To"] = email
    message["Subject"] = subject
    message.set_content(body)

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(message)
        # print(f"[INFO] OTP sent to {email}")
    except Exception as e:
        print(f"[ERROR] OTP sending failed: {e}")
        raise
