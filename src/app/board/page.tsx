"use client";

import { motion } from "framer-motion";
import { KanbanSquare } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { KanbanBoard } from "@/components/kanban/kanban-board";

export default function BoardPage() {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 py-2"
    >
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2.5">
            <KanbanSquare className="h-5 w-5 text-primary" />
            {t.kanban.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t.kanban.subtitle}
          </p>
        </div>
      </div>

      {/* Live Interactive Kanban Board */}
      <KanbanBoard />
    </motion.div>
  );
}
