from abc import ABC, abstractmethod
from typing import Dict, Any

class Step(ABC):
    """Base step interface for all step types"""
    
    @abstractmethod
    def execute(self, context: Dict[str, Any], inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the step and return results"""
        pass
    
    @abstractmethod
    def validate(self, inputs: Dict[str, Any]) -> bool:
        """Validate step inputs"""
        pass
