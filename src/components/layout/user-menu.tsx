"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useLanguage } from "@/components/language-provider";
import { DEMO_USERS, type User } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronUp, LogOut, Shield, UserCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  isCollapsed?: boolean;
}

export function UserMenu({ isCollapsed = false }: UserMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const { user, switchProfile, logout } = useAuthStore();
  const { t } = useLanguage();

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitch = (targetUser: User) => {
    switchProfile(targetUser.id);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/login");
  };

  const currentUser = user || DEMO_USERS[0];

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default";
      case "product_manager":
        return "success";
      case "viewer":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="relative w-full" ref={menuRef}>
      {/* Floating Popover Menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute bottom-full mb-2 z-50 rounded-xl border border-border/60 bg-card text-card-foreground shadow-2xl p-2 animate-in fade-in-0 zoom-in-95 duration-150",
            isCollapsed ? "left-0 w-64" : "left-0 right-0"
          )}
        >
          {/* Active Profile Summary */}
          <div className="px-2.5 py-2 border-b border-border/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                {currentUser.name}
              </span>
              <Badge
                variant={getRoleBadgeVariant(currentUser.role)}
                className="text-[10px] uppercase tracking-wider py-0 px-1.5"
              >
                {currentUser.role}
              </Badge>
            </div>
            <div className="text-[11px] text-muted-foreground truncate">
              {currentUser.email}
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">
              {currentUser.title}
            </div>
          </div>

          {/* Persona Switcher Section */}
          <div className="pt-2 pb-1">
            <div className="px-2.5 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-3 w-3" />
              <span>{t.shell.auth.switchProfile}</span>
            </div>

            <div className="space-y-1 mt-1">
              {DEMO_USERS.map((item) => {
                const isSelected = item.id === currentUser.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSwitch(item)}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left",
                      isSelected
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-semibold">
                        {item.initials}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-foreground">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground">{item.title}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logout Action */}
          <div className="border-t border-border/40 pt-1 mt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{t.shell.auth.logout}</span>
            </button>
          </div>
        </div>
      )}

      {/* Trigger Button Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-2.5 p-1.5 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/60 transition-all duration-150 text-left select-none group",
          isCollapsed ? "justify-center" : "justify-between"
        )}
        title={`${currentUser.name} (${currentUser.role})`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold shrink-0 group-hover:scale-105 transition-transform">
            {currentUser.initials}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden text-left">
              <span className="text-xs font-medium text-foreground truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-muted-foreground truncate capitalize">
                {currentUser.role}
              </span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <ChevronUp
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground opacity-60 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        )}
      </button>
    </div>
  );
}
