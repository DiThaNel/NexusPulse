"use client";

import { motion } from "framer-motion";
import { Plus, KanbanSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language-provider";

export default function BoardPage() {
  const { t } = useLanguage();

  const columns = [
    { id: "backlog", title: "Backlog", count: 3 },
    { id: "todo", title: "To Do", count: 4 },
    { id: "in_progress", title: "In Progress", count: 2 },
    { id: "in_review", title: "In Review", count: 2 },
    { id: "done", title: "Done", count: 5 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 py-2"
    >
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2.5">
            <KanbanSquare className="h-5 w-5 text-primary" />
            {t.shell.nav.board}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gestión de tareas operativas y ciclo de vida de proyectos en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono">
            Fase 3: @dnd-kit
          </Badge>
          <Button variant="inverted" size="sm" className="gap-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            <span>Nueva Tarea</span>
          </Button>
        </div>
      </div>

      {/* Kanban Board Columns Mockup / Skeleton for Phase 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-start">
        {columns.map((col) => (
          <div
            key={col.id}
            className="rounded-xl border border-border/50 bg-card/30 p-3 space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground px-1">
              <span className="text-foreground font-semibold">{col.title}</span>
              <span className="h-5 w-5 rounded-full bg-muted/60 flex items-center justify-center text-[10px] font-mono">
                {col.count}
              </span>
            </div>

            {/* Column Task Cards */}
            <div className="space-y-2">
              <div className="p-3 rounded-lg border border-border/40 bg-card/60 hover:border-border transition-colors text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[9px] py-0 px-1">
                    Frontend
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">NP-10{col.count}</span>
                </div>
                <div className="font-medium text-foreground">
                  Optimizar tiempo de renderizado con React 19 Server Actions
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                  <span>Alta prioridad</span>
                  <span className="h-4 w-4 rounded-full bg-primary/20 text-[9px] flex items-center justify-center font-semibold text-primary">
                    GG
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border/40 bg-card/60 hover:border-border transition-colors text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[9px] py-0 px-1">
                    Design
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">NP-10{col.count + 1}</span>
                </div>
                <div className="font-medium text-foreground">
                  Refinar estados interactivos de botones y micro-animaciones
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                  <span>Normal</span>
                  <span className="h-4 w-4 rounded-full bg-emerald-500/20 text-[9px] flex items-center justify-center font-semibold text-emerald-500">
                    GG
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
