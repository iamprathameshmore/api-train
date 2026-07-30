from typing import Dict, Any
from datetime import datetime

class ExecutionStore:
    """Store execution results in a database"""
    
    def __init__(self):
        self.data = {}
    
    def save_execution(self, execution_id: str, result: Dict[str, Any]) -> bool:
        """Save execution result to storage"""
        try:
            # In a real implementation, this would save to database
            # For now, store in memory
            self.data[execution_id] = {
                "execution_id": execution_id,
                "result": result,
                "status": "completed",
                "timestamp": datetime.utcnow().isoformat()
            }
            return True
        except Exception as e:
            print(f"Error saving execution: {str(e)}")
            return False
    
    def get_execution(self, execution_id: str) -> Dict[str, Any]:
        """Retrieve execution result by ID"""
        return self.data.get(execution_id)
    
    def list_executions(self) -> list:
        """List all executions"""
        return list(self.data.values())
