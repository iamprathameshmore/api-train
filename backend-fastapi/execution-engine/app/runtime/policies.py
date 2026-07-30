from typing import List
from enum import Enum

class StepType(Enum):
    VALIDATE = "validate"
    TRANSFORM = "transform"
    RESPOND = "respond"

class PolicyViolation(Exception):
    pass

def validate_step_sequence(steps: List[dict]) -> bool:
    """Ensure step sequence is valid"""
    if not steps:
        raise PolicyViolation("At least one step required")
        
    for step in steps:
        if step.get("type") not in StepType:
            raise PolicyViolation(f"Invalid step type: {step.get('type')}")
            
    return True
