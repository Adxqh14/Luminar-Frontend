"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { api } from "@/lib/api";

type Task = { id: string; title: string; completed: boolean };
type Event = { id: string; title: string; startAt: string; allDay: boolean };

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  const loadData = useCallback(() => {
    api<Task[]>("/tasks").then(setTasks).catch(() => setTasks([]));

    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    api<Event[]>(`/events?from=${from.toISOString()}&to=${to.toISOString()}`)
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => {
          if (!v) loadData();
          return !v;
        });
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [loadData]);

  function go(path: string) {
    setOpen(false);
    setSearch("");
    router.push(path);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 pt-32"
      onClick={() => setOpen(false)}
    >
      <Command
        shouldFilter={true}
        className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-xl dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        <Command.Input
          value={search}
          onValueChange={setSearch}
          autoFocus
          placeholder="Buscar tareas, eventos, o ir a una página..."
          className="w-full border-b border-neutral-200 bg-transparent px-4 py-3 text-sm text-neutral-900 outline-none dark:border-neutral-800 dark:text-white"
        />
        <Command.List className="max-h-96 overflow-y-auto p-2">
          <Command.Empty className="p-4 text-center text-sm text-neutral-400">
            Sin resultados.
          </Command.Empty>

          <Command.Group heading="Navegación" className="text-xs font-medium text-neutral-400 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
            <Command.Item
              onSelect={() => go("/dashboard")}
              className="cursor-pointer rounded-lg px-2 py-2 text-sm text-neutral-700 data-[selected=true]:bg-neutral-100 dark:text-neutral-200 dark:data-[selected=true]:bg-neutral-800"
            >
              Ir a Dashboard
            </Command.Item>
            <Command.Item
              onSelect={() => go("/tasks")}
              className="cursor-pointer rounded-lg px-2 py-2 text-sm text-neutral-700 data-[selected=true]:bg-neutral-100 dark:text-neutral-200 dark:data-[selected=true]:bg-neutral-800"
            >
              Ir a Tareas
            </Command.Item>
            <Command.Item
              onSelect={() => go("/calendario")}
              className="cursor-pointer rounded-lg px-2 py-2 text-sm text-neutral-700 data-[selected=true]:bg-neutral-100 dark:text-neutral-200 dark:data-[selected=true]:bg-neutral-800"
            >
              Ir a Calendario
            </Command.Item>
          </Command.Group>

          {tasks.length > 0 && (
            <Command.Group heading="Tareas" className="text-xs font-medium text-neutral-400 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
              {tasks.map((t) => (
                <Command.Item
                  key={t.id}
                  value={t.title}
                  onSelect={() => go("/tasks")}
                  className="cursor-pointer rounded-lg px-2 py-2 text-sm text-neutral-700 data-[selected=true]:bg-neutral-100 dark:text-neutral-200 dark:data-[selected=true]:bg-neutral-800"
                >
                  {t.completed ? "✅ " : "⬜ "}
                  {t.title}
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {events.length > 0 && (
            <Command.Group heading="Eventos" className="text-xs font-medium text-neutral-400 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
              {events.map((e) => (
                <Command.Item
                  key={e.id}
                  value={e.title}
                  onSelect={() => go("/calendario")}
                  className="flex justify-between cursor-pointer rounded-lg px-2 py-2 text-sm text-neutral-700 data-[selected=true]:bg-neutral-100 dark:text-neutral-200 dark:data-[selected=true]:bg-neutral-800"
                >
                  <span>📅 {e.title}</span>
                  <span className="text-xs text-neutral-400">
                    {new Date(e.startAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </Command>
    </div>
  );
}