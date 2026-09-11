"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Command,
  GitFork,
  KanbanSquare,
  Sparkles,
} from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language-provider";
import { useUIStore } from "@/stores/ui-store";
import { siteConfig } from "@/config/site";

// Motion variants for clean, staggered entrance
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function HomePage() {
  const { t } = useLanguage();
  const { setCommandPaletteOpen } = useUIStore();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10 py-2"
    >
      {/* Welcome & Overview Header */}
      <motion.section variants={itemVariants} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-border/50 bg-muted/30 text-muted-foreground text-[11px] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {t.hero.statusBadge}
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              {t.hero.title}
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {t.hero.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCommandPaletteOpen(true)}
              className="gap-2 text-xs"
            >
              <Command className="h-3.5 w-3.5" />
              <span>⌘K</span>
            </Button>
            <Button asChild variant="inverted" size="sm" className="gap-1.5 text-xs">
              <Link href="/board">
                <span>{t.shell.nav.board}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Telemetry Metrics Row */}
      <motion.section variants={itemVariants} className="space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {t.metrics.items.map((metric) => (
            <motion.div
              key={metric.label}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className="p-4 rounded-xl border border-border/50 bg-card/40 hover:bg-card hover:border-border transition-all duration-200"
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

      {/* Quick Access Operational Cards */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/board"
          className="group p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/70 hover:border-border transition-all duration-150 flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <KanbanSquare className="h-3.5 w-3.5 text-primary" />
              Tablero Kanban
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">12 Tareas Activas</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Preparado para Drag & Drop con @dnd-kit en Fase 3.
            </p>
          </div>
        </Link>

        <Link
          href="/workflows"
          className="group p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/70 hover:border-border transition-all duration-150 flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <GitFork className="h-3.5 w-3.5 text-emerald-500" />
              Flujos de Trabajo
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">6 Workflows en Vivo</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automatizaciones webhook y cron en tiempo real.
            </p>
          </div>
        </Link>

        <div
          onClick={() => setCommandPaletteOpen(true)}
          className="group p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/70 hover:border-border cursor-pointer transition-all duration-150 flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Command className="h-3.5 w-3.5 text-indigo-500" />
              Command Palette
            </span>
            <Badge variant="outline" className="text-[10px] font-mono py-0 px-1.5">
              ⌘K
            </Badge>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">Búsqueda Rápida</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Navega a cualquier vista o ejecuta acciones por teclado.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Foundation & Roadmap Split Section */}
      <motion.section
        variants={itemVariants}
        id="architecture"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2"
      >
        {/* Foundation Highlights */}
        <div className="p-5 rounded-xl border border-border/50 bg-card/30 space-y-4">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              {t.foundations.title}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t.foundations.subtitle}
            </p>
          </div>

          <ul className="space-y-3 text-xs text-muted-foreground">
            {t.foundations.items.map((item) => (
              <li key={item.title} className="flex items-start gap-2.5">
                <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-foreground font-medium">
                    {item.title}:
                  </span>{" "}
                  {item.desc}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Development Roadmap */}
        <div className="p-5 rounded-xl border border-border/50 bg-card/30 space-y-4">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              {t.roadmap.title}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t.roadmap.subtitle}
            </p>
          </div>

          <ol className="space-y-3 text-xs">
            {t.roadmap.steps.map((step) => {
              const isCompleted = step.status === "completed";
              const isActive = step.status === "active";

              return (
                <li
                  key={step.number}
                  className={`flex items-start gap-2.5 ${
                    !isCompleted && !isActive ? "opacity-60" : ""
                  }`}
                >
                  {isCompleted ? (
                    <span className="h-4 w-4 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-medium shrink-0 mt-0.5">
                      ✓
                    </span>
                  ) : isActive ? (
                    <span className="h-4 w-4 rounded-full border border-primary/60 text-primary flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5">
                      {step.number}
                    </span>
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-border text-muted-foreground flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {step.number}
                    </span>
                  )}

                  <div>
                    <div className="text-foreground font-medium flex items-center gap-2">
                      {step.title}
                      {isCompleted && (
                        <Badge
                          variant="success"
                          className="text-[9px] py-0 px-1.5"
                        >
                          {t.roadmap.readyBadge}
                        </Badge>
                      )}
                      {isActive && (
                        <Badge
                          variant="outline"
                          className="text-[9px] py-0 px-1.5"
                        >
                          {t.roadmap.nextBadge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </motion.section>
    </motion.div>
  );
}
