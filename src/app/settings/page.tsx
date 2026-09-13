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
          {t.settingsPage.subtitle}
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
                {t.settingsPage.securityCard.title}
                <Badge variant="success" className="text-[10px] py-0 px-1.5">
                  {t.settingsPage.securityCard.badge}
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t.settingsPage.securityCard.desc}
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
            <span>{isVerifying ? t.settingsPage.securityCard.verifying : t.settingsPage.securityCard.auditBtn}</span>
          </Button>
        </div>

        {/* Security Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-lg border border-border/50 bg-background/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-primary" />
                {t.settingsPage.securityCard.items.edgeGuard.title}
              </span>
              <span className="text-[10px] text-emerald-500 font-mono font-semibold">
                {t.settingsPage.securityCard.items.edgeGuard.status}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t.settingsPage.securityCard.items.edgeGuard.desc}
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-border/50 bg-background/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Cookie className="h-3.5 w-3.5 text-primary" />
                {t.settingsPage.securityCard.items.cookie.title}
              </span>
              <span className="text-[10px] text-emerald-500 font-mono font-semibold">
                {t.settingsPage.securityCard.items.cookie.status}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t.settingsPage.securityCard.items.cookie.desc}
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-border/50 bg-background/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                {t.settingsPage.securityCard.items.headers.title}
              </span>
              <span className="text-[10px] text-emerald-500 font-mono font-semibold">
                {t.settingsPage.securityCard.items.headers.status}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t.settingsPage.securityCard.items.headers.desc}
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-border/50 bg-background/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-primary" />
                {t.settingsPage.securityCard.items.rbac.title}
              </span>
              <span className="text-[10px] text-emerald-500 font-mono font-semibold">
                {t.settingsPage.securityCard.items.rbac.status}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t.settingsPage.securityCard.items.rbac.desc} <strong className="text-foreground uppercase">{user?.role || "GUEST"}</strong> ({user?.name || t.settingsPage.securityCard.items.rbac.noSession}).
            </p>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="rounded-xl border border-border/50 bg-card/30 p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            {t.settingsPage.preferencesCard.title}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t.settingsPage.preferencesCard.desc}
          </p>
        </div>

        <div className="divide-y divide-border/40 pt-1">
          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-foreground">
                {t.settingsPage.preferencesCard.themeTitle}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {t.settingsPage.preferencesCard.themeDesc}
              </div>
            </div>
            <ThemeToggle />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-foreground">
                {t.settingsPage.preferencesCard.langTitle}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {t.settingsPage.preferencesCard.langDesc}
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
              {t.settingsPage.workspaceCard.title}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t.settingsPage.workspaceCard.desc}
            </p>
          </div>
          <Badge variant="success" className="text-xs">
            {t.settingsPage.workspaceCard.planBadge}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg border border-border/40 bg-card/40 space-y-1">
            <span className="text-muted-foreground">{t.settingsPage.workspaceCard.nameLabel}</span>
            <div className="font-semibold text-foreground">{t.shell.workspace}</div>
          </div>

          <div className="p-3 rounded-lg border border-border/40 bg-card/40 space-y-1">
            <span className="text-muted-foreground">{t.settingsPage.workspaceCard.devLabel}</span>
            <div className="font-semibold text-foreground">{t.shell.user.name}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
