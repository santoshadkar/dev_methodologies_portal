import { Router } from 'express';
import {
  healthController,
  getMethodologiesController,
  getMethodologyByIdController,
  getComparisonController,
  advisorRecommendController,
  getSimulationDataController,
  simulateSddValidateController,
  getTemplateController,
  getGlossaryController,
  getUnifiedCaseStudyController
} from './controllers.js';

const router = Router();

// Health Check
router.get('/health', healthController);

// Methodologies Knowledge Base
router.get('/methodologies', getMethodologiesController);
router.get('/methodologies/:id', getMethodologyByIdController);

// Comparison Matrix & Glossary
router.get('/comparison', getComparisonController);
router.get('/glossary', getGlossaryController);

// Unified Case Study (Single Problem Solved Across SDD, TDD, BDD)
router.get('/casestudy/unified', getUnifiedCaseStudyController);

// Starter Templates Download
router.get('/templates/:type', getTemplateController);

// Interactive Advisor Engine
router.post('/advisor/recommend', advisorRecommendController);

// Simulators
router.get('/simulation/data', getSimulationDataController);
router.post('/simulate/sdd-validate', simulateSddValidateController);

export default router;
