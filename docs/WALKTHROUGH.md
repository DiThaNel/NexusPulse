# NexusPulse — Bitácora de Ingeniería y Fases de Desarrollo

Este documento es el registro técnico oficial de **NexusPulse**. Aquí se documenta de forma evolutiva la arquitectura, decisiones de diseño, módulos construidos y validaciones de calidad realizadas en cada fase del proyecto.

---

## 📑 Tabla de Contenidos

1. [🛠️ Stack Tecnológico y Herramientas: Catálogo Detallado y Propósito](#️-stack-tecnológico-y-herramientas-catálogo-detallado-y-propósito)
2. [Fase 1: Fundaciones, Design System & Soporte Bilingüe](#fase-1-fundaciones-design-system--soporte-bilingüe)
3. [Fase 2: SaaS Application Shell, Command Palette & RBAC](#fase-2-saas-application-shell-command-palette--rbac)
4. [Fase 3: Tablero Kanban Interactivo con Drag & Drop](#fase-3-tablero-kanban-interactivo-con-drag--drop)
5. [Capa de Seguridad: Edge Middleware, Cookies HttpOnly & Cabeceras HTTP](#capa-de-seguridad-edge-middleware-cookies-httponly--cabeceras-http)
6. [Resiliencia Técnica: Resolución Definitiva de Hidratación SSR/CSR](#resiliencia-técnica-resolución-definitiva-de-hidratación-ssrcsr)
7. [Fase 4: Gestión de Estado Asíncrono & Optimistic UI (TanStack Query v5)](#fase-4-gestión-de-estado-asíncrono--optimistic-ui-tanstack-query-v5)
8. [Fase 5: Motor de Workflows & Automatizaciones Operativas](#fase-5-motor-de-workflows--automatizaciones-operativas)
9. [Hoja de Ruta Actualizada para Próximas Fases](#hoja-de-ruta-actualizada-para-próximas-fases)

---

## 🛠️ Stack Tecnológico y Herramientas: Catálogo Detallado y Propósito

A continuación se detalla cada una de las tecnologías, librerías y herramientas utilizadas en **NexusPulse**, explicando con precisión técnica cuál es su rol y por qué fue seleccionada para este producto:

| Tecnología / Herramienta | Versión | Rol Específico y Propósito en el Proyecto |
| :--- | :--- | :--- |
| **Next.js (App Router & Turbopack)** | `16.3.4` | **Base Arquitectónica Full-Stack**: Proporciona Server-Side Rendering (SSR) de alto rendimiento, compilación instantánea con Turbopack, endpoints de API REST internos (`/api/tasks`, `/api/auth/*`) y Edge Middleware perimetral. |
| **React** | `19.2.8` | **Motor de UI Reactivo**: Proporciona concurrencia nativa, soporte de Hooks modernos (`useTransition`, `useOptimistic`), propagación de `ref` sin necesidad de `forwardRef` y renderizado optimizado del árbol de componentes. |
| **TypeScript (Strict Mode)** | `5.x` | **Seguridad Estática de Tipos**: Contratos de datos inmutables (`User`, `Task`, `Column`, `SessionCookiePayload`), inferencia automática de esquemas con `z.infer`, y erradicación total de tipos implícitos `any` en todo el repositorio. |
| **Tailwind CSS v4 (`@tailwindcss/postcss`)** | `4.x` | **Motor de Estilos de Nueva Generación**: Arquitectura sin archivos JavaScript de configuración pesada (`@theme`). Tokens semánticos HSL (`background`, `foreground`, `border`, `card`, `primary`) con soporte para temas claro/oscuro en caliente y bordes ultra-tenues (`border-border/60`). |
| **TanStack Query v5 (`@tanstack/react-query`)** | `5.102.8` | **Gestión de Estado de Servidor (*Server State*)**: Manejo de caché reactiva, revalidación en segundo plano (`staleTime: 60s`), mutaciones optimistas con **latencia percibida de 0ms** (`onMutate`), snapshots previos y **rollback automático** ante fallos de red o errores HTTP 500 (`onError`). |
| **Zustand** | `5.0.15` | **Gestión de Estado de Cliente (*Client UI State*)**: Store en memoria ultraligero y desacoplado para controlar apertura de modales (`TaskModal`, `CommandPalette`), colapso del sidebar responsivo, filtros instantáneos por texto/prioridad/responsable y el conmutador de simulación de errores. |
| **@dnd-kit (Core, Sortable, Utilities)** | `6.3.1` / `10.0.0` | **Motor Accesible de Drag & Drop**: Gestión de eventos táctiles y de puntero para el tablero Kanban. Detección precisa de colisiones (`closestCorners`), ordenamiento dinámico por columnas y previsualizaciones flotantes suaves con `DragOverlay`. |
| **Zod** | `4.6.2` | **Validación y Sanitización en Runtime**: Validación estricta de esquemas tanto en formularios del cliente como en los endpoints del servidor (`src/lib/validations/task.ts`), impidiendo inyecciones de datos no válidos, caracteres prohibidos o payloads corruptos. |
| **Framer Motion** | `13.2.0` | **Micro-Interacciones & Física Táctil**: Orquestación de animaciones elásticas (*spring physics*) en modales (`TaskModal`, `CommandPalette`, Drawer móvil) mediante `<AnimatePresence>` para eliminar desmontajes abruptos, y animación flotante de notificaciones toast (`popLayout`). |
| **cmdk** | `1.1.1` | **Paleta de Comandos Accesible (`⌘K` / `Ctrl+K`)**: Interfaz de búsqueda global rápida por teclado para alternar temas, cambiar idioma, crear tareas y navegar instantáneamente entre vistas. |
| **Lucide React** | `1.45.0` | **Iconografía Minimalista**: Set de iconos vectoriales SVG limpios de 1.5-2px optimizados para *tree-shaking*, aportando elegancia sin sobrecargar el peso del bundle. |
| **Next-Themes & ThemeProvider React 19** | `0.4.6` | **Gestión de Modo Claro / Oscuro**: Control nativo de la clase `.dark` en el elemento raíz `<html>` sincronizado con `localStorage` y compatible al 100% con la arquitectura de hidratación de React 19 sin scripts inline vulnerables. |
| **Bilingual i18n Engine (Propio)** | Nativo | **Internacionalización Bilingüe**: Contexto tipado sin dependencias externas pesadas con soporte completo para Español e Inglés, persistencia local y alternancia reactiva en tiempo real. |
| **Edge Middleware & Security Headers** | Nativo Next.js | **Capa de Seguridad Perimetral**: Protección de rutas privadas (`/board`, `/workflows`, `/analytics`, `/settings`), cookies de sesión seguras con `HttpOnly`, `SameSite=Strict`, e inyección de encabezados HTTP defensivos (CSP, HSTS, X-Frame-Options: DENY). |
| **Capacitor (Ionic) [Fase 6 Programada]** | *Próxima* | **Vía Híbrida / Empaquetado Nativo Móvil**: Empaquetado de la aplicación Next.js en ejecutables nativos para iOS y Android, permitiendo acceso a APIs reales del dispositivo (vibración háptica al soltar tarjetas Kanban, notificaciones push nativas y gestión de barra de estado). |
| **Robocopy (Robust File Copy)** | Sistema Windows | **Sincronización Segura de Repositorio**: Espejeado exacto entre el entorno de trabajo sandbox (`scratch\nexus-pulse`) y el repositorio de escritorio (`Desktop\NexusPulse`), excluyendo directorios pesados (`.git`, `.next`, `node_modules`). |
| **Git (Local Version Control)** | Sistema | **Control de Versiones Riguroso**: Historial atómico paso a paso siguiendo la convención de commits (`feat`, `style`, `fix`, `docs`), reteniendo el código 100% en local sin ejecutar push remoto a GitHub hasta la fase final. |

---

## Fase 1: Fundaciones, Design System & Soporte Bilingüe

### Objetivos y Alcance
Establecer los cimientos técnicos de la plataforma con Next.js App Router, React 19, TypeScript en modo estricto y un sistema de diseño minimalista basado en tokens HSL.

### Módulos y Archivos Clave
* **Design Tokens (`src/app/globals.css`)**: Variables CSS semánticas en formato HSL para fondos, textos, bordes, estados de foco y acentos primarios, adaptables en caliente.
* **ThemeProvider Nativo para React 19 (`src/components/theme-provider.tsx`)**: Reemplazo del inyector inline de scripts por un gestor nativo de clases CSS en `document.documentElement`, eliminando advertencias de hidratación en React 19.
* **Sistema de Internacionalización Bilingüe (`src/components/language-provider.tsx`)**:
  * Diccionarios tipados estrictos en Español (`src/locales/es.ts`) e Inglés (`src/locales/en.ts`).
  * Persistencia en `localStorage` con fallback reactivo.
* **Componentes Atómicos CVA (`src/components/ui/`)**:
  * `Button`: Variantes semánticas (`default`, `secondary`, `outline`, `ghost`, `inverted`, `destructive`).
  * `Badge`: Indicadores de estado (`default`, `secondary`, `outline`, `success`, `warning`, `destructive`).
  * `Card`: Contenedores con bordes tenues (`border-border/40`) y desenfoque de fondo.

---

## Fase 2: SaaS Application Shell, Command Palette & RBAC

### Objetivos y Alcance
Construir la estructura envolvente de producto SaaS empresarial, navegación rápida mediante teclado y sistema multi-perfil con Control de Acceso Basado en Roles (RBAC).

### Módulos y Archivos Clave
* **Store Global de UI con Zustand (`src/stores/ui-store.ts`)**:
  * Estado colapsable del sidebar con persistencia local.
  * Control del modal de la Command Palette y menús móviles.
* **Application Shell (`src/components/layout/app-shell.tsx`)**:
  * Orquestador de diseño responsivo. Separa la vista pública de login de la consola privada.
* **Sidebar Colapsable (`src/components/layout/sidebar.tsx`)**:
  * Enlaces de navegación a módulos (`Overview`, `Kanban Board`, `Workflows`, `Analytics`, `Settings`).
  * Indicador de versión y acceso al menú de usuario.
* **Header Dinámico con Breadcrumbs (`src/components/layout/header.tsx`)**:
  * Detección de ruta activa y migas de pan automáticas.
  * Notificación contextual para perfiles con restricciones (`Modo Solo Lectura`).
* **Command Palette (`src/components/layout/command-palette.tsx`)**:
  * Integración con `cmdk` y atajo global de teclado (`⌘K` / `Ctrl+K`).
  * Acciones rápidas: cambiar tema, alternar idioma, crear tarea y navegar entre vistas.
* **Multi-Usuario Demo y RBAC (`src/types/index.ts`, `src/stores/auth-store.ts`)**:
  * Tres perfiles con permisos granulares:
    1. **Gabriel Gonçalves (`admin`)**: Acceso y escritura total en todas las áreas.
    2. **Elena Rostova (`product_manager`)**: Creación y gestión de proyectos y tareas.
    3. **Lucas Silva (`viewer`)**: Navegación en modo solo lectura (acciones mutables deshabilitadas).
* **Pantalla de Login Minimalista (`src/app/login/page.tsx`)**:
  * Formulario corporativo y selector de acceso rápido demo en 1 clic para reclutadores.

---

## Fase 3: Tablero Kanban Interactivo con Drag & Drop

### Objetivos y Alcance
Implementar un flujo de trabajo visual completo de gestión de tareas con tecnología de arrastre moderna (`@dnd-kit`), persistencia local y validación estricta de datos con esquemas Zod.

### Módulos y Archivos Clave
* **Validación de Esquemas en Tiempo de Ejecución (`src/lib/validations/task.ts`)**:
  * Esquema Zod `taskSchema`: Valida longitud de título (mínimo 3 caracteres, máximo 100), descripción opcional, enums de estado (`backlog`, `todo`, `in_progress`, `in_review`, `done`), prioridades (`low`, `medium`, `high`, `urgent`), horas estimadas y sanitización de etiquetas.
* **Store de Tareas con Zustand (`src/stores/task-store.ts`)**:
  * Operaciones CRUD: `addTask`, `updateTask`, `deleteTask`, `moveTask`, `reorderTask`.
  * Persistencia automática en `localStorage` (`nexus-pulse-kanban-tasks`).
  * Filtrado reactivo en memoria: búsqueda por texto, filtro por prioridad y filtro por usuario asignado.
* **Componentes del Tablero (`src/components/kanban/`)**:
  * `KanbanBoard`: Contenedor principal orquestador de `DndContext` con sensor de puntero con restricción de activación (`distance: 5px`) para evitar que un clic accidental inicie un arrastre, y sensor de teclado accesible.
  * `KanbanColumn`: Columnas droppable con `SortableContext` y contadores en vivo.
  * `KanbanCard`: Tarjetas ordenables con micro-animaciones, badges de prioridad y avatar de asignación.
  * `KanbanToolbar`: Barra de controles con buscador en tiempo real, filtros refinados (fondo integrado `bg-background`, bordes `border-border/60`, chevron minimalista y opciones `bg-popover` eliminando el gris genérico del navegador) y botón `+ Nueva Tarea`.
  * `TaskModal`: Formulario modal accesible para creación y edición validado en tiempo real con Zod.
* **Enforcement de RBAC**:
  * Si el rol activo es `viewer`, la interfaz bloquea el arrastre (`cursor-default`), oculta botones de creación/edición/borrado y activa un banner informativo.

---

## Capa de Seguridad: Edge Middleware, Cookies HttpOnly & Cabeceras HTTP

### Objetivos y Alcance
Elevar la arquitectura de seguridad a estándares de producción corporativos mediante una estrategia de **Defensa en Profundidad (*Defense in Depth*)**.

### Módulos y Archivos Clave
* **Next.js Edge Middleware (`src/middleware.ts`)**:
  * Intercepta las solicitudes en el Edge de Next.js antes de cualquier renderizado.
  * Protege las rutas privadas: `/board`, `/workflows`, `/analytics` y `/settings`.
  * Si no existe una cookie de sesión válida (`nexus_session`), bloquea el acceso y redirige a `/login?redirect=${pathname}`.
  * Si el usuario ya está autenticado e intenta acceder a `/login`, lo redirige automáticamente al tablero.
  * Inyecta cabeceras defensivas en todas las respuestas salientes.
* **Tokens y Cookies Seguras (`src/lib/auth-session.ts`, `src/app/api/auth/`)**:
  * Emisión de cookie `nexus_session` con banderas de seguridad:
    * `httpOnly: true`: Inaccesible desde JavaScript en el navegador, previniendo el robo de sesión por inyección XSS.
    * `sameSite: "lax"`: Protección contra ataques CSRF.
    * `secure: process.env.NODE_ENV === "production"`: Exclusiva sobre HTTPS.
    * `path: "/"` y expiración de 7 días.
  * Endpoints REST: `/api/auth/login`, `/api/auth/logout`, `/api/auth/session`.
* **Cabeceras HTTP de Seguridad (`next.config.ts`)**:
  * `Content-Security-Policy (CSP)`: Reglas estrictas de fuentes, scripts y conexiones.
  * `Strict-Transport-Security (HSTS)`: `max-age=63072000; includeSubDomains; preload`.
  * `X-Frame-Options: DENY`: Prevención absoluta de ataques de Clickjacking.
  * `X-Content-Type-Options: nosniff`: Prevención de ejecución por mala interpretación de tipo MIME.
  * `Referrer-Policy: strict-origin-when-cross-origin`.
  * `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
* **Auditoría en Vivo en Settings (`src/app/settings/page.tsx`)**:
  * Panel visual con la Matriz de Seguridad y botón *"Auditar Seguridad"* para consulta en vivo del estado del servidor.

---

## Resiliencia Técnica: Resolución Definitiva de Hidratación SSR/CSR

### Diagnóstico del Problema
Al recargar la página en rutas que consumen datos del cliente (`/board`), Next.js reportaba un error recuperable de hidratación:
1. `localStorage` contenía tareas modificadas o perfiles diferentes a los valores iniciales estáticos del servidor.
2. `@dnd-kit` generaba descriptores de accesibilidad dinámicos (`aria-describedby`) con IDs desfasados.
3. El nombre del usuario activo en `UserMenu` difería entre el renderizado del servidor y el cliente.

### Solución Implementada
1. **Inicialización Determinista en Zustand**: El store de tareas arranca con el snapshot estático idéntico en SSR y cliente. La sincronización con `localStorage` se delega a `initializeFromStorage()`, ejecutada de forma segura en el ciclo `useEffect`.
2. **Esqueleto de Sincronización en `KanbanBoard`**: Durante la fase de hidratación se renderiza un esqueleto estático con la misma geometría de 5 columnas. Al confirmarse el montaje, se renderiza el árbol interactivo de `@dnd-kit`.
3. **ID Estático en `DndContext`**: `id="nexus-pulse-kanban-dnd"` fijo para estabilizar los descriptores de accesibilidad.
4. **Guardias de Montaje en la Interfaz**: `UserMenu`, `Header` y `KanbanToolbar` emplean una bandera `mounted` para asegurar consistencia en textos y badges antes de la hidratación.
5. **Resultado Verificado**: 0 errores de hidratación, 0 Recoverable Errors y 0 advertencias en consola tras múltiples recargas duras consecutivas y cambios de rol.

---

## Fase 4: Gestión de Estado Asíncrono & Optimistic UI (TanStack Query v5)

### Objetivos y Alcance
Separar de forma limpia el estado del servidor (*Server State*) del estado de la interfaz (*Client UI State*). Implementar mutaciones optimistas (*Optimistic Updates*) con latencia percibida de 0ms, rollback automático ante rechazos de red y persistencia asíncrona a través de una API REST de endpoints Next.js.

### Arquitectura y Componentes Clave
* **Proveedor de Contexto Query (`src/components/query-provider.tsx`)**:
  * Configuración singleton/request-scoped de `QueryClient` compatible con SSR y Next.js App Router.
  * Estrategia de reintentos (`retry: 1`) y tiempo de obsolescencia (`staleTime: 60s`).
* **Endpoints de Servidor REST (`src/app/api/tasks/`)**:
  * `GET /api/tasks`: Filtrado dinámico por texto, prioridad y responsable con latencia de red simulada (120ms).
  * `POST /api/tasks`: Creación con validación estricta en tiempo de ejecución (Zod) y soporte para error de prueba.
  * `PATCH /api/tasks/[id]`: Actualización y movimiento entre columnas. Soporte para el parámetro `?simulateError=true` para auditoría interactiva de rollback.
  * `DELETE /api/tasks/[id]`: Eliminación de tareas con reversión automática en caso de fallo.
* **Hooks de Mutaciones Optimistas (`src/hooks/use-tasks-query.ts`)**:
  * `useTasksQuery(filters)`: Suscripción a la caché reactiva de TanStack Query (`queryKey: ['tasks', filters]`).
  * `useMoveTaskMutation()`:
    1. **`onMutate`**: Cancela consultas salientes, toma un snapshot del estado previo (`previousTasks`) y mueve inmediatamente la tarjeta en la caché local (latencia percibida: 0ms).
    2. **`onError`**: Si el servidor responde con error (HTTP 500), ejecuta el **Rollback Automático**, restaurando la tarea a su columna original y disparando un toast contextual ámbar.
    3. **`onSuccess`**: Notifica la persistencia exitosa en el backend.
    4. **`onSettled`**: Invalida la query para resincronizar el estado canónico con el servidor.
  * `useCreateTaskMutation()` y `useDeleteTaskMutation()`: Creación y eliminación optimista con reversión inmediata ante contingencias de red.
* **Sistema Flotante de Notificaciones (`src/components/ui/optimistic-toast.tsx`, `src/stores/notification-store.ts`)**:
  * Notificaciones con micro-animaciones en Framer Motion (`popLayout`).
  * Estados semánticos: `rollback` (alerta ámbar con icono de reversión), `success` (confirmación esmeralda).
* **Micro-Interacciones & Animaciones Fluidas de Modales (`framer-motion`)**:
  * **Transiciones Físicas Tipo Resorte (*Spring*)**: Implementación de `AnimatePresence` en `TaskModal` (`src/components/kanban/task-modal.tsx`), `CommandPalette` (`src/components/layout/command-palette.tsx`) y el Drawer móvil de `Sidebar` (`src/components/layout/sidebar.tsx`).
  * **Backdrop con Desenfoque Orgánico**: Desvanecimiento suave (`opacity: 0` → `opacity: 1`) con `backdrop-blur-sm`.
  * **Animación de Entrada y Salida Simétrica**: Eliminación de desmontajes abruptos (`if (!isOpen) return null;`) reemplazados por curvas de aceleración elásticas (`damping: 26, stiffness: 350, mass: 0.8`), brindando una experiencia táctil de nivel senior tipo macOS/Linear.
  * **Preservación de Estado Durante Salida**: Uso de referencias `useRef` para retener los títulos y datos de la tarea durante los ~200ms de transición de cierre, evitando cualquier salto visual o parpadeo de texto (*flicker*).

---

## Fase 5: Motor de Workflows & Automatizaciones Operativas

### Objetivos y Alcance
Transformar la sección de `/workflows` en un motor completo e interactivo de automatizaciones orquestadas. Proporcionar diagramas visuales de pipelines por etapas (Trigger ➔ Condición ➔ Acción), simulación de ejecución en tiempo real con consola de telemetría y logs secuenciales, persistencia asíncrona mediante TanStack Query v5, validación en tiempo de ejecución con Zod y control estricto de accesos RBAC para perfiles *Viewer*.

### Arquitectura y Componentes Clave
* **Endpoints REST de Servidor (`src/app/api/workflows/`)**:
  * `GET /api/workflows`: Listado dinámico con filtros por texto, estado (`active`, `paused`) y tipo de disparador (`webhook`, `cron`, `event`, `manual`).
  * `POST /api/workflows`: Creación con validación estricta en tiempo de ejecución (Zod `workflowSchema`).
  * `PATCH /api/workflows/[id]`: Alternancia optimista entre estados activo y pausado (`toggleStatus`).
  * `DELETE /api/workflows/[id]`: Eliminación de automatizaciones.
  * `POST /api/workflows/[id]/run`: Simulación de ejecución en vivo que genera logs temporizados de telemetría e incrementa las métricas de corrida.
* **Repositorio en Memoria del Servidor (`src/lib/server-workflows.ts`)**:
  * Sembrado con 4 pipelines de producción realistas:
    1. *GitHub Sync & Deploy Trigger* (Webhook ➔ Regla de rama main y CI ➔ Despliegue en producción).
    2. *Kanban Task SLA Escalation* (Evento de tarea > 48h ➔ Prioridad alta/urgente ➔ Alerta Slack #ops).
    3. *Daily Operations Health Check* (Cron diario 00:00 UTC ➔ Ping de microservicios < 250ms ➔ Snapshot de telemetría).
    4. *Done Task Telemetry Archival* (Evento de tarea completada ➔ Tag archival ➔ Escritura en BD).
* **Hooks de TanStack Query v5 (`src/hooks/use-workflows-query.ts`)**:
  * `useWorkflowsQuery(filters)`: Suscripción a la caché reactiva de automatizaciones.
  * `useToggleWorkflowStatusMutation()`: Conmutación optimista (0ms) de estado con rollback automático ante fallo de red.
  * `useRunWorkflowMutation()`: Ejecución en vivo e invalidación de caché reactiva.
  * `useCreateWorkflowMutation()`: Inserción de nuevos flujos con validación.
* **Componentes de Interfaz de Usuario**:
  * **`WorkflowCard` (`src/components/workflows/workflow-card.tsx`)**: Tarjeta interactiva con badge dinámico, estadísticas de telemetría (tasa de éxito, ejecuciones totales, última corrida), conmutador de pausa/activación y botón de ejecución instantánea.
  * **`WorkflowPipelineDrawer` (`src/components/workflows/workflow-pipeline-drawer.tsx`)**: Panel modal con animación Framer Motion que muestra el grafo secuencial de 3 etapas. Al pulsar `[Simular Ejecución en Tiempo Real]`, cada nodo se ilumina progresivamente con resplandor de ejecución y checkmarks esmeralda, mientras la consola inferior despliega logs con marcas de tiempo.
  * **`WorkflowModal` (`src/components/workflows/workflow-modal.tsx`)**: Modal con física *spring* para la creación de automatizaciones validada con Zod.
* **Seguridad y RBAC (Role-Based Access Control)**:
  * El usuario *Lucas Silva* (Viewer) puede inspeccionar workflows y pipelines, pero los botones de creación, cambio de estado y ejecución en vivo están protegidos con candado (`Lock`) e inhabilitados.

---

## Hoja de Ruta Actualizada para Próximas Fases

* [x] **Fase 1: Arquitectura Base, Design System e i18n** *(Completado)*
* [x] **Fase 2: SaaS Shell, Command Palette y Multi-Usuario RBAC** *(Completado)*
* [x] **Fase 3: Tablero Kanban Interactivo & Zod Validation** *(Completado)*
* [x] **Módulo de Seguridad: Edge Middleware, Cookies HttpOnly y Security Headers** *(Completado)*
* [x] **Fase 4: Gestión de Estado Asíncrono & Optimistic UI (TanStack Query v5 & Animaciones de Modales)** *(Completado)*
* [x] **Fase 5: Motor de Workflows & Automatizaciones Operativas (Pipelines, Triggers de Eventos y Ejecución en Tiempo Real)** *(Completado)*
* [ ] **Fase 6: Métricas Operativas & Telemetría en Tiempo Real (Analytics Dashboard)**
* [ ] **Fase 7: Suite de Testing Automatizado con Jest / React Testing Library & Vitest**
* [ ] **Fase 8: Auditoría Final de Rendimiento, Optimización de Producción y Push Remoto a GitHub**
* [ ] **Fase 9 (Hito Final): Versión Mobile App mediante Vía Híbrida / Empaquetado Nativo: Capacitor (Ionic)** *(Sincronización multiplataforma, feedback háptico en drag-and-drop, notificaciones push nativas y empaquetado para iOS/Android)*


