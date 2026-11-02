/**
 * Interactive Simulation Engine for TDD, BDD, and SDD
 */

export const tddSimulationData = {
  featureName: "Discount & Loyalty Calculation Engine",
  steps: [
    {
      phase: "red",
      phaseName: "1. RED (Failing Test)",
      badgeColor: "bg-red-500",
      description: "Write an automated unit test expressing the desired behavior before implementation exists. The test must fail.",
      testCode: `import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateOrderDiscount } from './pricingEngine.js';

describe('Pricing Engine - Tier Loyalty Discount', () => {
  it('should apply 20% discount for PLATINUM loyalty tier on orders >= $100', () => {
    const order = { subtotal: 150, customerTier: 'PLATINUM' };
    const result = calculateOrderDiscount(order);
    assert.strictEqual(result.finalTotal, 120);
    assert.strictEqual(result.appliedDiscountPercent, 20);
  });
});`,
      implementationCode: `// pricingEngine.js - Implementation does not exist yet!
export function calculateOrderDiscount(order) {
  // Not implemented!
  throw new Error("Method calculateOrderDiscount not implemented.");
}`,
      testRunnerOutput: `[FAIL] Pricing Engine - Tier Loyalty Discount > should apply 20% discount for PLATINUM loyalty tier
Error: Method calculateOrderDiscount not implemented.
   at calculateOrderDiscount (pricingEngine.js:4:9)
   at TestContext.<anonymous> (pricing.test.js:8:20)
Tests: 1 failed, 0 passed, 1 total
Duration: 14ms
Status: Expected failure achieved (RED). Ready for minimal code.`
    },
    {
      phase: "green",
      phaseName: "2. GREEN (Minimal Passing Code)",
      badgeColor: "bg-emerald-500",
      description: "Write the simplest possible code to make the failing test pass. Do not over-engineer or add premature optimizations.",
      testCode: `import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateOrderDiscount } from './pricingEngine.js';

describe('Pricing Engine - Tier Loyalty Discount', () => {
  it('should apply 20% discount for PLATINUM loyalty tier on orders >= $100', () => {
    const order = { subtotal: 150, customerTier: 'PLATINUM' };
    const result = calculateOrderDiscount(order);
    assert.strictEqual(result.finalTotal, 120);
    assert.strictEqual(result.appliedDiscountPercent, 20);
  });
});`,
      implementationCode: `// pricingEngine.js - Minimal code to satisfy test
export function calculateOrderDiscount(order) {
  if (order.customerTier === 'PLATINUM' && order.subtotal >= 100) {
    const discount = order.subtotal * 0.20;
    return {
      finalTotal: order.subtotal - discount,
      appliedDiscountPercent: 20
    };
  }
  return { finalTotal: order.subtotal, appliedDiscountPercent: 0 };
}`,
      testRunnerOutput: `[PASS] Pricing Engine - Tier Loyalty Discount > should apply 20% discount for PLATINUM loyalty tier (120 === 120)
Tests: 1 passed, 0 failed, 1 total
Duration: 8ms
Status: GREEN! All assertions passed. Ready to refactor.`
    },
    {
      phase: "refactor",
      phaseName: "3. REFACTOR (Cleanse & Design)",
      badgeColor: "bg-cyan-500",
      description: "Clean up code smells, extract constants and strategy patterns, improve naming and maintainability while keeping all tests passing.",
      testCode: `import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateOrderDiscount } from './pricingEngine.js';

describe('Pricing Engine - Tier Loyalty Discount', () => {
  it('should apply 20% discount for PLATINUM loyalty tier on orders >= $100', () => {
    const order = { subtotal: 150, customerTier: 'PLATINUM' };
    const result = calculateOrderDiscount(order);
    assert.strictEqual(result.finalTotal, 120);
    assert.strictEqual(result.appliedDiscountPercent, 20);
  });

  it('should not apply discount if order is below threshold', () => {
    const order = { subtotal: 80, customerTier: 'PLATINUM' };
    const result = calculateOrderDiscount(order);
    assert.strictEqual(result.finalTotal, 80);
    assert.strictEqual(result.appliedDiscountPercent, 0);
  });
});`,
      implementationCode: `// pricingEngine.js - Refactored with Clean Architecture & Strategy Table
const TIER_DISCOUNT_RATES = Object.freeze({
  PLATINUM: 0.20,
  GOLD: 0.10,
  SILVER: 0.05
});

const MINIMUM_QUALIFYING_SUBTOTAL = 100;

export function calculateOrderDiscount(order) {
  const { subtotal = 0, customerTier = 'STANDARD' } = order;
  const isEligible = subtotal >= MINIMUM_QUALIFYING_SUBTOTAL;
  const discountRate = isEligible ? (TIER_DISCOUNT_RATES[customerTier] || 0) : 0;
  const discountAmount = subtotal * discountRate;

  return {
    finalTotal: Number((subtotal - discountAmount).toFixed(2)),
    appliedDiscountPercent: Math.round(discountRate * 100)
  };
}`,
      testRunnerOutput: `[PASS] Pricing Engine - Tier Loyalty Discount > should apply 20% discount for PLATINUM loyalty tier (120 === 120)
[PASS] Pricing Engine - Tier Loyalty Discount > should not apply discount if order is below threshold (80 === 80)
Tests: 2 passed, 0 failed, 2 total
Duration: 6ms
Status: REFACTORED! Code is modular, zero-magic-numbers, decoupled, and 100% verified.`
    }
  ]
};

