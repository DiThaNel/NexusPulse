"use client";

import { motion } from "framer-motion";
import { BarChart3, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language-provider";

export default function AnalyticsPage() {
  const { t } = useLanguage();

  const metrics = [
    { label: "Throughput Total", value: "2.4M req", change: "+14.2%", detail: "Últimos 30 días" },
    { label: "Latencia Promedio", value: "18ms", change: "-4.1%", detail: "Server Component Streaming" },
    { label: "Disponibilidad del Sistema", value: "99.98%", change: "Óptimo", detail: "Sin incidentes reportados" },
    { label: "Nodos de Ejecución", value: "16 activos", change: "+2", detail: "Autoescalado dinámico" },
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
            <BarChart3 className="h-5 w-5 text-indigo-500" />
            {t.shell.nav.analytics}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Métricas de rendimiento, latencia y observabilidad de flujos en tiempo real.
          </p>
        </div>

        <Badge variant="outline" className="text-xs font-mono">
          Fase 5: Recharts Integration
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="p-4 rounded-xl border border-border/50 bg-card/40 space-y-1.5"
          >
            <div className="text-xs text-muted-foreground font-medium">{m.label}</div>
            <div className="text-2xl font-semibold tracking-tight text-foreground">
              {m.value}
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
              <span>{m.detail}</span>
              <span className="text-emerald-500 font-medium flex items-center">
                {m.change}
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Operations Performance Log */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Distribución de Carga</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rendimiento por región y tiempos de respuesta.
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            Live Stream
          </Badge>
        </div>

        <div className="space-y-3 pt-2">
          {[
            { region: "Europe West (Frankfurt)", load: "42%", latency: "12ms", status: "Excelente" },
            { region: "US East (N. Virginia)", load: "35%", latency: "24ms", status: "Excelente" },
            { region: "Europe South (Madrid / Lisbon)", load: "18%", latency: "9ms", status: "Óptimo" },
            { region: "Asia Pacific (Tokyo)", load: "5%", latency: "88ms", status: "Normal" },
          ].map((r) => (
            <div
              key={r.region}
              className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-card/50 text-xs"
            >
              <div className="space-y-0.5">
                <div className="font-medium text-foreground">{r.region}</div>
                <div className="text-[11px] text-muted-foreground">Carga distribuida: {r.load}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-muted-foreground">{r.latency}</span>
                <Badge variant="success" className="text-[10px] py-0 px-1.5">
                  {r.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
