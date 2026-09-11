"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";
import { useAuthStore } from "@/stores/auth-store";
import { useLanguage } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Menu, Search } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const { setMobileSidebarOpen, setCommandPaletteOpen } = useUIStore();
  const { user } = useAuthStore();
  const { t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Determine current route title for breadcrumbs
  const getBreadcrumbTitle = () => {
    if (pathname === "/") return t.shell.breadcrumbs.overview;
    if (pathname.startsWith("/workflows")) return t.shell.breadcrumbs.workflows;
    if (pathname.startsWith("/board")) return t.shell.breadcrumbs.board;
    if (pathname.startsWith("/analytics")) return t.shell.breadcrumbs.analytics;
    if (pathname.startsWith("/settings")) return t.shell.breadcrumbs.settings;
    return pathname.replace("/", "");
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md px-4 sm:px-6">
      {/* Left side: Mobile menu toggle + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <Link href="/" className="hover:text-foreground transition-colors">
            {t.shell.breadcrumbs.root}
          </Link>
          <ChevronRight className="h-3 w-3 opacity-40" />
          <span className="text-foreground font-semibold">
            {getBreadcrumbTitle()}
          </span>
        </nav>
      </div>

      {/* Right side: Role badge + Command Palette trigger + Language + Theme */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {mounted && user?.role === "viewer" && (
          <Badge
            variant="warning"
            className="hidden sm:inline-flex text-[10px] py-0 px-2 font-medium"
          >
            {t.shell.auth.readOnlyNotice}
          </Badge>
        )}

        {/* Command Palette Trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCommandPaletteOpen(true)}
          className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground border-border/50 bg-card/40 hover:bg-card flex items-center gap-2 transition-all duration-150"
          title={t.shell.searchPlaceholder}
        >
          <Search className="h-3.5 w-3.5 opacity-60" />
          <span className="hidden sm:inline font-normal text-muted-foreground">
            {t.shell.searchPlaceholder}
          </span>
          <kbd className="hidden sm:inline-flex items-center rounded border border-border/60 bg-muted/50 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </Button>

        {/* Language switcher */}
        <LanguageToggle />

        {/* Theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
