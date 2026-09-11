"use client";

import { motion } from "framer-motion";
import { Settings, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/components/language-provider";

export default function SettingsPage() {
  const { t, locale } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 py-2 max-w-4xl"
    >
      {/* Header */}
      <div className="border-b border-border/40 pb-4">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2.5">
          <Settings className="h-5 w-5 text-muted-foreground" />
          {t.shell.nav.settings}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Preferencias de usuario, espacio de trabajo y configuración técnica.
        </p>
      </div>

      {/* Preferences Section */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Preferencias de Interfaz
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Personaliza el tema visual y el idioma de la aplicación.
          </p>
        </div>

        <div className="divide-y divide-border/40 pt-1">
          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-foreground">Tema Visual</div>
              <div className="text-[11px] text-muted-foreground">
                Alternar entre modo claro y oscuro con soporte SSR.
              </div>
            </div>
            <ThemeToggle />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-foreground">Idioma / Localization</div>
              <div className="text-[11px] text-muted-foreground">
                Seleccionar Español o Inglés con persistencia en localStorage.
              </div>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Workspace Profile */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Espacio de Trabajo
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Información de tu organización y credenciales.
            </p>
          </div>
          <Badge variant="success" className="text-xs">
            Plan Enterprise
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg border border-border/40 bg-card/40 space-y-1">
            <span className="text-muted-foreground">Nombre del Workspace</span>
            <div className="font-semibold text-foreground">{t.shell.workspace}</div>
          </div>

          <div className="p-3 rounded-lg border border-border/40 bg-card/40 space-y-1">
            <span className="text-muted-foreground">Desarrollador Responsable</span>
            <div className="font-semibold text-foreground">{t.shell.user.name}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
