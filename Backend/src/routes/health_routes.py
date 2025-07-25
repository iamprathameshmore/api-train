from fastapi import APIRouter

healthRouter = APIRouter(prefix="/health", tags=["Health"])

@healthRouter.get("/z")
def health_check():
    return {"status": "ok"} 