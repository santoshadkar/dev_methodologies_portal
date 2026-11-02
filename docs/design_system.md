# Design System & UI/UX Specifications

## 1. Design Tokens & Visual Hierarchy

### 1.1 Color Palette
The portal uses an ultra-modern, high-contrast executive theme with support for light and dark modes:
- **Primary / SDD Accent**: Electric Cyan & Indigo (`#06b6d4`, `#6366f1`) - represents modern, contract-centric, AI-native specifications.
- **TDD Accent**: Emerald Green & Crimson Red (`#10b981`, `#ef4444`) - represents the classic Red-Green-Refactor testing cycle.
- **BDD Accent**: Amber & Violet (`#f59e0b`, `#8b5cf6`) - represents human-readable collaboration, feature stories, and behavioral scenarios.
- **Neutral Dark Canvas**: `#090d16` (Deep Space Navy), `#0f172a` (Card Slate), `#1e293b` (Border/Surface).
- **Neutral Light Canvas**: `#f8fafc` (Ice Gray), `#ffffff` (Card White), `#e2e8f0` (Border).
- **Text Tokens**:
  - Dark Mode: Primary `#f8fafc`, Muted `#94a3b8`, Accent `#38bdf8`.
  - Light Mode: Primary `#0f172a`, Muted `#64748b`, Accent `#0284c7`.

### 1.2 Typography
- **Heading Font**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, sans-serif.
- **Body Font**: `Inter`, system-ui, sans-serif (font-size: 15px, line-height: 1.6).
- **Code & Specs Monospace**: `JetBrains Mono`, `Fira Code`, `Consolas`, monospace.

### 1.3 Spacing & Layout Grid
- 12-column responsive grid container with max-width `1440px`.
- Fluid gap hierarchy: `gap-4` (16px), `gap-6` (24px), `gap-8` (32px).
- Border radius: `rounded-xl` (12px), `rounded-2xl` (16px) for cards, `rounded-full` for badges.
- Glassmorphism backdrop blur: `backdrop-blur-md bg-opacity-80 border border-slate-700/50`.

---

## 2. Component Specifications

### 2.1 Navigation & Methodology Header
- Floating glassmorphic header with navigation tabs:
  - 📖 **Overview & Guide**
  - 📊 **Comparison Matrix**
  - 🧠 **Interactive Advisor**
  - ⚡ **Live Simulators (TDD, BDD, SDD)**
  - 🏢 **Enterprise Use Cases**
  - 🔌 **API Explorer**
- Quick stats pill ribbon showing active methodology count, dimensions, and live interactive sandbox indicator.

### 2.2 Interactive Simulators UI
- **TDD Tab**:
  - Code editor preview (Test suite vs Implementation).
  - Step buttons: "1. Red (Fail)", "2. Green (Pass)", "3. Refactor (Clean)".
  - Console terminal output showing test execution results.
- **BDD Tab**:
  - Gherkin feature definition panel (`Feature`, `Scenario`, `Given`, `When`, `Then`).
  - Interactive Step runner with animated checkmarks, latency stats, and variable context inspector.
- **SDD Tab**:
  - Specification editor (`OpenAPI 3.1` / Schema).
  - Interactive "Payload Validator" and "Live Code Synthesizer" (TypeScript types & Mock client generation).

### 2.3 Interactive Advisor UI
- Step-by-step 5-question multi-choice wizard with dynamic weighting indicators.
- Instant graphical fit breakdown (radar/gauge cards for SDD, TDD, and BDD) with tailored recommendation playbook.
