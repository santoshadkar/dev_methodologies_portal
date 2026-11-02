import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  tddSimulationData,
  bddDefaultScenarios,
  sddSampleSpec,
  validateSddPayload
} from '../src/domain/simulatorEngine.js';

describe('Domain Layer: Simulation & Verification Engines', () => {
  it('TDD simulation data should include Red, Green, and Refactor phases', () => {
    assert.ok(tddSimulationData.steps.length === 3);
    const phases = tddSimulationData.steps.map(s => s.phase);
    assert.deepStrictEqual(phases, ['red', 'green', 'refactor']);

    // Check code and output existence
    for (const step of tddSimulationData.steps) {
      assert.ok(step.testCode.length > 0);
      assert.ok(step.implementationCode.length > 0);
      assert.ok(step.testRunnerOutput.length > 0);
    }
  });

  it('BDD scenarios should contain valid Gherkin steps', () => {
    assert.ok(bddDefaultScenarios.length >= 2);
    for (const scenario of bddDefaultScenarios) {
      assert.ok(scenario.feature);
      assert.ok(scenario.scenario);
      assert.ok(scenario.steps.length >= 3);
      for (const step of scenario.steps) {
        assert.ok(['Given', 'When', 'Then', 'And', 'But'].includes(step.type));
        assert.ok(step.text.length > 0);
      }
    }
  });

  it('SDD validator should validate correct payment transaction payload', () => {
    const validPayload = {
      transactionId: 'TX-123456',
      amount: 450.00,
      currency: 'USD',
      recipientId: 'ACC-98765',
      paymentType: 'INSTANT_ACH'
    };
    const result = validateSddPayload(validPayload);
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.contractAssertionPassed, true);
    assert.strictEqual(result.errors.length, 0);
    assert.ok(result.generatedTypeScript.includes('export interface PaymentTransaction'));
  });

  it('SDD validator should detect missing required fields', () => {
    const invalidPayload = {
      amount: 450.00
      // missing transactionId, currency, recipientId, paymentType
    };
    const result = validateSddPayload(invalidPayload);
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.contractAssertionPassed, false);
    assert.ok(result.errors.length >= 4);
  });

  it('SDD validator should enforce transactionId regex format', () => {
    const invalidRegexPayload = {
      transactionId: 'NOT-A-TX-FORMAT',
      amount: 100.00,
      currency: 'USD',
      recipientId: 'ACC-12345',
      paymentType: 'CREDIT_CARD'
    };
    const result = validateSddPayload(invalidRegexPayload);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('does not match required regex pattern')));
  });

  it('SDD validator should enforce amount numeric limits', () => {
    const excessiveAmount = {
      transactionId: 'TX-999999',
      amount: 500000.00, // exceeds 100,000 max
      currency: 'USD',
      recipientId: 'ACC-12345',
      paymentType: 'CREDIT_CARD'
    };
    const result = validateSddPayload(excessiveAmount);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('violates maximum limit')));
  });
});
