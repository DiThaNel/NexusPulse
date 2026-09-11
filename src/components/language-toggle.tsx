"use client";

import * as React from "react";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { locale, toggleLocale, t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-14 rounded-lg border border-border/40 bg-card/40" />
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      className="h-8 px-2.5 text-xs font-mono tracking-wider text-muted-foreground hover:text-foreground border border-border/50 bg-card/40 hover:bg-card transition-colors duration-150"
      aria-label={t.nav.switchLanguage}
      title={t.nav.switchLanguage}
    >
      <span className={locale === "es" ? "font-bold text-foreground" : "opacity-40"}>
        ES
      </span>
      <span className="mx-1 opacity-25">/</span>
      <span className={locale === "en" ? "font-bold text-foreground" : "opacity-40"}>
        EN
      </span>
    </Button>
  );
}
