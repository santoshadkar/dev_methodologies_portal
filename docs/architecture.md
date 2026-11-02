# System Architecture & Technical Specifications

## 1. Architectural Style & Clean Separation
The application follows a **Hexagonal / Clean Architecture** pattern, ensuring domain models and calculation engines are completely decoupled from transport protocols (HTTP/REST), storage, and presentation layers (Web UI).

```
+-----------------------------------------------------------------------+
|                             Presentation                              |
|   Responsive Single Page Application / Interactive Modern Web Portal  |
|      (HTML5 / Modern Vanilla ES Modules / Tailwind CSS / Charts)     |
+-----------------------------------------------------------------------+
                                  |
                                  v REST / JSON
+-----------------------------------------------------------------------+
|                         Application / API Layer                       |
|         Express.js / Node.js HTTP Controllers & Middleware            |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
|                           Domain & Core Engines                       |
|   - Methodology Repository & Taxonomies                               |
|   - Methodology Comparison Evaluator                                  |
|   - Interactive Decision Matrix & Scoring Advisor                     |
|   - Spec-Driven Contract & Schema Validator Engine                    |
|   - Virtual Test Execution & Gherkin Step Engine                      |
+-----------------------------------------------------------------------+
                                  |
                                  v
+-----------------------------------------------------------------------+
|                        Configuration & Environment                    |
|            .env Configuration Provider (Zero Hardcoding)              |
+-----------------------------------------------------------------------+
```

---

## 2. Directory Structure & Modular Breakdown
```text
sdd-tdd-bdd-portal/
├── docs/
│   ├── pi_planning_board.md        # RTE SAFe planning board
│   ├── program_risks.md            # RTE ROAM risks
│   ├── PRD.md                      # Product Requirements Document
│   ├── user_stories.md             # Given/When/Then acceptance criteria
│   ├── design_system.md            # Visual tokens & UI specifications
│   ├── architecture.md             # Solutions Architect Blueprint
│   ├── api_spec.json               # OpenAPI 3.0 specification contract
│   ├── qa_test_report.md           # QA audit report
│   └── retrospective.md            # Agile Coach I&A retrospective
├── public/
│   ├── index.html                  # Portal layout & responsive UI
│   ├── app.js                      # Client controller & state management
│   ├── styles.css                  # UI styling & design tokens
│   └── favicon.svg                 # Portal brand icon
├── src/
│   ├── config/
│   │   └── environment.js          # .env configuration reader
│   ├── domain/
│   │   ├── methodologies.js        # SDD, TDD, BDD domain data & taxonomy
│   │   ├── comparison.js           # Comparative matrices & dimension filters
│   │   ├── advisorEngine.js        # Recommendation scoring algorithms
│   │   └── simulatorEngine.js      # TDD, BDD & SDD execution engines
│   ├── api/
│   │   ├── routes.js               # REST API endpoints mapping
│   │   └── controllers.js          # API request/response handlers
│   └── server.js                   # Node.js Express server bootstrap
├── tests/
│   ├── domain.test.js              # Unit tests for domain models & taxonomies
│   ├── advisor.test.js             # Unit tests for recommendation scoring
│   ├── simulator.test.js           # Unit tests for TDD/BDD/SDD simulation logic
│   └── api.test.js                 # Integration tests for REST API endpoints
├── .env.example                    # Template environment variables
├── .env                            # Active configuration file
├── package.json                    # Project dependencies & npm scripts
└── README.md                       # Project documentation & run guide
```

---

## 3. Technology Choices & Justification
- **Runtime**: Node.js v24 (Native ESM support, zero external build tool friction).
- **Web Framework**: Express.js (High performance, minimalist REST API).
- **Styling**: Tailwind CSS via CDN + Custom CSS design tokens in `public/styles.css` (Ultra-fast, zero-build bundling requirement for instant execution).
- **Testing**: Node.js built-in test runner (`node:test` + `node:assert`) ensuring zero fragile dependencies and blazing fast test runs with 100% standard conformance.
- **Environment Management**: Native `.env` file loader (`process.loadEnvFile()` / dotenv standard).

---

## 4. Security & Quality Guardrails
- Strict input validation on all API endpoints.
- Content Security Policy (CSP) and CORS headers configured.
- Zero secrets committed to source control.
- Deterministic simulation models for TDD, BDD, and SDD ensuring repeatable test results.
