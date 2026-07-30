import jsonschema
from jsonschema import Draft7Validator
from typing import Dict, Any, Optional
from app.runtime import schemas


def validate_mcp_envelope(mcp: Dict[str, Any]) -> None:
    """Validate the MCP envelope structure against the schema."""
    try:
        validator = Draft7Validator(schemas.mcp_schema)
        errors = list(validator.is_valid(mcp))
        if errors:
            raise ValueError(f"Invalid MCP envelope: {errors}")
    except Exception as e:
        raise ValueError(f"Validation error: {str(e)}")


def validate_input_schema(input_data: Dict[str, Any], input_schema: Dict[str, Any]) -> None:
    """Validate input data against the input schema."""
    try:
        validator = Draft7Validator(input_schema)
        errors = list(validator.is_valid(input_data))
        if errors:
            raise ValueError(f"Input schema validation failed: {errors}")
    except Exception as e:
        raise ValueError(f"Input schema validation error: {str(e)}")
