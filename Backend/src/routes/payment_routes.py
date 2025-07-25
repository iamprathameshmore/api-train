from fastapi import APIRouter, HTTPException, Request
from src.model.common_response_model import CommonResponse
from src.services.razorpay_service import create_order, verify_webhook_signature
from pydantic import BaseModel

paymentRouter = APIRouter(prefix="/payment", tags=["Payment"])

class PaymentOrderRequest(BaseModel):
    amount: int
    currency: str = "INR"
    receipt: str = None

@paymentRouter.post("/order", response_model=CommonResponse)
async def create_payment_order(payload: PaymentOrderRequest):
    try:
        order = create_order(payload.amount, payload.currency, payload.receipt)
        return CommonResponse(success=True, message="Order created", data=order)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Razorpay order creation failed: {str(e)}")

@paymentRouter.post("/webhook")
async def razorpay_webhook(request: Request):
    signature = request.headers.get("x-razorpay-signature")
    if not signature:
        raise HTTPException(status_code=400, detail="Missing signature header")
    body = await request.body()
    if not verify_webhook_signature(body, signature):
        raise HTTPException(status_code=400, detail="Invalid signature")
    payload = await request.json()
    # TODO: Handle payment event (e.g., update DB, send email, etc.)
    return {"status": "ok"}
