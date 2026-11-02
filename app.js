// Enterprise SDD, TDD & BDD Client Controller

const fallback = (typeof PORTAL_FALLBACK_DATA !== 'undefined') ? PORTAL_FALLBACK_DATA : {
  methodologies: [],
  comparison: { categories: [], dimensions: [], radarDimensions: [] },
  simulationData: null,
  glossary: [],
  unifiedCaseStudy: null
};

let appState = {
  methodologies: fallback.methodologies || [],
  comparison: fallback.comparison || { categories: [], dimensions: [], radarDimensions: [] },
  simulationData: fallback.simulationData || null,
  glossary: fallback.glossary || [],
  unifiedCaseStudy: fallback.unifiedCaseStudy || null,
  activeTab: 'overview',
  activeMethodologyId: 'sdd',
  activeMethodologySubTab: 'overview',
  activeUnifiedTab: 'bdd',
  selectedComparisonCategory: 'all',
  searchQuery: '',
  theme: 'dark',
  tddStepIndex: 0,
  bddSelectedScenarioIndex: 0,
  advisorParams: {
    apiContractImportance: 4,
    businessStakeholderInvolvement: 3,
    algorithmicComplexity: 3,
    aiCodeGenerationAdoption: 4,
    multiTeamDecoupling: 4
  },
  advisorResult: null
};

// Preset sample payloads for SDD simulator
const sddPresets = {
  valid: {
    transactionId: "TX-892144",
    amount: 1450.50,
    currency: "USD",
    recipientId: "ACC-998822",
    paymentType: "INSTANT_ACH"
  },
  invalidRegex: {
    transactionId: "INVALID-TRANSACTION-ID",
    amount: 250.00,
    currency: "USD",
    recipientId: "ACC-12345",
    paymentType: "CREDIT_CARD"
  },
  outOfRange: {
    transactionId: "TX-102938",
    amount: 999999.00, // exceeds max 100,000
    currency: "EUR",
    recipientId: "ACC-554433",
    paymentType: "WIRE_TRANSFER"
  },
  missingFields: {
    transactionId: "TX-334455",
    currency: "XYZ", // invalid currency enum
    recipientId: "A", // too short
    paymentType: "CASH_ENVELOPE" // not in enum
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  setupTheme();
  setupNavigation();
  setupEventListeners();
  renderAll(); // Immediate instant render from embedded data!
  runAdvisorCalculation();
  await fetchInitialData(); // Background refresh from live API
});

function setupTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  setTheme(saved);
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTheme(appState.theme === 'dark' ? 'light' : 'dark');
    });
  }
}

function setTheme(theme) {
  appState.theme = theme;
  localStorage.setItem('theme', theme);
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  if (theme === 'light') {
    root.classList.remove('dark');
    root.classList.add('light');
    if (toggleBtn) toggleBtn.innerHTML = '🌙 Dark Mode';
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
    if (toggleBtn) toggleBtn.innerHTML = '☀️ Light Mode';
  }
}

function setupNavigation() {
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = tab.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });
}

function switchTab(tabId) {
  appState.activeTab = tabId;
  document.querySelectorAll('.nav-tab').forEach(t => {
    if (t.getAttribute('data-tab') === tabId) {
      t.classList.add('border-cyan-400', 'text-cyan-400', 'bg-slate-800/80');
      t.classList.remove('text-slate-400', 'border-transparent');
    } else {
      t.classList.remove('border-cyan-400', 'text-cyan-400', 'bg-slate-800/80');
      t.classList.add('text-slate-400', 'border-transparent');
    }
  });

  document.querySelectorAll('.tab-content').forEach(section => {
    if (section.id === `tab-${tabId}`) {
      section.classList.remove('hidden');
    } else {
      section.classList.add('hidden');
    }
  });
}

function setupEventListeners() {
  // Global search input
  const searchInput = document.getElementById('global-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      appState.searchQuery = e.target.value.toLowerCase().trim();
      renderAll();
    });
  }

  // Advisor sliders
  const advisorInputs = [
    'apiContractImportance',
    'businessStakeholderInvolvement',
    'algorithmicComplexity',
    'aiCodeGenerationAdoption',
    'multiTeamDecoupling'
  ];
  advisorInputs.forEach(id => {
    const el = document.getElementById(`input-${id}`);
    if (el) {
      el.addEventListener('input', (e) => {
        appState.advisorParams[id] = parseInt(e.target.value, 10);
        const valBadge = document.getElementById(`val-${id}`);
        if (valBadge) valBadge.textContent = e.target.value;
        runAdvisorCalculation();
      });
    }
  });

  // TDD Simulator buttons
  document.querySelectorAll('.tdd-phase-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const stepIdx = parseInt(btn.getAttribute('data-step'), 10);
      appState.tddStepIndex = stepIdx;
      renderTddSimulator();
    });
  });

  // BDD Scenario selector
  const scenarioSelect = document.getElementById('bdd-scenario-select');
  if (scenarioSelect) {
    scenarioSelect.addEventListener('change', (e) => {
      appState.bddSelectedScenarioIndex = parseInt(e.target.value, 10);
      renderBddSimulator();
    });
  }

  const runBddBtn = document.getElementById('btn-run-bdd');
  if (runBddBtn) {
    runBddBtn.addEventListener('click', () => {
      simulateBddRun();
    });
  }

  // SDD Presets
  document.querySelectorAll('.sdd-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.getAttribute('data-preset');
      const payloadObj = sddPresets[presetKey];
      const editor = document.getElementById('sdd-payload-editor');
      if (editor && payloadObj) {
        editor.value = JSON.stringify(payloadObj, null, 2);
      }
    });
  });

  const validateSddBtn = document.getElementById('btn-validate-sdd');
  if (validateSddBtn) {
    validateSddBtn.addEventListener('click', () => {
      runSddValidation();
    });
  }

  const exportAdvisorBtn = document.getElementById('btn-export-advisor-report');
  if (exportAdvisorBtn) {
    exportAdvisorBtn.addEventListener('click', () => {
      exportAdvisorReport();
    });
  }
}

async function fetchInitialData() {
  try {
    const [methRes, compRes, simRes, glossRes, csRes] = await Promise.all([
      fetch('/api/v1/methodologies').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/v1/comparison').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/v1/simulation/data').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/v1/glossary').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/v1/casestudy/unified').then(r => r.ok ? r.json() : null).catch(() => null)
    ]);

    if (methRes && Array.isArray(methRes) && methRes.length > 0) appState.methodologies = methRes;
    if (compRes && compRes.dimensions) appState.comparison = compRes;
    if (simRes) appState.simulationData = simRes;
    if (glossRes && Array.isArray(glossRes)) appState.glossary = glossRes;
    if (csRes && csRes.problemStatement) appState.unifiedCaseStudy = csRes;

    renderAll();
  } catch (err) {
    console.warn('Live API sync note: operating with embedded resilient dataset.', err);
  }
}

function renderAll() {
  renderMethodologyGuide();
  renderAllVisualFlowcharts();
  renderComparisonMatrix();
  renderRadarScorecard();
  renderGlossary();
  renderUnifiedCaseStudy();
  renderTddSimulator();
  renderBddSimulator();
  renderSddSimulator();
}

// -------------------------------------------------------------
// Methodology Guide Renderer (Uncluttered, Tabbed, Deep Architecture)
// -------------------------------------------------------------
window.selectMethodology = function(id) {
  appState.activeMethodologyId = id;
  renderMethodologyGuide();
};

window.selectMethodologySubTab = function(subTab) {
  appState.activeMethodologySubTab = subTab;
  renderMethodologyGuide();
};

