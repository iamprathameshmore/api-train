from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.database_config import init_db
from apscheduler.schedulers.background import BackgroundScheduler
from src.scripts.cleanup import delete_uploads


from src.routes.auth_routes import authRouter
from src.routes.api_routes import apiRouter
from src.routes.user_routes import userRouter
from src.middleware.upload_size_middleware import LimitUploadSizeMiddleware
from src.routes.health_routes import healthRouter
from src.middleware.rate_limit_middleware import limiter
from slowapi.errors import RateLimitExceeded
from fastapi import Request
from fastapi.responses import JSONResponse
import logging
from src.routes.payment_routes import paymentRouter


app = FastAPI(
    title="APITrain — ML API Builder",
    description="Upload datasets, train models, and get instant APIs with API keys.",
    version="1.0.0",
    contact={
        "name": "Prathamesh More",
        "url": "https://www.apitrain.in",
        "email": "more@apitrain.in",
    },
)

# Setup CORS (must come after app = FastAPI(...))
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Replace with ["http://localhost:3000"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LimitUploadSizeMiddleware)

# Init DB on startup
@app.on_event("startup")
async def on_startup():
    await init_db()

# Setup Scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(delete_uploads, "cron", hour=0, minute=0)
scheduler.start()

# Include routes
app.include_router(authRouter)
app.include_router(userRouter)
app.include_router(apiRouter)
app.include_router(healthRouter)
app.include_router(paymentRouter)

app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"success": False, "message": "Rate limit exceeded."},
    )

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "Internal server error."},
    )
