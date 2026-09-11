import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  Clock,
  Cpu,
  ExternalLink,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 via-primary to-purple-600 flex items-center justify-center text-white shadow-md shadow-primary/20">
              <Activity className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight">NexusPulse</span>
              <Badge variant="outline" className="hidden sm:inline-flex text-[11px] font-mono">
                v0.1.0 • Paso 1
              </Badge>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <Badge variant="success" className="hidden md:inline-flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Next.js 15 + React 19
            </Badge>

            <Button asChild variant="outline" size="sm" className="gap-2">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5"
              >
                <GithubIcon className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </Button>

            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-5 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            Arquitectura Front-End Moderna & Enterprise-Ready
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-balance">
            Plataforma de Inteligencia Operativa & Flujos en Tiempo Real
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed text-balance">
            Desarrollada para reflejar el estado del arte en ingeniería front-end:{" "}
            <strong className="text-foreground font-semibold">TypeScript estricto</strong>,{" "}
            <strong className="text-foreground font-semibold">Next.js App Router</strong>,{" "}
            <strong className="text-foreground font-semibold">Tailwind v4</strong> y un sistema de diseño modular accesible.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button variant="glow" size="lg" className="gap-2">
              <Zap className="h-4 w-4" />
              Explorar Sistema de Diseño
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
                <GithubIcon className="h-4 w-4" />
                Ver Código Fuente
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>

        {/* Live Metrics Grid Preview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              Telemetría del Core & Fundamentos
            </h2>
            <Badge variant="outline">Métricas en Vivo</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:border-primary/40 transition-colors">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  TypeScript Strict
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Boxes className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">100%</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 text-emerald-500">
                  <ArrowUpRight className="h-3 w-3" /> Tipado integral sin 'any'
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/40 transition-colors">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Framework & Runtime
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Zap className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Next 15 + React 19</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  Server Components nativos
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/40 transition-colors">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Design Tokens
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Layers className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Dark / Light</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  Variables HSL + next-themes
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/40 transition-colors">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Control de Versiones
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <GithubIcon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">main branch</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 text-emerald-500">
                  <CheckCircle2 className="h-3 w-3" /> Sincronizado con GitHub
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Design System & Component Preview */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Showcase de Componentes Base (UI System)
              </CardTitle>
              <CardDescription>
                Componentes atómicos construidos con Tailwind CSS, Radix Primitives y class-variance-authority.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Variantes de Botones
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="default" size="sm">Default</Button>
                  <Button variant="secondary" size="sm">Secondary</Button>
                  <Button variant="outline" size="sm">Outline</Button>
                  <Button variant="ghost" size="sm">Ghost</Button>
                  <Button variant="destructive" size="sm">Destructive</Button>
                  <Button variant="glow" size="sm">Glow</Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Badges Semánticos
                </label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Active • 99.9%</Badge>
                  <Badge variant="warning">In Review</Badge>
                  <Badge variant="destructive">Failed</Badge>
                  <Badge variant="outline">Draft</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Roadmap & Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Hoja de Ruta del Proyecto
              </CardTitle>
              <CardDescription>
                Progreso por fases para solidificar tu experiencia senior.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold flex items-center gap-2">
                      Paso 1: Arquitectura, Design System y Git
                      <Badge variant="success" className="text-[10px] py-0 px-1.5">Completado</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Next.js 15, TypeScript Strict, Tailwind v4, tokens Dark/Light, repo GitHub conectado.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center mt-0.5 shrink-0">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold flex items-center gap-2">
                      Paso 2: Layout SaaS, Sidebar y Command Palette (Cmd+K)
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5">Siguiente</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Navegación colapsable, breadcrumbs dinámicos, shortcuts de teclado y búsqueda global.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3 opacity-70">
                  <div className="h-5 w-5 rounded-full border border-border flex items-center justify-center mt-0.5 shrink-0 text-xs text-muted-foreground">
                    3
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Paso 3: Kanban Interactivo con Drag & Drop</div>
                    <p className="text-xs text-muted-foreground">
                      `@dnd-kit`, gestión de estados con Zustand, filtros reactivos y reordenamiento fluido.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3 opacity-70">
                  <div className="h-5 w-5 rounded-full border border-border flex items-center justify-center mt-0.5 shrink-0 text-xs text-muted-foreground">
                    4
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Paso 4: Mutaciones Optimistas con TanStack Query</div>
                    <p className="text-xs text-muted-foreground">
                      Caché de servidor, reintentos automáticos, rollback en error y UI instantánea.
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <div className="container mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            NexusPulse • Desarrollado por{" "}
            <span className="font-semibold text-foreground">Gabriel Gonçalves</span>
          </p>
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              GitHub Repo
            </a>
            <span>•</span>
            <span>Oporto, Portugal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
