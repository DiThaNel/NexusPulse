"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/stores/ui-store";
import { useLanguage } from "@/components/language-provider";
import {
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  GitFork,
  KanbanSquare,
  LayoutDashboard,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/user-menu";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const {
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    setMobileSidebarOpen,
  } = useUIStore();
  const { t } = useLanguage();

  const navItems = [
    {
      title: t.shell.nav.overview,
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: t.shell.nav.workflows,
      href: "/workflows",
      icon: GitFork,
    },
    {
      title: t.shell.nav.board,
      href: "/board",
      icon: KanbanSquare,
    },
    {
      title: t.shell.nav.analytics,
      href: "/analytics",
      icon: BarChart3,
    },
    {
      title: t.shell.nav.settings,
      href: "/settings",
      icon: Settings,
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-3">
      {/* Workspace / Brand Header */}
      <div className="space-y-4">
        <div
          className={cn(
            "flex items-center gap-3 px-2 py-1.5 transition-all duration-200",
            isSidebarCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 overflow-hidden"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Activity className="h-4 w-4" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="font-semibold text-sm tracking-tight text-foreground truncate">
                  {t.shell.workspace}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono truncate">
                  {t.shell.workspaceRole}
                </span>
              </div>
            )}
          </Link>

          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-7 w-7"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                title={isSidebarCollapsed ? item.title : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors select-none",
                  isActive
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  isSidebarCollapsed && "justify-center px-2"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                {!isSidebarCollapsed && (
                  <span className="truncate">{item.title}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Pill & Collapse Button */}
      <div className="space-y-2 border-t border-border/50 pt-3">
        {/* User profile with interactive popover */}
        <UserMenu isCollapsed={isSidebarCollapsed} />

        {/* Desktop Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className={cn(
            "hidden md:flex w-full items-center text-xs text-muted-foreground hover:text-foreground h-8",
            isSidebarCollapsed ? "justify-center px-0" : "justify-between px-2"
          )}
          title={isSidebarCollapsed ? t.shell.expandSidebar : t.shell.collapseSidebar}
        >
          {!isSidebarCollapsed && (
            <span className="text-[11px] font-medium">{t.shell.collapseSidebar}</span>
          )}
          {isSidebarCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-border/50 bg-card/30 backdrop-blur-md transition-all duration-200 z-30 shrink-0 select-none",
          isSidebarCollapsed ? "w-16" : "w-60"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            key="mobile-sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <motion.div
              key="mobile-sidebar-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {sidebarContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
