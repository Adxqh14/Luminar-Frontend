# Personal Workspace

> Un "All-in-One Personal Workspace" que centraliza música, IA, productividad y búsqueda en un solo lugar.

Desarrollado por **Adxqh14**.

## ✨ Características

| Módulo | Estado |
|---|---|
| 🎛️ Command Palette (Cmd+K) | 🚧 V1 |
| ✅ To-Do List | 🚧 V1 |
| 📅 Calendario | 🚧 V1 |
| 🎵 Integración con Spotify | 📋 V2 |
| 📖 Diccionario | 📋 V2 |
| 🤖 Hub de IAs | 📋 V3 |
| 🔎 Búsqueda global semántica | 📋 V3 |

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 15 (App Router) + TypeScript
- **UI:** Tailwind CSS + shadcn/ui
- **Command Palette:** `cmdk`
- **Estado:** Zustand
- **Base de datos:** PostgreSQL (Neon / Supabase)
- **ORM:** Prisma
- **Autenticación:** Auth.js (NextAuth v5)
- **IA:** Vercel AI SDK
- **Cache / Rate limiting:** Upstash Redis
- **Hosting:** Vercel
- **Testing:** Vitest + Playwright

## 🚀 Instalación

### Requisitos previos

- Node.js 20+
- pnpm (recomendado) o npm
- Una base de datos PostgreSQL (local o Neon/Supabase)

### Pasos

1. Clona el repositorio

   ```bash
   git clone https://github.com/Adxqh14/personal-workspace.git
   cd personal-workspace
   ```

2. Instala las dependencias

   ```bash
   pnpm install
   ```

3. Configura las variables de entorno

   ```bash
   cp .env.example .env
   ```

   Completa las siguientes variables en `.env`:

   ```
   DATABASE_URL=
   NEXTAUTH_SECRET=
   NEXTAUTH_URL=http://localhost:3000

   SPOTIFY_CLIENT_ID=
   SPOTIFY_CLIENT_SECRET=

   ANTHROPIC_API_KEY=
   OPENAI_API_KEY=
   ```

4. Ejecuta las migraciones de Prisma

   ```bash
   pnpm prisma migrate dev
   ```

5. Levanta el servidor de desarrollo

   ```bash
   pnpm dev
   ```

   La app estará disponible en [http://localhost:3000](http://localhost:3000)

## 📂 Estructura del proyecto

```
src/
├── app/            # Rutas (App Router)
├── components/     # Componentes de UI
├── lib/            # Lógica de negocio, clientes de API
├── hooks/          # Custom hooks
├── store/          # Estado global (Zustand)
└── types/          # Tipos compartidos
```

## 🗺️ Roadmap

- [ ] **V1 — Núcleo:** Shell, autenticación, Cmd+K (navegación), To-Do List, Calendario
- [ ] **V2 — Integraciones:** Spotify, Diccionario
- [ ] **V3 — Inteligencia:** Hub de IAs, búsqueda semántica global

## 📄 Licencia

© MountainDev. Todos los derechos reservados.
