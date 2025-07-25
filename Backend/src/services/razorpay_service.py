import razorpay
import os
import hmac
import hashlib
from datetime import datetime

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")
RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET")

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

def create_order(amount: int, currency: str = "INR", receipt: str = None):
    data = {
        "amount": amount * 100,  # Razorpay expects paise
        "currency": currency,
        "receipt": receipt or f"receipt_{datetime.utcnow().timestamp()}"
    }
    return razorpay_client.order.create(data=data)

def verify_webhook_signature(body: bytes, signature: str) -> bool:
    generated_signature = hmac.new(
        RAZORPAY_WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(generated_signature, signature) 