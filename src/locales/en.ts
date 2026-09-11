import { es } from "./es";

export const en: typeof es = {
  nav: {
    brand: "NexusPulse",
    version: "v0.1.0",
    step1Badge: "Step 1",
    github: "GitHub",
    switchTheme: "Toggle theme",
    switchLanguage: "Change language",
  },
  shell: {
    workspace: "Nexus Studio",
    workspaceRole: "Pro Team",
    collapseSidebar: "Collapse sidebar",
    expandSidebar: "Expand sidebar",
    searchPlaceholder: "Search or press ⌘K...",
    nav: {
      overview: "Overview",
      workflows: "Workflows",
      board: "Kanban Board",
      analytics: "Analytics",
      settings: "Settings",
    },
    breadcrumbs: {
      root: "NexusPulse",
      overview: "Overview",
      workflows: "Workflows",
      board: "Kanban",
      analytics: "Analytics",
      settings: "Settings",
    },
    commandPalette: {
      title: "Commands & Search",
      placeholder: "Type a command or search a view...",
      empty: "No results found.",
      groupNavigation: "Views & Navigation",
      groupActions: "Quick Actions",
      groupPreferences: "Preferences",
      actionNewTask: "Create new task",
      actionNewWorkflow: "New workflow",
      actionToggleTheme: "Toggle dark / light mode",
      actionToggleLang: "Switch to Spanish",
    },
    user: {
      name: "Gabriel Gonçalves",
      role: "Front-End Engineer",
      status: "Online",
    },
  },
  hero: {
    statusBadge: "Step 1 Completed • Foundation Architecture",
    title: "Operations intelligence and real-time workflow orchestration.",
    description:
      "High-performance SaaS platform built with strict TypeScript, Next.js App Router, Tailwind CSS v4 design tokens, and decoupled component architecture.",
    exploreBtn: "Explore Architecture",
    viewRepoBtn: "View Repository",
  },
  metrics: {
    title: "Core Telemetry & Foundations",
    badge: "Live",
    items: [
      {
        label: "Strict Types",
        value: "100%",
        detail: "TypeScript without 'any'",
      },
      {
        label: "Core Framework",
        value: "Next.js 15",
        detail: "React 19 + Turbopack",
      },
      {
        label: "Design System",
        value: "Tailwind v4",
        detail: "Dark/Light HSL tokens",
      },
      {
        label: "Repository",
        value: "main",
        detail: "Synchronized on GitHub",
      },
    ],
  },
  foundations: {
    title: "Implemented Foundations",
    subtitle: "Enterprise patterns and best practices established in Step 1.",
    items: [
      {
        title: "Semantic HSL Tokens",
        desc: "Modular palette in globals.css easily adaptable to any brand.",
      },
      {
        title: "Zero-Flash Dark / Light Mode",
        desc: "Clean integration with next-themes without SSR hydration flicker.",
      },
      {
        title: "Atomic CVA Components",
        desc: "Button, Card, and Badge primitives built for maximum reusability.",
      },
      {
        title: "Centralized Domain Types",
        desc: "Strict definitions for Task, Workflow, Metrics, and User models.",
      },
      {
        title: "Bilingual i18n Support",
        desc: "Instant language switching (Spanish / English) with local persistence.",
      },
    ],
  },
  roadmap: {
    title: "Project Engineering Roadmap",
    subtitle: "Planned step-by-step progress towards senior front-end mastery.",
    readyBadge: "Ready",
    nextBadge: "Next",
    steps: [
      {
        number: "1",
        title: "Step 1: Architecture & Design System",
        desc: "Next.js 15, TypeScript, Tailwind v4, i18n (ES/EN), Git synchronized.",
        status: "completed",
      },
      {
        number: "2",
        title: "Step 2: SaaS Shell & Command Palette",
        desc: "Collapsible sidebar, dynamic breadcrumbs, and Cmd+K shortcut.",
        status: "active",
      },
      {
        number: "3",
        title: "Step 3: Interactive Kanban with Drag & Drop",
        desc: "@dnd-kit and reactive client state with Zustand.",
        status: "upcoming",
      },
      {
        number: "4",
        title: "Step 4: Optimistic Mutations (TanStack Query)",
        desc: "Reactive cache invalidation and instantaneous UI updates.",
        status: "upcoming",
      },
      {
        number: "5",
        title: "Step 5: Real-time Telemetry & AI Copilot",
        desc: "Streaming text responses, smart summaries, and analytics.",
        status: "upcoming",
      },
      {
        number: "6",
        title: "Step 6: Automated Testing with Jest & RTL",
        desc: "Comprehensive test suite for unit logic, stores, and components.",
        status: "upcoming",
      },
    ],
  },
  footer: {
    developedBy: "NexusPulse • Built by",
    author: "Gabriel Gonçalves",
    location: "Vila Nova de Gaia, Portugal",
  },
};
