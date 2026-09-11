"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";
import { useLanguage } from "@/components/language-provider";
import { DEMO_USERS } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Activity, ArrowRight, ShieldCheck, Lock } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "/board";
  
  const { loginAs, loginWithCredentials } = useAuthStore();
  const { t } = useLanguage();
  const [email, setEmail] = React.useState("gabriel@nexus-pulse.dev");
  const [password, setPassword] = React.useState("••••••••••••");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDemoLogin = async (userId: string) => {
    setIsLoading(true);
    await loginAs(userId);
    router.push(redirectParam);
    router.refresh();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await loginWithCredentials(email);
    router.push(redirectParam);
    router.refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-md w-full mx-auto space-y-5"
    >
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] font-medium">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Edge Middleware & HttpOnly Cookie Guard</span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {t.authPage.title}
        </h1>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          {t.authPage.subtitle}
        </p>
      </div>

      {/* Notice if redirected from a protected route */}
      {searchParams.get("redirect") && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2"
        >
          <Lock className="h-4 w-4 shrink-0" />
          <span>
            <strong>Ruta protegida:</strong> Se requiere sesión activa para acceder a{" "}
            <code className="font-mono px-1 py-0.5 rounded bg-background/50 text-[11px]">
              {searchParams.get("redirect")}
            </code>
          </span>
        </motion.div>
      )}

      {/* Credentials Form */}
      <div className="p-6 rounded-2xl border border-border/50 bg-card/40 shadow-sm space-y-5">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              {t.authPage.emailLabel}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-9 rounded-lg border border-border/60 bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="name@company.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              {t.authPage.passwordLabel}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-9 rounded-lg border border-border/60 bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
          </div>

          <Button
            type="submit"
            variant="inverted"
            disabled={isLoading}
            className="w-full h-9 text-xs"
          >
            {isLoading ? "Validando sesión..." : t.authPage.loginBtn}
          </Button>
        </form>

        {/* Demo 1-Click Persona Access (RBAC Showcase) */}
        <div className="border-t border-border/40 pt-4 space-y-3">
          <div className="space-y-0.5 text-center">
            <div className="text-xs font-semibold text-foreground flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              <span>{t.authPage.demoTitle}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {t.authPage.demoSubtitle}
            </p>
          </div>

          <div className="space-y-2 pt-1">
            {DEMO_USERS.map((demoUser) => (
              <button
                key={demoUser.id}
                onClick={() => handleDemoLogin(demoUser.id)}
                disabled={isLoading}
                type="button"
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-border/40 bg-background hover:bg-muted/50 hover:border-border transition-all duration-150 text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-7 w-7 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                    {demoUser.initials}
                  </span>
                  <div>
                    <div className="text-xs font-medium text-foreground">
                      {demoUser.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {demoUser.title}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      demoUser.role === "admin"
                        ? "default"
                        : demoUser.role === "product_manager"
                        ? "success"
                        : "outline"
                    }
                    className="text-[9px] py-0 px-1.5 uppercase tracking-wider"
                  >
                    {demoUser.role}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between p-6 bg-background text-foreground transition-colors duration-200">
      {/* Top bar with toggles */}
      <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Activity className="h-4 w-4" />
          </div>
          <span className="font-semibold text-sm tracking-tight">NexusPulse</span>
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      {/* Main Login Card wrapped in Suspense for useSearchParams */}
      <React.Suspense
        fallback={
          <div className="max-w-md w-full mx-auto p-8 text-center text-xs text-muted-foreground">
            Cargando seguridad de sesión...
          </div>
        }
      >
        <LoginForm />
      </React.Suspense>

      {/* Footer copyright */}
      <div className="text-center text-xs text-muted-foreground py-2">
        NexusPulse • Rol-Based Access Control & Edge Security Architecture
      </div>
    </div>
  );
}
