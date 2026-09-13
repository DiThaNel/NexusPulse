# NexusPulse — Operations & Workflow Intelligence SaaS

> **An enterprise-grade B2B SaaS platform engineered for real-time workflow orchestration, interactive Kanban project management, and automated operations telemetry.**

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.4%20(Turbopack)-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.8-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20Strict-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![TanStack Query v5](https://img.shields.io/badge/TanStack%20Query-v5.102-ff4154?style=flat&logo=reactquery)](https://tanstack.com/query/latest)
[![Vitest](https://img.shields.io/badge/Vitest-52%20Tests%20Passing%20(100%25)-6e9f18?style=flat&logo=vitest)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Built with strict enterprise engineering standards, clean architecture, zero-hydration SVG visualizers, optimistic mutations with automatic rollback, Edge security middleware, and a seamless bilingual internationalization engine (English / Spanish).

---

## 📑 Table of Contents

1. [Key Features](#-key-features)
2. [Core Architecture & Tech Stack](#-core-architecture--tech-stack)
3. [Deployment to Vercel](#-deployment-to-vercel)
4. [Getting Started (Local Development)](#-getting-started-local-development)
5. [Automated Testing Suite](#-automated-testing-suite)
6. [Project Directory Structure](#-project-directory-structure)
7. [Engineering Roadmap](#-engineering-roadmap)
8. [Comprehensive Documentation](#-comprehensive-documentation)

---

## 🚀 Key Features

### 1. Interactive Kanban Board (`@dnd-kit` + Zod)
* **Accessible Pointer & Keyboard Drag-and-Drop**: Multi-column sorting (`Backlog`, `To Do`, `In Progress`, `In Review`, `Done`) with collision detection (`closestCorners`).
* **Optimistic UI with 0ms Perceived Latency**: Powered by **TanStack Query v5**. Task transitions render immediately on drop; network errors trigger automatic rollback with contextual amber toast notifications.
* **Strict Runtime Schema Validation**: Every form and API payload is validated with **Zod**, preventing malformed data or unauthorized state transitions.

### 2. Reactive Automations & Workflows Engine
* **Multi-Stage Visual Pipelines**: 3-stage execution flow (**Trigger** $\rightarrow$ **Evaluation Rule** $\rightarrow$ **Dispatched Action**).
* **In-App Event Triggers**: Moving any task to `Done` instantly triggers matching active workflows (e.g. `In-App Alert on Task Completion`), dispatching live toasts and recording alerts into the **Automation Center**.
* **Real-Time Execution Drawer**: Live terminal console with sequential timestamps, step highlight animations, and manual trigger simulation.

### 3. Real-Time Operational Telemetry & Analytics Dashboard
* **Zero-Hydration SVG Charts Engine**: Pure mathematical vector charts (cubic Bezier curves, area gradients, and trigonometric donut rings) with **zero SSR/CSR hydration mismatches**.
* **Live Telemetry Feed**: Real-time operational event stream tracking millisecond latencies, HTTP status codes, and actor attribution with live pulsing status indicators.
* **Interactive Tooltips & Filtering**: Powered by **Framer Motion** spring physics for fluid hover inspections across 7-day, 30-day, and 90-day aggregation cycles.

### 4. Defense-in-Depth Security Architecture
* **Next.js Edge Middleware**: Perimeter route protection across `/board`, `/workflows`, `/analytics`, and `/settings`.
* **HttpOnly Session Cookies**: Hardened cookies (`SameSite=Strict`, `Path=/`, 7-day TTL) completely inaccessible to client-side JavaScript, mitigating XSS session hijacking.
* **Strict Defensive HTTP Headers**: CSP, HSTS (`max-age=63072000`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Permissions-Policy`.
* **Multi-Persona Role-Based Access Control (RBAC)**:
  * **Gabriel Gonçalves (`admin`)**: Full read/write access and platform administration.
  * **Elena Rostova (`product_manager`)**: Project & task orchestration.
  * **Lucas Silva (`viewer`)**: Read-only exploration (mutation buttons locked with padlocks).

### 5. Full Bilingual Internationalization (i18n)
* **Real-Time Locale Switching**: Instant header toggle between **English** (`en`) and **Spanish** (`es`) with zero page reload.
* **Deep Dynamic Card Localization**: Automatically localizes seed Kanban tasks, workflow descriptions, relative timestamps (*"Just now"* / *"Justo ahora"*, *"Yesterday at 00:00"* / *"Ayer a las 00:00"*), drawer console logs, and telemetry action streams.

---

## 🛠️ Core Architecture & Tech Stack

| Technology | Version | Purpose in NexusPulse |
| :--- | :--- | :--- |
| **Next.js** | `16.3.4` | App Router, Server Components, Streaming SSR, API Route Handlers, and Turbopack bundler. |
| **React** | `19.2.8` | Modern concurrent primitives (`useTransition`, `useOptimistic`, native ref forwarding). |
| **TypeScript** | `5.x Strict` | 100% type safety, strict domain interfaces, zero implicit `any`. |
| **Tailwind CSS v4** | `4.x` | CSS-first architecture (`@theme`), HSL semantic design tokens, fluid Dark/Light modes. |
| **TanStack Query v5** | `5.102.8` | Server state management, 60s stale cache, 0ms optimistic updates, and automatic rollback. |
| **Zustand** | `5.0.15` | Decoupled client UI state (modals, search filters, simulation toggles, notifications). |
| **@dnd-kit** | `6.3.1` | Accessible drag-and-drop sensor pipeline with pointer restriction and smooth drag overlays. |
| **Zod** | `4.6.2` | Runtime validation for task schemas, workflow payloads, and API contracts. |
| **Framer Motion** | `13.2.0` | Tactile spring physics for modals, Command Palette (`⌘K`), popLayout toasts, and SVG tooltips. |
| **Vitest & RTL** | `5.0.0` / `16.3.3` | Ultra-fast ESM testing suite with isolated providers and 100% pass rate across 52 tests. |

---

## ☁️ Deployment to Vercel

NexusPulse is architected for zero-configuration, native deployment on **Vercel**.

### Option A: 1-Click Git Integration (Recommended for Recruiters)
1. Push your repository commits to GitHub:
   ```bash
   git push origin main
   ```
2. Navigate to [vercel.com/new](https://vercel.com/new).
3. Import the `DiThaNel/NexusPulse` repository.
4. Framework preset **Next.js** is automatically detected. Click **Deploy**.
5. Your production SaaS app is live globally on Vercel's Edge Network with automatic CI/CD preview deployments!

### Option B: Deploy via Vercel CLI
```bash
# Authenticate with Vercel
npx vercel login

# Deploy a preview build
npx vercel

# Deploy directly to production
npx vercel --prod
```

The repository includes a pre-configured [vercel.json](./vercel.json) ensuring clean routing and header handling.

---

## 💻 Getting Started (Local Development)

### Prerequisites
* **Node.js**: v18.17+ or v20+ (tested on Node v24)
* **npm** / **pnpm** / **yarn**

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/DiThaNel/NexusPulse.git
cd NexusPulse

# 2. Install dependencies
npm install

# 3. Start local development server (with Turbopack)
npm run dev

# 4. Open http://localhost:3000 in your browser
```

### Pre-Configured Demo Accounts (1-Click Login)
* **Administrator**: `admin@nexuspulse.io` / `admin123` (Gabriel Gonçalves — full privileges)
* **Project Manager**: `pm@nexuspulse.io` / `pm123` (Elena Rostova — project & task management)
* **Auditor / Viewer**: `viewer@nexuspulse.io` / `viewer123` (Lucas Silva — read-only mode)

---

## 🧪 Automated Testing Suite

NexusPulse features a comprehensive, high-speed test suite powered by **Vitest v5** and **React Testing Library v16**.

```bash
# Run all 16 test suites (52 tests) once
npm run test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage Highlights:
* **Zod Schemas**: Strict validation of task lengths, priority enums, workflow event triggers, and tag sanitization.
* **Zustand Stores**: Task CRUD operations, optimistic rollback states, auth RBAC permissions, and notification streams.
* **Component RTL Tests**: Bilingual rendering across Spanish and English, Viewer padlock enforcement, and KPI inverse polarities.
* **Telemetry & SVG Visualizers**: Ring segment trigonometry, Bezier curve timelines, circular log buffers (max 25 entries), and live telemetry localization.

---

## 📁 Project Directory Structure

```
nexus-pulse/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/login/         # Enterprise Login with 1-click demo persona switcher
│   │   ├── api/                  # REST Route Handlers (tasks, workflows, analytics, auth)
│   │   ├── board/                # Interactive Kanban Board view
│   │   ├── workflows/            # Automations & Pipeline Drawer view
│   │   ├── analytics/            # Operational Metrics & Live Telemetry view
│   │   ├── settings/             # Security Matrix & RBAC audit view
│   │   ├── globals.css           # Tailwind v4 theme tokens (HSL semantic system)
│   │   ├── layout.tsx            # Root layout with ThemeProvider & LanguageProvider
│   │   └── page.tsx              # Overview page with 8 Core Architectural Pillars
│   ├── components/
│   │   ├── analytics/            # SVG charts (Throughput, Donut, Workload, Live Feed)
│   │   ├── kanban/               # Kanban board, columns, sortable cards, toolbar, modal
│   │   ├── layout/               # AppShell, Sidebar, Header, Breadcrumbs, CommandPalette
│   │   ├── ui/                   # Reusable atomic CVA primitives (Button, Badge, Card)
│   │   └── workflows/            # Workflow cards, pipeline drawer, creation modal
│   ├── hooks/                    # TanStack Query custom mutation & query hooks
│   ├── lib/                      # Translations engine, server state seeds, validations
│   ├── locales/                  # Type-safe bilingual dictionaries (es.ts, en.ts)
│   ├── stores/                   # Zustand client stores (UI, Auth, Tasks, Notifications)
│   └── types/                    # Domain models, strict TypeScript interfaces
├── tests/                        # Vitest & RTL test suites (16 files, 52 tests)
├── docs/
│   └── WALKTHROUGH.md            # Complete Phase-by-Phase Engineering Log
├── next.config.ts                # Production security headers (CSP, HSTS, DENY)
├── vercel.json                   # Vercel deployment configuration
└── tsconfig.json                 # Strict TypeScript configuration
```

---

## 🗺️ Engineering Roadmap

- [x] **Phase 1:** Core Foundations, Strict TypeScript, Tailwind v4 Design Tokens, ThemeProvider, Bilingual i18n Engine (ES/EN), and CVA Atomic Components.
- [x] **Phase 2:** SaaS Application Shell, Collapsible Responsive Sidebar, Dynamic Breadcrumbs, Command Palette (`⌘K`), and Multi-User RBAC.
- [x] **Phase 3:** Interactive Kanban Board (`@dnd-kit`), Zustand CRUD State, and Zod Runtime Schema Validation.
- [x] **Security Layer:** Next.js Edge Middleware Route Protection, Secure `HttpOnly` Session Cookies, and Defensive HTTP Security Headers.
- [x] **Phase 4:** Asynchronous Server State & Optimistic UI with TanStack Query v5 (0ms latency, automatic rollback & spring modal physics).
- [x] **Phase 5:** Reactive Automations & Workflows Engine (Visual Pipelines, Event Triggers, and In-App Toast Dispatches).
- [x] **Phase 6:** Real-Time Operational Telemetry & Analytics Dashboard (Zero-Hydration SVG Charts & Live Stream Feed).
- [x] **Special Module:** Comprehensive Internationalization (i18n) & Dynamic Bilingual Card Localization.
- [x] **Phase 7:** Automated Testing Suite with Vitest & React Testing Library (16 test suites, 52 tests, 100% passing).
- [x] **Phase 8:** Final Production Build Optimization, Zero-Hydration Audit, Vercel Deployment Readiness & Documentation.
- [ ] **Phase 9 (Post-MVP Scheduled Milestone):** Mobile App via Hybrid / Native Wrapper: Capacitor (Ionic) *(Haptic drag-and-drop feedback, native mobile push notifications, and iOS/Android application builds)*.

---

## 📖 Comprehensive Documentation

For a deep dive into architectural design decisions, performance benchmarks, and phase-by-phase implementation notes, please refer to the technical walkthrough:

👉 [**docs/WALKTHROUGH.md**](./docs/WALKTHROUGH.md)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
