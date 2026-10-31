# Architecture
Start as a modular monolith. Each feature owns its API, application use cases, domain rules, and infrastructure/persistence code.
- `api`: HTTP controllers and request/response DTOs
- `application`: use cases and orchestration
- `domain`: core business concepts and rules
- `infrastructure`: persistence and external integrations
- `common`: cross-cutting concerns
Avoid direct repository access across feature modules.
