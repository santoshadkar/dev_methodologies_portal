/**
 * Unified Real-World Case Study:
 * Demonstrating how SDD, TDD, and BDD approach and solve the EXACT same problem.
 */

export const unifiedCaseStudy = {
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
        "Product Owner, QA, and Engineers convene in a 45-minute Example Mapping session to discuss edge cases (e.g. What happens if a cart is exactly $99.99? What happens if an account is 2 hours old?).",
        "The team formulates business rules into an executable Gherkin .feature file using standard Given-When-Then syntax.",
        "Engineers connect Gherkin steps to automated Cucumber/Playwright drivers.",
        "Scenarios run in CI/CD pipeline, generating HTML living documentation reports shared directly with executive business stakeholders."
      ],
      concreteArtifact: {
        type: "Gherkin Specification (.feature)",
        fileName: "checkout_discount_and_fraud.feature",
        content: `Feature: VIP Tiered Loyalty Discount & Fraud Prevention
  As an e-commerce customer
  I want my tier-based discount automatically calculated at checkout
  So that I receive accurate loyalty rewards

  Background:
    Given the store promotion engine is active
    And the high-risk fraud threshold is set to $5000.00

  Scenario Outline: Applying VIP discounts and fraud verification rules
    Given a customer "<CustomerName>" with tier "<Tier>"
    And the customer cart subtotal is "<Subtotal>"
    When the customer initiates checkout with payment method "<PaymentMethod>"
    Then the calculated discount should be "<DiscountPercent>"
    And the final charge amount should be "<FinalAmount>"
    And the fraud screening result should be "<FraudStatus>"

    Examples:
      | CustomerName | Tier     | Subtotal  | PaymentMethod   | DiscountPercent | FinalAmount | FraudStatus |
      | Alice        | PLATINUM | $200.00   | CORPORATE_AMEX  | 20%             | $160.00     | APPROVED    |
      | Bob          | PLATINUM | $80.00    | VISA_DEBIT      | 0%              | $80.00      | APPROVED    |
      | Charlie      | SILVER   | $150.00   | INSTANT_ACH     | 5%              | $142.50     | APPROVED    |
      | Diana        | PLATINUM | $6,500.00 | WIRE_TRANSFER   | 20%             | $5,200.00   | FLAG_REVIEW |`
      },
      benefitsAchieved: [
        "100% Requirements Clarity: Clarified that orders under $100 do not qualify for tier discounts BEFORE coding started.",
        "Living Documentation: Business executives and compliance officers can read and audit the test suite without viewing source code.",
        "Zero Lost-in-Translation: Developers, QA, and POs used identical vocabulary across user stories, tests, and Jira tickets.",
        "Prevented 8 Major Edge-Case Bugs during the initial Three Amigos session."
      ],
      roiMetric: "70% reduction in requirements churn and zero post-sprint rework."
    },

    sdd: {
      name: "Specification-Driven Development (SDD)",
      drivingQuestion: "What is the authoritative contract governing system boundaries?",
      primaryActors: "Solutions Architect, API Platform Team, Autonomous AI Coding Agents",
      approach: "Schema-First Engineering & Single Source of Truth Synthesis",
      stepsTaken: [
        "Solutions Architect authors an OpenAPI 3.1 specification contract (`checkout-api.yaml`) defining entities, HTTP methods, UUID idempotency headers, numerical boundaries, and RFC 7807 error envelopes.",
        "Automated spectral linting verifies enterprise security rules, rate-limiting headers, and camelCase naming in git pre-commit.",
        "Prism HTTP Mock Server is deployed immediately: Web, iOS, and Android teams begin building the checkout UI concurrently on Day 1 against realistic mock responses.",
        "OpenAPI generator synthesizes TypeScript DTOs, React Query hooks, and Zod validation middleware.",
        "Schemathesis runs property-based fuzz tests in CI, validating that the live runtime backend adheres 100% to the specification contract."
      ],
      concreteArtifact: {
        type: "OpenAPI 3.1 Contract (.yaml)",
        fileName: "checkout-contract.openapi.yaml",
        content: `openapi: 3.1.0
info:
  title: Checkout & Discount Orchestration Service
  version: 1.0.0
paths:
  /v1/checkout/calculate:
    post:
      summary: Calculate order discount and validate fraud risk
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
              $ref: '#/components/schemas/CheckoutRequest'
      responses:
        '200':
          description: Discount calculated and validated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CheckoutResponse'
components:
  schemas:
    CheckoutRequest:
      type: object
      required: [orderId, customerTier, subtotal, paymentMethod]
      properties:
        orderId:
          type: string
          pattern: '^ORD-[0-9]{6}$'
        customerTier:
          type: string
          enum: [PLATINUM, GOLD, SILVER, STANDARD]
        subtotal:
          type: number
          minimum: 0.01
          maximum: 100000.00
        paymentMethod:
          type: string
          enum: [CORPORATE_AMEX, VISA_DEBIT, INSTANT_ACH, WIRE_TRANSFER]
    CheckoutResponse:
      type: object
      required: [orderId, subtotal, appliedDiscountPercent, finalTotal, fraudStatus]
      properties:
        orderId:
          type: string
        subtotal:
          type: number
        appliedDiscountPercent:
          type: integer
          minimum: 0
          maximum: 100
        finalTotal:
          type: number
        fraudStatus:
          type: string
          enum: [APPROVED, FLAG_REVIEW, REJECTED]`
      },
      benefitsAchieved: [
        "Concurrent Team Development: Mobile and frontend teams started coding on Day 1 against auto-generated Prism mock servers.",
        "Zero Contract Drift: Breaking payload changes were automatically blocked in git pull requests before reaching staging.",
        "Automated SDK Generation: Over 1,200 lines of boilerplate DTOs and HTTP client wrappers were auto-synthesized.",
        "AI Agentic Accelerator: Autonomous AI agents synthesized 100% compliant Express controllers from the schema without hallucinations."
      ],
      roiMetric: "3.5x faster cross-team feature delivery; 94% reduction in API integration defects."
    },

    tdd: {
      name: "Test-Driven Development (TDD)",
      drivingQuestion: "Did we build the internal calculation logic right with zero bugs?",
      primaryActors: "Core Backend Software Engineers",
      approach: "Micro-Feedback Red-Green-Refactor Loop (FIRST Principles)",
      stepsTaken: [
        "RED: Alex (backend engineer) authors an isolated failing unit test for the 20% PLATINUM discount calculation. Runner fails as expected.",
        "GREEN: Alex writes the minimal conditional code to pass the test. Test runner turns green in 12ms.",
        "REFACTOR: Cleans up magic numbers, extracts a frozen Tier Strategy Map, and isolates pure functions from I/O.",
        "REPEAT: Adds edge cases: subtotal < $100, rounding cents precision, negative values, boundary at $99.99 vs $100.00.",
        "Every change is verified in sub-second test execution inside the IDE."
      ],
      concreteArtifact: {
        type: "Refactored Modular Source & Test Suite",
        fileName: "discountCalculator.js & discountCalculator.test.js",
        content: `// discountCalculator.js (Clean Architecture & Strategy Pattern)
const TIER_DISCOUNTS = Object.freeze({
  PLATINUM: 0.20,
  GOLD: 0.10,
  SILVER: 0.05,
  STANDARD: 0.00
});

const QUALIFYING_THRESHOLD = 100.00;
const FRAUD_THRESHOLD = 5000.00;

export function calculateOrderDiscounts(order) {
  const { subtotal, customerTier = 'STANDARD' } = order;
  if (typeof subtotal !== 'number' || subtotal < 0) {
    throw new Error('Invalid order subtotal');
  }

  const rate = subtotal >= QUALIFYING_THRESHOLD ? (TIER_DISCOUNTS[customerTier] || 0) : 0;
  const discountAmount = subtotal * rate;
  const finalTotal = Number((subtotal - discountAmount).toFixed(2));
  const fraudStatus = subtotal >= FRAUD_THRESHOLD ? 'FLAG_REVIEW' : 'APPROVED';

  return {
    subtotal,
    appliedDiscountPercent: Math.round(rate * 100),
    finalTotal,
    fraudStatus
  };
}

// discountCalculator.test.js (Unit Test Suite with node:test)
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Pricing & Fraud Calculation Unit Engine (TDD)', () => {
  it('should apply 20% discount for PLATINUM tier on orders >= $100', () => {
    const res = calculateOrderDiscounts({ subtotal: 200, customerTier: 'PLATINUM' });
    assert.strictEqual(res.appliedDiscountPercent, 20);
    assert.strictEqual(res.finalTotal, 160.00);
    assert.strictEqual(res.fraudStatus, 'APPROVED');
  });

  it('should not apply discount when subtotal is below qualifying threshold', () => {
    const res = calculateOrderDiscounts({ subtotal: 99.99, customerTier: 'PLATINUM' });
    assert.strictEqual(res.appliedDiscountPercent, 0);
    assert.strictEqual(res.finalTotal, 99.99);
  });

  it('should flag orders >= $5,000 for fraud review', () => {
    const res = calculateOrderDiscounts({ subtotal: 6500, customerTier: 'PLATINUM' });
    assert.strictEqual(res.fraudStatus, 'FLAG_REVIEW');
  });
});`
      },
      benefitsAchieved: [
        "Sub-Second Feedback Loop: Developers knew within 15 milliseconds whether mathematical logic was correct.",
        "Fearless Refactoring: Code was refactored from messy nested if-else statements into clean Strategy patterns with 100% safety.",
        "Flawless Boundary Testing: Floating-point rounding and penny calculation edge cases were trapped before staging.",
        "Decoupled Pure Functions: Zero dependencies on external databases or networks, resulting in instantaneous tests."
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
};

export function getUnifiedCaseStudy() {
  return unifiedCaseStudy;
}
