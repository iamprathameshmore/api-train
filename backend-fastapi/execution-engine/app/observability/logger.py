import logging
from typing import Dict, Any
from datetime import datetime

class Logger:
    """Structured logger for execution engine"""
    
    def __init__(self):
        self.logger = logging.getLogger("execution-engine")
        self.logger.setLevel(logging.INFO)
        
        # Avoid duplicate handlers
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
            )
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)
    
    def log_execution(self, execution_id: str, level: str, message: str, context: Dict[str, Any] = None):
        """Log execution events with structured context"""
        log_data = {
            "execution_id": execution_id,
            "timestamp": datetime.utcnow().isoformat(),
            "level": level,
            "message": message,
            "context": context or {}
        }
        
        if level == "error":
            self.logger.error(f"{message} - {log_data['context']}")
        elif level == "warning":
            self.logger.warning(f"{message} - {log_data['context']}")
        else:
            self.logger.info(f"{message} - {log_data['context']}")
            
        return log_data
