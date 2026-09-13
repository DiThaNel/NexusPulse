"use client";

import * as React from "react";
import { AssigneeWorkloadData } from "@/types";
import { useLanguage } from "@/components/language-provider";
import { Users } from "lucide-react";

interface WorkloadBarChartProps {
  data: AssigneeWorkloadData[];
}

export function WorkloadBarChart({ data }: WorkloadBarChartProps) {
  const { t } = useLanguage();

  if (!data || data.length === 0) return null;

  const maxTotal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="rounded-xl border border-border/50 bg-card/40 p-4 sm:p-5 space-y-4">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/30 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-foreground">
              {t.analytics.charts.workloadTitle}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t.analytics.charts.workloadSubtitle}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>{t.analytics.status.completed}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span>{t.analytics.status.inProgress}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />
            <span>{t.analytics.status.backlog}</span>
          </div>
        </div>
      </div>

      {/* Stacked Bars List */}
      <div className="space-y-4 pt-1">
        {data.map((assignee) => {
          const completedPct = (assignee.completed / assignee.total) * 100;
          const inProgressPct = (assignee.inProgress / assignee.total) * 100;
          const backlogPct = (assignee.backlog / assignee.total) * 100;

          return (
            <div key={assignee.userId} className="space-y-1.5">
              {/* Member name & counts */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-muted/60 border border-border/60 flex items-center justify-center font-mono text-[10px] font-semibold text-foreground">
                    {assignee.initials}
                  </div>
                  <span className="font-medium text-foreground">
                    {assignee.userName}
                  </span>
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                  <span>
                    <strong className="text-foreground">{assignee.completed}</strong> {t.analytics.status.completed.toLowerCase()}
                  </span>
                  <span>•</span>
                  <span>{assignee.total} total</span>
                </div>
              </div>

              {/* Stacked Bar */}
              <div className="h-3 w-full rounded-full bg-muted/40 overflow-hidden flex shadow-inner">
                {/* Completed (Emerald) */}
                <div
                  style={{ width: `${completedPct}%` }}
                  title={`${assignee.completed} completadas (${Math.round(completedPct)}%)`}
                  className="h-full bg-emerald-500 transition-all duration-500 hover:opacity-90"
                />

                {/* In Progress (Blue) */}
                <div
                  style={{ width: `${inProgressPct}%` }}
                  title={`${assignee.inProgress} en progreso (${Math.round(inProgressPct)}%)`}
                  className="h-full bg-blue-500 transition-all duration-500 hover:opacity-90"
                />

                {/* Backlog (Muted) */}
                <div
                  style={{ width: `${backlogPct}%` }}
                  title={`${assignee.backlog} en backlog (${Math.round(backlogPct)}%)`}
                  className="h-full bg-muted-foreground/30 transition-all duration-500 hover:opacity-90"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