export const bddDefaultScenarios = [
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
];

export const sddSampleSpec = {
  specTitle: "PaymentTransactionContract",
  version: "3.1.0",
  schema: {
    type: "object",
    required: ["transactionId", "amount", "currency", "recipientId", "paymentType"],
    properties: {
      transactionId: {
        type: "string",
        pattern: "^TX-[0-9]{6}$",
        description: "Unique transaction identifier with prefix TX-"
      },
      amount: {
        type: "number",
        minimum: 0.01,
        maximum: 100000.0,
        description: "Transaction amount in fiat currency"
      },
      currency: {
        type: "string",
        enum: ["USD", "EUR", "GBP", "SGD"],
        description: "ISO 4217 3-letter currency code"
      },
      recipientId: {
        type: "string",
        minLength: 5,
        description: "Target account or recipient entity ID"
      },
      paymentType: {
        type: "string",
        enum: ["CREDIT_CARD", "WIRE_TRANSFER", "INSTANT_ACH", "CRYPTO_STABLECOIN"]
      }
    }
  }
};

/**
 * Validate a payload against the SDD contract
 */
export function validateSddPayload(payload) {
  const errors = [];
  const requiredFields = sddSampleSpec.schema.required;

  // Check required fields
  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
      errors.push(`Missing required field: '${field}'`);
    }
  }

  // Check types & constraints if field is present
  if (payload.transactionId && !/^TX-[0-9]{6}$/.test(payload.transactionId)) {
    errors.push(`'transactionId' does not match required regex pattern '^TX-[0-9]{6}$' (got '${payload.transactionId}')`);
  }

  if (payload.amount !== undefined) {
    if (typeof payload.amount !== 'number' || isNaN(payload.amount)) {
      errors.push(`'amount' must be a valid number`);
    } else if (payload.amount < 0.01) {
      errors.push(`'amount' (${payload.amount}) violates minimum threshold of 0.01`);
    } else if (payload.amount > 100000.0) {
      errors.push(`'amount' (${payload.amount}) violates maximum limit of 100,000.00`);
    }
  }

  const validCurrencies = sddSampleSpec.schema.properties.currency.enum;
  if (payload.currency && !validCurrencies.includes(payload.currency)) {
    errors.push(`'currency' '${payload.currency}' is invalid. Allowed: ${validCurrencies.join(', ')}`);
  }

  const validPaymentTypes = sddSampleSpec.schema.properties.paymentType.enum;
  if (payload.paymentType && !validPaymentTypes.includes(payload.paymentType)) {
    errors.push(`'paymentType' '${payload.paymentType}' is invalid. Allowed: ${validPaymentTypes.join(', ')}`);
  }

  // Synthesize TypeScript interface from contract
  const generatedTypeScript = `/**
 * Auto-generated from OpenAPI Contract: ${sddSampleSpec.specTitle} (v${sddSampleSpec.version})
 * Single Source of Truth - DO NOT EDIT MANUALLY
 */
export interface PaymentTransaction {
  transactionId: string; // pattern: ^TX-[0-9]{6}$
  amount: number;        // range: [0.01, 100000.00]
  currency: 'USD' | 'EUR' | 'GBP' | 'SGD';
  recipientId: string;
  paymentType: 'CREDIT_CARD' | 'WIRE_TRANSFER' | 'INSTANT_ACH' | 'CRYPTO_STABLECOIN';
}`;

  return {
    valid: errors.length === 0,
    schemaContract: sddSampleSpec.specTitle,
    errors,
    generatedTypeScript,
    contractAssertionPassed: errors.length === 0
  };
}
