## APITrain – FastAPI Execution Engine – PLAN.md

### Project Purpose
This service consumes execution jobs from a queue, executes MCP (Model Context Protocol) pipelines, persists results, and emits logs and metrics. It is a dedicated execution engine for the APITrain SaaS system.

### Non-Goals
- Does not handle authentication  
- Does not manage billing or tenant isolation  
- Does not expose execution logic via HTTP endpoints  
- Does not allow arbitrary code execution  
- Does not redesign architecture  
- Does not invent new features or business logic  

### Build Phases (High-Level)
1. **Phase 0**: Root documentation and project setup  
2. **Phase 1**: Project bootstrap and configuration  
3. **Phase 2**: MCP schema and validation framework  
4. **Phase 3**: Execution context and engine core  
5. **Phase 4**: Step executor framework  
6. **Phase 5**: Queue consumer implementation  
7. **Phase 6**: Persistence layer  
8. **Phase 7**: Observability (logging and metrics)  
9. **Phase 8**: Hardening checklist and final validation  

### Invariants (What Must Never Change)
- Directory structure is immutable and strictly follows the defined schema  
- No architectural redesign or feature invention  
- No business logic or auth handling  
- All files are created in the exact location and format specified  
- All files are updated only when explicitly instructed  
- Root-level files (PLAN.md, TASK.md, STATUS.md, README.md) are maintained and updated per phase  
- Execution engine does not expose execution logic via HTTP  
- No arbitrary code execution is allowed
