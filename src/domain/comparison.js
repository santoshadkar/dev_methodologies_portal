/**
 * Comprehensive Comparative Matrix, Radar Metrics & Evaluation Taxonomy across SDD, TDD, and BDD
 */

export const comparisonCategories = [
  "Strategic & Architectural",
  "Process & Lifecycle",
  "Artifacts & Standards",
  "Feedback & Speed",
  "AI & Future Readiness"
];

export const radarDimensions = [
  { dimension: "Contract Safety & Governance", sdd: 9.8, tdd: 6.5, bdd: 7.0 },
  { dimension: "Micro-Feedback Speed (IDE)", sdd: 7.5, tdd: 9.9, bdd: 6.0 },
  { dimension: "Business Stakeholder Alignment", sdd: 7.0, tdd: 5.5, bdd: 9.8 },
  { dimension: "Autonomous AI Agent Synergy", sdd: 9.9, tdd: 8.2, bdd: 8.7 },
  { dimension: "Cross-Team Parallelization", sdd: 9.7, tdd: 6.0, bdd: 7.8 },
  { dimension: "Living Documentation Value", sdd: 9.2, tdd: 5.0, bdd: 9.9 }
];

export const enterpriseGlossary = [
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
];

export const starterTemplates = {
  sdd: {
    fileName: "payment-gateway-spec.openapi.yaml",
    mimeType: "text/yaml",
    content: `openapi: 3.1.0
info:
  title: Enterprise Payment Gateway API
  description: Specification-Driven Development (SDD) Contract Single Source of Truth
  version: 1.0.0
servers:
  - url: https://api.enterprise.com/v1
    description: Production Gateway
paths:
  /payments:
    post:
      summary: Authorize idempotent payment
      operationId: processPayment
      headers:
        X-Idempotency-Key:
          schema:
            type: string
            format: uuid
          required: true
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
                $ref: '#/components/schemas/PaymentResponse'
        '400':
          description: Validation Error (RFC 7807)
components:
  schemas:
    PaymentRequest:
      type: object
      required: [transactionId, amount, currency, recipientId]
      properties:
        transactionId:
          type: string
          pattern: '^TX-[0-9]{6}$'
        amount:
          type: number
          minimum: 0.01
          maximum: 100000.00
        currency:
          type: string
          enum: [USD, EUR, GBP, SGD]
        recipientId:
          type: string
          minLength: 5
    PaymentResponse:
      type: object
      required: [paymentId, status, authorizedAt]
      properties:
        paymentId:
          type: string
        status:
          type: string
          enum: [AUTHORIZED, SETTLED, DECLINED]
        authorizedAt:
          type: string
          format: date-time`
  },
  bdd: {
    fileName: "checkout-fraud.feature",
    mimeType: "text/plain",
    content: `Feature: Enterprise Checkout & Fraud Screening
  As an e-commerce platform operator
  I want to evaluate risk before processing high-value transactions
  So that chargebacks and fraudulent purchases are prevented

  Background:
    Given the fraud detection rules engine is active
    And the high-risk transaction threshold is "$5,000.00"

  Scenario Outline: Multi-tier customer transaction risk evaluation
    Given a customer "<CustomerName>" with account status "<AccountStatus>"
    And the customer cart total is "<CartTotal>"
    When the customer initiates payment with "<PaymentType>"
    Then the order authorization decision should be "<Decision>"
    And the notification event "<EventEmitted>" should be dispatched

    Examples:
      | CustomerName | AccountStatus | CartTotal | PaymentType      | Decision | EventEmitted         |
      | Alice        | VIP_VERIFIED  | $6,200.00 | CORPORATE_AMEX   | APPROVED | PaymentApprovedEvent |
      | Bob          | NEW_ACCOUNT   | $7,500.00 | CRYPTO_INSTANT   | REVIEW   | FraudAlertEvent      |
      | Charlie      | STANDARD      | $250.00   | VISA_CREDIT_CARD | APPROVED | PaymentApprovedEvent |`
  },
  tdd: {
    fileName: "pricingEngine.test.js",
    mimeType: "text/javascript",
    content: `/**
 * Test-Driven Development (TDD) Red-Green-Refactor Starter
 * Built with native Node.js Test Runner (node:test)
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';

// Step 1: The Function Under Test (motivate its creation via tests)
function calculateTierDiscount(order) {
  const { subtotal = 0, tier = 'STANDARD' } = order;
  if (subtotal < 0) throw new Error('Invalid subtotal');
  
  const discountTable = {
    PLATINUM: 0.20,
    GOLD: 0.10,
    SILVER: 0.05
  };

  const rate = subtotal >= 100 ? (discountTable[tier] || 0) : 0;
  return Number((subtotal * (1 - rate)).toFixed(2));
}

// Step 2: The Red-Green-Refactor Test Suite
describe('Pricing Engine - Tier Loyalty Discount (TDD Suite)', () => {
  it('should apply 20% discount for PLATINUM tier on orders >= $100', () => {
    const result = calculateTierDiscount({ subtotal: 200, tier: 'PLATINUM' });
    assert.strictEqual(result, 160.00);
  });

  it('should apply 0% discount if order subtotal is below $100 threshold', () => {
    const result = calculateTierDiscount({ subtotal: 80, tier: 'PLATINUM' });
    assert.strictEqual(result, 80.00);
  });

  it('should throw Error when subtotal is negative', () => {
    assert.throws(() => calculateTierDiscount({ subtotal: -10 }), /Invalid subtotal/);
  });
});`
  }
};

export const comparisonDimensions = [
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
];

export function getComparisonMatrix(categoryFilter = null) {
  let dims = comparisonDimensions;
  if (categoryFilter && categoryFilter.toLowerCase() !== 'all') {
    dims = comparisonDimensions.filter(item => item.category.toLowerCase() === categoryFilter.toLowerCase());
  }
  return {
    categories: comparisonCategories,
    dimensions: dims,
    radarDimensions,
    glossary: enterpriseGlossary
  };
}

export function getStarterTemplate(type) {
  return starterTemplates[type.toLowerCase()] || null;
}
