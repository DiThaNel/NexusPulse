"use client";

import * as React from "react";
import { PriorityBreakdownData } from "@/types";
import { useLanguage } from "@/components/language-provider";
import { AlertCircle } from "lucide-react";

interface PriorityDonutChartProps {
  data: PriorityBreakdownData[];
}

export function PriorityDonutChart({ data }: PriorityBreakdownData[] | any) {
  const { t } = useLanguage();
  const [hoveredPriority, setHoveredPriority] = React.useState<string | null>(null);

  const items: PriorityBreakdownData[] = Array.isArray(data) ? data : data?.data || [];

  const totalCount = items.reduce((acc, item) => acc + item.count, 0);

  const radius = 64;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const activeItem = items.find((i) => i.priority === hoveredPriority);

  return (
    <div className="rounded-xl border border-border/50 bg-card/40 p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="border-b border-border/30 pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-foreground">
            {t.analytics.charts.priorityTitle}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t.analytics.charts.prioritySubtitle}
        </p>
      </div>

      {/* Body: Donut + Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
        {/* SVG Donut */}
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            {/* Background ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              className="text-muted/30"
              strokeWidth={strokeWidth}
            />

            {/* Slices */}
            {items.map((slice) => {
              const dashLength = (slice.percentage / 100) * circumference;
              const strokeOffset = -(accumulatedPercent / 100) * circumference;
              accumulatedPercent += slice.percentage;

              const isHovered = hoveredPriority === slice.priority;

              return (
                <circle
                  key={slice.priority}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                  strokeDashoffset={strokeOffset}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredPriority(slice.priority)}
                  onMouseLeave={() => setHoveredPriority(null)}
                />
              );
            })}
          </svg>

          {/* Center Label */}
          <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-xl font-mono font-bold text-foreground">
              {activeItem ? `${activeItem.percentage}%` : totalCount}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {activeItem ? (t.kanban.priorities[activeItem.priority as keyof typeof t.kanban.priorities] || activeItem.label) : "Total"}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full sm:w-auto space-y-2.5">
          {items.map((slice) => {
            const isHovered = hoveredPriority === slice.priority;
            const localizedLabel = t.kanban.priorities[slice.priority as keyof typeof t.kanban.priorities] || slice.label;

            return (
              <div
                key={slice.priority}
                onMouseEnter={() => setHoveredPriority(slice.priority)}
                onMouseLeave={() => setHoveredPriority(null)}
                className={`flex items-center justify-between gap-4 text-xs p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isHovered ? "bg-muted/60" : "hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="font-medium text-foreground">{localizedLabel}</span>
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                  <span>{slice.count}</span>
                  <span className="font-semibold text-foreground/80 w-8 text-right">
                    {slice.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
