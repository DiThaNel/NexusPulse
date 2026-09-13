"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/stores/notification-store";
import { useLanguage } from "@/components/language-provider";
import { localizeNotification } from "@/lib/translations/card-translations";
import { Bell, Zap, CheckCircle2, AlertTriangle, RotateCcw, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationBell() {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const { history, unreadCount, markAllAsRead, clearHistory } = useNotificationStore();
  const { locale } = useLanguage();

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen) {
      markAllAsRead();
    }
    setIsOpen(!isOpen);
  };

  const isEs = locale === "es";

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
        aria-label={isEs ? "Centro de notificaciones" : "Notification center"}
        title={isEs ? "Notificaciones de Workflows" : "Workflow Notifications"}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground shadow-sm animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl z-50 text-card-foreground overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 px-4 py-3 bg-muted/20">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                <span className="text-xs font-semibold text-foreground">
                  {isEs ? "Centro de Automatizaciones" : "Automations Center"}
                </span>
                <span className="text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-full font-mono">
                  {history.length}
                </span>
              </div>

              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive transition-colors"
                  title={isEs ? "Limpiar historial" : "Clear history"}
                >
                  <Trash2 className="h-3 w-3" />
                  <span>{isEs ? "Limpiar" : "Clear"}</span>
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-border/20">
              {history.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground">
                    <Zap className="h-4 w-4 opacity-50" />
                  </div>
                  <p className="font-medium text-foreground text-[12px]">
                    {isEs ? "Sin notificaciones de workflows" : "No workflow notifications yet"}
                  </p>
                  <p className="text-[11px] opacity-75 max-w-[220px]">
                    {isEs
                      ? "Completa una tarea en el Kanban para ver cómo el workflow dispara alertas en vivo."
                      : "Complete a Kanban task to see the workflow trigger real-time alerts."}
                  </p>
                </div>
              ) : (
                history.map((item) => {
                  const localized = localizeNotification(item, locale);
                  const isWf = localized.type === "workflow";
                  const dateStr = new Date(localized.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });

                  return (
                    <div
                      key={localized.id}
                      className={`p-3.5 flex items-start gap-3 transition-colors ${
                        isWf ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/30"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isWf ? (
                          <div className="h-6 w-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary shadow-sm">
                            <Zap className="h-3.5 w-3.5 fill-primary" />
                          </div>
                        ) : localized.type === "rollback" ? (
                          <RotateCcw className="h-4 w-4 text-amber-500" />
                        ) : localized.type === "success" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : localized.type === "warning" ? (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Info className="h-4 w-4 text-primary" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <div className="text-xs font-semibold text-foreground truncate">
                            {localized.title}
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                            {dateStr}
                          </span>
                        </div>
                        {localized.message && (
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug break-words">
                            {localized.message}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border/40 px-4 py-2 bg-muted/10 text-center">
              <span className="text-[10px] text-muted-foreground">
                {isEs
                  ? "Sincronizado en vivo con el motor de workflows"
                  : "Live synchronized with workflows engine"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
