# NexusPulse — Operations & Workflow Intelligence SaaS

> **A state-of-the-art B2B SaaS platform for real-time workflow orchestration, Kanban project management, and automated operations telemetry.**

Built from the ground up with strict enterprise-grade standards, modern front-end architecture, accessible design tokens, and next-generation React paradigms.

---

## Key Technologies & Stack

* **Core Framework:** [Next.js 15+](https://nextjs.org/) (App Router, Server Components, Streaming SSR)
* **Language:** [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode, 100% type-safe, zero `any`)
* **Styling & System Design:** [Tailwind CSS v4](https://tailwindcss.com/) + [Radix UI Primitives](https://www.radix-ui.com/) + HSL Design Tokens
* **Theming:** [next-themes](https://github.com/pacocoursey/next-themes) with zero-flash SSR Dark & Light mode
* **Icons:** [Lucide React](https://lucide.dev/)
* **Component Architecture:** Atomic design primitives (`Button`, `Card`, `Badge`) powered by `class-variance-authority` (CVA) and `clsx` / `tailwind-merge`

---

## Project Architecture

```
nexus-pulse/
├── src/
│   ├── app/                      # Next.js App Router (pages, layouts, globals.css)
│   │   ├── (auth)/               # Auth route group
│   │   ├── (dashboard)/          # SaaS application views
│   │   ├── globals.css           # Design tokens (HSL, Dark/Light modes)
│   │   ├── layout.tsx            # Root layout with ThemeProvider
│   │   └── page.tsx              # Telemetry & Foundation showcase
│   ├── components/
│   │   ├── ui/                   # Reusable atomic design system components (CVA)
│   │   │   ├── button.tsx
│   │   │   ├── badge.tsx
│   │   │   └── card.tsx
│   │   ├── layout/               # App layout, Sidebar, Header, Command Palette
│   │   ├── icons.tsx             # Brand and custom SVG icons
│   │   ├── theme-provider.tsx    # next-themes client wrapper
│   │   └── theme-toggle.tsx      # Smooth theme toggle button
│   ├── config/                   # Site configuration, navigation and constants
│   │   └── site.ts
│   ├── lib/                      # Core utility functions (cn helper)
│   │   └── utils.ts
│   ├── types/                    # Enterprise TypeScript interfaces & domain models
│   │   └── index.ts
│   ├── hooks/                    # Custom React hooks
│   └── stores/                   # Zustand client stores
├── public/                       # Static assets
├── tsconfig.json                 # Strict TypeScript configuration
└── package.json
```

---

## Getting Started

### Prerequisites
* Node.js 18.17+ or 20+ (tested on Node v24)
* npm, pnpm, or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/DiThaNel/NexusPulse.git
cd NexusPulse

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Engineering Roadmap

- [x] **Paso 1:** Foundation, strict TypeScript, Tailwind v4 design tokens, ThemeProvider, atomic components, Git setup.
- [ ] **Paso 2:** SaaS Layout, Collapsible Sidebar, Breadcrumbs, and Command Palette (`Cmd + K`).
- [ ] **Paso 3:** Interactive Kanban Board with `@dnd-kit` and Zustand client state.
- [ ] **Paso 4:** Server State & Optimistic UI with TanStack Query.
- [ ] **Paso 5:** Real-time Analytics, Telemetry charts & AI Copilot.
- [ ] **Paso 6:** End-to-end testing with Vitest & Playwright.

---
