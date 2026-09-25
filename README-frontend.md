# Luminar — Frontend

> Cliente web del "All-in-One Personal Workspace": música, IA, productividad y búsqueda en un solo lugar.

Desarrollado por **Adxqh14**.

## ✨ Características (UI)

| Módulo | Estado |
|---|---|
| 🎛️ Command Palette (Cmd+K) | 🚧 V1 |
| ✅ To-Do List | 🚧 V1 |
| 📅 Calendario | 🚧 V1 |
| 🎵 Reproductor de Spotify | 📋 V2 |
| 📖 Diccionario (widget de consulta rápida) | 📋 V2 |
| 🤖 Chat / Hub de IAs | 📋 V3 |
| 🔎 Búsqueda global semántica | 📋 V3 |

Este repositorio contiene únicamente el **cliente**. La lógica de negocio, autenticación y persistencia viven en [Luminar-Backend](../Luminar-Backend), y este frontend consume su API.

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 15 (App Router) + TypeScript
- **UI:** Tailwind CSS + shadcn/ui
- **Command Palette:** `cmdk`
- **Estado:** Zustand
- **Sesión / Auth:** Auth.js (cliente)
- **Streaming de IA:** Vercel AI SDK (hooks de UI)
- **Testing:** Vitest + Playwright

## 🚀 Instalación

### Requisitos previos

- Node.js 20+
- pnpm (recomendado) o npm
- El backend de Luminar corriendo (local o desplegado) — ver [Luminar-Backend](../Luminar-Backend)

### Pasos

1. Clona el repositorio

   ```bash
   git clone https://github.com/Adxqh14/Luminar-Frontend.git
   cd Luminar-Frontend
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
   NEXT_PUBLIC_API_URL=http://localhost:4000
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=
   ```

4. Levanta el servidor de desarrollo

   ```bash
   pnpm dev
   ```

   La app estará disponible en [http://localhost:3000](http://localhost:3000)

## 📂 Estructura del proyecto

```
src/
├── app/            # Rutas (App Router)
│   ├── (auth)/
│   └── (dashboard)/
│       ├── tasks/
│       ├── calendar/
│       ├── dictionary/
│       ├── spotify/
│       └── ai/
├── components/
│   ├── ui/                  # componentes shadcn
│   ├── command-palette/
│   ├── tasks/
│   ├── calendar/
│   ├── spotify/
│   └── ai/
├── hooks/
├── store/          # stores Zustand
└── types/
```

## 🗺️ Roadmap

- [ ] **V1 — Núcleo:** Shell, autenticación, Cmd+K (navegación), UI de To-Do List, UI de Calendario
- [ ] **V2 — Integraciones:** UI de Spotify, widget de Diccionario
- [ ] **V3 — Inteligencia:** UI de Hub de IAs, búsqueda semántica global

## 📄 Licencia

© Adxqh14. Todos los derechos reservados.
