import json
import asyncio
from typing import Dict, Any

async def send_execution_job(job_data: Dict[str, Any]) -> bool:
    """Producer that sends execution jobs to the queue"""
    try:
        # In a real implementation, this would send to Redis/RabbitMQ
        # For now, simulate sending
        message = json.dumps(job_data)
        print(f"Sending job to queue: {message}")
        return True
    except Exception as e:
        print(f"Error sending job: {str(e)}")
        return False

async def generate_test_job() -> Dict[str, Any]:
    """Generate a test execution job for testing"""
    return {
        "execution_id": "exec-001",
        "inputs": {
            "prompt": "Hello, world!",
            "context": "default"
        },
        "steps": [
            {"type": "validate"},
            {"type": "transform"},
            {"type": "respond"}
        ]
    }

async def run_producer():
    """Run producer to send test jobs"""
    job = await generate_test_job()
    success = await send_execution_job(job)
    if success:
        print("Test job sent successfully")
