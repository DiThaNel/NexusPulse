# NexusPulse — Bitácora de Ingeniería y Fases de Desarrollo

Este documento es el registro técnico oficial de **NexusPulse**. Aquí se documenta de forma evolutiva la arquitectura, decisiones de diseño, módulos construidos y validaciones de calidad realizadas en cada fase del proyecto.

---

## 📑 Tabla de Contenidos

1. [Fase 1: Fundaciones, Design System & Soporte Bilingüe](#fase-1-fundaciones-design-system--soporte-bilingüe)
2. [Fase 2: SaaS Application Shell, Command Palette & RBAC](#fase-2-saas-application-shell-command-palette--rbac)
3. [Fase 3: Tablero Kanban Interactivo con Drag & Drop](#fase-3-tablero-kanban-interactivo-con-drag--drop)
4. [Capa de Seguridad: Edge Middleware, Cookies HttpOnly & Cabeceras HTTP](#capa-de-seguridad-edge-middleware-cookies-httponly--cabeceras-http)
5. [Resiliencia Técnica: Resolución Definitiva de Hidratación SSR/CSR](#resiliencia-técnica-resolución-definitiva-de-hidratación-ssrcsr)
6. [Hoja de Ruta para Próximas Fases](#hoja-de-ruta-para-próximas-fases)

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

## Hoja de Ruta para Próximas Fases

* [x] **Fase 1: Arquitectura Base, Design System e i18n** *(Completado)*
* [x] **Fase 2: SaaS Shell, Command Palette y Multi-Usuario RBAC** *(Completado)*
* [x] **Fase 3: Tablero Kanban Interactivo & Zod Validation** *(Completado)*
* [x] **Módulo de Seguridad: Edge Middleware, Cookies HttpOnly y Security Headers** *(Completado)*
* [ ] **Fase 4: Gestión de Estado Asíncrono & Optimistic UI (TanStack Query)**
* [ ] **Fase 5: Métricas Operativas & Telemetría en Tiempo Real (Analytics)**
* [ ] **Fase 6: Testing Automatizado con Jest / React Testing Library & Vitest**
* [ ] **Fase 7: Auditoría Final, Producción y Push a GitHub**
