from abc import ABC, abstractmethod

class ExecutionContext:
    def __init__(self, data):
        self.data = data

class BaseExecutor(ABC):
    @abstractmethod
    def execute(self, step: dict, context: ExecutionContext) -> dict:
        pass
