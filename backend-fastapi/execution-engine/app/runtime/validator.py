from typing import Dict, Any
from pydantic import BaseModel, ValidationError
from schemas import mcp_schema

class ValidationException(Exception):
    pass

def validate_mcp_input(data: Dict[str, Any]) -> bool:
    try:
        # Validate against the MCP schema
        mcp_schema.validate(data)
        return True
    except ValidationError as e:
        raise ValidationException(f"Invalid MCP input: {str(e)}")
    return False
