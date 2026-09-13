"use client";

import * as React from "react";
import { TelemetryLog } from "@/types";
import { useLanguage } from "@/components/language-provider";
import { Terminal, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveTelemetryFeedProps {
  logs: TelemetryLog[];
}

export function LiveTelemetryFeed({ logs }: LiveTelemetryFeedProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border border-border/50 bg-card/40 p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/30 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-foreground">
              {t.analytics.charts.telemetryTitle}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            {t.analytics.charts.telemetrySubtitle}
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border/40 bg-card text-[10px] font-mono text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>LIVE STREAM</span>
        </div>
      </div>

      {/* Feed list */}
      <div className="divide-y divide-border/30 overflow-hidden font-mono text-xs">
        {logs.map((log) => (
          <div
            key={log.id}
            className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-muted/20 px-2 rounded-lg transition-colors"
          >
            {/* Left: Time & Actor & Action */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-neutral-500 text-[11px]">
                [{log.timestamp}]
              </span>

              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-muted/60 text-foreground border border-border/40">
                {log.action}
              </span>

              <span className="text-muted-foreground text-[11px] truncate max-w-xs">
                {log.actor}
              </span>

              <span className="text-muted-foreground/60 hidden sm:inline">•</span>

              <span className="text-primary font-medium text-[11px]">
                {log.target}
              </span>
            </div>

            {/* Right: Latency & Status */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Zap className="h-3 w-3 text-amber-500/70" />
                {log.latencyMs}ms
              </span>

              <span
                className={cn(
                  "text-[10px] font-semibold px-1.5 py-0.5 rounded border",
                  log.status.includes("200") || log.status.includes("201")
                    ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                    : "text-blue-500 bg-blue-500/10 border-blue-500/20"
                )}
              >
                {log.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
