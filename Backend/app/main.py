from fastapi import FastAPI
# from app.routes.auth_routes import authRouter  
from app.database.database_config import init_db
from apscheduler.schedulers.background import BackgroundScheduler
from app.scripts.cleanup import delete_uploads  
app = FastAPI()

scheduler = BackgroundScheduler()
scheduler.add_job(delete_uploads, 'cron', hour=0, minute=0)  # runs daily at midnight
scheduler.start()
init_db()


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


# app.include_router(authRouter)





