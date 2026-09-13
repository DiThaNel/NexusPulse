# NexusPulse — Engineering Log & Development Phases

This document serves as the official technical engineering record for **NexusPulse**. It details the architectural decisions, design patterns, implemented modules, and quality assurance audits across each phase of development.

---

## Table of Contents

1. [Tech Stack & Tool Catalog: In-Depth Purpose and Role](#tech-stack--tool-catalog-in-depth-purpose-and-role)
2. [Phase 1: Foundations, Design System & Bilingual Support](#phase-1-foundations-design-system--bilingual-support)
3. [Phase 2: SaaS Application Shell, Command Palette & RBAC](#phase-2-saas-application-shell-command-palette--rbac)
4. [Phase 3: Interactive Kanban Board with Drag & Drop](#phase-3-interactive-kanban-board-with-drag--drop)
5. [Security Layer: Edge Middleware, HttpOnly Cookies & Defensive Headers](#security-layer-edge-middleware-httponly-cookies--defensive-headers)
6. [Technical Resilience: Permanent Resolution of SSR/CSR Hydration Mismatches](#technical-resilience-permanent-resolution-of-ssrcsr-hydration-mismatches)
7. [Phase 4: Asynchronous State Management & Optimistic UI (TanStack Query v5)](#phase-4-asynchronous-state-management--optimistic-ui-tanstack-query-v5)
8. [Phase 5: Reactive Automations & Workflows Engine](#phase-5-reactive-automations--workflows-engine)
9. [Phase 6: Real-Time Operational Metrics & Zero-Hydration SVG Telemetry](#phase-6-real-time-operational-metrics--zero-hydration-svg-telemetry)
10. [Special Module: Comprehensive Internationalization (i18n) & Dynamic Card Localization](#special-module-comprehensive-internationalization-i18n--dynamic-card-localization)
11. [Phase 7: Automated Testing Suite with Vitest & React Testing Library](#phase-7-automated-testing-suite-with-vitest--react-testing-library)
12. [Phase 8: Final Production Build, Performance Audit & Vercel Deployment Readiness](#phase-8-final-production-build-performance-audit--vercel-deployment-readiness)
13. [Updated Roadmap & Upcoming Milestones](#updated-roadmap--upcoming-milestones)

---

## Tech Stack & Tool Catalog: In-Depth Purpose and Role

Below is the complete catalog of core technologies, libraries, and utilities utilized across **NexusPulse**, with technical justification for each selection:

| Technology / Tool | Version | Architectural Role & Selection Rationale |
| :--- | :--- | :--- |
| **Next.js (App Router & Turbopack)** | `16.3.4` | **Full-Stack Architectural Foundation**: Provides high-throughput Server-Side Rendering (SSR), sub-second compilation with Turbopack, internal REST API route handlers (`/api/tasks`, `/api/workflows`, `/api/analytics`, `/api/auth/*`), and perimeter Edge Middleware. |
| **React** | `19.2.8` | **Reactive UI Engine**: Concurrent rendering primitives, modern hooks (`useTransition`, `useOptimistic`), native `ref` forwarding without boilerplate, and optimized reconciliation. |
| **TypeScript (Strict Mode)** | `5.x` | **Static Type Safety**: Immutable domain contracts (`User`, `Task`, `Column`, `SessionCookiePayload`, `TelemetryLog`), automatic type inference via `z.infer`, and total elimination of implicit `any` across the codebase. |
| **Tailwind CSS v4 (`@tailwindcss/postcss`)** | `4.x` | **Next-Generation Styling Engine**: CSS-first configuration (`@theme`) removing heavy JavaScript config overhead. Semantic HSL color tokens (`background`, `foreground`, `border`, `card`, `primary`) supporting instant Dark/Light mode switching and ultra-subtle borders (`border-border/60`). |
| **TanStack Query v5 (`@tanstack/react-query`)** | `5.102.8` | **Server State Management**: Reactive client cache, background stale-while-revalidate (`staleTime: 60s`), optimistic updates with **0ms perceived latency** (`onMutate`), previous state snapshots, and **automatic rollback** on network drops or HTTP 500 errors (`onError`). |
| **Zustand** | `5.0.15` | **Client UI State Management**: Lightweight, decoupled in-memory stores for modal visibility (`TaskModal`, `CommandPalette`), collapsible responsive sidebar state, live text/priority/assignee filtering, and simulated error switches. |
| **@dnd-kit (Core, Sortable, Utilities)** | `6.3.1` / `10.0.0` | **Accessible Drag & Drop Engine**: Pointer and keyboard sensor pipelines for the Kanban board. Collision detection (`closestCorners`), cross-column item sorting, pointer activation distance restriction (`5px`), and smooth floating previews via `DragOverlay`. |
| **Zod** | `4.6.2` | **Runtime Validation & Sanitization**: Strict schema validation for user input forms, API endpoints, and workflow triggers (`src/lib/validations/task.ts`), preventing malformed data, forbidden characters, or corrupt payloads. |
| **Framer Motion** | `13.2.0` | **Micro-Interactions & Spring Physics**: Tactile spring animations across modals (`TaskModal`, `CommandPalette`, mobile drawer) orchestrated via `<AnimatePresence>` to eliminate abrupt unmounts, and floating toast notifications (`popLayout`). |
| **cmdk** | `1.1.1` | **Accessible Command Palette (`⌘K` / `Ctrl+K`)**: High-speed keyboard navigation interface for theme toggling, language switching, task creation, and instant view routing. |
| **Lucide React** | `1.45.0` | **Minimalist Iconography**: Tree-shakeable SVG vector icons with 1.5–2px stroke weights, delivering elegance without inflating bundle size. |
| **Next-Themes & React 19 ThemeProvider** | `0.4.6` | **Light / Dark Theme Management**: Native `.dark` class control on the root `<html>` element synchronized with `localStorage`, fully compatible with React 19 hydration architecture without vulnerable inline scripts. |
| **Bilingual i18n Engine (In-House)** | Native | **Bilingual Internationalization**: Type-safe context without bulky external dependencies, supporting English and Spanish with local persistence and real-time reactive switching. |
| **Edge Middleware & Security Headers** | Native Next.js | **Perimeter Defense-in-Depth**: Protection of private routes (`/board`, `/workflows`, `/analytics`, `/settings`), secure session cookies (`HttpOnly`, `SameSite=Strict`), and defensive HTTP header injection (CSP, HSTS, `X-Frame-Options: DENY`). |
| **Zero-Hydration SVG Charts Engine** | Native / Framer Motion | **Analytical Visualization Engine**: Pure SVG charts with cubic Bezier curves, area gradients, trigonometric rings (`strokeDasharray`), and interactive floating tooltips without SSR/CSR hydration mismatches. |
| **Vitest & React Testing Library** | `5.0.0` / `16.3.3` | **High-Speed Automated Testing Suite**: Comprehensive unit and integration testing across schemas, stores, components, SVG math, and bilingual engines with 100% pass rate across 52 tests. |
| **Robocopy & Git** | System | **Automated Local Sync & Version Control**: Precise mirroring between sandbox (`scratch/nexus-pulse`) and the desktop repository (`Desktop/NexusPulse`), maintaining an atomic, conventional commit history. |

---

## Phase 1: Foundations, Design System & Bilingual Support

### Objectives & Scope
Establish the architectural bedrock using the Next.js App Router, React 19, strict TypeScript, and a minimalist design system powered by semantic HSL color tokens.

### Key Modules & Files
* **Design Tokens (`src/app/globals.css`)**: Semantic HSL CSS variables for backgrounds, surfaces, text, borders, focus rings, and primary accents with hot-swappable Dark/Light mode states.
* **Native ThemeProvider for React 19 (`src/components/theme-provider.tsx`)**: Replaced inline script injection with a native CSS class manager on `document.documentElement`, eliminating hydration warnings in React 19.
* **Bilingual Internationalization System (`src/components/language-provider.tsx`)**:
  * Type-safe dictionaries in Spanish (`src/locales/es.ts`) and English (`src/locales/en.ts`).
  * `localStorage` persistence with reactive fallback.
* **Atomic CVA Primitives (`src/components/ui/`)**:
  * `Button`: Semantic variants (`default`, `secondary`, `outline`, `ghost`, `inverted`, `destructive`).
  * `Badge`: Status indicators (`default`, `secondary`, `outline`, `success`, `warning`, `destructive`).
  * `Card`: Clean elevated containers with subtle borders (`border-border/40`) and soft backdrop blurs.

---

## Phase 2: SaaS Application Shell, Command Palette & RBAC

### Objectives & Scope
Engineer an enterprise-grade SaaS shell, rapid keyboard-driven navigation, and a multi-persona Role-Based Access Control (RBAC) security system.

### Key Modules & Files
* **Global UI Store with Zustand (`src/stores/ui-store.ts`)**:
  * Collapsible sidebar state with local storage persistence.
  * Command Palette modal control and mobile navigation drawers.
* **Application Shell (`src/components/layout/app-shell.tsx`)**:
  * Responsive layout orchestrator separating the public login screen from the authenticated console.
* **Collapsible Sidebar (`src/components/layout/sidebar.tsx`)**:
  * Navigation links to core modules (`Overview`, `Kanban Board`, `Workflows`, `Analytics`, `Settings`).
  * Version tag and quick user profile switcher.
* **Dynamic Header with Breadcrumbs (`src/components/layout/header.tsx`)**:
  * Active route detection and automated breadcrumbs hierarchy.
  * Contextual banners for restricted roles (*"Read-Only Mode"*).
* **Command Palette (`src/components/layout/command-palette.tsx`)**:
  * Integrated with `cmdk` and global shortcut (`⌘K` / `Ctrl+K`).
  * Quick actions: theme toggle, language switch, task creation, and instant view navigation.
* **Multi-User Demo & RBAC (`src/types/index.ts`, `src/stores/auth-store.ts`)**:
  * Three personas with granular permissions:
    1. **Gabriel Gonçalves (`admin`)**: Unrestricted read/write access across all modules.
    2. **Elena Rostova (`product_manager`)**: Project and task management orchestration.
    3. **Lucas Silva (`viewer`)**: Read-only browsing with mutation actions strictly locked.
* **Minimalist Login Screen (`src/app/login/page.tsx`)**:
  * Corporate login form with 1-click quick-access demo buttons for recruiters.

---

## Phase 3: Interactive Kanban Board with Drag & Drop

### Objectives & Scope
Implement a complete visual project management board with modern drag-and-drop technology (`@dnd-kit`), in-memory CRUD operations, and strict runtime data validation with Zod.

### Key Modules & Files
* **Runtime Schema Validation (`src/lib/validations/task.ts`)**:
  * Zod `taskSchema`: Validates title length (3 to 100 characters), optional descriptions (max 500 characters), status enums (`backlog`, `todo`, `in_progress`, `in_review`, `done`), priority levels (`low`, `medium`, `high`, `urgent`), estimated hours, and tag sanitization.
* **Task Store with Zustand (`src/stores/task-store.ts`)**:
  * In-memory CRUD operations: `addTask`, `updateTask`, `deleteTask`, `moveTask`, `reorderTask`.
  * Local persistence fallback (`nexus-pulse-kanban-tasks`).
  * Reactive multi-dimensional filtering by text query, priority, and assignee.
* **Board Components (`src/components/kanban/`)**:
  * `KanbanBoard`: Core orchestrator with pointer sensor distance constraint (`distance: 5px`) to prevent accidental drag triggers on click, plus accessible keyboard navigation.
  * `KanbanColumn`: Droppable containers with `SortableContext` and live item counters.
  * `KanbanCard`: Sortable cards with micro-animations, priority badges, and assignee avatars.
  * `KanbanToolbar`: Controls bar with search input, refined dropdowns (`bg-background`, `border-border/60`, custom minimalist chevrons), and `+ New Task` button.
  * `TaskModal`: Accessible modal dialog for task creation and editing with real-time Zod validation.
* **RBAC Enforcement**:
  * For the `viewer` role, dragging is disabled (`cursor-default`), mutation buttons are hidden/locked, and a read-only badge is presented.

---

## Security Layer: Edge Middleware, HttpOnly Cookies & Defensive Headers

### Objectives & Scope
Elevate platform security to enterprise production grade through a comprehensive **Defense-in-Depth** strategy.

### Key Modules & Files
* **Next.js Edge Middleware (`src/middleware.ts`)**:
  * Intercepts requests at the Edge before rendering.
  * Protects private routes: `/board`, `/workflows`, `/analytics`, and `/settings`.
  * Unauthenticated requests are blocked and redirected to `/login?redirect=${pathname}`.
  * Authenticated users navigating to `/login` are automatically redirected to the dashboard.
  * Injects defensive security headers into all outgoing responses.
* **Secure Session Cookies (`src/lib/auth-session.ts`, `src/app/api/auth/`)**:
  * Issues `nexus_session` cookie with strict flags:
    * `httpOnly: true`: Completely inaccessible to browser JavaScript, mitigating XSS session theft.
    * `sameSite: "lax"`: Robust defense against CSRF attacks.
    * `secure: process.env.NODE_ENV === "production"`: Enforced over HTTPS in production.
    * `path: "/"` with a 7-day expiration window.
  * REST endpoints: `/api/auth/login`, `/api/auth/logout`, `/api/auth/session`.
* **Defensive HTTP Headers (`next.config.ts`)**:
  * `Content-Security-Policy (CSP)`: Strict rules for scripts, styles, fonts, and connections.
  * `Strict-Transport-Security (HSTS)`: `max-age=63072000; includeSubDomains; preload`.
  * `X-Frame-Options: DENY`: Complete protection against Clickjacking.
  * `X-Content-Type-Options: nosniff`: Prevents MIME-type sniffing exploits.
  * `Referrer-Policy: strict-origin-when-cross-origin`.
  * `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
* **Live Security Audit in Settings (`src/app/settings/page.tsx`)**:
  * Interactive security matrix panel with live audit capabilities verifying active perimeter defenses.

---

## Technical Resilience: Permanent Resolution of SSR/CSR Hydration Mismatches

### Problem Diagnosis
During initial development, page reloads on client-hydrated routes (`/board`) produced recoverable hydration warnings due to:
1. `localStorage` holding modified tasks or roles differing from static server snapshots.
2. `@dnd-kit` generating dynamic accessibility IDs (`aria-describedby`) with mismatched numbers.
3. Active user names in the `UserMenu` differing between server render and client hydration.

### Implemented Solution
1. **Deterministic Store Initialization**: The task store initializes with an identical static seed across SSR and client. Storage synchronization is deferred to `initializeFromStorage()`, executed safely within a `useEffect` lifecycle hook.
2. **Skeleton Synchronization in `KanbanBoard`**: Renders a static skeleton matching the exact 5-column geometry during hydration. Once mounted, the interactive `@dnd-kit` tree is seamlessly swapped in.
3. **Static ID on `DndContext`**: Assigned a fixed `id="nexus-pulse-kanban-dnd"` to stabilize accessibility descriptors across renders.
4. **Interface Mount Guards**: `UserMenu`, `Header`, and `KanbanToolbar` employ a `mounted` guard to guarantee identical markup before hydration.
5. **Verified Result**: 0 hydration errors, 0 recoverable warnings, and a clean console across continuous hard refreshes and role switches.

---

## Phase 4: Asynchronous State Management & Optimistic UI (TanStack Query v5)

### Objectives & Scope
Cleanly decouple **Server State** from **Client UI State**. Implement optimistic updates with 0ms perceived latency, automatic error rollback on network failures, and asynchronous persistence backed by Next.js REST API endpoints.

### Key Modules & Components
* **Query Provider Context (`src/components/query-provider.tsx`)**:
  * Request-scoped singleton `QueryClient` compatible with SSR and App Router streaming.
  * Retry policies (`retry: 1`) and cache freshness window (`staleTime: 60s`).
* **REST Server Endpoints (`src/app/api/tasks/`)**:
  * `GET /api/tasks`: Dynamic filtering by search query, priority, and assignee with simulated network latency (120ms).
  * `POST /api/tasks`: Creation with Zod runtime validation and test error simulation support.
  * `PATCH /api/tasks/[id]`: Task updates and column transitions. Supports `?simulateError=true` query parameter for interactive rollback verification.
  * `DELETE /api/tasks/[id]`: Task deletion with automatic state restoration upon backend failure.
* **Optimistic Mutation Hooks (`src/hooks/use-tasks-query.ts`)**:
  * `useTasksQuery(filters)`: Subscribes to the reactive TanStack Query cache (`['tasks', filters]`).
  * `useMoveTaskMutation()`:
    1. **`onMutate`**: Cancels in-flight queries, takes a snapshot of previous state (`previousTasks`), and immediately relocates the card in the local cache (0ms perceived latency).
    2. **`onError`**: If the server returns an error (HTTP 500), executes **Automatic Rollback**, snapping the card back to its original column and triggering an amber alert toast.
    3. **`onSuccess`**: Confirms backend persistence.
    4. **`onSettled`**: Invalidates the query to re-synchronize canonical server state.
* **Floating Toast Notification System (`src/components/ui/optimistic-toast.tsx`, `src/stores/notification-store.ts`)**:
  * Animated toast notifications via Framer Motion (`popLayout`).
  * Semantic feedback states: `rollback` (amber alert with undo icon), `success` (emerald confirmation).
* **Spring-Physics Modal Animations (`framer-motion`)**:
  * **Natural Spring Curves**: Smooth transitions on `TaskModal`, `CommandPalette`, and the mobile `Sidebar` drawer via `<AnimatePresence>` (`damping: 26, stiffness: 350, mass: 0.8`).
  * **State Retention on Exit**: `useRef` handles prevent visual flickering or premature text clearing during exit transitions.

---

## Phase 5: Reactive Automations & Workflows Engine

### Objectives & Scope
Transform `/workflows` into an interactive, multi-stage orchestration engine. Provide visual 3-stage pipeline diagrams (Trigger $\rightarrow$ Rule $\rightarrow$ Action), live execution simulation with sequential terminal logs, TanStack Query persistence, and reactive in-app event dispatching.

### Key Modules & Components
* **REST Server Endpoints (`src/app/api/workflows/`)**:
  * `GET /api/workflows`: Filter by text, status (`active`, `paused`), and trigger type (`webhook`, `cron`, `event`, `manual`).
  * `POST /api/workflows`: Creation with strict Zod validation (`workflowSchema`).
  * `PATCH /api/workflows/[id]`: Optimistic status toggle between active and paused.
  * `DELETE /api/workflows/[id]`: Pipeline removal.
  * `POST /api/workflows/[id]/run`: Real-time execution simulation generating sequential timestamped logs and incrementing run counters.
* **In-App Reactive Event Dispatcher ([server-workflows.ts](file:///C:/Users/Gabri/Desktop/NexusPulse/src/lib/server-workflows.ts) & [api/tasks/[id]/route.ts](file:///C:/Users/Gabri/Desktop/NexusPulse/src/app/api/tasks/[id]/route.ts))**:
  * Built-in reactive listener `triggerTaskWorkflows(task)`: Moving any task to `Done` automatically evaluates active workflows with trigger `event`.
  * Dispatches instant in-app toast notifications (*"Workflow Disparado"*) and records permanent alerts into the **Automation Center**.
  * Prevents execution when a workflow is paused by the user.
* **Interactive UI Components**:
  * **`WorkflowCard` (`src/components/workflows/workflow-card.tsx`)**: Telemetry badges, success rate, run statistics, pause/resume toggle, and instant execution trigger.
  * **`WorkflowPipelineDrawer` (`src/components/workflows/workflow-pipeline-drawer.tsx`)**: Modal drawer displaying 3-stage sequential flow. Simulating live runs highlights pipeline nodes with an emerald glow while the terminal stream prints sequential logs.
  * **`WorkflowModal` (`src/components/workflows/workflow-modal.tsx`)**: Accessible creation dialog with Zod validation.

---

## Phase 6: Real-Time Operational Metrics & Zero-Hydration SVG Telemetry

### Objectives & Scope
Engineer an enterprise-grade analytics dashboard at `/analytics`. Deliver real-time operational visibility into delivery velocity, cycle times, and system health with **Zero Hydration Mismatches** via pure mathematical SVG vector visualizers.

### Key Modules & Components
* **Server Analytics Engine (`src/lib/server-analytics.ts`)**:
  * In-memory aggregation algorithm calculating delivery throughput, active workflows, average lead times, and SLA compliance.
  * Deterministic cubic Bezier curve generation tailored for 7-day, 30-day, and 90-day aggregation windows.
  * Trigonometric donut ring calculation (`strokeDasharray` / `strokeDashoffset`).
  * Real-time operational telemetry event stream with millisecond latencies and HTTP status codes.
* **Data Visualization Primitives (Zero-Hydration SVG)**:
  * **`ThroughputChart` (`src/components/analytics/throughput-chart.tsx`)**: Continuous cubic Bezier line and area chart with semi-transparent gradients, horizontal timestamp axes, and **Framer Motion interactive floating tooltips** on hover.
  * **`PriorityDonutChart` (`src/components/analytics/priority-donut-chart.tsx`)**: Segmented SVG ring with clean trigonometric slicing, interactive hover scaling, and active legend highlighting.
  * **`WorkloadBarChart` (`src/components/analytics/workload-bar-chart.tsx`)**: Segmented team distribution chart with user avatars and proportional task breakdowns.
  * **`LiveTelemetryFeed` (`src/components/analytics/live-telemetry-feed.tsx`)**: Real-time event feed displaying localized action badges (`TASK STATUS CHANGED`, `WORKFLOW TRIGGERED`, etc.), state transitions, millisecond latencies, and pulsing live status badge (`live stream` / `transmisión en vivo`).

---

## Special Module: Comprehensive Internationalization (i18n) & Dynamic Card Localization

### Scope & Architectural Design
Delivered full bilingual support (English / Spanish) across the entire application, extending beyond static UI chrome to encompass dynamic entity cards:

1. **Card Translations Engine (`src/lib/translations/card-translations.ts`)**:
   * Deterministic bilingual dictionary for seed Kanban tasks (`NP-101` to `NP-107`) and workflows (`wf-1` to `wf-5`).
   * `localizeTask(task, locale)`: Translates titles, descriptions, and tags while preserving user-created tasks untouched.
   * `localizeWorkflow(workflow, locale)`: Translates workflow names, descriptions, pipeline step titles, and relative timestamps (*"Yesterday at 00:00"* $\leftrightarrow$ *"Ayer a las 00:00"*, *"Just now"* $\leftrightarrow$ *"Justo ahora"*).
   * `localizeWorkflowRunLog(log, locale)`: Translates sequential terminal execution logs in the pipeline drawer.
   * `localizeTelemetry(log, locale)`: Translates telemetry actions (`TASK STATUS CHANGED` $\leftrightarrow$ `CAMBIO DE ESTADO`, `WORKFLOW TRIGGERED` $\leftrightarrow$ `WORKFLOW DISPARADO`) and status transitions without mutating server database enums.

---

## Phase 7: Automated Testing Suite with Vitest & React Testing Library

### Testing Architecture & Stack
Ultra-fast ESM test environment executed with **Vitest v5**, **React Testing Library v16**, **jsdom**, and **@testing-library/jest-dom v7**:
- **Native ESM Configuration (`vitest.config.mts`)**: `@/*` alias resolution synchronized with `tsconfig.json` via `import.meta.dirname`.
- **Global Mock Environment (`tests/setup.ts`)**: Comprehensive mocks for browser APIs (`ResizeObserver`, `IntersectionObserver`, `matchMedia`) and Next.js navigation hooks (`useRouter`, `usePathname`).
- **Bilingual Test Utility (`tests/test-utils.tsx`)**: Helper `renderWithProviders(ui, { locale, queryClient })` providing isolated `QueryClient` instances and testing components in Spanish (`"es"`) and English (`"en"`).

### Coverage: 16 Test Suites (52 Tests — 100% Pass Rate)

| # | Test File | Target Layer | Tests | Key Aspects Validated |
|---|---|---|:---:|---|
| 1 | `tests/validations/task.test.ts` | Zod Schemas | 6 | Title length limits (3-100 chars), description limits (500 chars), priority enums, status enums, tag sanitization. |
| 2 | `tests/validations/workflow.test.ts` | Zod Schemas | 5 | Event trigger validation, pipeline names, status defaults, and payload constraints. |
| 3 | `tests/translations/card-translations.test.ts` | i18n Engine | 6 | Dynamic task translation in ES/EN, user task preservation, bidirectional relative time formatting. |
| 4 | `tests/stores/task-store.test.ts` | Zustand Stores | 6 | Seed task initialization, `addTask`, `updateTask`, `moveTask`, `deleteTask`, and multi-field filtering. |
| 5 | `tests/stores/auth-store.test.ts` | Zustand / RBAC | 5 | Permissions for Admin and PM, read-only padlock enforcement for Viewer (`canEdit: false`), profile switching, logout. |
| 6 | `tests/stores/notification-store.test.ts` | Zustand Stores | 2 | Notification dispatching, unread counter management, and clear actions. |
| 7 | `tests/components/kanban-card.test.tsx` | React UI / RTL | 3 | Bilingual rendering of titles, descriptions, priority badges, and Viewer delete button restriction. |
| 8 | `tests/components/workflow-card.test.tsx` | React UI / RTL | 2 | Run statistics, triggers, active/paused status, and manual pipeline execution trigger. |
| 9 | `tests/components/kpi-metric-card.test.tsx` | React UI / RTL | 2 | Numeric metric values, percentage trend badges, and inverse polarity logic for lead time metrics. |
| 10 | `tests/components/live-telemetry-feed.test.tsx` | React UI / RTL | 3 | Real-time event log stream in ES and EN, localized live badges, and clean empty state. |
| 11 | `tests/components/priority-donut-chart.test.tsx` | SVG Charts | 2 | Bilingual legend and donut slice labels (`Urgent` vs `Urgente`, `Low` vs `Baja`). |
| 12 | `tests/components/workload-bar-chart.test.tsx` | SVG Charts | 1 | Stacked bars by team assignee (`Elena Rostova`, `Lucas Silva`, etc.) and task distributions. |
| 13 | `tests/components/throughput-chart.test.tsx` | SVG Charts | 2 | Bezier curve rendering, bilingual timeline markers, and interactive hover tooltips. |
| 14 | `tests/server/server-telemetry.test.ts` | Server State | 3 | Telemetry event ingestion, circular buffer capacity limit (max 25 entries), and stream clearing. |
| 15 | `tests/server/server-workflows.test.ts` | Automation Engine | 2 | Automated in-app workflow triggering on task completion and paused workflow suppression. |
| 16 | `tests/server/server-analytics.test.ts` | Analytics Logic | 2 | Aggregate metric calculations across `7d`, `30d`, and `90d` time horizons. |

```bash
# Execute full automated test suite
npm run test

# Run tests in interactive watch mode
npm run test:watch
```

---

## Phase 8: Final Production Build, Performance Audit & Vercel Deployment

### Objectives & Scope
Finalize production readiness, perform an exhaustive performance and zero-hydration audit, configure standard Vercel deployment assets, expand the Overview architecture showcase.

### Architectural Deliverables
1. **Production Compilation with Turbopack**:
   - `npm run build` generates 15 static and dynamic App Router routes with zero TypeScript errors and zero warnings.
   - Route tree fully optimized for streaming and Edge Middleware execution.
2. **Vercel Deployment Architecture**:
   - Configured [vercel.json](../vercel.json) for native Next.js routing and clean URL management.

---

## Updated Roadmap & Upcoming Milestones

- [x] **Phase 1: Foundations, Design System & Bilingual Support (ES/EN)** *(Completed)*
- [x] **Phase 2: SaaS Application Shell, Command Palette & Multi-User RBAC** *(Completed)*
- [x] **Phase 3: Interactive Kanban Board (`@dnd-kit`) & Zod Runtime Validation** *(Completed)*
- [x] **Security Layer: Next.js Edge Middleware, HttpOnly Cookies & Defensive HTTP Headers** *(Completed)*
- [x] **Phase 4: Asynchronous State Management & Optimistic UI (TanStack Query v5)** *(Completed)*
- [x] **Phase 5: Reactive Automations & Workflows Engine (Pipelines & In-App Triggers)** *(Completed)*
- [x] **Phase 6: Real-Time Operational Telemetry & Analytics Dashboard (Zero-Hydration SVG)** *(Completed)*
- [x] **Special Module: Comprehensive Internationalization (i18n) & Dynamic Card Localization** *(Completed)*
- [x] **Phase 7: Automated Testing Suite with Vitest & React Testing Library (16 Suites, 52 Tests — 100% Pass)** *(Completed)*
- [x] **Phase 8: Final Production Build, Performance Audit, Vercel Readiness & English Documentation** *(Completed)*
- [ ] **Phase 9 (Post-MVP Scheduled Milestone): Mobile App via Hybrid / Native Wrapper: Capacitor (Ionic)** *(Cross-platform packaging, haptic feedback on drag-and-drop, native push notifications, and iOS/Android builds)*.
