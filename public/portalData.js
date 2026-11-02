// Embedded Fallback Data for Enterprise SDD, TDD & BDD Portal
// Ensures 100% offline and standalone resilience even if opened directly via file:// or during server restarts.

const PORTAL_FALLBACK_DATA = {
  methodologies: [
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
          outputs: "Formally authored specification file (openapi.yaml, schema.tsp, or events.asyncapi.yaml).",
          actions: [
            "Define resource paths, idempotency keys, and security schemes (OAuth2, JWT).",
            "Specify strict JSON Schema constraints: data types, regex patterns, enum lists, and numerical bounds.",
            "Document error models (e.g., RFC 7807 Problem Details) for 400, 401, 403, 404, 409, and 500 responses."
          ],
          codeSnippet: `openapi: 3.1.0\ninfo:\n  title: Payment Gateway API\n  version: 1.0.0\npaths:\n  /v1/payments:\n    post:\n      summary: Process an idempotent payment\n      requestBody:\n        required: true\n        content:\n          application/json:\n            schema:\n              $ref: '#/components/schemas/PaymentRequest'\n      responses:\n        '201':\n          description: Payment Authorized`,
          qualityGate: "API Design Review passed; RFC approved by Solution Architect and Consumer Tech Leads."
        },
        {
          step: 2,
          title: "2. Automated Contract Linting & Governance",
          objective: "Enforce enterprise design standards, security baselines, semantic versioning, and naming conventions automatically.",
          inputs: "Authored specification file and organizational ruleset (.spectral.yaml).",
          outputs: "Spectral / TypeSpec linting report with zero errors and zero warnings.",
          actions: [
            "Verify kebab-case or camelCase path naming consistency across microservices.",
            "Ensure every endpoint declares authentication and rate-limiting headers.",
            "Check that all schemas enforce explicit required fields, enum boundaries, and descriptions."
          ],
          codeSnippet: `# .spectral.yaml\nextends: ["spectral:oas", "spectral:owasp"]\nrules:\n  no-http-basic: true\n  paths-kebab-case:\n    description: "All URL paths must use kebab-case"\n    given: "$.paths[*]~"\n    then:\n      function: pattern\n      functionOptions:\n        match: "^(/[a-z0-9-~.]+)+$"`,
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
          codeSnippet: `# Spin up instantaneous mock server:\nnpx @stoplight/prism-cli mock -p 4010 openapi.yaml\n\n# Frontend developers can instantly execute:\ncurl http://localhost:4010/v1/payments`,
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
          codeSnippet: `// Auto-synthesized TypeScript Model\nexport interface PaymentRequest {\n  transactionId: string;\n  amount: number;\n  currency: 'USD' | 'EUR' | 'GBP';\n}`,
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
          codeSnippet: `# Fuzz test runtime backend against contract:\nnpx schemathesis run http://localhost:3080/api/v1/openapi.yaml --checks all`,
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
            { name: "OpenAPI Generator", desc: "Generates server stubs and client libraries for 40+ programming languages." }
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
            problem: "Writing code first and using code annotations to generate specs after the fact.",
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
          "Day 1: Sarah drafts webhook-spec.yaml using OpenAPI 3.1. She models the idempotent payload, required HMAC headers, and RFC 7807 error envelopes.",
          "Day 2: She runs spectral lint to ensure adherence to corporate security rules. The billing team reviews and approves the contract in a GitHub PR.",
          "Day 3: Prism mock server is deployed to the staging cluster. Marcus (Frontend Lead) immediately builds the payment status dashboard against the live mock.",
          "Day 4: Sarah runs orval to auto-generate TypeScript types and Express Zod validation middleware. The backend logic is written to turn the contract tests green.",
          "Day 5: Schemathesis fuzzes the service with 5,000 edge payloads in CI. Deployment succeeds with 0 manual integration meetings."
        ]
      },

      aiSynergy: {
        title: "Why SDD is the Silver Bullet for AI Coding Agents",
        summary: "In 2026, autonomous AI coding agents struggle most when given open-ended, ambiguous prompts. When an agent is forced to guess API shapes, it hallucinates parameters, invents non-existent endpoints, and writes incompatible frontend/backend code.",
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
            "Confirm it fails for the expected reason, not a syntax error."
          ],
          codeSnippet: `import { describe, it } from 'node:test';\nimport assert from 'node:assert';\nimport { calculateTax } from './taxCalculator.js';\n\ndescribe('Tax Calculator', () => {\n  it('should apply 15% luxury tax on electronics above $1,000', () => {\n    const item = { type: 'ELECTRONICS', price: 1200 };\n    assert.strictEqual(calculateTax(item), 180); // Fails!\n  });\n});`,
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
          codeSnippet: `export function calculateTax(item) {\n  if (item.type === 'ELECTRONICS' && item.price > 1000) {\n    return item.price * 0.15;\n  }\n  return 0;\n}`,
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
          codeSnippet: `const LUXURY_TAX_RATE = 0.15;\nconst LUXURY_THRESHOLD = 1000;\nconst TAXABLE = new Set(['ELECTRONICS', 'JEWELRY']);\n\nexport function calculateTax(item) {\n  const isLuxury = TAXABLE.has(item.type) && item.price > LUXURY_THRESHOLD;\n  return isLuxury ? Number((item.price * LUXURY_TAX_RATE).toFixed(2)) : 0;\n}`,
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
          codeSnippet: `it('should throw Error when price is negative', () => {\n  assert.throws(() => calculateTax({ type: 'ELECTRONICS', price: -50 }), /Invalid price/);\n});`,
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
          "Minute 0: Alex writes test #1: should return base fare when demand is normal. Executes runner -> RED.",
          "Minute 2: Alex implements return baseFare;. Test runner turns -> GREEN.",
          "Minute 4: Alex adds test #2: should apply 1.5x multiplier when rain detected. Runner -> RED.",
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
            "Convening the 'Three Amigos': Product Owner, Developer, and QA.",
            "Apply Example Mapping: break rules into concrete, real-life examples.",
            "Identify unstated assumptions and edge conditions upfront."
          ],
          codeSnippet: `Example Mapping Discussion:\nStory: Allow customers to cancel subscriptions.\nRule: Refunds are prorated if cancelled within 14 days.\nExample 1: Alice cancels on day 3 -> receives full refund.\nExample 2: Bob cancels on day 10 -> receives prorated refund.\nExample 3: Charlie cancels on day 16 -> zero refund.`,
          qualityGate: "Three Amigos sign off on examples; User Story satisfies Definition of Ready (DoR)."
        },
        {
          step: 2,
          title: "2. Formulation (Gherkin Scenarios)",
          objective: "Formulate concrete examples into structured, executable Gherkin syntax (.feature files).",
          inputs: "Examples from the Discovery session.",
          outputs: "Standardized .feature files containing Feature, Scenario, Given, When, Then statements.",
          actions: [
            "Use Ubiquitous Language: shared domain vocabulary understood by business and dev alike.",
            "Write declarative scenarios focusing on business intent rather than UI clicks.",
            "Structure into Given (context), When (action), and Then (expected business outcome)."
          ],
          codeSnippet: `Feature: Subscription Cancellation & Prorated Refunds\n  Scenario Outline: Prorated refund based on cancellation window\n    Given customer "<Customer>" has an active "$100" monthly subscription\n    When the customer initiates subscription cancellation\n    Then the system refund amount should be "<ExpectedRefund>"\n\n    Examples:\n      | Customer | ExpectedRefund |\n      | Alice    | $100.00        |\n      | Bob      | $66.67         |`,
          qualityGate: "Scenarios readable and approved by Product Owner; zero technical jargon in Gherkin text."
        },
        {
          step: 3,
          title: "3. Automation (Step Definitions & Glue Code)",
          objective: "Connect natural language Gherkin statements to executable code drivers and assertions.",
          inputs: ".feature files.",
          outputs: "Step definition glue code mapping regex/expressions to service calls or browser automation.",
          actions: [
            "Generate step definition skeletons using Cucumber or SpecFlow.",
            "Implement glue code invoking domain services, REST APIs, or Playwright UI drivers.",
            "Maintain clean page object models (POM) or API test harnesses."
          ],
          codeSnippet: `import { Given, When, Then } from '@cucumber/cucumber';\nimport assert from 'node:assert';\n\nGiven('customer {string} has an active {string} monthly subscription', function (name, price) {\n  this.customer = createCustomer(name, price);\n});\n\nWhen('the customer initiates subscription cancellation', function () {\n  this.result = cancelSubscription(this.customer.id);\n});\n\nThen('the system refund amount should be {string}', function (expectedAmount) {\n  assert.strictEqual(this.result.refundFormatted, expectedAmount);\n});`,
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
          codeSnippet: `# Run cucumber test suite with HTML living documentation output:\nnpx cucumber-js --format html:reports/living_docs.html\n# => 100% Passed. Living Documentation Published.`,
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
          "11:00 AM: Priya and Elena write checkout_fraud.feature with 4 concrete scenarios covering normal users, VIPs, and newly created accounts.",
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
          "Living Documentation Summarization: LLMs can review a suite of 200 passing .feature files and produce an executive-ready release brief in seconds."
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
        { step: 2, title: "2. Formulation (Gherkin)", description: "Draft executable .feature files using structured Given/When/Then ubiquitous syntax." },
        { step: 3, title: "3. Automation (Step Glue)", description: "Engineers map natural language steps to automated code drivers and domain service assertions." },
        { step: 4, title: "4. Living Documentation", description: "Run automated scenarios in CI/CD, producing living compliance documentation." }
      ]
    }
  ],
  comparison: {
    categories: [
      "Strategic & Architectural",
      "Process & Lifecycle",
      "Artifacts & Standards",
      "Feedback & Speed",
      "AI & Future Readiness"
    ],
    radarDimensions: [
      { dimension: "Contract Safety & Governance", sdd: 9.8, tdd: 6.5, bdd: 7.0 },
      { dimension: "Micro-Feedback Speed (IDE)", sdd: 7.5, tdd: 9.9, bdd: 6.0 },
      { dimension: "Business Stakeholder Alignment", sdd: 7.0, tdd: 5.5, bdd: 9.8 },
      { dimension: "Autonomous AI Agent Synergy", sdd: 9.9, tdd: 8.2, bdd: 8.7 },
      { dimension: "Cross-Team Parallelization", sdd: 9.7, tdd: 6.0, bdd: 7.8 },
      { dimension: "Living Documentation Value", sdd: 9.2, tdd: 5.0, bdd: 9.9 }
    ],
    dimensions: [
      {
        dimension: "Primary Philosophy & Driving Question",
        category: "Strategic & Architectural",
        sdd: "What is the exact contract between systems? Spec as single source of truth.",
        tdd: "Did I write the internal code right? Red-Green-Refactor micro-loop.",
        bdd: "Are we building the right user behavior? Given-When-Then ubiquitous language.",
        keyTakeaway: "SDD defines system boundaries; TDD verifies internal correctness; BDD verifies business value."
      },
      {
        dimension: "Target Abstraction Level",
        category: "Strategic & Architectural",
        sdd: "System boundaries, APIs, Microservices, Event schemas, DTOs.",
        tdd: "Unit / Function / Class level algorithms and internal logic.",
        bdd: "User workflow / Feature / Acceptance Criteria / Integration level.",
        keyTakeaway: "SDD operates at service perimeters; BDD at product workflow; TDD deep inside the engine."
      },
      {
        dimension: "Primary Stakeholders & Authors",
        category: "Strategic & Architectural",
        sdd: "Solutions Architects, API Designers, Multi-team Leads, AI Agents.",
        tdd: "Software Engineers, Core Developers.",
        bdd: "Three Amigos: Product Owners, QA Analysts, and Developers.",
        keyTakeaway: "BDD has the broadest cross-functional audience; TDD is developer-internal; SDD spans enterprise systems."
      },
      {
        dimension: "Core Artifact Produced First",
        category: "Artifacts & Standards",
        sdd: "Formal Spec / Schema (.yaml, .json, .tsp, .proto).",
        tdd: "Automated Unit Test case (.test.js, .spec.ts).",
        bdd: "Executable Feature file with Gherkin scenarios (.feature).",
        keyTakeaway: "SDD starts with a machine-readable schema; BDD with natural language scenarios; TDD with executable test code."
      },
      {
        dimension: "Feedback Loop & Velocity",
        category: "Feedback & Speed",
        sdd: "Fast design-time linting (<100ms) + CI contract tests (<5s). Enables parallel team development immediately.",
        tdd: "Instantaneous developer loop (10ms - 500ms) right inside the IDE.",
        bdd: "Medium to Long loop (seconds to minutes) depending on step runner and UI/API automation drivers.",
        keyTakeaway: "TDD provides the fastest second-by-second code feedback; SDD unlocks massive team parallelization upfront."
      },
      {
        dimension: "Ecosystem & Primary Tooling",
        category: "Artifacts & Standards",
        sdd: "OpenAPI 3.1, TypeSpec, AsyncAPI, Spectral, Prism, Pact, Orval.",
        tdd: "Jest, Vitest, Node:test, JUnit, PyTest, RSpec, Stryker.",
        bdd: "Cucumber, SpecFlow, Behave, Playwright-BDD, Serenity.",
        keyTakeaway: "SDD toolchains generate code and validate schemas; TDD/BDD toolchains execute assertions."
      },
      {
        dimension: "AI Agent & Autonomous Code Generation Synergy",
        category: "AI & Future Readiness",
        sdd: "Exceptional (10/10). Unambiguous machine-readable specs eliminate LLM hallucinations and enable 1-shot code synthesis.",
        tdd: "High (8/10). AI tools excel at generating test suites and completing code to turn red tests green.",
        bdd: "Very High (8.5/10). LLMs easily translate user stories into Gherkin scenarios and scaffold step definitions.",
        keyTakeaway: "SDD provides the mathematical constraints AI needs to build large-scale distributed systems safely."
      },
      {
        dimension: "Team Parallelization Capability",
        category: "Process & Lifecycle",
        sdd: "Maximum. Frontend, Backend, Mobile, and QA work in parallel immediately against auto-generated mocks and SDKs.",
        tdd: "Low parallelization across teams; primarily boosts solo developer throughput.",
        bdd: "Moderate. PO, QA, and Dev align upfront, but automation typically tracks implementation.",
        keyTakeaway: "SDD completely unblocks cross-team bottlenecks before implementation begins."
      },
      {
        dimension: "Refactoring Safety & Friction",
        category: "Process & Lifecycle",
        sdd: "Prevents breaking external API contracts; schema linters flag breaking changes instantly.",
        tdd: "Exceptional internal safety net; warning: tight test coupling to private methods can create refactoring friction.",
        bdd: "Resilient to internal implementation changes because tests only assert external behavioral outcomes.",
        keyTakeaway: "BDD and SDD tests survive internal refactors without changing test code; TDD protects algorithmic changes."
      },
      {
        dimension: "Maintenance Overhead & Living Documentation",
        category: "Artifacts & Standards",
        sdd: "Zero doc drift; interactive Swagger/Redoc portals and SDKs are compiled continuously from source specs.",
        tdd: "Low doc value for business users; primarily serves as developer-level technical documentation.",
        bdd: "Living documentation readable by business executives, auditors, and non-technical stakeholders.",
        keyTakeaway: "SDD documents the technical system contract; BDD documents the business feature behavior."
      }
    ]
  },
  simulationData: {
    tdd: {
      featureName: "Discount & Loyalty Calculation Engine",
      steps: [
        {
          phase: "red",
          phaseName: "1. RED (Failing Test)",
          badgeColor: "bg-red-500",
          description: "Write an automated unit test expressing the desired behavior before implementation exists. The test must fail.",
          testCode: "import { describe, it } from 'node:test';\nimport assert from 'node:assert';\nimport { calculateOrderDiscount } from './pricingEngine.js';\n\ndescribe('Pricing Engine - Tier Loyalty Discount', () => {\n  it('should apply 20% discount for PLATINUM loyalty tier on orders >= $100', () => {\n    const order = { subtotal: 150, customerTier: 'PLATINUM' };\n    const result = calculateOrderDiscount(order);\n    assert.strictEqual(result.finalTotal, 120);\n    assert.strictEqual(result.appliedDiscountPercent, 20);\n  });\n});",
          implementationCode: "// pricingEngine.js - Implementation does not exist yet!\nexport function calculateOrderDiscount(order) {\n  throw new Error('Method calculateOrderDiscount not implemented.');\n}",
          testRunnerOutput: "[FAIL] Pricing Engine - Tier Loyalty Discount > should apply 20% discount for PLATINUM loyalty tier\nError: Method calculateOrderDiscount not implemented.\n   at calculateOrderDiscount (pricingEngine.js:4:9)\nTests: 1 failed, 0 passed, 1 total\nDuration: 14ms\nStatus: Expected failure achieved (RED)."
        },
        {
          phase: "green",
          phaseName: "2. GREEN (Minimal Passing Code)",
          badgeColor: "bg-emerald-500",
          description: "Write the simplest possible code to make the failing test pass. Do not over-engineer or add premature optimizations.",
          testCode: "import { describe, it } from 'node:test';\nimport assert from 'node:assert';\nimport { calculateOrderDiscount } from './pricingEngine.js';\n\ndescribe('Pricing Engine - Tier Loyalty Discount', () => {\n  it('should apply 20% discount for PLATINUM loyalty tier on orders >= $100', () => {\n    const order = { subtotal: 150, customerTier: 'PLATINUM' };\n    const result = calculateOrderDiscount(order);\n    assert.strictEqual(result.finalTotal, 120);\n    assert.strictEqual(result.appliedDiscountPercent, 20);\n  });\n});",
          implementationCode: "export function calculateOrderDiscount(order) {\n  if (order.customerTier === 'PLATINUM' && order.subtotal >= 100) {\n    return { finalTotal: order.subtotal * 0.8, appliedDiscountPercent: 20 };\n  }\n  return { finalTotal: order.subtotal, appliedDiscountPercent: 0 };\n}",
          testRunnerOutput: "[PASS] Pricing Engine - Tier Loyalty Discount > should apply 20% discount for PLATINUM loyalty tier\nTests: 1 passed, 0 failed, 1 total\nDuration: 8ms\nStatus: GREEN! All assertions passed."
        },
        {
          phase: "refactor",
          phaseName: "3. REFACTOR (Cleanse & Design)",
          badgeColor: "bg-cyan-500",
          description: "Clean up code smells, extract constants and strategy patterns, improve naming and maintainability while keeping all tests passing.",
          testCode: "import { describe, it } from 'node:test';\nimport assert from 'node:assert';\nimport { calculateOrderDiscount } from './pricingEngine.js';\n\ndescribe('Pricing Engine - Tier Loyalty Discount', () => {\n  it('should apply 20% discount for PLATINUM loyalty tier on orders >= $100', () => {\n    const order = { subtotal: 150, customerTier: 'PLATINUM' };\n    const result = calculateOrderDiscount(order);\n    assert.strictEqual(result.finalTotal, 120);\n    assert.strictEqual(result.appliedDiscountPercent, 20);\n  });\n});",
          implementationCode: "const TIER_RATES = { PLATINUM: 0.20, GOLD: 0.10, SILVER: 0.05 };\n\nexport function calculateOrderDiscount(order) {\n  const rate = (order.subtotal >= 100 ? TIER_RATES[order.customerTier] : 0) || 0;\n  return {\n    finalTotal: Number((order.subtotal * (1 - rate)).toFixed(2)),\n    appliedDiscountPercent: Math.round(rate * 100)\n  };\n}",
          testRunnerOutput: "[PASS] Pricing Engine - Tier Loyalty Discount > should apply 20% discount for PLATINUM loyalty tier (120 === 120)\nTests: 2 passed, 0 failed, 2 total\nDuration: 6ms\nStatus: REFACTORED! Code is modular, zero-magic-numbers, decoupled, and 100% verified."
        }
      ]
    },
    bdd: [
      {
        feature: "Enterprise Order Checkout & Fraud Verification",
        scenario: "VIP Customer checks out with high-value order under fraud threshold",
        steps: [
          { type: "Given", text: "a registered customer 'Alice' with VIP status", status: "passed", detail: "Customer context initialized with creditLimit: $10,000" },
          { type: "And", text: "the customer cart contains 3 items worth $1,450.00", status: "passed", detail: "Cart items verified and stock pre-reserved" },
          { type: "When", text: "the customer confirms checkout with payment method 'CORPORATE_AMEX'", status: "passed", detail: "Payment authorization token received from gateway" },
          { type: "Then", text: "the order status should be 'CONFIRMED'", status: "passed", detail: "Order #ORD-98231 persisted with status CONFIRMED" },
          { type: "And", text: "an invoice PDF specification is emitted to the accounting queue", status: "passed", detail: "Event 'InvoiceGeneratedEvent' dispatched to Kafka topic" }
        ]
      },
      {
        feature: "User Authentication & MFA Gate",
        scenario: "User attempts login from unrecognized geolocation",
        steps: [
          { type: "Given", text: "an active user 'Bob' registered in 'US-EAST'", status: "passed", detail: "User record retrieved with active MFA policy" },
          { type: "When", text: "Bob authenticates with valid credentials from IP '198.51.100.22' in 'Europe/Zurich'", status: "passed", detail: "Geo-IP anomaly detected: Distance delta > 4,000 miles" },
          { type: "Then", text: "the system prompts Bob for a Step-Up TOTP Multi-Factor code", status: "passed", detail: "MFA challenge generated with 5-minute TTL" },
          { type: "And", text: "a security alert is recorded in the audit log", status: "passed", detail: "Audit event SECURITY_ANOMALY_GEO logged with severity WARNING" }
        ]
      }
    ]
  },
  glossary: [
    {
      term: "Contract Drift",
      category: "SDD",
      definition: "The silent divergence between what a backend API returns at runtime and what the API documentation or client SDK expects. SDD prevents drift via CI contract testing.",
      icon: "⚡"
    },
    {
      term: "Spectral Linting",
      category: "SDD",
      definition: "Automated static analysis for OpenAPI and JSON Schema specs. Enforces enterprise conventions (kebab-case paths, required authentication headers, RFC 7807 error envelopes).",
      icon: "🛡️"
    },
    {
      term: "Prism Mock Server",
      category: "SDD",
      definition: "A zero-code HTTP mock server that reads an OpenAPI spec and returns realistic dynamic payloads, unblocking frontend and QA teams immediately.",
      icon: "🎭"
    },
    {
      term: "Schemathesis",
      category: "SDD",
      definition: "A property-based testing tool that ingests OpenAPI specs to automatically synthesize thousands of negative, boundary, and fuzz test cases against a live server.",
      icon: "🔬"
    },
    {
      term: "The Three Amigos",
      category: "BDD",
      definition: "A disciplined collaborative triad consisting of Product Owner (Business Intent), Developer (Technical Feasibility), and QA (Edge Cases & Boundaries) meeting before sprint execution.",
      icon: "👥"
    },
    {
      term: "Gherkin Syntax",
      category: "BDD",
      definition: "Structured natural language format (Given [Context], When [Action], Then [Expected Outcome]) that acts simultaneously as business requirements and executable automated tests.",
      icon: "📝"
    },
    {
      term: "Ubiquitous Language",
      category: "BDD",
      definition: "A shared, unambiguous domain vocabulary co-authored by business stakeholders and engineering, used consistently across user stories, Gherkin feature files, and code symbols.",
      icon: "🗣️"
    },
    {
      term: "Red-Green-Refactor",
      category: "TDD",
      definition: "The 3-stage micro-cycle: 1. RED (author a failing test), 2. GREEN (write the minimal code to pass), and 3. REFACTOR (cleanse code smells and design while relying on tests as a safety net).",
      icon: "🔄"
    },
    {
      term: "FIRST Principles",
      category: "TDD",
      definition: "Core qualities of effective unit tests: Fast (milliseconds), Independent (no order coupling), Repeatable (deterministic), Self-Validating (boolean pass/fail), and Timely (written test-first).",
      icon: "🥇"
    },
    {
      term: "Mutation Testing",
      category: "TDD",
      definition: "An advanced test quality technique (e.g., Stryker Mutator) that injects deliberate bugs into source code to verify whether your unit tests are robust enough to catch them.",
      icon: "🧬"
    },
    {
      term: "TypeSpec (Microsoft)",
      category: "SDD",
      definition: "A TypeScript-like domain-specific modeling language designed by Microsoft to author API definitions and compile them to OpenAPI 3.0, JSON Schema, and Protobuf.",
      icon: "🔷"
    },
    {
      term: "Shift-Left Testing",
      category: "All",
      definition: "Moving testing, contract verification, and quality audits earlier in the development lifecycle (during design and PR review) rather than waiting for post-deployment staging.",
      icon: "⬅️"
    }
  ],
  unifiedCaseStudy: {
    problemStatement: {
      title: "Global Enterprise Checkout & Dynamic Tiered Loyalty Discount Engine",
      businessContext: "A global multi-channel retail platform needs to release a new checkout and pricing engine. The requirements are high-stakes: VIP loyalty customers receive 20% discounts on orders >= $100; orders above $5,000 trigger automated fraud verification; duplicate transactions must be prevented via UUID idempotency; and 12 distributed engineering teams (iOS, Android, React Web, Microservices Backend, and Compliance QA) must deliver concurrently within a 6-week sprint without blocking each other.",
      coreChallenges: [
        "Ambiguity in business requirements leading to costly rework.",
        "Frontend & Mobile teams blocked waiting for backend microservices to be deployed.",
        "Risk of subtle algorithmic calculation bugs in currency precision and tiered discount rules.",
        "Contract drift between mobile apps and backend APIs causing production crashes."
      ]
    },
    methodologySolutions: {
      bdd: {
        name: "Behavior-Driven Development (BDD)",
        drivingQuestion: "Are we building the right business behavior for the customer?",
        primaryActors: "Three Amigos (Product Owner, QA SDET, Fullstack Engineer)",
        approach: "Shift-Left Collaboration & Ubiquitous Language Formulation",
        stepsTaken: [
          "Product Owner, QA, and Engineers convene in a 45-minute Example Mapping session to discuss edge cases.",
          "The team formulates business rules into an executable Gherkin .feature file using standard Given-When-Then syntax.",
          "Engineers connect Gherkin steps to automated Cucumber/Playwright drivers.",
          "Scenarios run in CI/CD pipeline, generating HTML living documentation reports."
        ],
        concreteArtifact: {
          type: "Gherkin Specification (.feature)",
          fileName: "checkout_discount_and_fraud.feature",
          content: "Feature: VIP Tiered Loyalty Discount & Fraud Prevention\\n  As an e-commerce customer\\n  I want my tier-based discount automatically calculated at checkout\\n  So that I receive accurate loyalty rewards\\n\\n  Scenario Outline: Applying VIP discounts and fraud verification rules\\n    Given a customer \\\"<CustomerName>\\\" with tier \\\"<Tier>\\\"\\n    And the customer cart subtotal is \\\"<Subtotal>\\\"\\n    When the customer initiates checkout with payment method \\\"<PaymentMethod>\\\"\\n    Then the calculated discount should be \\\"<DiscountPercent>\\\"\\n    And the final charge amount should be \\\"<FinalAmount>\\\"\\n    And the fraud screening result should be \\\"<FraudStatus>\\\"\\n\\n    Examples:\\n      | CustomerName | Tier     | Subtotal  | PaymentMethod   | DiscountPercent | FinalAmount | FraudStatus |\\n      | Alice        | PLATINUM | $200.00   | CORPORATE_AMEX  | 20%             | $160.00     | APPROVED    |\\n      | Bob          | PLATINUM | $80.00    | VISA_DEBIT      | 0%              | $80.00      | APPROVED    |\\n      | Charlie      | SILVER   | $150.00   | INSTANT_ACH     | 5%              | $142.50     | APPROVED    |\\n      | Diana        | PLATINUM | $6,500.00 | WIRE_TRANSFER   | 20%             | $5,200.00   | FLAG_REVIEW |"
        },
        benefitsAchieved: [
          "100% Requirements Clarity: Clarified discount rules BEFORE coding started.",
          "Living Documentation: Business executives can read and audit the test suite without viewing source code.",
          "Zero Lost-in-Translation: Common ubiquitous language across POs, QA, and developers.",
          "Prevented 8 major edge-case bugs during the initial Three Amigos session."
        ],
        roiMetric: "70% reduction in requirements churn and zero post-sprint rework."
      },
      sdd: {
        name: "Specification-Driven Development (SDD)",
        drivingQuestion: "What is the authoritative contract governing system boundaries?",
        primaryActors: "Solutions Architect, API Platform Team, Autonomous AI Coding Agents",
        approach: "Schema-First Engineering & Single Source of Truth Synthesis",
        stepsTaken: [
          "Solutions Architect authors an OpenAPI 3.1 specification contract defining entities, idempotency headers, and error models.",
          "Spectral linter enforces enterprise security and naming in pre-commit git hooks.",
          "Prism HTTP Mock Server deployed immediately: Web, iOS, and Android teams start frontend work on Day 1.",
          "OpenAPI generator synthesizes TypeScript DTOs, React Query hooks, and Zod validation middleware.",
          "Schemathesis runs property-based fuzz tests in CI to guarantee 0 contract drift."
        ],
        concreteArtifact: {
          type: "OpenAPI 3.1 Contract (.yaml)",
          fileName: "checkout-contract.openapi.yaml",
          content: "openapi: 3.1.0\\ninfo:\\n  title: Checkout & Discount Orchestration Service\\n  version: 1.0.0\\npaths:\\n  /v1/checkout/calculate:\\n    post:\\n      summary: Calculate order discount and validate fraud risk\\n      headers:\\n        X-Idempotency-Key:\\n          schema:\\n            type: string\\n            format: uuid\\n          required: true\\n      requestBody:\\n        required: true\\n        content:\\n          application/json:\\n            schema:\\n              $ref: '#/components/schemas/CheckoutRequest'\\n      responses:\\n        '200':\\n          description: Discount calculated and validated"
        },
        benefitsAchieved: [
          "Concurrent Team Development: Mobile & web teams started coding on Day 1 against mock servers.",
          "Zero Contract Drift: Breaking payload changes automatically blocked in CI pull requests.",
          "Automated SDK Generation: Over 1,200 lines of boilerplate DTOs auto-synthesized.",
          "AI Agentic Accelerator: AI coding agents synthesized 100% compliant controllers without hallucination."
        ],
        roiMetric: "3.5x faster cross-team feature delivery; 94% reduction in API integration defects."
      },
      tdd: {
        name: "Test-Driven Development (TDD)",
        drivingQuestion: "Did we build the internal calculation logic right with zero bugs?",
        primaryActors: "Core Backend Software Engineers",
        approach: "Micro-Feedback Red-Green-Refactor Loop (FIRST Principles)",
        stepsTaken: [
          "RED: Author isolated failing unit test for 20% PLATINUM discount calculation.",
          "GREEN: Write minimal conditional code to pass test in 12ms.",
          "REFACTOR: Extract frozen Tier Strategy Map and isolate pure functions from I/O.",
          "REPEAT: Add boundary edge cases: subtotal < $100, rounding precision, boundary at $99.99 vs $100.00."
        ],
        concreteArtifact: {
          type: "Refactored Modular Source & Test Suite",
          fileName: "discountCalculator.js & discountCalculator.test.js",
          content: "// Pure Calculation Engine\\nconst TIER_DISCOUNTS = Object.freeze({\\n  PLATINUM: 0.20,\\n  GOLD: 0.10,\\n  SILVER: 0.05,\\n  STANDARD: 0.00\\n});\\n\\nexport function calculateOrderDiscounts(order) {\\n  const { subtotal, customerTier = 'STANDARD' } = order;\\n  const rate = subtotal >= 100 ? (TIER_DISCOUNTS[customerTier] || 0) : 0;\\n  const finalTotal = Number((subtotal * (1 - rate)).toFixed(2));\\n  const fraudStatus = subtotal >= 5000 ? 'FLAG_REVIEW' : 'APPROVED';\\n  return { subtotal, appliedDiscountPercent: Math.round(rate * 100), finalTotal, fraudStatus };\\n}"
        },
        benefitsAchieved: [
          "Sub-Second Feedback Loop: Developers knew within 15 milliseconds whether mathematical logic was correct.",
          "Fearless Refactoring: Refactored nested if-else code into clean Strategy pattern with 100% safety.",
          "Flawless Boundary Testing: Floating-point rounding and boundary conditions trapped immediately.",
          "Decoupled Pure Functions: Zero dependencies on external databases or network services."
        ],
        roiMetric: "Zero calculation regressions; 99.99% algorithmic precision in production."
      }
    },
    holisticSynergy: {
      summary: "How the Three Methodologies Converge into an Unbeatable Enterprise Workflow",
      breakdown: [
        {
          stage: "Stage 1: Business Alignment (BDD)",
          action: "Product, QA, and Engineering write Gherkin scenarios to agree on business rules and edge cases upfront.",
          solves: "Eliminates requirements misunderstandings and establishes the Definition of Ready (DoR)."
        },
        {
          stage: "Stage 2: Architecture & Contracts (SDD)",
          action: "Architects formalize the boundary contract in OpenAPI 3.1. Mocks, types, and validation schemas are synthesized.",
          solves: "Unblocks frontend/mobile teams immediately, prevents contract drift, and gives AI agents precise blueprints."
        },
        {
          stage: "Stage 3: Engine Craftsmanship (TDD)",
          action: "Developers implement internal complex calculation engines using the Red-Green-Refactor micro-loop.",
          solves: "Ensures mathematical precision, prevents logic regressions, and produces decoupled, clean code."
        }
      ]
    }
  }
};
