from app.steps.base import Step
from typing import Dict, Any

class TransformStep(Step):
    """Transformation step that processes input data"""
    
    def execute(self, context: Dict[str, Any], inputs: Dict[str, Any]) -> Dict[str, Any]:
        # In a real implementation, this would transform data
        # For now, just return a transformed version
        return {
            "result": f"Transformed: {inputs.get('prompt', 'no prompt')}",
            "status": "completed"
        }
    
    def validate(self, inputs: Dict[str, Any]) -> bool:
        # Check for required fields
        required_fields = ["prompt"]
        for field in required_fields:
            if field not in inputs:
                return False
        return True
