from typing import Dict, Any
from datetime import datetime

class Metrics:
    """Metrics collector for execution engine"""
    
    def __init__(self):
        self.metrics = {}
    
    def record_metric(self, name: str, value: float, tags: Dict[str, Any] = None) -> bool:
        """Record a metric with optional tags"""
        try:
            # In a real implementation, this would send to monitoring system
            # For now, store in memory
            metric_data = {
                "name": name,
                "value": value,
                "timestamp": datetime.utcnow().isoformat(),
                "tags": tags or {}
            }
            self.metrics[name] = metric_data
            return True
        except Exception as e:
            print(f"Error recording metric: {str(e)}")
            return False
    
    def get_metric(self, name: str) -> Dict[str, Any]:
        """Retrieve metric by name"""
        return self.metrics.get(name)
    
    def get_all_metrics(self) -> Dict[str, Any]:
        """Retrieve all metrics"""
        return self.metrics.copy()
