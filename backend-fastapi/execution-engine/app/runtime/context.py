from pydantic import BaseModel
from typing import Dict, Any

class ExecutionContext(BaseModel):
    execution_id: str
    inputs: Dict[str, Any]
    steps: list
    outputs: Dict[str, Any] = {}
    metadata: Dict[str, Any] = {}
    
    def __init__(self, execution_id: str, inputs: Dict[str, Any], steps: list):
        super().__init__(
            execution_id=execution_id,
            inputs=inputs,
            steps=steps,
            metadata={}
        )
        self.outputs = {}
