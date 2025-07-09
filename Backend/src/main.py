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
    allow_origins=["*"],  # Replace with ["http://localhost:3000"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LimitUploadSizeMiddleware)

# Init DB
init_db()

# Setup Scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(delete_uploads, "cron", hour=0, minute=0)
scheduler.start()

# Include routes
app.include_router(authRouter)
app.include_router(userRouter)
app.include_router(apiRouter)
