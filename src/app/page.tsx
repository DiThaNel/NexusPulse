"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  Command,
  GitFork,
  KanbanSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language-provider";
import { useUIStore } from "@/stores/ui-store";
import { useTasksQuery } from "@/hooks/use-tasks-query";
import { useWorkflowsQuery } from "@/hooks/use-workflows-query";
import { useAnalyticsQuery } from "@/hooks/use-analytics-query";

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

  // Pull live data for reactive Overview cards
  const { data: tasks = [] } = useTasksQuery();
  const { data: workflows = [] } = useWorkflowsQuery();
  const { data: analytics } = useAnalyticsQuery("30d");

  const completedTasks = tasks.filter((t) => t.status === "done").length;

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
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t.hero.statusBadge}
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              {t.hero.title}
            </h1>
            <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
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

      {/* Telemetry Core Metrics Row */}
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

      {/* Quick Access Operational Cards (Live Connected) */}
      <motion.section
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Kanban Board */}
        <Link
          href="/board"
          className="group p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/70 hover:border-border transition-all duration-150 flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <KanbanSquare className="h-3.5 w-3.5 text-primary" />
              {t.overviewCards.kanban.badge}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {tasks.length} {t.overviewCards.kanban.activeTasks}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {t.overviewCards.kanban.desc}
            </p>
          </div>
        </Link>

        {/* Workflows */}
        <Link
          href="/workflows"
          className="group p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/70 hover:border-border transition-all duration-150 flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <GitFork className="h-3.5 w-3.5 text-emerald-500" />
              {t.overviewCards.workflows.badge}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {workflows.length} {t.overviewCards.workflows.livePipelines}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {t.overviewCards.workflows.desc}
            </p>
          </div>
        </Link>

        {/* Analytics */}
        <Link
          href="/analytics"
          className="group p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/70 hover:border-border transition-all duration-150 flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-3.5 w-3.5 text-indigo-500" />
              {t.overviewCards.analytics.badge}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {analytics ? `${analytics.overview.workflowSuccessRate}% ${t.overviewCards.analytics.coreHealth}` : t.overviewCards.analytics.telemetryActive}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {t.overviewCards.analytics.desc}
            </p>
          </div>
        </Link>

        {/* Command Palette */}
        <div
          onClick={() => setCommandPaletteOpen(true)}
          className="group p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/70 hover:border-border cursor-pointer transition-all duration-150 flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Command className="h-3.5 w-3.5 text-amber-500" />
              {t.overviewCards.commandPalette.badge}
            </span>
            <Badge variant="outline" className="text-[10px] font-mono py-0 px-1.5">
              ⌘K
            </Badge>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">{t.overviewCards.commandPalette.title}</div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {t.overviewCards.commandPalette.desc}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Implemented Foundations & Architecture (Full-Width Expanded Showcase) */}
      <motion.section
        variants={itemVariants}
        id="architecture"
        className="rounded-2xl border border-border/50 bg-card/30 p-5 sm:p-7 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/30 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                {t.foundations.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t.foundations.subtitle}
            </p>
          </div>

          <Badge variant="outline" className="text-xs font-mono py-0.5 px-2.5 self-start sm:self-auto">
            8 Core Pillars • 100% Production Ready
          </Badge>
        </div>

        {/* 4-column / 2-column Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.foundations.items.map((item: any) => (
            <div
              key={item.title}
              className="p-4 rounded-xl border border-border/40 bg-card/40 hover:bg-card hover:border-border/80 transition-all duration-200 flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Check className="h-4 w-4" />
                  </div>
                  {item.tag && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/40">
                      {item.tag}
                    </span>
                  )}
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {item.title}
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
