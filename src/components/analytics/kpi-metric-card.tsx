"use client";

import * as React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiMetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  detail: string;
  trend?: "up" | "down" | "neutral";
  isInverseGood?: boolean; // For metrics like cycle time where lower is better
  icon?: React.ReactNode;
}

export function KpiMetricCard({
  label,
  value,
  change,
  changeLabel,
  detail,
  trend,
  isInverseGood = false,
  icon,
}: KpiMetricCardProps) {
  const isPositive = (change ?? 0) > 0;
  const isGood = isInverseGood ? !isPositive : isPositive;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/40 p-4 transition-all duration-200 hover:border-border/80 hover:bg-card/70 hover:shadow-xs space-y-2">
      {/* Top row: Label & Icon */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium text-foreground/80">{label}</span>
        {icon && <div className="text-muted-foreground/70">{icon}</div>}
      </div>

      {/* Main value */}
      <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground font-mono">
        {value}
      </div>

      {/* Footer: Detail & Trend badge */}
      <div className="flex items-center justify-between pt-1 border-t border-border/30 text-[11px] text-muted-foreground">
        <span className="truncate max-w-[170px]">{detail}</span>

        {change !== undefined && (
          <span
            className={cn(
              "font-mono font-medium flex items-center gap-0.5 shrink-0 px-1.5 py-0.5 rounded",
              isGood
                ? "text-emerald-500 bg-emerald-500/10"
                : "text-amber-500 bg-amber-500/10"
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : change < 0 ? (
              <ArrowDownRight className="h-3 w-3" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
            <span>
              {isPositive ? `+${change}%` : `${change}%`}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
