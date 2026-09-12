"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CommandPalette } from "@/components/layout/command-palette";
import { OptimisticToastContainer } from "@/components/ui/optimistic-toast";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If on login route, render children standalone without shell
  if (pathname === "/login") {
    return <div className="min-h-screen bg-background text-foreground">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette />

      {/* Optimistic UI Feedback Toasts */}
      <OptimisticToastContainer />
    </div>
  );
}
