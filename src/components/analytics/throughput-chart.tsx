"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThroughputDataPoint } from "@/types";
import { useLanguage } from "@/components/language-provider";
import { TrendingUp } from "lucide-react";

interface ThroughputChartProps {
  data: ThroughputDataPoint[];
}

export function ThroughputChart({ data }: ThroughputChartProps) {
  const { t } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 640;
  const height = 220;
  const paddingX = 40;
  const paddingTop = 25;
  const paddingBottom = 35;

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.completed, d.created)),
    10
  );

  const getX = (index: number) => {
    return paddingX + (index / (data.length - 1)) * (width - 2 * paddingX);
  };

  const getY = (val: number) => {
    const usableHeight = height - paddingTop - paddingBottom;
    return height - paddingBottom - (val / maxVal) * usableHeight;
  };

  // Generate smooth cubic bezier SVG path
  const generateSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i < points.length - 2 ? points[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return d;
  };

  const completedPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.completed) }));
  const createdPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.created) }));

  const completedLinePath = generateSmoothPath(completedPoints);
  const createdLinePath = generateSmoothPath(createdPoints);

  const areaPath = `${completedLinePath} L ${getX(data.length - 1)} ${
    height - paddingBottom
  } L ${getX(0)} ${height - paddingBottom} Z`;

  const hoveredPoint = hoveredIndex !== null ? data[hoveredIndex] : null;
  const hoveredCompletedCoord = hoveredIndex !== null ? completedPoints[hoveredIndex] : null;

  return (
    <div className="rounded-xl border border-border/50 bg-card/40 p-4 sm:p-5 space-y-4">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/30 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-foreground">
              {t.analytics.charts.throughputTitle}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t.analytics.charts.throughputSubtitle}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>{t.analytics.status.completed}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <span className="h-0.5 w-3 bg-muted-foreground/60 rounded" />
            <span>{t.analytics.status.backlog}</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="throughputAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" className="text-primary" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" className="text-primary" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + ratio * (height - paddingTop - paddingBottom);
            return (
              <line
                key={ratio}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="currentColor"
                className="text-border/40"
                strokeDasharray="3 3"
              />
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#throughputAreaGradient)" />

          {/* Created line (dashed) */}
          <path
            d={createdLinePath}
            fill="none"
            stroke="currentColor"
            className="text-muted-foreground/40"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Completed line (primary solid) */}
          <path
            d={completedLinePath}
            fill="none"
            stroke="currentColor"
            className="text-primary"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points & Hit Areas */}
          {data.map((point, index) => {
            const x = getX(index);
            const y = getY(point.completed);
            const isHovered = hoveredIndex === index;

            return (
              <g key={point.date}>
                {/* Vertical hover guide */}
                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingTop}
                    x2={x}
                    y2={height - paddingBottom}
                    stroke="currentColor"
                    className="text-border"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Visible Point */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 5 : 3.5}
                  className={
                    isHovered
                      ? "fill-card stroke-primary stroke-[2.5px] transition-all"
                      : "fill-primary"
                  }
                />

                {/* Transparent wider hit area for easy hover */}
                <rect
                  x={x - 20}
                  y={paddingTop}
                  width={40}
                  height={height - paddingTop - paddingBottom}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                />

                {/* X Axis Labels */}
                <text
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  className={
                    isHovered
                      ? "fill-foreground font-semibold text-[11px] font-mono"
                      : "fill-muted-foreground text-[10px] font-mono"
                  }
                >
                  {point.date}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip with Framer Motion */}
        <AnimatePresence>
          {hoveredPoint && hoveredCompletedCoord && (
            <motion.div
              key="tooltip"
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              style={{
                left: `${(hoveredCompletedCoord.x / width) * 100}%`,
                top: `${(hoveredCompletedCoord.y / height) * 100}%`,
                transform: "translate(-50%, -125%)",
              }}
              className="pointer-events-none absolute z-20 rounded-lg border border-border/80 bg-card p-2.5 shadow-xl text-xs space-y-1 min-w-[130px]"
            >
              <div className="font-mono text-[11px] font-semibold text-foreground border-b border-border/40 pb-1">
                {hoveredPoint.label} ({hoveredPoint.date})
              </div>
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <span className="text-muted-foreground">{t.analytics.status.completed}:</span>
                <span className="font-mono font-bold text-emerald-500">
                  {hoveredPoint.completed}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <span className="text-muted-foreground">{t.analytics.status.backlog}:</span>
                <span className="font-mono font-medium text-foreground">
                  {hoveredPoint.created}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
