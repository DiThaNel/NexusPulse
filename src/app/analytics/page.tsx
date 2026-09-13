"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AnalyticsTimeRange } from "@/types";
import { useLanguage } from "@/components/language-provider";
import { useAnalyticsQuery } from "@/hooks/use-analytics-query";
import { KpiMetricCard } from "@/components/analytics/kpi-metric-card";
import { ThroughputChart } from "@/components/analytics/throughput-chart";
import { WorkloadBarChart } from "@/components/analytics/workload-bar-chart";
import { PriorityDonutChart } from "@/components/analytics/priority-donut-chart";
import { LiveTelemetryFeed } from "@/components/analytics/live-telemetry-feed";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  RefreshCw,
  Clock,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = React.useState<AnalyticsTimeRange>("30d");

  const {
    data: analytics,
    isLoading,
    isFetching,
    refetch,
  } = useAnalyticsQuery(timeRange);

  return (
    <div className="space-y-6 py-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2.5">
              <BarChart3 className="h-5 w-5 text-indigo-500" />
              <span>{t.analytics.title}</span>
            </h1>

            {/* Live Telemetry Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border/40 bg-card text-[11px] font-mono text-muted-foreground shadow-xs">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  isFetching
                    ? "bg-amber-400 animate-pulse"
                    : "bg-emerald-500 animate-pulse"
                )}
              />
              <span>{t.analytics.liveBadge}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-1">
            {t.analytics.subtitle}
          </p>
        </div>

        {/* Time Range Selector & Refresh */}
        <div className="flex items-center gap-2">
          {/* Segmented Time Range Buttons */}
          <div className="flex items-center p-1 rounded-lg border border-border/60 bg-muted/30">
            {(["7d", "30d", "90d"] as AnalyticsTimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-3 py-1 text-xs font-mono rounded-md transition-all",
                  timeRange === range
                    ? "bg-card text-foreground font-semibold shadow-xs border border-border/40"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.analytics.timeRanges[range]}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8 w-8 p-0 border-border/60"
            title="Refrescar métricas"
          >
            <RefreshCw
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground",
                isFetching && "animate-spin"
              )}
            />
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {isLoading || !analytics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 rounded-xl border border-border/40 bg-card/20 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <KpiMetricCard
            label={t.analytics.kpi.throughput}
            value={analytics.overview.totalTasksCompleted}
            change={analytics.overview.tasksCompletedChange}
            detail={t.analytics.kpi.throughputDetail}
            icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
          />

          <KpiMetricCard
            label={t.analytics.kpi.cycleTime}
            value={`${analytics.overview.avgCycleTimeHours}h`}
            change={analytics.overview.cycleTimeChange}
            detail={t.analytics.kpi.cycleTimeDetail}
            isInverseGood={true}
            icon={<Clock className="h-4 w-4 text-blue-500" />}
          />

          <KpiMetricCard
            label={t.analytics.kpi.workflowSuccess}
            value={`${analytics.overview.workflowSuccessRate}%`}
            detail={`${analytics.overview.workflowRuns.toLocaleString()} ${t.analytics.kpi.workflowRunsRecorded}`}
            icon={<CheckCircle2 className="h-4 w-4 text-purple-500" />}
          />

          <KpiMetricCard
            label={t.analytics.kpi.slaCompliance}
            value={`${analytics.overview.slaComplianceRate}%`}
            detail={t.analytics.kpi.slaComplianceDetail}
            icon={<ShieldCheck className="h-4 w-4 text-indigo-500" />}
          />
        </div>
      )}

      {/* Charts Section */}
      {analytics && (
        <div className="space-y-4">
          {/* Top Row: Throughput Chart & Workload Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ThroughputChart data={analytics.throughputTimeline} />
            <WorkloadBarChart data={analytics.assigneeWorkload} />
          </div>

          {/* Bottom Row: Priority Donut Chart & Live Telemetry Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PriorityDonutChart data={analytics.priorityBreakdown} />
            <LiveTelemetryFeed logs={analytics.liveTelemetry} />
          </div>
        </div>
      )}
    </div>
  );
}
