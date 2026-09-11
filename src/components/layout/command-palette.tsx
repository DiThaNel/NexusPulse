"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { useUIStore } from "@/stores/ui-store";
import { useLanguage } from "@/components/language-provider";
import {
  ArrowRight,
  Compass,
  Laptop,
  Moon,
  Plus,
  Sun,
  Languages,
} from "lucide-react";

export function CommandPalette() {
  const router = useRouter();
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t, locale, toggleLocale } = useLanguage();

  // Global keyboard shortcut listener (Cmd+K / Ctrl+K)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName))) {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === "Escape" && isCommandPaletteOpen) {
        e.preventDefault();
        setCommandPaletteOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const navigateTo = (path: string) => {
    setCommandPaletteOpen(false);
    router.push(path);
  };

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 px-4 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-150"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border/60 bg-card text-card-foreground shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label={t.shell.commandPalette.title} className="w-full">
          {/* Search Input */}
          <div className="flex items-center border-b border-border/50 px-3.5">
            <Command.Input
              autoFocus
              placeholder={t.shell.commandPalette.placeholder}
              className="w-full h-12 bg-transparent text-sm placeholder:text-muted-foreground outline-none border-none text-foreground"
            />
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border/60 bg-muted/40 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <Command.List className="max-h-80 overflow-y-auto p-2 text-sm">
            <Command.Empty className="py-6 text-center text-xs text-muted-foreground">
              {t.shell.commandPalette.empty}
            </Command.Empty>

            {/* Navigation Group */}
            <Command.Group
              heading={t.shell.commandPalette.groupNavigation}
              className="text-[11px] font-medium text-muted-foreground px-2 py-1.5 uppercase tracking-wider"
            >
              <Command.Item
                onSelect={() => navigateTo("/")}
                className="flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer text-sm text-foreground hover:bg-muted/60 data-[selected=true]:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="h-4 w-4 text-muted-foreground" />
                  <span>{t.shell.nav.overview}</span>
                </div>
                <ArrowRight className="h-3 w-3 text-muted-foreground opacity-50" />
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/workflows")}
                className="flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer text-sm text-foreground hover:bg-muted/60 data-[selected=true]:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{t.shell.nav.workflows}</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">/workflows</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/board")}
                className="flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer text-sm text-foreground hover:bg-muted/60 data-[selected=true]:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{t.shell.nav.board}</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">/board</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/analytics")}
                className="flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer text-sm text-foreground hover:bg-muted/60 data-[selected=true]:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  <span>{t.shell.nav.analytics}</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">/analytics</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/settings")}
                className="flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer text-sm text-foreground hover:bg-muted/60 data-[selected=true]:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  <span>{t.shell.nav.settings}</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">/settings</span>
              </Command.Item>
            </Command.Group>

            {/* Quick Actions */}
            <Command.Group
              heading={t.shell.commandPalette.groupActions}
              className="text-[11px] font-medium text-muted-foreground px-2 py-1.5 mt-2 uppercase tracking-wider border-t border-border/40"
            >
              <Command.Item
                onSelect={() => navigateTo("/board")}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-sm text-foreground hover:bg-muted/60 data-[selected=true]:bg-muted/70 transition-colors"
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
                <span>{t.shell.commandPalette.actionNewTask}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigateTo("/workflows")}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-sm text-foreground hover:bg-muted/60 data-[selected=true]:bg-muted/70 transition-colors"
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
                <span>{t.shell.commandPalette.actionNewWorkflow}</span>
              </Command.Item>
            </Command.Group>

            {/* Preferences */}
            <Command.Group
              heading={t.shell.commandPalette.groupPreferences}
              className="text-[11px] font-medium text-muted-foreground px-2 py-1.5 mt-2 uppercase tracking-wider border-t border-border/40"
            >
              <Command.Item
                onSelect={() => setTheme(isDark ? "light" : "dark")}
                className="flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer text-sm text-foreground hover:bg-muted/60 data-[selected=true]:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-500" />}
                  <span>{t.shell.commandPalette.actionToggleTheme}</span>
                </div>
                <span className="text-xs text-muted-foreground capitalize font-mono">
                  {isDark ? "Dark" : "Light"}
                </span>
              </Command.Item>

              <Command.Item
                onSelect={() => toggleLocale()}
                className="flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer text-sm text-foreground hover:bg-muted/60 data-[selected=true]:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Languages className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {locale === "es" ? "Switch language to English" : "Cambiar idioma a Español"}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground uppercase font-mono">
                  {locale}
                </span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          {/* Footer Guide */}
          <div className="flex items-center justify-between border-t border-border/40 px-3.5 py-2 bg-muted/20 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>↑↓ para navegar</span>
              <span>↵ para seleccionar</span>
            </div>
            <span>NexusPulse Shell</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
