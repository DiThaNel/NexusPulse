"use client";

import { motion } from "framer-motion";
import { GitFork, Plus, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language-provider";

export default function WorkflowsPage() {
  const { t } = useLanguage();

  const workflows = [
    {
      id: "wf-1",
      name: "GitHub Sync & Deploy Trigger",
      trigger: "Webhook",
      status: "Activo",
      runs: 1420,
      successRate: "99.9%",
      lastRun: "Hace 4 minutos",
    },
    {
      id: "wf-2",
      name: "Daily Operations Health Check",
      trigger: "Cron (00:00 UTC)",
      status: "Activo",
      runs: 365,
      successRate: "100%",
      lastRun: "Hace 3 horas",
    },
    {
      id: "wf-3",
      name: "Automated Slack Issue Notifier",
      trigger: "Event",
      status: "En Pausa",
      runs: 840,
      successRate: "98.5%",
      lastRun: "Ayer",
    },
    {
      id: "wf-4",
      name: "Database Telemetry Archival",
      trigger: "Cron (Weekly)",
      status: "Activo",
      runs: 52,
      successRate: "99.4%",
      lastRun: "Hace 2 días",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 py-2"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2.5">
            <GitFork className="h-5 w-5 text-emerald-500" />
            {t.shell.nav.workflows}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Automatizaciones orquestadas y monitoreo de eventos en vivo.
          </p>
        </div>

        <Button variant="inverted" size="sm" className="gap-1.5 text-xs">
          <Plus className="h-3.5 w-3.5" />
          <span>Nuevo Workflow</span>
        </Button>
      </div>

      {/* Workflows List */}
      <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
        <div className="divide-y divide-border/40">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-card/60 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-medium text-foreground">
                    {wf.name}
                  </span>
                  <Badge
                    variant={wf.status === "Activo" ? "success" : "outline"}
                    className="text-[10px] py-0 px-1.5"
                  >
                    {wf.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-mono text-[11px]">{wf.trigger}</span>
                  <span>•</span>
                  <span>{wf.lastRun}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <div className="text-right">
                  <div className="font-medium text-foreground">{wf.successRate}</div>
                  <div className="text-[10px]">Tasa de éxito</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-foreground font-mono">{wf.runs}</div>
                  <div className="text-[10px]">Ejecuciones</div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
