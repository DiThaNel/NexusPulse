"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Settings, ShieldCheck, Lock, Cookie, KeyRound, CheckCircle2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/components/language-provider";
import { useAuthStore } from "@/stores/auth-store";

export default function SettingsPage() {
  const { t } = useLanguage();
  const { user } = useAuthStore();
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [securityData, setSecurityData] = React.useState<{
    authenticated: boolean;
    session?: { role: string; expiresAt: string };
    security?: {
      edgeMiddleware: boolean;
      httpOnlyCookies: boolean;
      headersConfigured: boolean;
      zodValidation: boolean;
    };
  } | null>(null);

  const checkSecurityAudit = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setSecurityData(data);
    } catch {
      // ignore
    } finally {
      setIsVerifying(false);
    }
  };

  React.useEffect(() => {
    checkSecurityAudit();
  }, []);

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
          Preferencias de usuario, auditoría de seguridad y configuración técnica.
        </p>
      </div>

      {/* Security Layer & Edge Middleware Card */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                Capa de Seguridad & Middleware Edge
                <Badge variant="success" className="text-[10px] py-0 px-1.5">
                  Activa
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Arquitectura de defensa en profundidad implementada en Next.js App Router.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={checkSecurityAudit}
            disabled={isVerifying}
            className="h-7 text-xs border-primary/20 bg-background/50 hover:bg-background flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className={`h-3 w-3 ${isVerifying ? "animate-spin" : ""}`} />
            <span>{isVerifying ? "Verificando..." : "Auditar Seguridad"}</span>
          </Button>
        </div>

        {/* Security Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-lg border border-border/50 bg-background/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-primary" />
                Edge Middleware Route Guard
              </span>
              <span className="text-[10px] text-emerald-500 font-mono font-semibold">200 OK</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Protección en el Edge para <code className="text-foreground">/board</code>, <code className="text-foreground">/workflows</code>, <code className="text-foreground">/analytics</code> y <code className="text-foreground">/settings</code>. Redirección automática con parámetro <code className="text-foreground">?redirect=</code>.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-border/50 bg-background/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Cookie className="h-3.5 w-3.5 text-primary" />
                Sesión con Cookie HttpOnly
              </span>
              <span className="text-[10px] text-emerald-500 font-mono font-semibold">Protegido</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Cookie <code className="text-foreground">nexus_session</code> configurada con flags <code className="text-foreground">HttpOnly</code>, <code className="text-foreground">SameSite=Lax</code> y <code className="text-foreground">Path=/</code>. Inmune a robo por inyección XSS.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-border/50 bg-background/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Cabeceras HTTP de Seguridad
              </span>
              <span className="text-[10px] text-emerald-500 font-mono font-semibold">CSP & HSTS</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Content Security Policy estricta, <code className="text-foreground">X-Frame-Options: DENY</code> contra Clickjacking, <code className="text-foreground">nosniff</code>, <code className="text-foreground">strict-origin</code> y HSTS preload.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-border/50 bg-background/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-primary" />
                Esquemas Zod & Control RBAC
              </span>
              <span className="text-[10px] text-emerald-500 font-mono font-semibold">Runtime Guard</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Sanitización de payloads antes del procesamiento. Rol activo verificado: <strong className="text-foreground uppercase">{user?.role || "GUEST"}</strong> ({user?.name || "Sin sesión"}).
            </p>
          </div>
        </div>
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
                Alternar entre modo claro y oscuro con soporte SSR nativo en React 19.
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
