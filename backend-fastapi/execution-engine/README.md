# APITrain – FastAPI Execution Engine

A dedicated execution engine for the APITrain SaaS system.

## Purpose
Consumes execution jobs from a queue, executes MCP (Model Context Protocol) pipelines, persists results, and emits logs and metrics.

## Non-Goals
- Does not handle authentication  
- Does not manage billing or tenant isolation  
- Does not expose execution logic via HTTP endpoints  
- Does not allow arbitrary code execution  

## Architecture
- Built on FastAPI for high-performance, async operations  
- Uses Python for all backend logic  
- Runs in containerized environment via Docker  

## Files
- `app/`: Core application modules  
- `schemas/`: MCP schema definitions  
- `Dockerfile`: Containerization configuration  
- `pyproject.toml`: Dependency and build configuration  

## Next Steps
- Phase 2: Implement MCP schema and validation framework  
- Phase 3: Develop execution context and engine core
