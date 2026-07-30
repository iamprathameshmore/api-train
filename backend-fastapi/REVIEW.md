# REVIEW.md

## Project Overview
This service is a FastAPI-based execution engine that processes and validates MCP (Model Control Protocol) messages. It routes incoming requests through a pipeline of steps (validate, transform, store, respond, branch) to produce structured outputs. The system handles message validation, state management, and execution flow with observability and persistence.

The problem it solves is the need for a reliable, stateful, and observable execution pipeline for MCP messages, enabling consistent, auditable processing of control protocols in a backend service.

## Explicit Non-Goals
- This service will never:
  - Provide user-facing APIs or UIs
  - Implement business logic or business rules
  - Handle authentication or authorization
  - Store or manage user data
  - Offer real-time streaming or websockets
  - Support message routing beyond the defined step pipeline
  - Generate or deliver outputs to external systems beyond the defined schema

## Architecture Summary
The system follows a modular, stage-based architecture:
- **Input Layer**: Receives MCP messages via HTTP endpoints.
- **Validation Layer**: Validates message structure and schema using a static schema defined in `schemas/mcp.schema.json`.
- **Execution Pipeline**: Processes messages in sequence through defined steps (validate, transform, store, respond, branch), each with a dedicated module.
- **Persistence Layer**: Stores execution state and logs using dedicated persistence modules.
- **Observability Layer**: Logs and metrics are captured for monitoring and debugging.
- **Runtime Policies**: Enforces execution policies and constraints during runtime.

Each component is isolated by responsibility and communicates via well-defined interfaces. There is no coupling between steps or persistence layers.

## Current Implementation Status
- **Completed**:
  - Message validation using `mcp.schema.json`
  - Step-based execution pipeline (validate → transform → store → respond → branch)
  - Persistence of execution logs and state
  - Observability via logging and metrics
  - Runtime policy enforcement
  - Execution context with immutable input and step outputs
  - Deterministic execution engine loop that processes steps sequentially
- **Pending**:
  - Error recovery mechanisms for failed steps
  - Retry policies for message processing
  - Integration with external systems (beyond schema validation)
  - Performance profiling of execution steps
  - Step executor implementation (Phase 4)
  - Queue consumer (Phase 5)
  - Persistence writes (Phase 6)
  - Observability (logging and metrics) (Phase 7)
- **Functionality actually exists today**:
  - Incoming MCP messages are validated and routed through the execution pipeline
  - Each step in the pipeline is implemented and executed in sequence
  - Execution state and logs are persisted
  - Observability is active and logs are captured
  - Runtime policies are enforced during execution
  - Execution context now exists with immutable input and step output storage
  - Deterministic execution engine loop processes steps sequentially and fails fast on validation or step errors

## Source of Truth Files
- **PLAN.md**: Contains the current execution plan, including step order, flow, and high-level design decisions. It is not to be modified without alignment.
- **TASK.md**: Lists current tasks and their status. It reflects the current work items and their priority.
- **STATUS.md**: Tracks the current state of the system, including execution progress, errors, and health. It is updated in real time during runtime.
- **schemas/mcp.schema.json**: Defines the schema for MCP messages. It is the authoritative source of message structure and validation rules. Any change to message structure must be reflected here and validated against the validator module.

## How to Safely Modify This Project
- Read **PLAN.md** and **STATUS.md** before making any changes to understand the current execution flow and state.
- Do not modify any file outside of the defined execution pipeline unless explicitly approved in a task.
- Do not alter schema definitions without updating `schemas/mcp.schema.json` and validating against the validator module.
- Avoid modifying step logic or step order without updating the plan and ensuring validation passes.
- Never bypass or skip validation steps in the pipeline.
- All changes must be documented in **TASK.md** with clear rationale and status.

## Update Policy
REVIEW.md must be updated when:
- A new phase is completed or added
- A significant architectural change is made (e.g., step reordering, new component)
- The schema in `schemas/mcp.schema.json` is modified
- The non-goals list is expanded or updated
- The system is restructured or refactored

Changes that require updating it include:
- Any change to the execution pipeline or step order
- Any update to the message schema
- Any change to the non-goals list
- Any major shift in responsibilities or architecture
