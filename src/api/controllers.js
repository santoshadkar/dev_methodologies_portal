import { getAllMethodologies, getMethodologyById } from '../domain/methodologies.js';
import { getComparisonMatrix, getStarterTemplate, enterpriseGlossary } from '../domain/comparison.js';
import { calculateMethodologyFit } from '../domain/advisorEngine.js';
import { validateSddPayload, tddSimulationData, bddDefaultScenarios, sddSampleSpec } from '../domain/simulatorEngine.js';
import { getUnifiedCaseStudy } from '../domain/caseStudy.js';
import config from '../config/environment.js';

const startTime = Date.now();

export const healthController = (req, res) => {
  const uptimeSeconds = Number(((Date.now() - startTime) / 1000).toFixed(2));
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    environment: config.nodeEnv,
    version: '1.0.0'
  });
};

export const getMethodologiesController = (req, res) => {
  const list = getAllMethodologies();
  res.json(list);
};

export const getMethodologyByIdController = (req, res) => {
  const { id } = req.params;
  const methodology = getMethodologyById(id);
  if (!methodology) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Methodology with id '${id}' was not found. Valid IDs: sdd, tdd, bdd`
    });
  }
  res.json(methodology);
};

export const getComparisonController = (req, res) => {
  const { category } = req.query;
  const matrix = getComparisonMatrix(category);
  res.json(matrix);
};

export const advisorRecommendController = (req, res) => {
  const criteria = req.body || {};
  const requiredFields = [
    'apiContractImportance',
    'businessStakeholderInvolvement',
    'algorithmicComplexity',
    'aiCodeGenerationAdoption',
    'multiTeamDecoupling'
  ];

  for (const field of requiredFields) {
    if (criteria[field] === undefined || typeof criteria[field] !== 'number') {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Field '${field}' is required and must be a number between 1 and 5.`
      });
    }
  }

  const result = calculateMethodologyFit(criteria);
  res.json(result);
};

export const getSimulationDataController = (req, res) => {
  res.json({
    tdd: tddSimulationData,
    bdd: bddDefaultScenarios,
    sdd: sddSampleSpec
  });
};

export const simulateSddValidateController = (req, res) => {
  const { payload } = req.body || {};
  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({
      error: 'Bad Request',
      message: "Property 'payload' must be a valid JSON object."
    });
  }

  const result = validateSddPayload(payload);
  res.json(result);
};

export const getTemplateController = (req, res) => {
  const { type } = req.params;
  const template = getStarterTemplate(type);
  if (!template) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Starter template '${type}' not found. Valid: sdd, tdd, bdd`
    });
  }
  res.json(template);
};

export const getGlossaryController = (req, res) => {
  res.json(enterpriseGlossary);
};

export const getUnifiedCaseStudyController = (req, res) => {
  res.json(getUnifiedCaseStudy());
};
