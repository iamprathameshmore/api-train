from src.model.api_usage_model import APIUsage

async def log_api_usage(api_id: str, user_id: str, endpoint: str, status_code: int):
    usage = APIUsage(
        api_id=api_id,
        user_id=user_id,
        endpoint=endpoint,
        status_code=status_code
    )
    await usage.insert() 