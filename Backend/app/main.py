from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database_config import init_db
from apscheduler.schedulers.background import BackgroundScheduler
from app.scripts.cleanup import delete_uploads
from app.routes.auth_routes import authRouter

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

# Init DB
init_db()

# Setup Scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(delete_uploads, "cron", hour=0, minute=0)
scheduler.start()

# Include routes
app.include_router(authRouter)
