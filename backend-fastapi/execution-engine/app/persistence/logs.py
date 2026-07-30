from typing import Dict, Any
from datetime import datetime

class LogStore:
    """Store execution logs in a database"""
    
    def __init__(self):
        self.data = {}
    
    def save_log(self, log_id: str, log_entry: Dict[str, Any]) -> bool:
        """Save log entry to storage"""
        try:
            # In a real implementation, this would save to database
            # For now, store in memory
            self.data[log_id] = {
                "log_id": log_id,
                "entry": log_entry,
                "timestamp": datetime.utcnow().isoformat()
            }
            return True
        except Exception as e:
            print(f"Error saving log: {str(e)}")
            return False
    
    def get_log(self, log_id: str) -> Dict[str, Any]:
        """Retrieve log entry by ID"""
        return self.data.get(log_id)
    
    def list_logs(self) -> list:
        """List all logs"""
        return list(self.data.values())
