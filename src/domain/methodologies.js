/**
 * Domain Model & Comprehensive Knowledge Repository for SDD, TDD, and BDD
 * Detailed, structured, and deep enterprise documentation.
 */

export const methodologies = [
  {
    id: "sdd",
    name: "Specification-Driven Development",
    acronym: "SDD",
    subtitle: "Spec-First Engineering & Single Source of Truth",
    tagline: "Define the Contract First. Synthesize, Validate, and Govern Everything Else.",
    category: "Contract & Architecture Centric",
    origin: "Evolved from Formal Methods, WSDL/SOAP, and revolutionized by modern OpenAPI 3.1, TypeSpec (Microsoft), AsyncAPI, GraphQL, Protobuf, and Autonomous AI Coding Agents.",
    primaryFocus: "System boundaries, inter-service API contracts, asynchronous event schemas, and machine-readable blueprints for both humans and AI.",
    aiReadinessScore: 9.9,
    governanceWeight: "High (Contract Gated)",

    overview: {
      formalDefinition: "Specification-Driven Development (SDD) is an architectural discipline where a machine-readable, formal specification (such as OpenAPI 3.1, AsyncAPI, or TypeSpec) is drafted, reviewed, and finalized before any application code is implemented. The specification serves as the immutable Single Source of Truth (SSOT), from which documentation, client SDKs, mock servers, runtime validation schemas, and automated contract tests are synthesized.",
      problemStatement: "In traditional 'Code-First' workflows, developers jump straight into writing backend controllers and database models. The API contract is treated as a secondary byproduct—often generated after the fact. This causes severe cross-team friction: frontend developers wait weeks for backend deployment; documentation constantly drifts out of date; breaking changes slip silently into production; and AI code generation produces hallucinations due to ambiguous requirements.",
      mentalModel: "Think of SDD like high-rise civil architecture: before a skyscraper's steel beams are forged and concrete is poured, architects create precise, mathematically verified CAD blueprints. Contractors, electrical engineers, plumbers, and inspectors all work in parallel against the exact same blueprint. In software, the specification is that authoritative CAD blueprint.",
      keyMetrics: [
        { label: "Reduction in Integration Drift", value: "94%" },
        { label: "Team Parallelization Speedup", value: "3.5x" },
        { label: "AI Code Synthesis Accuracy", value: "99.2%" },
        { label: "Boilerplate DTO Reduction", value: "85%" }
      ]
    },

    detailedLifecycle: [
      {
        step: 1,
        title: "1. Specification Modeling & Design",
        objective: "Model domain entities, URIs, query parameters, request/response payloads, headers, and HTTP status codes in a machine-readable format.",
        inputs: "Product Requirements Document (PRD), business domain models, and RFC discussions.",
        outputs: "Formally authored specification file (`openapi.yaml`, `schema.tsp`, or `events.asyncapi.yaml`).",
        actions: [
          "Define resource paths, idempotency keys, and security schemes (OAuth2, JWT).",
          "Specify strict JSON Schema constraints: data types, regex patterns, enum lists, and numerical bounds.",
          "Document error models (e.g., RFC 7807 Problem Details) for 400, 401, 403, 404, 409, and 500 responses."
        ],
        codeSnippet: `openapi: 3.1.0
info:
  title: Payment Gateway API
  version: 1.0.0
paths:
  /v1/payments:
    post:
      summary: Process an idempotent payment
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PaymentRequest'
      responses:
        '201':
          description: Payment Authorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaymentResponse'`,
        qualityGate: "API Design Review passed; RFC approved by Solution Architect and Consumer Tech Leads."
      },
      {
        step: 2,
        title: "2. Automated Contract Linting & Governance",
        objective: "Enforce enterprise design standards, security baselines, semantic versioning, and naming conventions automatically.",
        inputs: "Authored specification file and organizational ruleset (`.spectral.yaml`).",
        outputs: "Spectral / TypeSpec linting report with zero errors and zero warnings.",
        actions: [
          "Verify kebab-case or camelCase path naming consistency across microservices.",
          "Ensure every endpoint declares authentication and rate-limiting headers.",
          "Check that all schemas enforce explicit required fields, enum boundaries, and descriptions."
        ],
        codeSnippet: `# .spectral.yaml
extends: ["spectral:oas", "spectral:owasp"]
rules:
  no-http-basic: true
  paths-kebab-case:
    description: "All URL paths must use kebab-case"
    message: "{{property}} must be kebab-case"
    given: "$.paths[*]~"
    then:
      function: pattern
      functionOptions:
        match: "^(/[a-z0-9-~.]+)+$"`,
        qualityGate: "CI Spectral lint passes with 100% compliance; zero unapproved exceptions."
      },
      {
        step: 3,
        title: "3. Mocking & Concurrent Team Parallelization",
        objective: "Unblock frontend, mobile, data engineering, and QA teams immediately without waiting for backend implementation.",
        inputs: "Linted specification contract.",
        outputs: "Live interactive mock servers (Prism, MSW) and dynamic Swagger/Redoc documentation.",
        actions: [
          "Spin up containerized mock servers returning realistic dynamic payloads based on schema examples.",
          "Frontend teams bind UI components to the mock API endpoints.",
          "QA engineers begin drafting contract test assertions and end-to-end integration flows."
        ],
        codeSnippet: `# Spin up instantaneous mock server in terminal or Docker:
npx @stoplight/prism-cli mock -p 4010 openapi.yaml

# Frontend developers can instantly execute:
curl http://localhost:4010/v1/payments -H "Content-Type: application/json" \\
  -d '{"amount": 99.50, "currency": "USD"}'
# => Returns 201 mock response matching schema perfectly!`,
        qualityGate: "Consumer teams verify mock data meets UI requirements; sign off on contract handshake."
      },
      {
        step: 4,
        title: "4. Artifact Synthesis & Code Generation",
        objective: "Eliminate manual boilerplate code by generating TypeScript types, client SDKs, server stubs, and validation middleware directly from the spec.",
        inputs: "Approved specification file.",
        outputs: "Auto-generated TypeScript interfaces, Zod validation schemas, Axios/Fetch SDKs, and Express/FastAPI route stubs.",
        actions: [
          "Run OpenAPI generator (Orval, openapi-typescript, Swagger Codegen).",
          "Embed generated Zod schemas into backend validation middleware to reject invalid requests before hitting business logic.",
          "Distribute generated client SDKs to internal package registries (npm/artifactory)."
        ],
        codeSnippet: `// Auto-synthesized TypeScript Model: PaymentRequest.ts
export interface PaymentRequest {
  transactionId: string; // pattern: ^TX-[0-9]{6}$
  amount: number;        // min: 0.01, max: 100000.00
  currency: 'USD' | 'EUR' | 'GBP';
  paymentMethod: 'CREDIT_CARD' | 'INSTANT_ACH';
}

// Auto-synthesized Express Request Validator (Zod/Joi)
export const PaymentValidator = z.object({
  transactionId: z.string().regex(/^TX-[0-9]{6}$/),
  amount: z.number().min(0.01).max(100000.00),
  currency: z.enum(['USD', 'EUR', 'GBP']),
  paymentMethod: z.enum(['CREDIT_CARD', 'INSTANT_ACH'])
});`,
        qualityGate: "Generated types compile cleanly with 0 TypeScript errors across frontend and backend codebases."
      },
      {
        step: 5,
        title: "5. Contract Compliance Testing & CI Gate",
        objective: "Continuously verify that the live backend implementation strictly adheres to the specification contract at runtime.",
        inputs: "Running backend service, OpenAPI spec, and consumer contract expectations.",
        outputs: "Contract assertion test results (Pact, Schemathesis, Dredd) in CI pipeline.",
        actions: [
          "Execute property-based contract tests (Schemathesis) to fuzz thousands of edge cases against the spec.",
          "Run consumer-driven contract tests (Pact) to verify backward compatibility.",
          "Block deployment if the backend omits a required field or returns an undocumented data type."
        ],
        codeSnippet: `# Run Schemathesis to fuzz endpoints with 10,000 generated requests:
npx schemathesis run http://localhost:3080/api/v1/openapi.yaml \\
  --base-url=http://localhost:3080/api/v1 \\
  --checks all \\
  --hypothesis-max-examples=100`,
        qualityGate: "100% contract compliance; zero payload drift between spec and production runtime."
      }
    ],

    corePrinciples: [
      {
        title: "Specification as Single Source of Truth (SSOT)",
        description: "The specification is not an afterthought or documentation artifact; it is the master architectural contract. Code, SDKs, tests, and docs are downstream derivations.",
        whyItMatters: "Prevents documentation from lagging behind code and eliminates disagreements over endpoint signatures."
      },
      {
        title: "Contract-First Collaboration (Shift-Left)",
        description: "Teams debate, iterate, and agree upon data boundaries in YAML/TypeSpec before writing any backend business logic.",
        whyItMatters: "Fixing an architectural mistake in a 50-line YAML spec takes 10 minutes; fixing it after 5,000 lines of backend and UI code takes 3 weeks."
      },
      {
        title: "Machine-Readable & Executable Blueprints",
        description: "Specs must be strictly parsed by machines (JSON Schema / OpenAPI 3.1) so compilers, linters, generators, and test runners can automate the delivery pipeline.",
        whyItMatters: "Human-written Word or Confluence docs are ambiguous and cannot be evaluated by CI/CD pipelines."
      },
      {
        title: "AI-Agentic Optimization",
        description: "LLMs and autonomous coding agents need mathematical boundaries to succeed. A formal spec provides the exact system constraints that prevent hallucinations.",
        whyItMatters: "Autonomous agents like Copilot or Claude write 1-shot bug-free code when prompted with OpenAPI schemas and TypeSpec contracts."
      },
      {
        title: "Zero Contract Drift via CI/CD Enforcement",
        description: "Any commit or pull request that alters an endpoint signature without updating the spec—or introduces a breaking change without versioning—is blocked by CI.",
        whyItMatters: "Eliminates breaking changes for downstream consumers, partner companies, and mobile apps."
      }
    ],

    toolingEcosystem: [
      {
        category: "Specification Modeling & Languages",
        tools: [
          { name: "OpenAPI 3.1", desc: "Industry standard REST specification based on full JSON Schema 2020-12 alignment." },
          { name: "TypeSpec (Microsoft)", desc: "A TypeScript-like programming language to model APIs and compile to OpenAPI, JSON Schema, and Protobuf." },
          { name: "AsyncAPI", desc: "Standard for event-driven message architectures (Kafka, RabbitMQ, WebSockets)." },
          { name: "Protobuf / gRPC", desc: "Google binary schema format for high-throughput microservice communication." }
        ]
      },
      {
        category: "API Linting & Governance",
        tools: [
          { name: "Spectral (Stoplight)", desc: "Flexible JSON/YAML linter enforcing enterprise naming, security, and schema rules." },
          { name: "Redocly CLI", desc: "Enterprise linting, bundle splitting, and automated breaking-change detection in git." }
        ]
      },
      {
        category: "Mocking & Virtualization",
        tools: [
          { name: "Prism CLI", desc: "Instant HTTP mock server with dynamic fake data and runtime request/response schema validation." },
          { name: "MSW (Mock Service Worker)", desc: "Seamless client-side network mocking directly from OpenAPI schemas." }
        ]
      },
      {
        category: "Code & SDK Synthesis",
        tools: [
          { name: "Orval / OpenAPI-TS", desc: "Generates typed React Query hooks, Axios clients, and TypeScript DTOs." },
          { name: "OpenAPI Generator", desc: "Generates server stubs and client libraries for 40+ programming languages." },
          { name: "Zod / Typia", desc: "Runtime schema validation engines generated directly from specifications." }
        ]
      },
      {
        category: "Contract Testing & Fuzzing",
        tools: [
          { name: "Schemathesis", desc: "Property-based testing tool that automatically generates thousands of negative & boundary test cases." },
          { name: "Pact", desc: "Consumer-driven contract testing preventing breaking changes across microservices." }
        ]
      }
    ],

    advantagesAndTradeoffs: {
      advantages: [
        { title: "Parallel Development", detail: "Frontend, mobile, and QA teams begin immediately against mock servers without waiting for backend deployment." },
        { title: "Elimination of Contract Drift", detail: "Automated linting and contract assertions guarantee runtime code matches the spec 100% of the time." },
        { title: "Automated SDKs & Boilerplate", detail: "Saves hundreds of developer hours by auto-generating DTOs, HTTP clients, and validation middleware." },
        { title: "Exceptional AI Multiplier", detail: "AI agents synthesize complete fullstack implementations with extreme accuracy when grounded in formal specifications." },
        { title: "Seamless Partner Integration", detail: "External consumers and clients receive interactive, always-accurate documentation and client libraries." }
      ],
      pitfalls: [
        {
          antiPattern: "Spec After Code (Reverse Generation)",
          problem: "Writing code first and using code annotations (e.g. Swagger UI annotations) to generate specs after the fact.",
          mitigation: "Enforce contract-first governance: PRs must have spec changes reviewed and merged before backend feature branches are created."
        },
        {
          antiPattern: "Over-Specifying Internal Implementation",
          problem: "Trying to express internal database schemas or internal private algorithms in the public API contract.",
          mitigation: "Keep specifications focused on boundaries, protocols, and data contracts. Use TDD for internal algorithms."
        },
        {
          antiPattern: "Specification Neglect & Ghost Drift",
          problem: "Engineers change backend response fields without updating the spec, bypassing CI checks.",
          mitigation: "Implement contract testing (Pact / Schemathesis) as a mandatory blocking gate in your CI/CD deployment pipeline."
        }
      ]
    },

    dayInTheLife: {
      scenarioTitle: "Building an Idempotent Payment Webhook Service",
      narrative: "Sarah, a Principal Architect, needs to build a new payment webhook system connecting Stripe to internal billing microservices.",
      steps: [
        "Day 1: Sarah drafts `webhook-spec.yaml` using OpenAPI 3.1. She models the idempotent payload, required HMAC headers, and RFC 7807 error envelopes.",
        "Day 2: She runs `spectral lint` to ensure adherence to corporate security rules. The billing team reviews and approves the contract in a GitHub PR.",
        "Day 3: Prism mock server is deployed to the staging cluster. Marcus (Frontend Lead) immediately builds the payment status dashboard against the live mock.",
        "Day 4: Sarah runs `orval` to auto-generate TypeScript types and Express Zod validation middleware. The backend logic is written to turn the contract tests green.",
        "Day 5: Schemathesis fuzzes the service with 5,000 edge payloads in CI. Deployment succeeds with 0 manual integration meetings."
      ]
    },

    aiSynergy: {
      title: "Why SDD is the Silver Bullet for AI Coding Agents",
      summary: "In 2026, autonomous AI coding agents (Claude, Copilot Workspace, Devin) struggle most when given open-ended, ambiguous prompts. When an agent is forced to guess API shapes, it hallucinates parameters, invents non-existent endpoints, and writes incompatible frontend/backend code.",
      breakdown: [
        "Mathematical Grounding: An OpenAPI 3.1 specification provides deterministic boundary constraints that narrow the search space for LLMs.",
        "One-Shot Code Synthesis: LLMs can generate complete controllers, repository layers, and unit test suites with 99%+ accuracy when provided with the target specification.",
        "Automated Verification Loop: AI agents can run contract linters (Spectral) and contract tests (Schemathesis) locally to self-correct their code before human review.",
        "Prompting Strategy: Rather than prompting 'Build me a payments API', enterprise engineers prompt: 'Implement this OpenAPI specification in Node.js/Express following clean architecture principles.'"
      ]
    },

    tools: [
      "OpenAPI 3.1 / Swagger",
      "TypeSpec (Microsoft)",
      "AsyncAPI (Event-driven)",
      "Protobuf / gRPC",
      "Spectral (API Linting)",
      "Prism / MSW (Mocking)",
      "Pact / Schemathesis (Contract Testing)",
      "OpenAPI-TS / Orval (SDK Generation)",
      "GitHub Copilot Workspace / Spec-driven Agents"
    ],
    advantages: [
      "Eliminates Frontend/Backend Blocking: Teams decouple immediately using auto-generated mock servers and client SDKs.",
      "Single Source of Truth: Docs, types, server validation, and tests never drift out of sync.",
      "Exceptional AI Multiplier: LLMs and AI coding agents write accurate code when given formal schemas, avoiding hallucinations.",
      "Guaranteed Backward Compatibility: Breaking schema changes are detected deterministically in git pull requests before merging.",
      "Massive Developer Velocity: Eliminates handwritten boilerplate DTOs and client fetch wrappers."
    ],
    challenges: [
      "Upfront Specification Discipline: Requires architects and engineers to agree on contracts before diving into coding.",
      "Tooling Overhead: Requires configuring code generators, linters, and CI contract testing pipelines.",
      "Internal Domain Logic Coverage: Specs govern boundaries and contracts, but internal algorithmic loops still require unit tests."
    ],
    bestUseCases: [
      "Microservices & Distributed Systems with multiple cross-functional teams.",
      "Public APIs, Enterprise Partner Platforms, and B2B SaaS integrations.",
      "AI-Assisted Development where agents synthesize implementation directly from contracts.",
      "Event-Driven Architectures (Kafka, RabbitMQ) demanding strict payload governance.",
      "Fullstack Web & Mobile apps needing synchronized TypeScript/Kotlin/Swift models."
    ],
    lifecycle: [
      { step: 1, title: "Model & Author Spec", description: "Architects and engineers draft machine-readable specifications (OpenAPI 3.1, TypeSpec, Protobuf) modeling entities and endpoints." },
      { step: 2, title: "Lint & Validate Contract", description: "Run automated linters (Spectral) to verify corporate standards and semantic versioning." },
      { step: 3, title: "Mock & Parallelize Teams", description: "Instantly spin up Prism or MSW mock servers so frontend and backend teams code in parallel." },
      { step: 4, title: "Synthesize & Generate Artifacts", description: "Auto-generate TypeScript types, DTOs, client SDKs, and validation middleware." },
      { step: 5, title: "Verify & Assert Compliance", description: "Run contract testing tools (Pact, Schemathesis) to guarantee 0 runtime contract drift." }
    ]
  },
  {
    id: "tdd",
    name: "Test-Driven Development",
    acronym: "TDD",
    subtitle: "Micro-Feedback Loop & Implementation Quality",
    tagline: "Red -> Green -> Refactor. Code only to make a failing test pass.",
    category: "Developer & Code Quality Centric",
    origin: "Rediscovered and formalized by Kent Beck in the late 1990s as a core foundational pillar of Extreme Programming (XP).",
    primaryFocus: "Internal algorithmic correctness, modular class/function design, regression prevention, and sub-second developer feedback.",
    aiReadinessScore: 8.2,
    governanceWeight: "Medium (Developer Loop)",

    overview: {
      formalDefinition: "Test-Driven Development (TDD) is an iterative software development technique where developers author an automated, failing unit test before writing the production code required to satisfy that test. Development proceeds in rapid, 2-to-5-minute cycles known as the Red-Green-Refactor loop.",
      problemStatement: "In traditional 'Code-First, Test-Later' development, testing is often skipped due to time pressure. When tests are written post-facto, code is typically tightly coupled, difficult to mock, and riddled with hidden side effects. Debugging becomes a forensic ordeal, and developers become terrified of refactoring complex code because they lack an automated safety net.",
      mentalModel: "Think of TDD like double-entry bookkeeping in accounting: every debit must match a credit. In TDD, every line of production logic must be motivated and justified by an automated test. The test suite serves as an unbreakable suspension bridge safety net.",
      keyMetrics: [
        { label: "Reduction in Production Defects", value: "40% - 80%" },
        { label: "Developer Feedback Speed", value: "< 500ms" },
        { label: "Refactoring Psychological Safety", value: "98%" },
        { label: "Organic Unit Test Coverage", value: "90%+" }
      ]
    },

    detailedLifecycle: [
      {
        step: 1,
        title: "1. RED (Author Failing Test)",
        objective: "Define the desired function behavior and API signature by authoring a concise, failing unit test.",
        inputs: "Feature requirement, edge case specification, or bug report.",
        outputs: "A failing test assertion with an explicit, predictable failure message.",
        actions: [
          "Write a single test asserting expected output for given inputs.",
          "Run the test runner and verify it FAILS.",
          "Confirm it fails for the expected reason (e.g. function missing or assertion mismatch), not a syntax error."
        ],
        codeSnippet: `// Step 1: RED
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateTax } from './taxCalculator.js';

describe('Tax Calculator', () => {
  it('should apply 15% luxury tax on electronics above $1,000', () => {
    const item = { type: 'ELECTRONICS', price: 1200 };
    const tax = calculateTax(item);
    assert.strictEqual(tax, 180); // Fails! calculateTax is not defined
  });
});`,
        qualityGate: "Test runner reports FAIL; failure message clearly states expected vs actual."
      },
      {
        step: 2,
        title: "2. GREEN (Minimal Implementation)",
        objective: "Write the simplest, quickest code that makes the failing test pass. Avoid premature optimization or speculation.",
        inputs: "Failing test from Phase 1.",
        outputs: "Passing test suite with all assertions green.",
        actions: [
          "Implement just enough code to satisfy the assertion.",
          "Resist adding unrequested features, speculative abstractions, or database logic.",
          "Run the test runner and watch the badge turn GREEN."
        ],
        codeSnippet: `// Step 2: GREEN (Simplest code to pass)
export function calculateTax(item) {
  if (item.type === 'ELECTRONICS' && item.price > 1000) {
    return item.price * 0.15;
  }
  return 0;
}`,
        qualityGate: "Test runner reports PASS with 0 failures in under 200 milliseconds."
      },
      {
        step: 3,
        title: "3. REFACTOR (Cleanse & Architect)",
        objective: "Clean up code smells, remove duplication, improve variable naming, and extract design patterns while keeping all tests green.",
        inputs: "Passing code and test suite.",
        outputs: "Clean, modular, elegant production code protected by tests.",
        actions: [
          "Extract magic numbers into named domain constants.",
          "Apply design patterns (Strategy, Factory, Polymorphism) if needed.",
          "Re-run test suite after every small tweak to guarantee zero regression."
        ],
        codeSnippet: `// Step 3: REFACTOR (Decoupled, extensible strategy table)
const LUXURY_TAX_RATE = 0.15;
const LUXURY_THRESHOLD = 1000;

const TAXABLE_CATEGORIES = new Set(['ELECTRONICS', 'JEWELRY', 'AUTOMOTIVE']);

export function calculateTax(item) {
  const { type, price = 0 } = item;
  const isLuxury = TAXABLE_CATEGORIES.has(type) && price > LUXURY_THRESHOLD;
  return isLuxury ? Number((price * LUXURY_TAX_RATE).toFixed(2)) : 0;
}`,
        qualityGate: "All tests remain GREEN; cyclomatic complexity reduced; 0 linter warnings."
      },
      {
        step: 4,
        title: "4. REPEAT (Next Incremental Step)",
        objective: "Advance to the next boundary condition, edge case, or error scenario and repeat the micro-loop.",
        inputs: "Next requirement item (e.g., negative prices, zero values, tax exemption flags).",
        outputs: "Incrementally growing, comprehensive test suite.",
        actions: [
          "Add next test: 'should throw error if price is negative'.",
          "Watch test fail (RED), write minimal check (GREEN), clean up (REFACTOR).",
          "Maintain rhythm of 2-5 minute micro-iterations."
        ],
        codeSnippet: `// Repeat cycle with edge case:
it('should throw Error when price is negative', () => {
  assert.throws(() => calculateTax({ type: 'ELECTRONICS', price: -50 }), /Invalid price/);
});`,
        qualityGate: "Progressive accumulation of fast, independent unit tests."
      }
    ],

    corePrinciples: [
      {
        title: "The Three Laws of TDD (Uncle Bob)",
        description: "1. You may not write production code until you have written a failing unit test. 2. You may not write more of a unit test than is sufficient to fail. 3. You may not write more production code than is sufficient to pass the currently failing test.",
        whyItMatters: "Enforces continuous micro-feedback and prevents untested speculative code."
      },
      {
        title: "F.I.R.S.T. Principles of Unit Testing",
        description: "Tests must be Fast (milliseconds), Independent (no order dependency), Repeatable (deterministic anywhere), Self-Validating (boolean pass/fail), and Timely (written test-first).",
        whyItMatters: "Slow or flaky tests get disabled by developers; FIRST tests run continuously in background watchers."
      },
      {
        title: "Design By Testing (Loosely Coupled Architecture)",
        description: "Writing tests first forces small, pure functions, dependency injection, and explicit parameters, naturally preventing monolithic spaghetti code.",
        whyItMatters: "TDD is fundamentally a software design technique, not just a testing technique."
      },
      {
        title: "Transformation Priority Premise (TPP)",
        description: "As tests become more specific, the production code becomes more generic. Simple transformations (constant -> variable -> conditional -> loop) should be preferred.",
        whyItMatters: "Prevents jumping directly to complicated algorithms when simpler general solutions exist."
      }
    ],

    toolingEcosystem: [
      {
        category: "Test Runners & Frameworks",
        tools: [
          { name: "Vitest / Jest", desc: "Blazing fast ESM test runners with built-in mocking, snapshot testing, and coverage." },
          { name: "Node:test (Native)", desc: "Zero-dependency, high-speed test runner baked directly into Node.js 20+." },
          { name: "JUnit 5 / PyTest", desc: "Standard testing powerhouses for enterprise Java and Python backends." }
        ]
      },
      {
        category: "Mocking & Spying",
        tools: [
          { name: "Sinon.js / Vitest Mocks", desc: "Spies, stubs, and mocks for isolating units of code from network and I/O." },
          { name: "Testcontainers", desc: "Lightweight throwaway Docker containers for real integration test verification." }
        ]
      },
      {
        category: "Advanced Quality & Mutation Testing",
        tools: [
          { name: "Stryker Mutator", desc: "Mutation testing tool that alters source code to test if your unit tests actually catch bugs." },
          { name: "Fast-Check", desc: "Property-based testing library running thousands of randomized edge inputs." }
        ]
      }
    ],

    advantagesAndTradeoffs: {
      advantages: [
        { title: "Immediate Feedback Loop", detail: "Get sub-second feedback inside your IDE on whether your algorithmic logic works." },
        { title: "Unstoppable Refactoring Confidence", detail: "Safely refactor legacy or complex code without fear of unintended side effects." },
        { title: "High Organic Coverage", detail: "Achieves 90%+ code coverage naturally without needing separate, tedious 'test writing' sprints." },
        { title: "Cleaner, Modular Code", detail: "Code written test-first is inherently decoupled and easily testable." }
      ],
      pitfalls: [
        {
          antiPattern: "Testing Implementation Details (Brittle Tests)",
          problem: "Writing assertions on private internal methods or mock-heavy call counts instead of observing public behavior.",
          mitigation: "Test public contracts and outputs. Treat the internal class or module as a black box."
        },
        {
          antiPattern: "Writing Tests After Coding (Post-Hoc Tests)",
          problem: "Writing production code first, then writing tests that merely mirror what the code already does.",
          mitigation: "Strictly adhere to the Red phase: watch the test fail before touching production files."
        },
        {
          antiPattern: "Slow or Flaky Unit Tests",
          problem: "Including real database calls, timers, or network I/O in unit test suites.",
          mitigation: "Isolate unit tests from I/O using dependency injection; run integration tests in a separate suite."
        }
      ]
    },

    dayInTheLife: {
      scenarioTitle: "Implementing a Dynamic Pricing & Surge Multiplier",
      narrative: "Alex, a Senior Backend Engineer, is building a ride-share surge pricing calculator with weather, demand, and traffic multipliers.",
      steps: [
        "Minute 0: Alex writes test #1: `should return base fare when demand is normal`. Executes runner -> RED.",
        "Minute 2: Alex implements `return baseFare;`. Test runner turns -> GREEN.",
        "Minute 4: Alex adds test #2: `should apply 1.5x multiplier when rain detected`. Runner -> RED.",
        "Minute 6: Implements rain condition. Runner -> GREEN.",
        "Minute 8: Refactors: extracts weather conditions into a Strategy map. Tests remain GREEN.",
        "Minute 15: Alex repeats for traffic congestion, driver availability, and maximum cap limits.",
        "Minute 30: The surge calculation engine is 100% complete, fully covered, and zero regressions."
      ]
    },

    aiSynergy: {
      title: "How TDD Supercharges AI Pair Programming",
      summary: "In an AI-augmented workflow, TDD serves as the steering wheel and brake system for LLMs. Left unconstrained, AI generates code that looks plausible but fails edge cases.",
      breakdown: [
        "AI as Test Writer: Prompt the AI: 'Given this business requirement, generate 5 edge-case failing unit tests using node:test.'",
        "AI as Code Generator: Provide the failing test to the AI and say: 'Write minimal code to turn this test green.'",
        "Automated AI Feedback: If the AI's generated code fails, the test runner output is fed back into the prompt, allowing the AI to auto-correct itself in seconds."
      ]
    },

    tools: [
      "Jest / Vitest / Node:test",
      "JUnit (Java)",
      "PyTest (Python)",
      "RSpec / Minitest (Ruby)",
      "NUnit / xUnit (.NET)",
      "Mocha / Chai",
      "Stryker (Mutation Testing)"
    ],
    advantages: [
      "Ultra-Fast Feedback: Know within 200 milliseconds whether your logic works.",
      "Bulletproof Regression Safety: Developers refactor complex algorithms with complete psychological safety.",
      "Naturally Decoupled Code: Code written test-first inherently avoids tight coupling and hidden side effects.",
      "Comprehensive Living Test Suite: High unit test coverage emerges organically without post-facto test sprints.",
      "Reduces Debugging Time: Most logic bugs are caught immediately in the IDE rather than in staging or production."
    ],
    challenges: [
      "Steep Learning Curve: Requires discipline and mindset shift; beginners tend to write code first and backfill tests.",
      "Brittle Tests when Coupled to Implementation: Testing internal private details can lead to painful refactoring friction.",
      "Blind to High-Level Business Intent: All unit tests can pass while the system as a whole solves the wrong user problem."
    ],
    bestUseCases: [
      "Complex algorithmic computations (pricing calculators, routing engines, cryptography, parsers).",
      "Domain business logic with high branching complexity and mathematical edge cases.",
      "Core libraries, utility packages, and SDK internals.",
      "Legacy code modernization with characterization tests."
    ],
    lifecycle: [
      { step: 1, title: "1. RED (Failing Test)", description: "Author a precise unit test defining desired function behavior. Watch it fail for expected reason." },
      { step: 2, title: "2. GREEN (Minimal Code)", description: "Write just enough code to satisfy the test. Avoid premature optimizations." },
      { step: 3, title: "3. REFACTOR (Cleanse)", description: "Improve code structure, remove smells, and extract patterns with test safety net." },
      { step: 4, title: "4. REPEAT (Iterate)", description: "Add next edge-case test and repeat in rapid 2-5 minute micro-iterations." }
    ]
  },
  {
    id: "bdd",
    name: "Behavior-Driven Development",
    acronym: "BDD",
    subtitle: "Ubiquitous Language & Business-Centric Collaboration",
    tagline: "Bridging the Communication Chasm with Executable Given/When/Then Scenarios.",
    category: "Collaboration & Business Alignment Centric",
    origin: "Conceived by Dan North in 2003 as an evolution of TDD and Domain-Driven Design (DDD) to address the questions: 'Where do I start, what do I test, and how do I speak about it?'.",
    primaryFocus: "System behavior from the stakeholder perspective, shared ubiquitous domain vocabulary, and executable acceptance criteria.",
    aiReadinessScore: 8.7,
    governanceWeight: "High (Stakeholder Gated)",

    overview: {
      formalDefinition: "Behavior-Driven Development (BDD) is a collaborative software development methodology that bridges communication gaps between technical and non-technical stakeholders. It expresses desired system behavior in human-readable, structured natural language (Gherkin syntax: Given, When, Then) that serves simultaneously as product requirements, automated acceptance tests, and living documentation.",
      problemStatement: "Traditional software engineering suffers from the 'Lost in Translation' syndrome: Product Managers write ambiguous Word PRDs; developers interpret them differently and write technical unit tests; and QA engineers test against yet a third interpretation. Features are delivered that function technically but completely miss the customer's actual business intent.",
      mentalModel: "Think of BDD like a legal contract written in plain, unambiguous language that both business executives, compliance attorneys, and software engineers can co-sign. The contract is executed automatically by robots on every release to prove the contract has been honored.",
      keyMetrics: [
        { label: "Reduction in Requirement Rework", value: "70%" },
        { label: "Stakeholder Alignment Index", value: "96%" },
        { label: "Living Documentation Accuracy", value: "100%" },
        { label: "Defects Found Prior to Sprint", value: "5x" }
      ]
    },

    detailedLifecycle: [
      {
        step: 1,
        title: "1. Discovery & The Three Amigos",
        objective: "Unearth ambiguities and align business expectations before writing any code through concrete user examples.",
        inputs: "User stories, business goals, and customer feedback.",
        outputs: "Agreed-upon concrete scenarios and boundary examples.",
        actions: [
          "Convening the 'Three Amigos': Product Owner (Business Intent), Developer (Technical Feasibility), and QA (Edge Cases & Boundaries).",
          "Apply Example Mapping: break rules into concrete, real-life examples.",
          "Identify unstated assumptions and edge conditions upfront."
        ],
        codeSnippet: `Example Mapping Discussion:
Story: Allow customers to cancel subscriptions.
Rule: Refunds are prorated if cancelled within 14 days.
Example 1: Alice cancels on day 3 -> receives full refund.
Example 2: Bob cancels on day 10 -> receives prorated refund.
Example 3: Charlie cancels on day 16 -> zero refund, access until billing cycle end.`,
        qualityGate: "Three Amigos sign off on examples; User Story satisfies Definition of Ready (DoR)."
      },
      {
        step: 2,
        title: "2. Formulation (Gherkin Scenarios)",
        objective: "Formulate concrete examples into structured, executable Gherkin syntax (.feature files).",
        inputs: "Examples from the Discovery session.",
        outputs: "Standardized `.feature` files containing Feature, Scenario, Given, When, Then, and And statements.",
        actions: [
          "Use Ubiquitous Language: shared domain vocabulary understood by business and dev alike.",
          "Write declarative scenarios focusing on business intent rather than UI clicks (avoid 'click button id=xyz').",
          "Structure into Given (context), When (action), and Then (expected business outcome)."
        ],
        codeSnippet: `Feature: Subscription Cancellation & Prorated Refunds
  As a paying customer
  I want to cancel my active subscription
  So that I am not billed for services I no longer require

  Scenario Outline: Prorated refund based on cancellation window
    Given customer "<Customer>" has an active "$100" monthly subscription
    And the subscription was started "<DaysAgo>" days ago
    When the customer initiates subscription cancellation
    Then the system refund amount should be "<ExpectedRefund>"
    And the subscription status should update to "CANCELLED"

    Examples:
      | Customer | DaysAgo | ExpectedRefund |
      | Alice    | 3       | $100.00        |
      | Bob      | 10      | $66.67         |
      | Charlie  | 16      | $0.00          |`,
        qualityGate: "Scenarios readable and approved by Product Owner; zero technical jargon in Gherkin text."
      },
      {
        step: 3,
        title: "3. Automation (Step Definitions & Glue Code)",
        objective: "Connect natural language Gherkin statements to executable code drivers and assertions.",
        inputs: "`.feature` files.",
        outputs: "Step definition glue code mapping regex/expressions to service calls or browser automation.",
        actions: [
          "Generate step definition skeletons using Cucumber or SpecFlow.",
          "Implement glue code invoking domain services, REST APIs, or Playwright UI drivers.",
          "Maintain clean page object models (POM) or API test harnesses."
        ],
        codeSnippet: `import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { SubscriptionService } from '../src/subscriptionService.js';

Given('customer {string} has an active {string} monthly subscription', function (name, price) {
  this.service = new SubscriptionService();
  this.customer = this.service.createCustomer(name, parseFloat(price.replace('$', '')));
});

When('the customer initiates subscription cancellation', function () {
  this.result = this.service.cancelSubscription(this.customer.id);
});

Then('the system refund amount should be {string}', function (expectedAmount) {
  assert.strictEqual(this.result.refundFormatted, expectedAmount);
});`,
        qualityGate: "Step definitions compile cleanly; initial run shows pending/failing scenarios."
      },
      {
        step: 4,
        title: "4. Execution & Living Documentation",
        objective: "Run automated scenarios in the CI/CD pipeline and publish living documentation reports for stakeholders.",
        inputs: "Completed implementation code and step definitions.",
        outputs: "Passing automated test run and HTML living documentation reports (Allure/Serenity).",
        actions: [
          "Execute BDD test suite in CI pipeline on every pull request.",
          "Generate interactive HTML living reports accessible to non-technical business partners.",
          "Audit compliance: regulatory bodies inspect living documentation to verify adherence to standards."
        ],
        codeSnippet: `# Run cucumber test suite with HTML living documentation output:
npx cucumber-js --format html:reports/living_docs.html

# Generated Living Report shows:
# 100% of Scenarios Passed (3/3)
# Feature: Subscription Cancellation -> Verified by CI on 2026-11-02`,
        qualityGate: "All scenarios pass in CI; living documentation updated and accessible."
      }
    ],

    corePrinciples: [
      {
        title: "Ubiquitous Language (Domain-Driven Design)",
        description: "A single, unambiguous vocabulary shared by domain experts, Product Owners, Developers, and QA across stories, Gherkin files, and source code.",
        whyItMatters: "Eliminates semantic misunderstandings that plague cross-functional software projects."
      },
      {
        title: "The Three Amigos Collaboration",
        description: "Requirements are not handed down from on high; they are co-discovered through structured conversations between Business, Development, and Quality.",
        whyItMatters: "Brings diverse perspectives together to find edge cases before any code is written."
      },
      {
        title: "Outside-In Development",
        description: "Development starts at the outside perimeter (user value and customer workflows) and works inward toward the internal services and database.",
        whyItMatters: "Guarantees that every line of code written directly contributes to verified customer value."
      },
      {
        title: "Living Documentation",
        description: "Tests are written in natural language and double as always-accurate, real-time documentation of the system's actual behavior.",
        whyItMatters: "Word documents and wikis rot; living documentation is executed on every commit and can never drift out of date."
      }
    ],

    toolingEcosystem: [
      {
        category: "BDD Scenario Runners",
        tools: [
          { name: "Cucumber (JS / Java / Ruby)", desc: "The gold standard open-source tool for executable specifications and Gherkin parsing." },
          { name: "SpecFlow / Reqnroll (.NET)", desc: "Enterprise BDD test framework for Microsoft .NET ecosystems." },
          { name: "Behave (Python)", desc: "Python BDD framework following standard Gherkin syntax." }
        ]
      },
      {
        category: "Browser & UI Automation Drivers",
        tools: [
          { name: "Playwright-BDD", desc: "Integrates Cucumber Gherkin scenarios with high-speed Playwright browser automation." },
          { name: "Cypress BDD Preprocessor", desc: "Executes Gherkin feature files directly inside the interactive Cypress test runner." }
        ]
      },
      {
        category: "Living Documentation & Reporting",
        tools: [
          { name: "Allure Report", desc: "Stunning visual test execution reports showcasing scenarios, steps, attachments, and historical trends." },
          { name: "Serenity BDD", desc: "Automated acceptance test reporting engine producing comprehensive living documentation." }
        ]
      }
    ],

    advantagesAndTradeoffs: {
      advantages: [
        { title: "Flawless Business Alignment", detail: "Ensures developers build exactly what the business needs, eliminating costly misunderstandings." },
        { title: "Shared Ubiquitous Language", detail: "Product Managers, Developers, and QA speak the exact same language across tickets, code, and tests." },
        { title: "Living Audit Documentation", detail: "Provides non-technical auditors, regulators, and executives with readable, verified proofs of compliance." },
        { title: "Defect Prevention (Shift-Left)", detail: "Unearths missing requirements and edge cases during the Three Amigos session before coding begins." }
      ],
      pitfalls: [
        {
          antiPattern: "Imperative / UI-Click Scripting in Gherkin",
          problem: "Writing Gherkin like: 'When I click input id=username and type foo and click submit'.",
          mitigation: "Write declarative, business-focused scenarios: 'When Alice logs in with valid credentials'. Keep UI selectors in page objects."
        },
        {
          antiPattern: "Step Definition Glue Code Sprawl",
          problem: "Creating duplicate step definition regexes with subtle wording variations, causing high maintenance overhead.",
          mitigation: "Standardize step phrasing and maintain reusable step libraries across teams."
        },
        {
          antiPattern: "BDD for Low-Level Algorithmic Code",
          problem: "Using Gherkin to test low-level data structures or string formatting functions.",
          mitigation: "Use TDD for internal algorithms and unit logic; reserve BDD for multi-step user and business workflows."
        }
      ]
    },

    dayInTheLife: {
      scenarioTitle: "Implementing Fraud Check during High-Value Checkout",
      narrative: "Priya (Product Owner), Leo (Tech Lead), and Elena (QA Lead) convene to build a fraud verification check for transactions over $5,000.",
      steps: [
        "10:00 AM: Three Amigos meet for 30 minutes. Elena asks: 'What happens if a customer has an account under 24 hours old?' Priya clarifies the rule.",
        "11:00 AM: Priya and Elena write `checkout_fraud.feature` with 4 concrete scenarios covering normal users, VIPs, and newly created accounts.",
        "1:00 PM: Leo connects the Gherkin steps to the payment service using Cucumber and writes the verification pipeline.",
        "3:30 PM: The test runner executes all 4 scenarios. All green badges.",
        "4:00 PM: Living documentation HTML report is generated and shared with the Chief Risk Officer for compliance sign-off."
      ]
    },

    aiSynergy: {
      title: "How BDD Enhances AI Collaboration & Prompt Engineering",
      summary: "Gherkin's Given/When/Then structure is one of the most effective prompt formats for generative AI. Because LLMs are trained extensively on natural language, Gherkin provides structured semantic clarity without technical ambiguity.",
      breakdown: [
        "Automated Story-to-Scenario Generation: Prompt LLMs with a raw user story to generate complete, edge-case-rich Gherkin feature files.",
        "Step Definition Synthesis: AI models can effortlessly parse Gherkin steps and scaffold TypeScript/Java glue code with 95% accuracy.",
        "Living Documentation Summarization: LLMs can review a suite of 200 passing `.feature` files and produce an executive-ready release brief in seconds."
      ]
    },

    tools: [
      "Cucumber (Java, JS, Ruby)",
      "SpecFlow (.NET / Reqnroll)",
      "Behave (Python)",
      "Playwright / Cypress with BDD plugins",
      "JGiven",
      "Serenity BDD",
      "Allure Reporting"
    ],
    advantages: [
      "Flawless Business & Tech Alignment: Eliminates misunderstanding between Product Owners and Developers.",
      "Single Ubiquitous Vocabulary: Everyone uses identical terminology from user stories down to automated test assertions.",
      "Auditable Living Documentation: Regulators, business owners, and non-technical stakeholders can read and verify test suites directly.",
      "Clear Definition of Ready & Done: Features enter sprints with crystal clear acceptance criteria already written.",
      "Drastic Reduction in Rework: Clarifying ambiguities before coding prevents building the wrong feature."
    ],
    challenges: [
      "Maintenance Overhead of Glue Code: Step definition regex mappings can become fragile if not well-architected.",
      "Slower Execution Speed: High-level behavioral and end-to-end tests run significantly slower than unit tests.",
      "Risk of Over-Engineering: Writing Gherkin for simple CRUD without business nuance can introduce unnecessary ceremony."
    ],
    bestUseCases: [
      "Complex business workflows with multi-step regulatory rules (banking, insurance, compliance, e-commerce checkout).",
      "Cross-functional teams where non-technical stakeholders actively review and sign off on test scenarios.",
      "Products with high user interaction and behavioral branching.",
      "Agile enterprise environments enforcing strict Definition of Ready (DoR) gates."
    ],
    lifecycle: [
      { step: 1, title: "1. Discovery (Three Amigos)", description: "Product Owner, QA, and Engineers convene to explore requirements and edge cases through concrete examples." },
      { step: 2, title: "2. Formulation (Gherkin)", description: "Draft executable `.feature` files using structured Given/When/Then ubiquitous syntax." },
      { step: 3, title: "3. Automation (Step Glue)", description: "Engineers map natural language steps to automated code drivers and domain service assertions." },
      { step: 4, title: "4. Living Documentation", description: "Run automated scenarios in CI/CD, producing living compliance documentation." }
    ]
  }
];

export function getMethodologyById(id) {
  return methodologies.find(m => m.id.toLowerCase() === id.toLowerCase());
}

export function getAllMethodologies() {
  return methodologies;
}
