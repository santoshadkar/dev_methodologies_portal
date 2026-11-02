import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getAllMethodologies, getMethodologyById } from '../src/domain/methodologies.js';
import { getComparisonMatrix, comparisonCategories } from '../src/domain/comparison.js';
import { getUnifiedCaseStudy } from '../src/domain/caseStudy.js';

describe('Domain Layer: Methodologies & Taxonomies', () => {
  it('should return 3 core methodologies (SDD, TDD, BDD)', () => {
    const list = getAllMethodologies();
    assert.strictEqual(list.length, 3);
    const ids = list.map(m => m.id);
    assert.ok(ids.includes('sdd'));
    assert.ok(ids.includes('tdd'));
    assert.ok(ids.includes('bdd'));
  });

  it('should fetch methodology by ID case-insensitively', () => {
    const sdd = getMethodologyById('SDD');
    assert.ok(sdd);
    assert.strictEqual(sdd.acronym, 'SDD');
    assert.strictEqual(sdd.name, 'Specification-Driven Development');

    const tdd = getMethodologyById('tdd');
    assert.ok(tdd);
    assert.strictEqual(tdd.acronym, 'TDD');

    const bdd = getMethodologyById('bDD');
    assert.ok(bdd);
    assert.strictEqual(bdd.acronym, 'BDD');
  });

  it('should return undefined for non-existent methodology', () => {
    const nonExistent = getMethodologyById('waterfall');
    assert.strictEqual(nonExistent, undefined);
  });

  it('each methodology should have required enterprise attributes', () => {
    const list = getAllMethodologies();
    for (const m of list) {
      assert.ok(m.id, 'Must have ID');
      assert.ok(m.name, 'Must have name');
      assert.ok(m.tagline, 'Must have tagline');
      assert.ok(m.primaryFocus, 'Must have primary focus');
      assert.ok(Array.isArray(m.corePrinciples) && m.corePrinciples.length >= 3, 'Must have >= 3 principles');
      assert.ok(Array.isArray(m.lifecycle) && m.lifecycle.length >= 3, 'Must have >= 3 lifecycle steps');
      assert.ok(Array.isArray(m.tools) && m.tools.length >= 3, 'Must have >= 3 tools');
      assert.ok(Array.isArray(m.advantages) && m.advantages.length >= 3, 'Must have >= 3 advantages');
      assert.ok(typeof m.aiReadinessScore === 'number', 'Must have numeric AI readiness score');
      
      // Deep-dive fields
      assert.ok(m.overview && m.overview.formalDefinition, 'Must have overview with formal definition');
      assert.ok(Array.isArray(m.detailedLifecycle) && m.detailedLifecycle.length >= 4, 'Must have detailedLifecycle with >= 4 phases');
      assert.ok(Array.isArray(m.toolingEcosystem) && m.toolingEcosystem.length >= 3, 'Must have categorized toolingEcosystem');
      assert.ok(m.dayInTheLife && m.dayInTheLife.steps.length >= 3, 'Must have dayInTheLife narrative steps');
      assert.ok(m.aiSynergy && m.aiSynergy.breakdown.length >= 2, 'Must have aiSynergy breakdown');
    }
  });

  it('comparison matrix should return all dimensions and categories', () => {
    const matrix = getComparisonMatrix();
    assert.ok(matrix.categories.length > 0);
    assert.ok(matrix.dimensions.length >= 8);

    const filtered = getComparisonMatrix('Strategic & Architectural');
    assert.ok(filtered.dimensions.length > 0);
    assert.ok(filtered.dimensions.every(d => d.category === 'Strategic & Architectural'));
  });

  it('unified case study should model problem and solutions for all 3 paradigms', () => {
    const cs = getUnifiedCaseStudy();
    assert.ok(cs.problemStatement && cs.problemStatement.title);
    assert.ok(cs.methodologySolutions.sdd);
    assert.ok(cs.methodologySolutions.tdd);
    assert.ok(cs.methodologySolutions.bdd);
    assert.ok(cs.holisticSynergy.breakdown.length === 3);
  });
});
