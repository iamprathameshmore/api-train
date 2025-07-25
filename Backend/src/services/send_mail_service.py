import smtplib
from email.message import EmailMessage
from src.config.settings import SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, FROM_EMAIL, APP_NAME

def send_otp(email: str, otp: str):
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
    except Exception as e:
        print(f"[ERROR] OTP sending failed: {e}")
        raise

def send_notification_email(email: str, subject: str, body: str):
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
    except Exception as e:
        print(f"[ERROR] Notification email sending failed: {e}")
        raise
