"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/stores/notification-store";
import { useLanguage } from "@/components/language-provider";
import { localizeNotification } from "@/lib/translations/card-translations";
import { AlertTriangle, CheckCircle2, Info, RotateCcw, X, Zap } from "lucide-react";

export function OptimisticToastContainer() {
  const { notifications, dismissNotification } = useNotificationStore();
  const { locale } = useLanguage();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      <AnimatePresence mode="popLayout">
        {notifications.map((notif) => {
          const localized = localizeNotification(notif, locale);
          const isWorkflow = localized.type === "workflow";
          const isRollback = localized.type === "rollback";
          const isSuccess = localized.type === "success";
          const isWarning = localized.type === "warning";

          return (
            <motion.div
              key={localized.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl backdrop-blur-md flex items-start gap-3 transition-colors ${
                isWorkflow
                  ? "border-primary/60 bg-card/95 text-card-foreground ring-1 ring-primary/30 shadow-[0_4px_24px_rgba(99,102,241,0.22)]"
                  : isRollback
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200"
                  : isSuccess
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200"
                  : isWarning
                  ? "border-amber-500/30 bg-card text-foreground"
                  : "border-border/60 bg-card text-foreground"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isWorkflow ? (
                  <div className="h-5 w-5 rounded-md bg-primary/20 flex items-center justify-center text-primary">
                    <Zap className="h-3.5 w-3.5 fill-primary text-primary animate-pulse" />
                  </div>
                ) : isRollback ? (
                  <RotateCcw className="h-4 w-4 text-amber-500 animate-spin-reverse" />
                ) : isSuccess ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : isWarning ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                ) : (
                  <Info className="h-4 w-4 text-primary" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold tracking-tight leading-snug">
                  {localized.title}
                </div>
                {localized.message && (
                  <p className="text-[11px] opacity-80 mt-0.5 leading-relaxed">
                    {localized.message}
                  </p>
                )}
              </div>

              <button
                onClick={() => dismissNotification(localized.id)}
                className="opacity-50 hover:opacity-100 p-0.5 rounded transition-opacity"
                aria-label={locale === "es" ? "Cerrar notificación" : "Dismiss notification"}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
