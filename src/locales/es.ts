export const es = {
  nav: {
    brand: "NexusPulse",
    version: "v0.1.0",
    step1Badge: "Paso 1",
    github: "GitHub",
    switchTheme: "Cambiar tema",
    switchLanguage: "Cambiar idioma",
  },
  hero: {
    statusBadge: "Paso 1 Completado • Arquitectura Base",
    title: "Inteligencia operativa y orquestación de flujos de trabajo.",
    description:
      "Plataforma SaaS de alto rendimiento desarrollada con TypeScript estricto, Next.js App Router, tokens de diseño Tailwind v4 y arquitectura por componentes desacoplados.",
    exploreBtn: "Explorar Arquitectura",
    viewRepoBtn: "Ver Repositorio",
  },
  metrics: {
    title: "Telemetría del Core & Fundamentos",
    badge: "En Vivo",
    items: [
      {
        label: "Tipado Estricto",
        value: "100%",
        detail: "TypeScript sin 'any'",
      },
      {
        label: "Framework Core",
        value: "Next.js 15",
        detail: "React 19 + Turbopack",
      },
      {
        label: "Design System",
        value: "Tailwind v4",
        detail: "Tokens HSL Dark/Light",
      },
      {
        label: "Repositorio",
        value: "main",
        detail: "Sincronizado en GitHub",
      },
    ],
  },
  foundations: {
    title: "Fundamentos Implementados",
    subtitle: "Patrones y buenas prácticas establecidas en el Paso 1.",
    items: [
      {
        title: "Tokens Semánticos HSL",
        desc: "Paleta modular en globals.css adaptable a cualquier marca.",
      },
      {
        title: "Dark / Light Mode Zero-Flash",
        desc: "Integración limpia con next-themes sin parpadeo SSR.",
      },
      {
        title: "Componentes Atómicos CVA",
        desc: "Button, Card y Badge estructurados para máxima reutilización.",
      },
      {
        title: "Tipado de Dominio Centralizado",
        desc: "Definición estricta de Task, Workflow, Metrics y User.",
      },
      {
        title: "Soporte Bilingüe (i18n)",
        desc: "Cambio instantáneo de idioma (Español / Inglés) con persistencia local.",
      },
    ],
  },
  roadmap: {
    title: "Hoja de Ruta del Proyecto",
    subtitle: "Avance planificado paso a paso hacia nivel senior.",
    readyBadge: "Listo",
    nextBadge: "Siguiente",
    steps: [
      {
        number: "1",
        title: "Paso 1: Arquitectura & Design System",
        desc: "Next.js 15, TypeScript, Tailwind v4, i18n (ES/EN), Git sincronizado.",
        status: "completed",
      },
      {
        number: "2",
        title: "Paso 2: SaaS Shell & Command Palette",
        desc: "Sidebar colapsable, breadcrumbs dinámicos y atajo Cmd+K.",
        status: "active",
      },
      {
        number: "3",
        title: "Paso 3: Kanban Interactivo con Drag & Drop",
        desc: "@dnd-kit y gestión de estados con Zustand.",
        status: "upcoming",
      },
      {
        number: "4",
        title: "Paso 4: Mutaciones Optimistas (TanStack Query)",
        desc: "Caché reactivo y respuestas de UI instantáneas.",
        status: "upcoming",
      },
      {
        number: "5",
        title: "Paso 5: Telemetría en Tiempo Real & AI Copilot",
        desc: "Streaming de texto, resúmenes automáticos y analíticas.",
        status: "upcoming",
      },
      {
        number: "6",
        title: "Paso 6: Testing Automatizado con Jest & RTL",
        desc: "Cobertura de pruebas unitarias, stores y componentes.",
        status: "upcoming",
      },
    ],
  },
  footer: {
    developedBy: "NexusPulse • Creado por",
    author: "Gabriel Gonçalves",
    location: "Vila Nova de Gaia, Portugal",
  },
};
