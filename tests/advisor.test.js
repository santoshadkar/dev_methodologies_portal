import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateMethodologyFit } from '../src/domain/advisorEngine.js';

describe('Domain Layer: Advisor Engine Recommendations', () => {
  it('should recommend SDD when API contracts, decoupling, and AI adoption dominate', () => {
    const input = {
      apiContractImportance: 5,
      businessStakeholderInvolvement: 2,
      algorithmicComplexity: 2,
      aiCodeGenerationAdoption: 5,
      multiTeamDecoupling: 5
    };
    const result = calculateMethodologyFit(input);
    assert.strictEqual(result.primaryRecommendation, 'Spec-Driven Development (SDD)');
    assert.ok(result.scores.sdd > result.scores.tdd);
    assert.ok(result.scores.sdd > result.scores.bdd);
    assert.ok(result.strategicRationale.length > 20);
    assert.ok(result.blendedPyramid.middleLayer.includes('SDD'));
  });

  it('should recommend BDD when stakeholder involvement is the dominant factor', () => {
    const input = {
      apiContractImportance: 1,
      businessStakeholderInvolvement: 5,
      algorithmicComplexity: 1,
      aiCodeGenerationAdoption: 2,
      multiTeamDecoupling: 2
    };
    const result = calculateMethodologyFit(input);
    assert.strictEqual(result.primaryRecommendation, 'Behavior-Driven Development (BDD)');
    assert.ok(result.scores.bdd >= result.scores.sdd);
    assert.ok(result.scores.bdd >= result.scores.tdd);
  });

  it('should recommend TDD when algorithmic complexity is paramount', () => {
    const input = {
      apiContractImportance: 1,
      businessStakeholderInvolvement: 1,
      algorithmicComplexity: 5,
      aiCodeGenerationAdoption: 2,
      multiTeamDecoupling: 1
    };
    const result = calculateMethodologyFit(input);
    assert.strictEqual(result.primaryRecommendation, 'Test-Driven Development (TDD)');
    assert.ok(result.scores.tdd >= result.scores.sdd);
    assert.ok(result.scores.tdd >= result.scores.bdd);
  });

  it('should clamp scores within 0 to 100 percentage range', () => {
    const minInput = {
      apiContractImportance: 1,
      businessStakeholderInvolvement: 1,
      algorithmicComplexity: 1,
      aiCodeGenerationAdoption: 1,
      multiTeamDecoupling: 1
    };
    const resultMin = calculateMethodologyFit(minInput);
    assert.ok(resultMin.scores.sdd >= 0 && resultMin.scores.sdd <= 100);
    assert.ok(resultMin.scores.tdd >= 0 && resultMin.scores.tdd <= 100);
    assert.ok(resultMin.scores.bdd >= 0 && resultMin.scores.bdd <= 100);

    const maxInput = {
      apiContractImportance: 5,
      businessStakeholderInvolvement: 5,
      algorithmicComplexity: 5,
      aiCodeGenerationAdoption: 5,
      multiTeamDecoupling: 5
    };
    const resultMax = calculateMethodologyFit(maxInput);
    assert.ok(resultMax.scores.sdd <= 100);
    assert.ok(resultMax.scores.tdd <= 100);
    assert.ok(resultMax.scores.bdd <= 100);
  });
});
