import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  healthController,
  getMethodologiesController,
  getMethodologyByIdController,
  getComparisonController,
  advisorRecommendController,
  simulateSddValidateController,
  getTemplateController,
  getGlossaryController,
  getUnifiedCaseStudyController
} from '../src/api/controllers.js';

// Helper to create mock request and response objects
function createMockReqRes({ params = {}, query = {}, body = {} } = {}) {
  const req = { params, query, body };
  let statusCode = 200;
  let jsonOutput = null;

  const res = {
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      jsonOutput = data;
      return res;
    },
    get statusCode() {
      return statusCode;
    },
    get data() {
      return jsonOutput;
    }
  };

  return { req, res };
}

describe('Controller & API Integration Tests', () => {
  it('healthController should return 200 with status UP', () => {
    const { req, res } = createMockReqRes();
    healthController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.status, 'UP');
    assert.ok(res.data.timestamp);
    assert.ok(typeof res.data.uptimeSeconds === 'number');
  });

  it('getMethodologiesController should return all 3 methodology records', () => {
    const { req, res } = createMockReqRes();
    getMethodologiesController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(Array.isArray(res.data));
    assert.strictEqual(res.data.length, 3);
  });

  it('getMethodologyByIdController returns record for valid id', () => {
    const { req, res } = createMockReqRes({ params: { id: 'sdd' } });
    getMethodologyByIdController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.id, 'sdd');
    assert.strictEqual(res.data.acronym, 'SDD');
  });

  it('getMethodologyByIdController returns 404 for unknown id', () => {
    const { req, res } = createMockReqRes({ params: { id: 'nonexistent' } });
    getMethodologyByIdController(req, res);
    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.data.error, 'Not Found');
  });

  it('getComparisonController returns full matrix without filter', () => {
    const { req, res } = createMockReqRes();
    getComparisonController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(Array.isArray(res.data.categories));
    assert.ok(Array.isArray(res.data.dimensions));
    assert.ok(res.data.dimensions.length >= 8);
  });

  it('getComparisonController filters by category', () => {
    const { req, res } = createMockReqRes({ query: { category: 'Strategic & Architectural' } });
    getComparisonController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.data.dimensions.length > 0);
    assert.ok(res.data.dimensions.every(d => d.category === 'Strategic & Architectural'));
  });

  it('advisorRecommendController returns 200 and computed scores for valid criteria', () => {
    const validCriteria = {
      apiContractImportance: 5,
      businessStakeholderInvolvement: 2,
      algorithmicComplexity: 2,
      aiCodeGenerationAdoption: 5,
      multiTeamDecoupling: 5
    };
    const { req, res } = createMockReqRes({ body: validCriteria });
    advisorRecommendController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.primaryRecommendation, 'Spec-Driven Development (SDD)');
    assert.ok(res.data.scores.sdd > 0);
    assert.ok(res.data.blendedPyramid);
  });

  it('advisorRecommendController returns 400 for missing or non-numeric fields', () => {
    const badCriteria = {
      apiContractImportance: 5
      // missing other fields
    };
    const { req, res } = createMockReqRes({ body: badCriteria });
    advisorRecommendController(req, res);
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.data.error, 'Bad Request');
  });

  it('simulateSddValidateController validates payload against contract', () => {
    const validPayload = {
      payload: {
        transactionId: 'TX-778899',
        amount: 2500.00,
        currency: 'USD',
        recipientId: 'ACC-771122',
        paymentType: 'WIRE_TRANSFER'
      }
    };
    const { req, res } = createMockReqRes({ body: validPayload });
    simulateSddValidateController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.valid, true);
    assert.strictEqual(res.data.contractAssertionPassed, true);
    assert.ok(res.data.generatedTypeScript.includes('export interface PaymentTransaction'));
  });

  it('simulateSddValidateController returns 400 when payload is missing', () => {
    const { req, res } = createMockReqRes({ body: {} });
    simulateSddValidateController(req, res);
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.data.error, 'Bad Request');
  });

  it('getTemplateController returns starter template for sdd', () => {
    const { req, res } = createMockReqRes({ params: { type: 'sdd' } });
    getTemplateController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.data.fileName.includes('openapi.yaml'));
    assert.ok(res.data.content.length > 50);
  });

  it('getTemplateController returns 404 for unknown template', () => {
    const { req, res } = createMockReqRes({ params: { type: 'unknown' } });
    getTemplateController(req, res);
    assert.strictEqual(res.statusCode, 404);
  });

  it('getGlossaryController returns enterprise glossary terms', () => {
    const { req, res } = createMockReqRes();
    getGlossaryController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(Array.isArray(res.data));
    assert.ok(res.data.length >= 8);
  });

  it('getUnifiedCaseStudyController returns the single unified comparative case study', () => {
    const { req, res } = createMockReqRes();
    getUnifiedCaseStudyController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.data.problemStatement);
    assert.ok(res.data.methodologySolutions.sdd);
  });
});
