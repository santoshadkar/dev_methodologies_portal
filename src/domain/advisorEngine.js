/**
 * Methodology Advisor Engine: Computes tailored recommendations
 * based on architectural, team, and organizational parameters.
 */

export function calculateMethodologyFit(criteria) {
  const {
    apiContractImportance = 3,
    businessStakeholderInvolvement = 3,
    algorithmicComplexity = 3,
    aiCodeGenerationAdoption = 3,
    multiTeamDecoupling = 3
  } = criteria;

  // Weightings for SDD: heavily driven by API contracts, multi-team decoupling, and AI code gen
  const sddRaw = 
    (apiContractImportance * 3.5) +
    (multiTeamDecoupling * 3.0) +
    (aiCodeGenerationAdoption * 2.5) +
    (businessStakeholderInvolvement * 1.0) +
    (algorithmicComplexity * 1.0);

  // Weightings for TDD: heavily driven by algorithmic complexity and code-level feedback
  const tddRaw =
    (algorithmicComplexity * 3.5) +
    (aiCodeGenerationAdoption * 2.0) +
    (multiTeamDecoupling * 1.5) +
    (apiContractImportance * 1.5) +
    (businessStakeholderInvolvement * 1.0);

  // Weightings for BDD: heavily driven by business stakeholder involvement and user behavior
  const bddRaw =
    (businessStakeholderInvolvement * 3.5) +
    (multiTeamDecoupling * 2.0) +
    (aiCodeGenerationAdoption * 2.0) +
    (apiContractImportance * 1.5) +
    (algorithmicComplexity * 1.0);

  // Normalize scores to percentage (out of 100)
  const maxPossible = 55;
  const sddPercent = Math.min(100, Math.round((sddRaw / maxPossible) * 100));
  const tddPercent = Math.min(100, Math.round((tddRaw / maxPossible) * 100));
  const bddPercent = Math.min(100, Math.round((bddRaw / maxPossible) * 100));

  // Determine primary leader
  let primaryRecommendation = "Spec-Driven Development (SDD)";
  let highest = sddPercent;

  if (bddPercent > highest && bddPercent >= tddPercent) {
    primaryRecommendation = "Behavior-Driven Development (BDD)";
    highest = bddPercent;
  } else if (tddPercent > highest) {
    primaryRecommendation = "Test-Driven Development (TDD)";
    highest = tddPercent;
  }

  // Generate strategic rationale
  let strategicRationale = "";
  if (primaryRecommendation.includes("SDD")) {
    strategicRationale = "Your project features distributed service boundaries, significant cross-team collaboration, or high AI agent integration. A Spec-First architecture will decouple teams via auto-generated mocks, enforce strict zero-drift contracts, and provide AI agents with the mathematical blueprints needed for high-accuracy synthesis.";
  } else if (primaryRecommendation.includes("BDD")) {
    strategicRationale = "Your initiative relies deeply on cross-functional alignment with Product Owners, compliance officers, or domain experts. Executable Gherkin scenarios will prevent costly misunderstandings, bridge the communication gap, and create living documentation that verifies business value.";
  } else {
    strategicRationale = "Your workload is dominated by intricate internal algorithms, calculation engines, or utility libraries with numerous edge cases. The red-green-refactor loop of TDD provides immediate sub-second feedback and ensures unbreakable regression safety.";
  }

  // The modern hybrid unified recommendation
  const blendedPyramid = {
    topLayer: "BDD (Given/When/Then scenarios defining end-to-end user journeys and business acceptance criteria)",
    middleLayer: "SDD (Formal OpenAPI/AsyncAPI contracts governing inter-service boundaries, DTOs, and AI generation)",
    foundationLayer: "TDD (Micro unit tests verifying intricate algorithmic logic, boundary conditions, and internal classes)"
  };

  const actionItems = [
    `Establish ${primaryRecommendation} as the primary cultural discipline for the current initiative.`,
    "Adopt the 'Modern Enterprise Pyramid': Write BDD acceptance criteria with stakeholders, define SDD schema contracts for boundaries, and use TDD inside complex business units.",
    "Integrate automated contract and test verification directly into the continuous integration (CI) pipeline.",
    "Leverage modern tooling: OpenAPI 3.1 / TypeSpec for contracts, Cucumber/Playwright for behavioral scenarios, and Jest/Node:test for unit test micro-loops."
  ];

  return {
    scores: {
      sdd: sddPercent,
      tdd: tddPercent,
      bdd: bddPercent
    },
    primaryRecommendation,
    strategicRationale,
    blendedPyramid,
    actionItems
  };
}
