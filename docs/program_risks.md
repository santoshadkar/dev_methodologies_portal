# Program Increment (PI-1) Risk ROAM Matrix

| Risk ID | Description | Severity | Likelihood | ROAM Status | Owner | Mitigation Strategy |
|---------|-------------|----------|------------|-------------|-------|---------------------|
| **RSK-001** | Ambiguity in distinguishing Specification-Driven Development (SDD) from classic API-First and BDD approaches. | High | Medium | **Mitigated** | Solutions Architect / PO | Provide clear historical context, comparative taxonomy table, and interactive scenario simulator showing where SDD sits at the apex of contract-driven and AI-driven development. |
| **RSK-002** | Complexity in running interactive client-side simulators (Gherkin parsing and TDD lifecycle) causing browser performance lags. | Medium | Low | **Mitigated** | Frontend Tech Lead | Implement lightweight, zero-dependency client-side virtual execution engines with pure functional state updates. |
| **RSK-003** | Inconsistency between REST API specs and frontend consumption. | High | Medium | **Resolved** | Solutions Architect | Enforce API-First governance with `docs/api_spec.json` serving as the definitive contract. |
| **RSK-004** | Portability issues across diverse node/web environments. | Low | Low | **Accepted** | DevOps Lead | Standardize on vanilla Node.js ES Modules / Express and clean responsive standard web frontend without heavy native build steps. |