function renderMethodologyGuide() {
  const container = document.getElementById('methodologies-container');
  if (!container || !appState.methodologies.length) return;

  const currentMethodology = appState.methodologies.find(m => m.id === appState.activeMethodologyId) || appState.methodologies[0];

  let themeAccent = {
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    primaryBorder: 'border-cyan-500/40',
    btnActive: 'bg-cyan-500 text-slate-950 font-bold',
    textAccent: 'text-cyan-400',
    cardGlow: 'glow-cyan',
    dot: 'bg-cyan-400'
  };

  if (currentMethodology.id === 'tdd') {
    themeAccent = {
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      primaryBorder: 'border-emerald-500/40',
      btnActive: 'bg-emerald-500 text-slate-950 font-bold',
      textAccent: 'text-emerald-400',
      cardGlow: 'glow-emerald',
      dot: 'bg-emerald-400'
    };
  } else if (currentMethodology.id === 'bdd') {
    themeAccent = {
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      primaryBorder: 'border-amber-500/40',
      btnActive: 'bg-amber-500 text-slate-950 font-bold',
      textAccent: 'text-amber-400',
      cardGlow: 'glow-amber',
      dot: 'bg-amber-400'
    };
  }

  // 1. Selector Bar (Hero 3-way toggle)
  const selectorBarHtml = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
      ${appState.methodologies.map(m => {
        const isSelected = m.id === currentMethodology.id;
        let cardColor = 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300';
        let activeDot = 'bg-slate-600';

        if (isSelected) {
          if (m.id === 'sdd') {
            cardColor = 'border-cyan-400 bg-cyan-950/30 text-white ring-2 ring-cyan-500/30';
            activeDot = 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]';
          } else if (m.id === 'tdd') {
            cardColor = 'border-emerald-400 bg-emerald-950/30 text-white ring-2 ring-emerald-500/30';
            activeDot = 'bg-emerald-400 shadow-[0_0_8px_#10b981]';
          } else if (m.id === 'bdd') {
            cardColor = 'border-amber-400 bg-amber-950/30 text-white ring-2 ring-amber-500/30';
            activeDot = 'bg-amber-400 shadow-[0_0_8px_#f59e0b]';
          }
        }

        return `
          <button onclick="selectMethodology('${m.id}')" class="p-4 sm:p-5 text-left rounded-2xl border transition-all duration-300 ${cardColor} cursor-pointer">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold font-mono tracking-wider uppercase opacity-80">${m.category}</span>
              <span class="w-2.5 h-2.5 rounded-full ${activeDot}"></span>
            </div>
            <div class="text-lg sm:text-xl font-black mt-2 tracking-tight">${m.acronym}: ${m.name}</div>
            <p class="text-xs text-slate-400 mt-1 line-clamp-1 italic">${m.tagline}</p>
          </button>
        `;
      }).join('')}
    </div>
  `;

  // 2. Sub-tab Navigation for deep details
  const subTabs = [
    { id: 'overview', label: '📖 Overview & Mental Model' },
    { id: 'visualPipeline', label: '🎨 Pictorial Architecture Flow' },
    { id: 'lifecycle', label: '🔄 Detailed Lifecycle & Code' },
    { id: 'principles', label: '⚙️ Core Architectural Rules' },
    { id: 'tooling', label: '🛠️ Tooling & Frameworks' },
    { id: 'tradeoffs', label: '⚠️ Trade-offs & Pitfalls' },
    { id: 'dayInLife', label: '🌅 A Day In The Life' },
    { id: 'aiSynergy', label: '🤖 AI & Autonomous Agents' }
  ];

  const subNavHtml = `
    <div class="flex space-x-2 overflow-x-auto pb-3 mb-6 border-b border-slate-800 scrollbar-none text-xs font-semibold">
      ${subTabs.map(t => `
        <button onclick="selectMethodologySubTab('${t.id}')" class="px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${appState.activeMethodologySubTab === t.id ? themeAccent.btnActive : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'}">
          ${t.label}
        </button>
      `).join('')}
    </div>
  `;

  // 3. Sub-tab Content Panels
  let subTabContentHtml = '';

  if (appState.activeMethodologySubTab === 'overview') {
    const o = currentMethodology.overview || {};
    subTabContentHtml = `
      <div class="space-y-6">
        <!-- Definition & Problem Card -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-8 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Formal Architectural Definition</span>
              <p class="text-sm sm:text-base text-slate-200 mt-2 leading-relaxed font-normal">${o.formalDefinition || currentMethodology.primaryFocus}</p>
            </div>
            <div class="pt-4 border-t border-slate-800">
              <span class="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <span>⚠️</span> The Problem It Solves (Why Traditional Methods Fail Here)
              </span>
              <p class="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">${o.problemStatement || 'Addresses drift, late discoveries, and communication gaps.'}</p>
            </div>
            <div class="pt-4 border-t border-slate-800">
              <span class="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <span>💡</span> Intuitive Mental Model
              </span>
              <p class="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed italic bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">${o.mentalModel || ''}</p>
            </div>
          </div>

          <!-- Key Quantitative Metrics & Attributes -->
          <div class="lg:col-span-4 space-y-4">
            <div class="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">Enterprise Impact Metrics</span>
              <div class="grid grid-cols-2 gap-3">
                ${(o.keyMetrics || []).map(m => `
                  <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                    <span class="text-xl sm:text-2xl font-black ${themeAccent.textAccent} block">${m.value}</span>
                    <span class="text-[11px] text-slate-400 font-medium leading-tight block mt-1">${m.label}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div>
                <span class="text-slate-400 font-bold block">Historical Origin:</span>
                <span class="text-slate-200">${currentMethodology.origin}</span>
              </div>
              <div class="pt-2 border-t border-slate-800">
                <span class="text-slate-400 font-bold block">Governance Weight:</span>
                <span class="text-slate-200">${currentMethodology.governanceWeight}</span>
              </div>
              <div class="pt-2 border-t border-slate-800">
                <span class="text-slate-400 font-bold block">AI Synergy Score:</span>
                <span class="text-cyan-400 font-mono font-bold text-sm">${currentMethodology.aiReadinessScore} / 10.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (appState.activeMethodologySubTab === 'visualPipeline') {
    subTabContentHtml = renderVisualPipelineDiagram(currentMethodology);
  } else if (appState.activeMethodologySubTab === 'lifecycle') {
    const steps = currentMethodology.detailedLifecycle || currentMethodology.lifecycle;
    subTabContentHtml = `
      <div class="space-y-6">
        <div class="text-xs text-slate-400 bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <span>Explore each progressive phase in the <strong>${currentMethodology.name}</strong> delivery pipeline, including required inputs, outputs, and concrete executable code snippets.</span>
          <span class="font-mono text-cyan-400 font-bold">${steps.length} Distinct Phases</span>
        </div>

        <div class="space-y-6">
          ${steps.map((st, i) => `
            <div class="glass-panel p-6 rounded-2xl border border-slate-800/90 hover:border-slate-700 transition-all">
              <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-3">
                  <span class="w-7 h-7 rounded-lg ${themeAccent.badgeBg} flex items-center justify-center font-mono font-black text-xs border">
                    ${st.step || (i + 1)}
                  </span>
                  <h4 class="text-base sm:text-lg font-bold text-white">${st.title}</h4>
                </div>
                <span class="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-md border border-slate-800">
                  Quality Gate: <span class="text-emerald-400">${st.qualityGate || 'Verification complete'}</span>
                </span>
              </div>

              <p class="text-xs sm:text-sm text-slate-300 mt-3 font-medium">${st.objective || st.description}</p>

              <!-- Inputs, Outputs & Actions -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
                <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">Inputs</span>
                  <span class="text-slate-300">${st.inputs || 'Requirements & Architecture Specs'}</span>
                </div>
                <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">Outputs</span>
                  <span class="text-slate-300">${st.outputs || 'Executable artifacts & reports'}</span>
                </div>
                <div class="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">Key Actions</span>
                  <ul class="text-slate-300 space-y-1 mt-1">
                    ${(st.actions || [st.description]).map(act => `<li>• ${act}</li>`).join('')}
                  </ul>
                </div>
              </div>

              <!-- Executable Code/Schema Snippet -->
              ${st.codeSnippet ? `
                <div class="mt-4">
                  <div class="text-[11px] font-mono font-bold text-slate-400 bg-slate-950 px-3 py-1.5 rounded-t-lg border-t border-x border-slate-800 flex justify-between">
                    <span>Artifact & Execution Snippet</span>
                    <span class="text-cyan-400">Phase Code</span>
                  </div>
                  <pre class="bg-black/90 p-4 rounded-b-lg border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto"><code>${escapeHtml(st.codeSnippet)}</code></pre>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (appState.activeMethodologySubTab === 'principles') {
    const principles = currentMethodology.corePrinciples;
    subTabContentHtml = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${principles.map((p, idx) => {
          const isObj = typeof p === 'object';
          const title = isObj ? p.title : `Principle #${idx + 1}`;
          const desc = isObj ? p.description : p;
          const why = isObj ? p.whyItMatters : null;

          return `
            <div class="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-6 h-6 rounded-md ${themeAccent.badgeBg} flex items-center justify-center font-mono font-bold text-xs border">
                    ${idx + 1}
                  </span>
                  <h4 class="text-sm sm:text-base font-bold text-white">${title}</h4>
                </div>
                <p class="text-xs text-slate-300 leading-relaxed mt-2">${desc}</p>
              </div>
              ${why ? `
                <div class="mt-4 pt-3 border-t border-slate-800/80">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">Why It Matters</span>
                  <p class="text-xs text-slate-400 mt-1">${why}</p>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  } else if (appState.activeMethodologySubTab === 'tooling') {
    const ecosystem = currentMethodology.toolingEcosystem;
    if (ecosystem && Array.isArray(ecosystem)) {
      subTabContentHtml = `
        <div class="space-y-6">
          ${ecosystem.map(cat => `
            <div class="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <h4 class="text-xs font-bold uppercase tracking-wider ${themeAccent.textAccent} mb-3 flex items-center gap-2">
                <span>📦</span>
                <span>${cat.category}</span>
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${cat.tools.map(tool => `
                  <div class="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                    <span class="font-bold text-white text-xs font-mono">${tool.name}</span>
                    <p class="text-xs text-slate-400 mt-1">${tool.desc}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      subTabContentHtml = `
        <div class="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Ecosystem Tools</h4>
          <div class="flex flex-wrap gap-2">
            ${currentMethodology.tools.map(t => `
              <span class="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono">${t}</span>
            `).join('')}
          </div>
        </div>
      `;
    }
  } else if (appState.activeMethodologySubTab === 'tradeoffs') {
    const at = currentMethodology.advantagesAndTradeoffs || {};
    const advs = at.advantages || currentMethodology.advantages.map(a => ({ title: 'Key Advantage', detail: a }));
    const pits = at.pitfalls || (currentMethodology.challenges || []).map(c => ({ antiPattern: 'Common Challenge', problem: c, mitigation: 'Adhere to lifecycle discipline.' }));

    subTabContentHtml = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Advantages Column -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <span>★</span> Strategic & Developer Advantages
          </div>
          ${advs.map(adv => `
            <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-all">
              <h5 class="text-xs font-bold text-emerald-300 font-mono">${adv.title}</h5>
              <p class="text-xs text-slate-300 mt-1 leading-relaxed">${adv.detail}</p>
            </div>
          `).join('')}
        </div>

        <!-- Pitfalls & Mitigations Column -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 mb-1">
            <span>⚠️</span> Anti-Patterns & Pitfall Mitigations
          </div>
          ${pits.map(pit => `
            <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-800 hover:border-red-500/30 transition-all">
              <span class="text-xs font-bold text-red-300 font-mono block">${pit.antiPattern}</span>
              <p class="text-xs text-slate-300 mt-1.5"><strong class="text-slate-400">The Problem:</strong> ${pit.problem}</p>
              <div class="mt-2.5 pt-2 border-t border-slate-800/80 text-xs text-cyan-300">
                <strong>Recommended Mitigation:</strong> ${pit.mitigation}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (appState.activeMethodologySubTab === 'dayInLife') {
    const day = currentMethodology.dayInTheLife || {
      scenarioTitle: 'Standard Sprint Implementation Flow',
      narrative: 'A step-by-step day in the life of an engineer applying this method.',
      steps: currentMethodology.lifecycle.map(l => `${l.title}: ${l.description}`)
    };

    subTabContentHtml = `
      <div class="bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div class="border-b border-slate-800 pb-4">
          <span class="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-800">Real-World Walkthrough</span>
          <h4 class="text-xl font-bold text-white mt-2">${day.scenarioTitle}</h4>
          <p class="text-xs sm:text-sm text-slate-300 mt-1">${day.narrative}</p>
        </div>

        <div class="space-y-4">
          ${day.steps.map((step, idx) => `
            <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span class="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                ${idx + 1}
              </span>
              <p class="text-xs sm:text-sm text-slate-200 leading-relaxed">${step}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (appState.activeMethodologySubTab === 'aiSynergy') {
    const ai = currentMethodology.aiSynergy || {
      title: 'Autonomous Coding Agents & LLM Alignment',
      summary: 'How this methodology accelerates AI-assisted software engineering.',
      breakdown: [
        'Structured context prevents hallucinated APIs.',
        'Deterministic test runners verify AI code automatically.'
      ]
    };

    subTabContentHtml = `
      <div class="bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-cyan-500/30 glow-cyan space-y-6">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800">Next-Gen Engineering</span>
            <span class="text-xs font-mono text-slate-400">Autonomous Agentic Readiness</span>
          </div>
          <h4 class="text-xl sm:text-2xl font-black text-white mt-3">${ai.title}</h4>
          <p class="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed font-normal">${ai.summary}</p>
        </div>

        <div class="space-y-3 pt-4 border-t border-slate-800">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Key AI Synergy Multipliers</span>
          ${ai.breakdown.map((item, idx) => `
            <div class="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-3">
              <span class="text-cyan-400 font-bold text-sm">⚡</span>
              <p class="text-xs sm:text-sm text-slate-200 leading-relaxed">${item}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 4. Assemble the complete view
  container.innerHTML = `
    <!-- 3-Way Top Methodology Selector -->
    ${selectorBarHtml}

    <!-- Active Methodology Card Container -->
    <div class="glass-panel p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${themeAccent.primaryBorder} ${themeAccent.cardGlow}">
      
      <!-- Card Header Banner -->
      <div class="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${themeAccent.badgeBg}">
              <span class="w-2 h-2 rounded-full mr-2 ${themeAccent.dot}"></span>
              ${currentMethodology.acronym}
            </span>
            <span class="text-xs text-slate-400 font-mono">${currentMethodology.category}</span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-extrabold text-white mt-2">${currentMethodology.name}</h3>
          <p class="text-slate-300 mt-1 italic font-medium">"${currentMethodology.tagline}"</p>
        </div>
        <div class="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700 text-right">
          <span class="text-xs text-slate-400 block uppercase tracking-wider">AI Synergy Index</span>
          <span class="text-xl font-bold ${themeAccent.textAccent}">${currentMethodology.aiReadinessScore} / 10.0</span>
        </div>
      </div>

      <!-- Sub-Tab Navigation Bar -->
      ${subNavHtml}

      <!-- Dynamic Sub-Tab Content -->
      ${subTabContentHtml}

    </div>
  `;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// -------------------------------------------------------------
// Comparison Matrix Renderer
// -------------------------------------------------------------
function renderComparisonMatrix() {
  const container = document.getElementById('comparison-matrix-container');
  if (!container || !appState.comparison.dimensions.length) return;

  const dimensions = appState.comparison.dimensions;
  const filtered = dimensions.filter(d => {
    const matchCategory = appState.selectedComparisonCategory === 'all' || d.category === appState.selectedComparisonCategory;
    if (!matchCategory) return false;
    if (!appState.searchQuery) return true;
    const txt = (d.dimension + ' ' + d.sdd + ' ' + d.tdd + ' ' + d.bdd + ' ' + d.keyTakeaway).toLowerCase();
    return txt.includes(appState.searchQuery);
  });

  // Render category buttons
  const catFilterContainer = document.getElementById('comparison-categories');
  if (catFilterContainer) {
    const allCategories = ['all', ...appState.comparison.categories];
    catFilterContainer.innerHTML = allCategories.map(cat => `
      <button class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${appState.selectedComparisonCategory === cat ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}" onclick="setComparisonCategory('${cat}')">
        ${cat === 'all' ? 'All Dimensions' : cat}
      </button>
    `).join('');
  }

  container.innerHTML = `
    <div class="overflow-x-auto rounded-xl border border-slate-700/80">
      <table class="w-full text-left text-sm border-collapse">
        <thead>
          <tr class="bg-slate-900/90 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-700">
            <th class="p-4 w-1/4">Dimension & Scope</th>
            <th class="p-4 w-1/4 text-cyan-400 bg-cyan-950/20 border-l border-slate-800">Spec-Driven (SDD)</th>
            <th class="p-4 w-1/4 text-emerald-400 bg-emerald-950/20 border-l border-slate-800">Test-Driven (TDD)</th>
            <th class="p-4 w-1/4 text-amber-400 bg-amber-950/20 border-l border-slate-800">Behavior-Driven (BDD)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800 bg-slate-950/40">
          ${filtered.map(row => `
            <tr class="hover:bg-slate-800/40 transition-colors">
              <td class="p-4 font-semibold text-white align-top">
                <span class="block">${row.dimension}</span>
                <span class="inline-block mt-1 text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">${row.category}</span>
                <p class="text-xs text-slate-400 mt-2 italic font-normal">💡 ${row.keyTakeaway}</p>
              </td>
              <td class="p-4 text-slate-300 align-top bg-cyan-950/10 border-l border-slate-800 text-xs leading-relaxed font-sans">
                ${row.sdd}
              </td>
              <td class="p-4 text-slate-300 align-top bg-emerald-950/10 border-l border-slate-800 text-xs leading-relaxed font-sans">
                ${row.tdd}
              </td>
              <td class="p-4 text-slate-300 align-top bg-amber-950/10 border-l border-slate-800 text-xs leading-relaxed font-sans">
                ${row.bdd}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

window.setComparisonCategory = function(cat) {
  appState.selectedComparisonCategory = cat;
  renderComparisonMatrix();
};

// -------------------------------------------------------------
// Interactive Advisor Engine
// -------------------------------------------------------------
async function runAdvisorCalculation() {
  try {
    const res = await fetch('/api/v1/advisor/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appState.advisorParams)
    });
    if (res.ok) {
      const data = await res.json();
      appState.advisorResult = data;
      renderAdvisorResults();
      return;
    }
  } catch (err) {
    // Fallback to local computation
  }

  // Pure client-side computation fallback
  appState.advisorResult = computeLocalAdvisor(appState.advisorParams);
  renderAdvisorResults();
}

function computeLocalAdvisor(criteria) {
  const {
    apiContractImportance = 3,
    businessStakeholderInvolvement = 3,
    algorithmicComplexity = 3,
    aiCodeGenerationAdoption = 3,
    multiTeamDecoupling = 3
  } = criteria;

  const sddRaw = (apiContractImportance * 3.5) + (multiTeamDecoupling * 3.0) + (aiCodeGenerationAdoption * 2.5) + (businessStakeholderInvolvement * 1.0) + (algorithmicComplexity * 1.0);
  const tddRaw = (algorithmicComplexity * 3.5) + (aiCodeGenerationAdoption * 2.0) + (multiTeamDecoupling * 1.5) + (apiContractImportance * 1.5) + (businessStakeholderInvolvement * 1.0);
  const bddRaw = (businessStakeholderInvolvement * 3.5) + (multiTeamDecoupling * 2.0) + (aiCodeGenerationAdoption * 2.0) + (apiContractImportance * 1.5) + (algorithmicComplexity * 1.0);

  const maxPossible = 55;
  const sddPercent = Math.min(100, Math.round((sddRaw / maxPossible) * 100));
  const tddPercent = Math.min(100, Math.round((tddRaw / maxPossible) * 100));
  const bddPercent = Math.min(100, Math.round((bddRaw / maxPossible) * 100));

  let primary = "Spec-Driven Development (SDD)";
  let highest = sddPercent;
  if (bddPercent > highest && bddPercent >= tddPercent) {
    primary = "Behavior-Driven Development (BDD)";
    highest = bddPercent;
  } else if (tddPercent > highest) {
    primary = "Test-Driven Development (TDD)";
    highest = tddPercent;
  }

  return {
    scores: { sdd: sddPercent, tdd: tddPercent, bdd: bddPercent },
    primaryRecommendation: primary,
    strategicRationale: "Calculated based on your team's architectural dependencies and quality parameters.",
    blendedPyramid: {
      topLayer: "BDD (Given/When/Then acceptance criteria defining user journeys)",
      middleLayer: "SDD (Formal schema contracts governing service boundaries & AI prompts)",
      foundationLayer: "TDD (Micro unit tests verifying intricate algorithmic logic)"
    },
    actionItems: [
      `Adopt ${primary} as the primary cultural discipline for the current initiative.`,
      "Enforce the Modern Enterprise Pyramid: BDD for stories, SDD for contracts, TDD for code units."
    ]
  };
}

function renderAdvisorResults() {
  if (!appState.advisorResult) return;
  const { scores, primaryRecommendation, strategicRationale, blendedPyramid, actionItems } = appState.advisorResult;

  // Update Score Cards
  const sddBar = document.getElementById('score-bar-sdd');
  const tddBar = document.getElementById('score-bar-tdd');
  const bddBar = document.getElementById('score-bar-bdd');

  const sddVal = document.getElementById('score-val-sdd');
  const tddVal = document.getElementById('score-val-tdd');
  const bddVal = document.getElementById('score-val-bdd');

  if (sddBar && sddVal) {
    sddBar.style.width = `${scores.sdd}%`;
    sddVal.textContent = `${scores.sdd}%`;
  }
  if (tddBar && tddVal) {
    tddBar.style.width = `${scores.tdd}%`;
    tddVal.textContent = `${scores.tdd}%`;
  }
  if (bddBar && bddVal) {
    bddBar.style.width = `${scores.bdd}%`;
    bddVal.textContent = `${scores.bdd}%`;
  }

  // Recommendation Rationale
  const titleEl = document.getElementById('advisor-primary-title');
  const descEl = document.getElementById('advisor-primary-desc');
  if (titleEl) titleEl.textContent = `Primary Strategic Recommendation: ${primaryRecommendation}`;
  if (descEl) descEl.textContent = strategicRationale;

  // Modern Pyramid
  const pyramidEl = document.getElementById('advisor-pyramid-details');
  if (pyramidEl) {
    pyramidEl.innerHTML = `
      <div class="p-3 bg-amber-950/20 border border-amber-500/40 rounded-lg text-xs">
        <span class="font-bold text-amber-400 block">TOP TIER: Business Intent</span>
        <span class="text-slate-300">${blendedPyramid.topLayer}</span>
      </div>
      <div class="p-3 bg-cyan-950/20 border border-cyan-500/40 rounded-lg text-xs">
        <span class="font-bold text-cyan-400 block">MIDDLE TIER: System Contract</span>
        <span class="text-slate-300">${blendedPyramid.middleLayer}</span>
      </div>
      <div class="p-3 bg-emerald-950/20 border border-emerald-500/40 rounded-lg text-xs">
        <span class="font-bold text-emerald-400 block">FOUNDATION TIER: Algorithmic Verification</span>
        <span class="text-slate-300">${blendedPyramid.foundationLayer}</span>
      </div>
    `;
  }

  // Action items
  const actionListEl = document.getElementById('advisor-action-items');
  if (actionListEl && actionItems) {
    actionListEl.innerHTML = actionItems.map(item => `
      <li class="flex items-start gap-2 text-xs text-slate-300">
        <span class="text-cyan-400 font-bold">➔</span>
        <span>${item}</span>
      </li>
    `).join('');
  }
}

// -------------------------------------------------------------
// TDD Simulator Renderer
// -------------------------------------------------------------
function renderTddSimulator() {
  if (!appState.simulationData || !appState.simulationData.tdd) return;
  const currentStep = appState.simulationData.tdd.steps[appState.tddStepIndex];

  // Update button highlights
  document.querySelectorAll('.tdd-phase-btn').forEach(btn => {
    const idx = parseInt(btn.getAttribute('data-step'), 10);
    if (idx === appState.tddStepIndex) {
      btn.classList.add('ring-2', 'ring-cyan-400', 'bg-slate-700');
    } else {
      btn.classList.remove('ring-2', 'ring-cyan-400', 'bg-slate-700');
    }
  });

  const titleEl = document.getElementById('tdd-step-title');
  const descEl = document.getElementById('tdd-step-desc');
  const testCodeEl = document.getElementById('tdd-test-code');
  const implCodeEl = document.getElementById('tdd-impl-code');
  const consoleEl = document.getElementById('tdd-console-output');

  if (titleEl) titleEl.textContent = currentStep.phaseName;
  if (descEl) descEl.textContent = currentStep.description;
  if (testCodeEl) testCodeEl.textContent = currentStep.testCode;
  if (implCodeEl) implCodeEl.textContent = currentStep.implementationCode;
  if (consoleEl) {
    consoleEl.textContent = currentStep.testRunnerOutput;
    if (currentStep.phase === 'red') {
      consoleEl.className = 'font-mono text-xs text-red-400 bg-black/90 p-4 rounded-xl border border-red-500/40 whitespace-pre overflow-x-auto';
    } else if (currentStep.phase === 'green') {
      consoleEl.className = 'font-mono text-xs text-emerald-400 bg-black/90 p-4 rounded-xl border border-emerald-500/40 whitespace-pre overflow-x-auto';
    } else {
      consoleEl.className = 'font-mono text-xs text-cyan-300 bg-black/90 p-4 rounded-xl border border-cyan-500/40 whitespace-pre overflow-x-auto';
    }
  }
}

// -------------------------------------------------------------
// BDD Simulator Renderer
// -------------------------------------------------------------
function renderBddSimulator() {
  if (!appState.simulationData || !appState.simulationData.bdd) return;
  const scenarios = appState.simulationData.bdd;
  const current = scenarios[appState.bddSelectedScenarioIndex];

  const featEl = document.getElementById('bdd-feature-title');
  const scenEl = document.getElementById('bdd-scenario-name');
  const stepsContainer = document.getElementById('bdd-steps-container');

  if (featEl) featEl.textContent = `Feature: ${current.feature}`;
  if (scenEl) scenEl.textContent = `Scenario: ${current.scenario}`;

  if (stepsContainer) {
    stepsContainer.innerHTML = current.steps.map((st, i) => `
      <div id="bdd-step-${i}" class="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start justify-between gap-4 transition-all duration-300">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-bold uppercase text-amber-400">${st.type}</span>
            <span class="text-sm font-medium text-slate-200">${st.text}</span>
          </div>
          <div class="text-xs text-slate-400 mt-1 pl-4 border-l-2 border-slate-700">${st.detail}</div>
        </div>
        <span class="step-badge inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          PASSED
        </span>
      </div>
    `).join('');
  }
}

function simulateBddRun() {
  const steps = document.querySelectorAll('#bdd-steps-container > div');
  const statusEl = document.getElementById('bdd-run-status');
  if (statusEl) statusEl.textContent = 'Executing automated step drivers...';

  steps.forEach((el, idx) => {
    const badge = el.querySelector('.step-badge');
    badge.textContent = 'RUNNING...';
    badge.className = 'step-badge inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse';

    setTimeout(() => {
      badge.textContent = 'PASSED (6ms)';
      badge.className = 'step-badge inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      if (idx === steps.length - 1 && statusEl) {
        statusEl.textContent = 'All Gherkin steps passed with 0 failures! Living documentation updated.';
      }
    }, (idx + 1) * 300);
  });
}

// -------------------------------------------------------------
// SDD Simulator Renderer & Validation
// -------------------------------------------------------------
function renderSddSimulator() {
  const editor = document.getElementById('sdd-payload-editor');
  if (editor && !editor.value) {
    editor.value = JSON.stringify(sddPresets.valid, null, 2);
  }
}

async function runSddValidation() {
  const editor = document.getElementById('sdd-payload-editor');
  const resultCard = document.getElementById('sdd-validation-result');
  const typeCodeEl = document.getElementById('sdd-synthesized-types');

  if (!editor || !resultCard) return;

  let parsedPayload;
  try {
    parsedPayload = JSON.parse(editor.value);
  } catch (e) {
    resultCard.innerHTML = `
      <div class="p-4 bg-red-950/40 border border-red-500 rounded-xl text-red-300 text-xs">
        <strong>Invalid JSON Syntax:</strong> ${e.message}
      </div>
    `;
    return;
  }

  try {
    const res = await fetch('/api/v1/simulate/sdd-validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ specType: 'openapi', payload: parsedPayload })
    });
    if (res.ok) {
      const data = await res.json();
      displaySddResult(data, resultCard, typeCodeEl);
      return;
    }
  } catch (err) {
    // Client-side fallback validation
  }

  // Local fallback validation
  const errors = [];
  if (!parsedPayload.transactionId) errors.push("Missing required field: 'transactionId'");
  else if (!/^TX-[0-9]{6}$/.test(parsedPayload.transactionId)) errors.push("'transactionId' does not match required regex pattern '^TX-[0-9]{6}$'");

  if (parsedPayload.amount === undefined) errors.push("Missing required field: 'amount'");
  else if (typeof parsedPayload.amount !== 'number') errors.push("'amount' must be a number");
  else if (parsedPayload.amount < 0.01) errors.push("'amount' violates minimum threshold of 0.01");
  else if (parsedPayload.amount > 100000) errors.push("'amount' violates maximum limit of 100,000.00");

  if (!parsedPayload.currency) errors.push("Missing required field: 'currency'");
  else if (!['USD', 'EUR', 'GBP', 'SGD'].includes(parsedPayload.currency)) errors.push(`'currency' '${parsedPayload.currency}' is invalid. Allowed: USD, EUR, GBP, SGD`);

  if (!parsedPayload.recipientId) errors.push("Missing required field: 'recipientId'");

  const localResult = {
    valid: errors.length === 0,
    schemaContract: "PaymentTransactionContract",
    errors,
    generatedTypeScript: `/**\n * Auto-generated from OpenAPI Contract: PaymentTransactionContract (v3.1.0)\n * Single Source of Truth - DO NOT EDIT MANUALLY\n */\nexport interface PaymentTransaction {\n  transactionId: string;\n  amount: number;\n  currency: 'USD' | 'EUR' | 'GBP' | 'SGD';\n  recipientId: string;\n  paymentType: 'CREDIT_CARD' | 'WIRE_TRANSFER' | 'INSTANT_ACH' | 'CRYPTO_STABLECOIN';\n}`
  };
  displaySddResult(localResult, resultCard, typeCodeEl);
}

function displaySddResult(data, resultCard, typeCodeEl) {
  if (data.valid) {
    resultCard.innerHTML = `
      <div class="p-4 bg-emerald-950/40 border border-emerald-500 rounded-xl text-xs">
        <div class="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <span>✓</span> Contract Assertion PASSED!
        </div>
        <p class="text-slate-300 mt-1">Payload conforms 100% to OpenAPI specification schema '${data.schemaContract}'. Zero contract drift.</p>
      </div>
    `;
  } else {
    resultCard.innerHTML = `
      <div class="p-4 bg-red-950/40 border border-red-500 rounded-xl text-xs">
        <div class="flex items-center gap-2 text-red-400 font-bold text-sm">
          <span>✗</span> Contract Assertion FAILED (${data.errors.length} violations detected)
        </div>
        <ul class="mt-2 space-y-1 list-disc list-inside text-red-300">
          ${data.errors.map(err => `<li>${err}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (typeCodeEl && data.generatedTypeScript) {
    typeCodeEl.textContent = data.generatedTypeScript;
  }
}

// -------------------------------------------------------------
// Radar Scorecard Renderer
// -------------------------------------------------------------
function renderRadarScorecard() {
  const container = document.getElementById('radar-scorecard-container');
  if (!container || !appState.comparison.radarDimensions) return;

  const dims = appState.comparison.radarDimensions;
  container.innerHTML = dims.map(d => `
    <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
      <div class="flex justify-between items-center text-xs font-bold text-white">
        <span>${d.dimension}</span>
      </div>
      <div class="space-y-1.5 text-[11px]">
        <div>
          <div class="flex justify-between text-slate-400 mb-0.5">
            <span>SDD (Spec-Driven)</span>
            <span class="font-mono text-cyan-400 font-bold">${d.sdd}</span>
          </div>
          <div class="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div class="bg-cyan-400 h-full rounded-full" style="width: ${d.sdd * 10}%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-slate-400 mb-0.5">
            <span>TDD (Test-Driven)</span>
            <span class="font-mono text-emerald-400 font-bold">${d.tdd}</span>
          </div>
          <div class="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div class="bg-emerald-400 h-full rounded-full" style="width: ${d.tdd * 10}%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-slate-400 mb-0.5">
            <span>BDD (Behavior-Driven)</span>
            <span class="font-mono text-amber-400 font-bold">${d.bdd}</span>
          </div>
          <div class="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div class="bg-amber-400 h-full rounded-full" style="width: ${d.bdd * 10}%"></div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// -------------------------------------------------------------
// Enterprise Glossary Renderer
// -------------------------------------------------------------
function renderGlossary() {
  const container = document.getElementById('glossary-grid');
  if (!container || !appState.glossary) return;

  const terms = appState.glossary.filter(t => {
    if (!appState.searchQuery) return true;
    return (t.term + ' ' + t.definition + ' ' + t.category).toLowerCase().includes(appState.searchQuery);
  });

  container.innerHTML = terms.map(t => {
    let badgeColor = 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30';
    if (t.category === 'TDD') badgeColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30';
    if (t.category === 'BDD') badgeColor = 'text-amber-400 border-amber-500/30 bg-amber-950/30';

    return `
      <div class="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-base font-bold text-white flex items-center gap-2">
              <span>${t.icon}</span>
              <span>${t.term}</span>
            </span>
            <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeColor}">${t.category}</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed mt-2">${t.definition}</p>
        </div>
      </div>
    `;
  }).join('');
}

// -------------------------------------------------------------
// Starter Template Downloader
// -------------------------------------------------------------
window.downloadStarterTemplate = async function(type) {
  try {
    const res = await fetch('/api/v1/templates/' + type);
    const data = await res.json();
    if (!data.content) return;

    const blob = new Blob([data.content], { type: data.mimeType || 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = data.fileName || ('template-' + type + '.txt');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to download template:', err);
  }
};

// -------------------------------------------------------------
// Advisor Executive Report Exporter
// -------------------------------------------------------------
function exportAdvisorReport() {
  if (!appState.advisorResult) return;
  const { scores, primaryRecommendation, strategicRationale, blendedPyramid, actionItems } = appState.advisorResult;

  const reportMarkdown = [
    '# Executive Methodology Assessment Report',
    'Generated: ' + new Date().toLocaleString(),
    '',
    '## Strategic Summary',
    '- **Primary Recommendation**: ' + primaryRecommendation,
    '- **SDD Alignment Score**: ' + scores.sdd + '%',
    '- **TDD Alignment Score**: ' + scores.tdd + '%',
    '- **BDD Alignment Score**: ' + scores.bdd + '%',
    '',
    '## Strategic Rationale',
    strategicRationale,
    '',
    '## The Modern Development Pyramid Blueprint',
    '- **Top Layer (Business Intent)**: ' + blendedPyramid.topLayer,
    '- **Middle Layer (System Contracts)**: ' + blendedPyramid.middleLayer,
    '- **Foundation Layer (Algorithmic Logic)**: ' + blendedPyramid.foundationLayer,
    '',
    '## Prescribed Action Items',
    (actionItems || []).map(item => '- ' + item).join('\n'),
    '',
    '---',
    'Report authored by DevMethodologies Enterprise Advisor Engine'
  ].join('\n');

  const blob = new Blob([reportMarkdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Methodology-Assessment-Report.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// -------------------------------------------------------------
// Visual Pipeline Diagram Renderer
// -------------------------------------------------------------
function renderVisualPipelineDiagram(m) {
  if (m.id === 'sdd') {
    return `
      <div class="space-y-6">
        <div class="text-xs text-slate-400 bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <span>Graphical Architecture: The <strong>Specification-Driven Development (SDD)</strong> Linear & Concurrent Synthesis Pipeline</span>
          <span class="text-cyan-400 font-mono font-bold">Shift-Left Architecture</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
          <!-- Stage 1 -->
          <div class="bg-slate-900/80 p-4 rounded-xl border border-cyan-500/40">
            <span class="text-[10px] font-mono font-bold text-cyan-400 uppercase">Stage 1</span>
            <div class="font-bold text-white text-sm mt-1">Contract Authoring</div>
            <p class="text-[11px] text-slate-400 mt-2">Architects write OpenAPI 3.1 or TypeSpec models.</p>
            <div class="mt-3 text-[10px] font-mono text-cyan-300 bg-slate-950 p-1.5 rounded">Artifact: openapi.yaml</div>
          </div>

          <!-- Stage 2 -->
          <div class="bg-slate-900/80 p-4 rounded-xl border border-indigo-500/40">
            <span class="text-[10px] font-mono font-bold text-indigo-400 uppercase">Stage 2</span>
            <div class="font-bold text-white text-sm mt-1">Spectral Linting Gate</div>
            <p class="text-[11px] text-slate-400 mt-2">Automated checks verify security & conventions in git.</p>
            <div class="mt-3 text-[10px] font-mono text-indigo-300 bg-slate-950 p-1.5 rounded">Gate: 0 Lint Errors</div>
          </div>

          <!-- Stage 3 -->
          <div class="bg-slate-900/80 p-4 rounded-xl border border-emerald-500/40">
            <span class="text-[10px] font-mono font-bold text-emerald-400 uppercase">Stage 3</span>
            <div class="font-bold text-white text-sm mt-1">Prism Mock Server</div>
            <p class="text-[11px] text-slate-400 mt-2">Frontend & Mobile unblocked on Day 1.</p>
            <div class="mt-3 text-[10px] font-mono text-emerald-300 bg-slate-950 p-1.5 rounded">Output: Port 4010 Live</div>
          </div>

          <!-- Stage 4 -->
          <div class="bg-slate-900/80 p-4 rounded-xl border border-violet-500/40">
            <span class="text-[10px] font-mono font-bold text-violet-400 uppercase">Stage 4</span>
            <div class="font-bold text-white text-sm mt-1">Artifact Synthesis</div>
            <p class="text-[11px] text-slate-400 mt-2">Auto-generates TypeScript DTOs & Zod schemas.</p>
            <div class="mt-3 text-[10px] font-mono text-violet-300 bg-slate-950 p-1.5 rounded">Code: 0 Manual DTOs</div>
          </div>

          <!-- Stage 5 -->
          <div class="bg-slate-900/80 p-4 rounded-xl border border-cyan-500/40">
            <span class="text-[10px] font-mono font-bold text-cyan-400 uppercase">Stage 5</span>
            <div class="font-bold text-white text-sm mt-1">Contract Testing</div>
            <p class="text-[11px] text-slate-400 mt-2">Schemathesis & Pact verify 0 contract drift.</p>
            <div class="mt-3 text-[10px] font-mono text-cyan-300 bg-slate-950 p-1.5 rounded">Outcome: 100% Drift-Free</div>
          </div>
        </div>

        <div class="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-xs text-slate-300 flex items-center justify-between">
          <span>★ <strong>The SDD Advantage:</strong> Frontend, mobile, and backend teams build in parallel concurrently instead of waiting sequentially.</span>
          <span class="text-cyan-400 font-bold">3.5x Velocity Multiplier</span>
        </div>
      </div>
    `;
  } else if (m.id === 'tdd') {
    return `
      <div class="space-y-6">
        <div class="text-xs text-slate-400 bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <span>Graphical Architecture: The <strong>Test-Driven Development (TDD)</strong> Red-Green-Refactor Cyclical Engine</span>
          <span class="text-emerald-400 font-mono font-bold">Micro-Feedback Loop</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-slate-900/80 p-6 rounded-2xl border border-red-500/40 text-center space-y-2">
            <div class="w-12 h-12 mx-auto rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xl border border-red-500/40 animate-pulse">1</div>
            <h4 class="text-base font-extrabold text-red-400">RED: Write Failing Test</h4>
            <p class="text-xs text-slate-300">Author minimal unit test expressing the desired behavior. Execute test runner; verify it fails for expected reason.</p>
            <span class="inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-400 border border-red-800">Duration: ~1 - 2 mins</span>
          </div>

          <div class="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/40 text-center space-y-2">
            <div class="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-500/40">2</div>
            <h4 class="text-base font-extrabold text-emerald-400">GREEN: Minimal Code</h4>
            <p class="text-xs text-slate-300">Write just enough production code to make the test pass. Avoid premature optimization or speculation.</p>
            <span class="inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">Duration: ~1 - 3 mins</span>
          </div>

          <div class="bg-slate-900/80 p-6 rounded-2xl border border-cyan-500/40 text-center space-y-2">
            <div class="w-12 h-12 mx-auto rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xl border border-cyan-500/40">3</div>
            <h4 class="text-base font-extrabold text-cyan-400">REFACTOR: Cleanse Design</h4>
            <p class="text-xs text-slate-300">Remove duplication, extract constants & strategy patterns. Test suite acts as an unbreakable safety net.</p>
            <span class="inline-block mt-2 px-2.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">Duration: ~2 - 4 mins</span>
          </div>
        </div>

        <div class="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-slate-300 flex items-center justify-between">
          <span>★ <strong>The TDD Advantage:</strong> Sub-second verification feedback inside your IDE with bulletproof regression safety for algorithmic code.</span>
          <span class="text-emerald-400 font-bold">&lt; 200ms Feedback</span>
        </div>
      </div>
    `;
  } else {
    return `
      <div class="space-y-6">
        <div class="text-xs text-slate-400 bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <span>Graphical Architecture: The <strong>Behavior-Driven Development (BDD)</strong> Outside-In Collaboration Funnel</span>
          <span class="text-amber-400 font-mono font-bold">Three Amigos Model</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-slate-900/80 p-5 rounded-xl border border-amber-500/40 space-y-2">
            <span class="text-[10px] font-mono font-bold text-amber-400 uppercase">Step 1: Discovery</span>
            <div class="font-bold text-white text-sm">The Three Amigos</div>
            <p class="text-xs text-slate-300">Product Owner, Developer, and QA explore business intent through Example Mapping.</p>
            <span class="inline-block text-[10px] text-amber-300 bg-slate-950 p-1 rounded font-mono">Role: PO + QA + Dev</span>
          </div>

          <div class="bg-slate-900/80 p-5 rounded-xl border border-indigo-500/40 space-y-2">
            <span class="text-[10px] font-mono font-bold text-indigo-400 uppercase">Step 2: Formulation</span>
            <div class="font-bold text-white text-sm">Gherkin Scenarios</div>
            <p class="text-xs text-slate-300">Draft executable .feature files using standard Given/When/Then ubiquitous language.</p>
            <span class="inline-block text-[10px] text-indigo-300 bg-slate-950 p-1 rounded font-mono">Output: .feature files</span>
          </div>

          <div class="bg-slate-900/80 p-5 rounded-xl border border-emerald-500/40 space-y-2">
            <span class="text-[10px] font-mono font-bold text-emerald-400 uppercase">Step 3: Automation</span>
            <div class="font-bold text-white text-sm">Step Glue Code</div>
            <p class="text-xs text-slate-300">Engineers bind natural language steps to Cucumber, Playwright, or Cypress drivers.</p>
            <span class="inline-block text-[10px] text-emerald-300 bg-slate-950 p-1 rounded font-mono">Drivers: Cucumber/Playwright</span>
          </div>

          <div class="bg-slate-900/80 p-5 rounded-xl border border-cyan-500/40 space-y-2">
            <span class="text-[10px] font-mono font-bold text-cyan-400 uppercase">Step 4: Living Docs</span>
            <div class="font-bold text-white text-sm">Auditable Reports</div>
            <p class="text-xs text-slate-300">CI execution produces HTML living documentation readable by non-technical stakeholders.</p>
            <span class="inline-block text-[10px] text-cyan-300 bg-slate-950 p-1 rounded font-mono">Reports: Allure / HTML</span>
          </div>
        </div>

        <div class="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-slate-300 flex items-center justify-between">
          <span>★ <strong>The BDD Advantage:</strong> Eliminates requirements rework by ensuring business intent directly drives automated assertions.</span>
          <span class="text-amber-400 font-bold">Zero Requirements Drift</span>
        </div>
      </div>
    `;
  }
}

// -------------------------------------------------------------
// Unified Case Study Renderer (1 Problem, 3 Approaches)
// -------------------------------------------------------------
window.selectUnifiedTab = function(methodologyId) {
  appState.activeUnifiedTab = methodologyId;
  renderUnifiedCaseStudy();
};

function renderUnifiedCaseStudy() {
  const probContainer = document.getElementById('unified-problem-card');
  const compContainer = document.getElementById('unified-methodology-comparisons');
  const synContainer = document.getElementById('unified-synergy-card');

  const cs = appState.unifiedCaseStudy || ((typeof PORTAL_FALLBACK_DATA !== 'undefined') ? PORTAL_FALLBACK_DATA.unifiedCaseStudy : null);
  if (!cs || !probContainer || !compContainer) return;

  // 1. Problem Statement
  probContainer.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/30 pb-4 mb-4">
      <div>
        <span class="text-xs font-bold font-mono text-indigo-400 uppercase">Enterprise Challenge Specification</span>
        <h3 class="text-xl sm:text-2xl font-black text-white mt-1">${cs.problemStatement.title}</h3>
      </div>
      <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
        Cross-Paradigm Experiment
      </span>
    </div>
    <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">${cs.problemStatement.businessContext}</p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
      ${cs.problemStatement.coreChallenges.map((c, i) => `
        <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
          <span class="text-indigo-400 font-bold">#${i + 1}</span>
          <span>${c}</span>
        </div>
      `).join('')}
    </div>
  `;

  // 2. Interactive 3-way Tab Selector for the Solution
  const activeMethod = cs.methodologySolutions[appState.activeUnifiedTab || 'bdd'];
  let activeTheme = {
    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    border: 'border-amber-500/40',
    titleColor: 'text-amber-400',
    btnActive: 'bg-amber-500 text-slate-950 font-bold shadow-lg'
  };

  if (appState.activeUnifiedTab === 'sdd') {
    activeTheme = {
      badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      border: 'border-cyan-500/40',
      titleColor: 'text-cyan-400',
      btnActive: 'bg-cyan-500 text-slate-950 font-bold shadow-lg'
    };
  } else if (appState.activeUnifiedTab === 'tdd') {
    activeTheme = {
      badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      border: 'border-emerald-500/40',
      titleColor: 'text-emerald-400',
      btnActive: 'bg-emerald-500 text-slate-950 font-bold shadow-lg'
    };
  }

  compContainer.innerHTML = `
    <!-- Switcher Pills -->
    <div class="flex flex-wrap gap-2 pb-2 border-b border-slate-800">
      <button onclick="selectUnifiedTab('bdd')" class="px-4 py-2 rounded-xl text-xs font-semibold transition-all ${appState.activeUnifiedTab === 'bdd' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'}">
        👥 1. The BDD Approach (Business Intent & Scenarios)
      </button>
      <button onclick="selectUnifiedTab('sdd')" class="px-4 py-2 rounded-xl text-xs font-semibold transition-all ${appState.activeUnifiedTab === 'sdd' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'}">
        ⚡ 2. The SDD Approach (System Contract & Team Decoupling)
      </button>
      <button onclick="selectUnifiedTab('tdd')" class="px-4 py-2 rounded-xl text-xs font-semibold transition-all ${appState.activeUnifiedTab === 'tdd' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'}">
        🧪 3. The TDD Approach (Algorithmic Logic & Precision)
      </button>
    </div>

    <!-- Active Method Card -->
    <div class="glass-panel p-6 sm:p-8 rounded-2xl border ${activeTheme.border} space-y-6">
      
      <!-- Card Header -->
      <div class="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold border ${activeTheme.badge}">
            ${activeMethod.name}
          </span>
          <h4 class="text-xl sm:text-2xl font-black text-white mt-2">${activeMethod.approach}</h4>
          <p class="text-xs sm:text-sm ${activeTheme.titleColor} mt-1 font-semibold italic">Driving Question: "${activeMethod.drivingQuestion}"</p>
        </div>
        <div class="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 text-right">
          <span class="text-[11px] text-slate-400 block uppercase">Primary Key Actors</span>
          <span class="text-xs font-bold text-white">${activeMethod.primaryActors}</span>
        </div>
      </div>

      <!-- Execution Walkthrough Steps -->
      <div>
        <h5 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Concrete Execution Process</h5>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          ${activeMethod.stepsTaken.map((step, idx) => `
            <div class="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-slate-800 text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                ${idx + 1}
              </span>
              <p class="text-slate-300 leading-relaxed">${step}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Concrete Artifact Produced -->
      <div>
        <div class="flex items-center justify-between text-xs font-mono font-bold text-slate-400 bg-slate-950 px-4 py-2 rounded-t-xl border-t border-x border-slate-800">
          <span>Concrete Artifact: ${activeMethod.concreteArtifact.fileName}</span>
          <span class="${activeTheme.titleColor}">${activeMethod.concreteArtifact.type}</span>
        </div>
        <pre class="bg-black/95 p-4 rounded-b-xl border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto max-h-72"><code>${escapeHtml(activeMethod.concreteArtifact.content)}</code></pre>
      </div>

      <!-- Benefits & ROI Column -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2">
        <div class="lg:col-span-8 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <h5 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Specific Benefits Achieved</h5>
          <ul class="space-y-1.5 text-xs text-slate-300">
            ${activeMethod.benefitsAchieved.map(b => `
              <li class="flex items-start gap-2">
                <span class="text-emerald-400 font-bold">✓</span>
                <span>${b}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        <div class="lg:col-span-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-center">
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Measured Business ROI</span>
          <p class="text-sm font-extrabold text-cyan-300 leading-snug">${activeMethod.roiMetric}</p>
        </div>
      </div>

    </div>
  `;

  // 3. Holistic Synergy Synthesis
  if (synContainer && cs.holisticSynergy) {
    synContainer.innerHTML = `
      <div class="border-b border-cyan-500/30 pb-4 mb-4">
        <span class="text-xs font-bold font-mono text-cyan-400 uppercase">The Tri-Methodology Convergence</span>
        <h4 class="text-lg sm:text-xl font-bold text-white mt-1">${cs.holisticSynergy.summary}</h4>
        <p class="text-xs text-slate-300 mt-1">Rather than arguing which is 'best', high-performing teams combine all three into a single synchronized workflow:</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        ${cs.holisticSynergy.breakdown.map((stage, idx) => {
          let bdr = 'border-amber-500/40 bg-amber-950/20';
          let txt = 'text-amber-400';
          if (idx === 1) {
            bdr = 'border-cyan-500/40 bg-cyan-950/20';
            txt = 'text-cyan-400';
          } else if (idx === 2) {
            bdr = 'border-emerald-500/40 bg-emerald-950/20';
            txt = 'text-emerald-400';
          }
          return `
            <div class="p-4 rounded-xl border ${bdr} space-y-2">
              <span class="font-bold ${txt} text-sm block">${stage.stage}</span>
              <p class="text-slate-300"><strong class="text-white">Action:</strong> ${stage.action}</p>
              <div class="pt-2 border-t border-slate-800 text-slate-400">
                <strong class="text-slate-300">Solves:</strong> ${stage.solves}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}

// -------------------------------------------------------------
// Dedicated Visual Flowcharts Gallery Renderer
// -------------------------------------------------------------
function renderAllVisualFlowcharts() {
  const container = document.getElementById('visual-flowcharts-gallery');
  if (!container) return;

  container.innerHTML = `
    <!-- 1. SDD Flowchart -->
    <div class="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/40 glow-cyan space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span class="text-xs font-bold font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800 uppercase">
            PARADIGM 1: SPECIFICATION-DRIVEN DEVELOPMENT (SDD)
          </span>
          <h3 class="text-xl sm:text-2xl font-black text-white mt-2">The Concurrent Team Parallelization Pipeline</h3>
          <p class="text-xs sm:text-sm text-slate-300 mt-1">From machine-readable specification to auto-generated mocks, SDKs, and drift-free production delivery.</p>
        </div>
        <span class="text-xs font-mono text-cyan-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          Velocity Boost: 3.5x Concurrency
        </span>
      </div>

      <!-- Flowchart Visual Steps -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        
        <!-- Step 1 -->
        <div class="bg-slate-900/90 p-5 rounded-2xl border border-cyan-500/40 flex flex-col justify-between space-y-3 relative">
          <div>
            <div class="flex items-center justify-between">
              <span class="w-7 h-7 rounded-lg bg-cyan-500 text-slate-950 font-black font-mono text-xs flex items-center justify-center">1</span>
              <span class="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">Design Phase</span>
            </div>
            <h4 class="font-bold text-white text-sm mt-3">Formal Contract Authoring</h4>
            <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">Architects model entities, idempotency headers, numerical constraints, and error envelopes.</p>
          </div>
          <div class="pt-3 border-t border-slate-800 text-[11px] font-mono text-cyan-300">
            📄 openapi.yaml / .tsp
          </div>
        </div>

        <!-- Step 2 -->
        <div class="bg-slate-900/90 p-5 rounded-2xl border border-indigo-500/40 flex flex-col justify-between space-y-3 relative">
          <div>
            <div class="flex items-center justify-between">
              <span class="w-7 h-7 rounded-lg bg-indigo-500 text-white font-black font-mono text-xs flex items-center justify-center">2</span>
              <span class="text-[10px] font-mono text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">Governance Gate</span>
            </div>
            <h4 class="font-bold text-white text-sm mt-3">Automated Spectral Lint</h4>
            <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">CI blocks unapproved changes. Verifies naming rules, security schemes, and zero contract drift.</p>
          </div>
          <div class="pt-3 border-t border-slate-800 text-[11px] font-mono text-indigo-300">
            🛡️ .spectral.yaml Gate
          </div>
        </div>

        <!-- Step 3 -->
        <div class="bg-slate-900/90 p-5 rounded-2xl border border-emerald-500/40 flex flex-col justify-between space-y-3 relative">
          <div>
            <div class="flex items-center justify-between">
              <span class="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-black font-mono text-xs flex items-center justify-center">3</span>
              <span class="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">Concurrent Dev</span>
            </div>
            <h4 class="font-bold text-white text-sm mt-3">Prism Live Mock Server</h4>
            <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">Frontend (React) and Mobile (iOS/Android) start UI implementation on Day 1 against live mocks.</p>
          </div>
          <div class="pt-3 border-t border-slate-800 text-[11px] font-mono text-emerald-300">
            🎭 Prism Mock :4010
          </div>
        </div>

        <!-- Step 4 -->
        <div class="bg-slate-900/90 p-5 rounded-2xl border border-violet-500/40 flex flex-col justify-between space-y-3 relative">
          <div>
            <div class="flex items-center justify-between">
              <span class="w-7 h-7 rounded-lg bg-violet-500 text-white font-black font-mono text-xs flex items-center justify-center">4</span>
              <span class="text-[10px] font-mono text-violet-400 bg-violet-950/80 px-2 py-0.5 rounded border border-violet-800">Auto-Gen</span>
            </div>
            <h4 class="font-bold text-white text-sm mt-3">Code & SDK Synthesis</h4>
            <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">Orval & OpenAPI-TS generate TypeScript DTOs, Zod request validators, and client SDKs automatically.</p>
          </div>
          <div class="pt-3 border-t border-slate-800 text-[11px] font-mono text-violet-300">
            ⚙️ 0 Handwritten DTOs
          </div>
        </div>

        <!-- Step 5 -->
        <div class="bg-slate-900/90 p-5 rounded-2xl border border-cyan-500/40 flex flex-col justify-between space-y-3 relative">
          <div>
            <div class="flex items-center justify-between">
              <span class="w-7 h-7 rounded-lg bg-cyan-400 text-slate-950 font-black font-mono text-xs flex items-center justify-center">5</span>
              <span class="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">Verification</span>
            </div>
            <h4 class="font-bold text-white text-sm mt-3">Contract Testing & Fuzzing</h4>
            <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">Schemathesis & Pact fuzz test the runtime backend against the spec to guarantee zero drift.</p>
          </div>
          <div class="pt-3 border-t border-slate-800 text-[11px] font-mono text-cyan-300">
            🚀 100% Contract Pass
          </div>
        </div>

      </div>

      <div class="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3">
        <span>💡 <strong>SDD Insight:</strong> In traditional development, Frontend and Mobile teams wait 3–4 weeks for Backend deployment. With SDD, all teams code concurrently from Day 1.</span>
        <span class="font-bold text-cyan-400 font-mono">Teams Unblocked: Day 1</span>
      </div>
    </div>

    <!-- 2. TDD Flowchart -->
    <div class="glass-panel p-6 sm:p-8 rounded-2xl border border-emerald-500/40 glow-emerald space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span class="text-xs font-bold font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800 uppercase">
            PARADIGM 2: TEST-DRIVEN DEVELOPMENT (TDD)
          </span>
          <h3 class="text-xl sm:text-2xl font-black text-white mt-2">The Micro-Feedback Red-Green-Refactor Engine</h3>
          <p class="text-xs sm:text-sm text-slate-300 mt-1">Continuous sub-second verification loop driving internal algorithmic design and regression safety.</p>
        </div>
        <span class="text-xs font-mono text-emerald-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          Cycle Time: 2–5 Mins
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Red -->
        <div class="bg-slate-900/90 p-6 rounded-2xl border border-red-500/40 space-y-3 text-center">
          <div class="w-14 h-14 mx-auto rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-black text-2xl border border-red-500/40 animate-pulse">
            🔴
          </div>
          <span class="text-xs font-bold font-mono uppercase text-red-400 tracking-wider">Step 1 (1–2 mins)</span>
          <h4 class="text-lg font-extrabold text-white">RED: Failing Test</h4>
          <p class="text-xs text-slate-300 leading-relaxed">Author a single, precise unit test asserting the desired behavior before implementation exists. Watch it fail for the expected reason.</p>
          <div class="pt-2 text-[11px] font-mono text-red-300 bg-black/60 p-2 rounded-lg border border-red-900">
            [FAIL] Assertion Mismatch (Expected vs Actual)
          </div>
        </div>

        <!-- Green -->
        <div class="bg-slate-900/90 p-6 rounded-2xl border border-emerald-500/40 space-y-3 text-center">
          <div class="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-2xl border border-emerald-500/40">
            🟢
          </div>
          <span class="text-xs font-bold font-mono uppercase text-emerald-400 tracking-wider">Step 2 (1–3 mins)</span>
          <h4 class="text-lg font-extrabold text-white">GREEN: Minimal Code</h4>
          <p class="text-xs text-slate-300 leading-relaxed">Write the simplest, quickest production code to make the failing test pass. Do not speculate or add premature optimizations.</p>
          <div class="pt-2 text-[11px] font-mono text-emerald-300 bg-black/60 p-2 rounded-lg border border-emerald-900">
            [PASS] All Assertions Green in 12ms
          </div>
        </div>

        <!-- Refactor -->
        <div class="bg-slate-900/90 p-6 rounded-2xl border border-cyan-500/40 space-y-3 text-center">
          <div class="w-14 h-14 mx-auto rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-2xl border border-cyan-500/40">
            🔵
          </div>
          <span class="text-xs font-bold font-mono uppercase text-cyan-400 tracking-wider">Step 3 (2–4 mins)</span>
          <h4 class="text-lg font-extrabold text-white">REFACTOR: Cleanse Design</h4>
          <p class="text-xs text-slate-300 leading-relaxed">Eliminate duplication, extract strategy maps, and improve names. The unit test suite serves as an unbreakable safety net.</p>
          <div class="pt-2 text-[11px] font-mono text-cyan-300 bg-black/60 p-2 rounded-lg border border-cyan-900">
            Clean Modular Architecture & 0 Smells
          </div>
        </div>

      </div>

      <div class="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3">
        <span>💡 <strong>TDD Insight:</strong> TDD is not just a testing technique; it is a software design technique that naturally produces decoupled, modular classes.</span>
        <span class="font-bold text-emerald-400 font-mono">Feedback: &lt; 200ms</span>
      </div>
    </div>

    <!-- 3. BDD Flowchart -->
    <div class="glass-panel p-6 sm:p-8 rounded-2xl border border-amber-500/40 glow-amber space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span class="text-xs font-bold font-mono text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800 uppercase">
            PARADIGM 3: BEHAVIOR-DRIVEN DEVELOPMENT (BDD)
          </span>
          <h3 class="text-xl sm:text-2xl font-black text-white mt-2">The Outside-In Business Collaboration Funnel</h3>
          <p class="text-xs sm:text-sm text-slate-300 mt-1">Bridging the communication chasm using ubiquitous language and living documentation.</p>
        </div>
        <span class="text-xs font-mono text-amber-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          Stakeholders: The Three Amigos
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div class="bg-slate-900/90 p-5 rounded-2xl border border-amber-500/40 space-y-3">
          <div class="flex items-center justify-between">
            <span class="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black font-mono text-xs flex items-center justify-center">1</span>
            <span class="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">Discovery</span>
          </div>
          <h4 class="font-bold text-white text-sm mt-2">The Three Amigos</h4>
          <p class="text-xs text-slate-300 leading-relaxed">Product Owner (Business), Developer (Feasibility), and QA (Edge cases) explore user rules via Example Mapping.</p>
          <div class="text-[10px] font-mono text-amber-300 bg-slate-950 p-1.5 rounded">Actors: PO + QA + Dev</div>
        </div>

        <div class="bg-slate-900/90 p-5 rounded-2xl border border-indigo-500/40 space-y-3">
          <div class="flex items-center justify-between">
            <span class="w-7 h-7 rounded-lg bg-indigo-500 text-white font-black font-mono text-xs flex items-center justify-center">2</span>
            <span class="text-[10px] font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">Formulation</span>
          </div>
          <h4 class="font-bold text-white text-sm mt-2">Gherkin Formulation</h4>
          <p class="text-xs text-slate-300 leading-relaxed">Draft executable .feature files using standard Given/When/Then ubiquitous language that both business and tech understand.</p>
          <div class="text-[10px] font-mono text-indigo-300 bg-slate-950 p-1.5 rounded">Artifact: .feature files</div>
        </div>

        <div class="bg-slate-900/90 p-5 rounded-2xl border border-emerald-500/40 space-y-3">
          <div class="flex items-center justify-between">
            <span class="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-black font-mono text-xs flex items-center justify-center">3</span>
            <span class="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">Automation</span>
          </div>
          <h4 class="font-bold text-white text-sm mt-2">Step Definition Glue</h4>
          <p class="text-xs text-slate-300 leading-relaxed">Engineers map natural language steps to Cucumber, Playwright, or Cypress test automation drivers.</p>
          <div class="text-[10px] font-mono text-emerald-300 bg-slate-950 p-1.5 rounded">Drivers: Cucumber / Playwright</div>
        </div>

        <div class="bg-slate-900/90 p-5 rounded-2xl border border-cyan-500/40 space-y-3">
          <div class="flex items-center justify-between">
            <span class="w-7 h-7 rounded-lg bg-cyan-400 text-slate-950 font-black font-mono text-xs flex items-center justify-center">4</span>
            <span class="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">Verification</span>
          </div>
          <h4 class="font-bold text-white text-sm mt-2">Living Documentation</h4>
          <p class="text-xs text-slate-300 leading-relaxed">CI execution generates interactive HTML living documentation verified by auditors and non-technical stakeholders.</p>
          <div class="text-[10px] font-mono text-cyan-300 bg-slate-950 p-1.5 rounded">Output: Allure Living Docs</div>
        </div>

      </div>

      <div class="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3">
        <span>💡 <strong>BDD Insight:</strong> Traditional specs rot in wikis. BDD scenarios are executed continuously on every release, guaranteeing documentation is always 100% accurate.</span>
        <span class="font-bold text-amber-400 font-mono">0 Requirements Drift</span>
      </div>
    </div>

    <!-- 4. Unified Synthesis Pyramid -->
    <div class="glass-panel p-6 sm:p-8 rounded-2xl border border-indigo-500/40 space-y-6">
      <div class="border-b border-slate-800 pb-4">
        <span class="text-xs font-bold font-mono text-indigo-400 uppercase">ENTERPRISE SYNTHESIS BLUEPRINT</span>
        <h3 class="text-xl sm:text-2xl font-black text-white mt-1">The Modern Development Pyramid: Combining All Three</h3>
        <p class="text-xs sm:text-sm text-slate-300 mt-1">How high-performing engineering teams stack BDD, SDD, and TDD into an unbreakable development lifecycle.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-amber-950/20 p-5 rounded-2xl border border-amber-500/40 space-y-2">
          <span class="text-xs font-bold font-mono text-amber-400 uppercase">Layer 3: Top</span>
          <h4 class="text-base font-extrabold text-white">BDD (Business Value)</h4>
          <p class="text-xs text-slate-300">Answers: <em>'Are we building the right user feature?'</em> Validates customer journeys and business acceptance criteria.</p>
        </div>

        <div class="bg-cyan-950/20 p-5 rounded-2xl border border-cyan-500/40 space-y-2">
          <span class="text-xs font-bold font-mono text-cyan-400 uppercase">Layer 2: Middle</span>
          <h4 class="text-base font-extrabold text-white">SDD (System Contract)</h4>
          <p class="text-xs text-slate-300">Answers: <em>'What is the contract between systems?'</em> Decouples microservices, creates mocks, and grounds AI agents.</p>
        </div>

        <div class="bg-emerald-950/20 p-5 rounded-2xl border border-emerald-500/40 space-y-2">
          <span class="text-xs font-bold font-mono text-emerald-400 uppercase">Layer 1: Foundation</span>
          <h4 class="text-base font-extrabold text-white">TDD (Algorithmic Logic)</h4>
          <p class="text-xs text-slate-300">Answers: <em>'Is the internal code mathematically correct?'</em> Sub-second micro-feedback loops ensuring zero regressions.</p>
        </div>
      </div>
    </div>
  `;
}
