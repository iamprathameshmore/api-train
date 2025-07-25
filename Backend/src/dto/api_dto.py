from pydantic import BaseModel, EmailStr, constr

class CreateAPIRequest(BaseModel):
    email: EmailStr
    api_name: constr(min_length=1, max_length=100)
    model_name: constr(min_length=1, max_length=100)
    model_type: constr(min_length=1, max_length=50) 