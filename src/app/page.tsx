"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Check, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config/site";

// Motion variants for clean, staggered entrance
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function HomePage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200"
    >
      {/* Top Navigation Bar (Minimalist) */}
      <motion.header
        variants={itemVariants}
        className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/75 backdrop-blur-md"
      >
        <div className="container mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="font-semibold text-sm tracking-tight text-foreground">
              NexusPulse
            </span>
            <span className="text-[11px] text-muted-foreground font-mono ml-1.5 pl-2 border-l border-border/60">
              v0.1.0
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">GitHub</span>
                <ExternalLink className="h-3 w-3 opacity-50" />
              </a>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      {/* Main Container */}
      <main className="flex-1 container mx-auto max-w-5xl px-6 py-14 space-y-16">
        {/* Hero Section (Minimalist & Typography-driven) */}
        <motion.section variants={itemVariants} className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-border/60 bg-muted/40 text-muted-foreground text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Paso 1 Completado • Arquitectura Base
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.15] text-foreground">
            Inteligencia operativa y orquestación de flujos de trabajo.
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-normal">
            Plataforma SaaS de alto rendimiento desarrollada con TypeScript estricto, 
            Next.js App Router, tokens de diseño Tailwind v4 y arquitectura por componentes desacoplados.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild variant="inverted" size="default">
              <a href="#architecture">Explorar Arquitectura</a>
            </Button>
            <Button asChild variant="outline" size="default" className="gap-1.5 text-muted-foreground hover:text-foreground">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                <span>Ver Repositorio</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-50" />
              </a>
            </Button>
          </div>
        </motion.section>

        {/* Telemetry Metrics Row (Clean, subtle cards) */}
        <motion.section variants={itemVariants} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Tipado Estricto", value: "100%", detail: "TypeScript sin 'any'" },
              { label: "Framework Core", value: "Next.js 15", detail: "React 19 + Turbopack" },
              { label: "Design System", value: "Tailwind v4", detail: "Tokens HSL Dark/Light" },
              { label: "Repositorio", value: "main", detail: "Sincronizado en GitHub" },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-border transition-all duration-200"
              >
                <div className="text-xs text-muted-foreground font-medium mb-1.5">
                  {metric.label}
                </div>
                <div className="text-xl font-semibold tracking-tight text-foreground">
                  {metric.value}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  {metric.detail}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Foundation & Roadmap Split Section */}
        <motion.section variants={itemVariants} id="architecture" className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Foundation Highlights */}
          <div className="p-6 rounded-2xl border border-border/50 bg-card/40 space-y-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Fundamentos Implementados
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Patrones y buenas prácticas establecidas en el Paso 1.
              </p>
            </div>

            <ul className="space-y-3 pt-1 text-sm text-muted-foreground">
              {[
                { title: "Tokens Semánticos HSL", desc: "Paleta modular en globals.css adaptable a cualquier marca." },
                { title: "Dark / Light Mode Zero-Flash", desc: "Integración limpia con next-themes sin parpadeo SSR." },
                { title: "Componentes Atómicos CVA", desc: "Button, Card y Badge estructurados para máxima reutilización." },
                { title: "Tipado de Dominio Centralizado", desc: "Definición estricta de Task, Workflow, Metrics y User." },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-foreground font-medium">{item.title}:</span>{" "}
                    {item.desc}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Development Roadmap */}
          <div className="p-6 rounded-2xl border border-border/50 bg-card/40 space-y-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Hoja de Ruta del Proyecto
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Avance planificado paso a paso hacia nivel senior.
              </p>
            </div>

            <ol className="space-y-3.5 pt-1 text-sm">
              <li className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                  ✓
                </span>
                <div>
                  <div className="text-foreground font-medium flex items-center gap-2">
                    Paso 1: Arquitectura & Design System
                    <Badge variant="success" className="text-[10px] py-0 px-1.5">Listo</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Next.js 15, TypeScript, Tailwind v4, Git sincronizado.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full border border-primary/50 text-primary flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <div className="text-foreground font-medium flex items-center gap-2">
                    Paso 2: SaaS Shell & Command Palette
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5">Siguiente</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Sidebar colapsable, breadcrumbs dinámicos y atajo Cmd+K.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2.5 opacity-60">
                <span className="h-5 w-5 rounded-full border border-border text-muted-foreground flex items-center justify-center text-xs shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <div className="text-foreground font-medium">
                    Paso 3: Kanban Interactivo con Drag & Drop
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    @dnd-kit y gestión de estados con Zustand.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2.5 opacity-60">
                <span className="h-5 w-5 rounded-full border border-border text-muted-foreground flex items-center justify-center text-xs shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <div className="text-foreground font-medium">
                    Paso 4: Mutaciones Optimistas (TanStack Query)
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Caché reactivo y respuestas de UI instantáneas.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </motion.section>
      </main>

      {/* Footer (Minimalist) */}
      <motion.footer
        variants={itemVariants}
        className="border-t border-border/40 py-6 text-xs text-muted-foreground"
      >
        <div className="container mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            NexusPulse • Creado por <span className="text-foreground font-medium">Gabriel Gonçalves</span>
          </p>
          <div className="flex items-center gap-3">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <span>•</span>
            <span>Vila Nova de Gaia, Portugal</span>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
}
