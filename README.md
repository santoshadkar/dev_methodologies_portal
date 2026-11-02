# Spec-Driven Development (SDD), TDD & BDD Comparative Enterprise Portal

An enterprise-grade, interactive web portal and knowledge repository detailing **Specification-Driven Development (SDD)**, **Test-Driven Development (TDD)**, and **Behavior-Driven Development (BDD)**, complete with interactive methodology simulators, a side-by-side comparison matrix, an automated methodology advisor, and real-world case studies.

---

## 🌟 Key Features

1. **Methodology Deep Dives**:
   - **Spec-Driven Development (SDD)**: Philosophy, machine-readable contracts (OpenAPI 3.1, TypeSpec, AsyncAPI), single source of truth (SSOT), and AI code-generation synergy.
   - **Test-Driven Development (TDD)**: Kent Beck's Red-Green-Refactor micro-loop, unit testing principles (FIRST), design benefits, and anti-patterns.
   - **Behavior-Driven Development (BDD)**: Dan North's Three Amigos model, ubiquitous language, executable Given/When/Then Gherkin syntax, and living documentation.
2. **Interactive 10-Dimensional Comparison Matrix**:
   - Compare SDD, TDD, and BDD across Philosophy, Scope, Stakeholders, Feedback Loops, Tooling, AI Agent Synergy, Team Parallelization, Refactoring Safety, and Living Documentation.
3. **Interactive Methodology Recommendation Advisor**:
   - 5-question multi-attribute assessment calculator that analyzes your project's architectural parameters and calculates weighted fit percentages with a strategic adoption playbook.
4. **Live Hands-on Methodology Simulators**:
   - **TDD Simulator**: Step-by-step interactive Red -> Green -> Refactor code visualizer with virtual test runner feedback.
   - **BDD Simulator**: Gherkin scenario runner with live step driver execution and context inspection.
   - **SDD Simulator**: Interactive JSON payload validator against an OpenAPI 3.1 contract with instant regex/range violation diagnostics and auto-synthesized TypeScript interfaces.
5. **Real-World Case Studies**:
   - FinTech Global Payment Gateway (SDD + TDD)
   - Healthcare FDA-Regulated Clinical Diagnostics (BDD + SDD)
   - Capital Markets Matching Engine (Pure TDD)
   - Autonomous Multi-Agent AI Microservice Factory (Spec-First SDD)
6. **API Specification & Explorer**:
   - Built API-First with full OpenAPI 3.0.3 specification (`docs/api_spec.json`) and active REST endpoints.

---

## 🚀 Quick Start Guide

### 1. Set Active Workspace
It is recommended to set this project folder as your active workspace:
```text
C:\Users\anany\.gemini\antigravity\scratch\sdd-tdd-bdd-portal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Automated Tests
```bash
npm test
```

### 4. Start the Application Server
```bash
npm start
```
The portal will be live at:
👉 **http://localhost:3000**

---

## 📁 Repository Structure

```text
sdd-tdd-bdd-portal/
├── docs/
│   ├── pi_planning_board.md        # RTE SAFe planning board
│   ├── program_risks.md            # RTE ROAM risk matrix
│   ├── PRD.md                      # Product Requirements Document
│   ├── user_stories.md             # BDD Given/When/Then user stories
│   ├── design_system.md            # Visual design tokens & layout
│   ├── architecture.md             # Solutions Architect system blueprint
│   ├── api_spec.json               # OpenAPI 3.0 REST specification
│   ├── qa_test_report.md           # QA audit & CAB sign-off report
│   └── retrospective.md            # Agile Coach Inspect & Adapt report
├── public/
│   ├── index.html                  # Portal interface with Tailwind CSS
│   ├── app.js                      # Interactive client controller
│   ├── styles.css                  # Custom styling & glassmorphism
│   └── favicon.svg                 # Brand icon
├── src/
│   ├── config/
│   │   └── environment.js          # .env configuration reader
│   ├── domain/
│   │   ├── methodologies.js        # Domain data for SDD, TDD, and BDD
│   │   ├── comparison.js           # Multi-dimensional comparison matrix
│   │   ├── advisorEngine.js        # Recommendation scoring algorithm
│   │   └── simulatorEngine.js      # TDD, BDD & SDD execution engines
│   ├── api/
│   │   ├── controllers.js          # REST API request handlers
│   │   └── routes.js               # Express route mapping
│   └── server.js                   # Express server bootstrap
├── tests/
│   ├── domain.test.js              # Unit tests for domain models
│   ├── advisor.test.js             # Unit tests for advisor scoring
│   ├── simulator.test.js           # Unit tests for TDD/BDD/SDD logic
│   └── api.test.js                 # Integration tests for REST endpoints
├── .env.example                    # Environment variables template
├── .env                            # Active environment configuration
├── package.json                    # Project configuration
└── README.md                       # Documentation
```

---

## 🏛️ SAFe & Agile Governance Compliance
This project was developed strictly according to Enterprise Agile & SAFe standards:
- **PI Planning Gate**: Passed via `docs/pi_planning_board.md`.
- **Definition of Ready (DoR)**: Verified via `docs/user_stories.md`.
- **Definition of Done (DoD)**: 25/25 automated tests passed, 0 lint warnings, approved in `docs/qa_test_report.md`.
- **Inspect & Adapt (I&A)**: Retrospective archived in `docs/retrospective.md`.
- **Clean Architecture & Zero-Hardcoding**: Enforced across all layers.
