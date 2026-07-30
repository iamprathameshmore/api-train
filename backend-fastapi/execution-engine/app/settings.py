from pydantic import BaseSettings

class Settings(BaseSettings):
    DEBUG: bool = True
    QUEUE_URL: str = "redis://localhost:6379"
    DATABASE_URL: str = "sqlite:///./execution.db"
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
