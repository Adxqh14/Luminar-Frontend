"use client";

import { useState } from "react";
import { api } from "@/lib/api";

type Task = { id: string; title: string; priority: string };
type Event = { id: string; title: string; startAt: string; allDay: boolean };

type ParseResult = { kind: "task"; item: Task } | { kind: "event"; item: Event };

export default function AiHubPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ParseResult[]>([]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    try {
      const result = await api<ParseResult>("/ai/parse", {
        method: "POST",
        body: JSON.stringify({ text: trimmed, now: new Date().toString() }),
      });
      setResults((prev) => [result, ...prev]);
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-2 text-2xl font-semibold text-neutral-900 dark:text-white">Hub de IA</h1>
      <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
        Escribe en lenguaje natural y la IA crea la tarea o el evento por ti.
      </p>

      <form onSubmit={submit} className="mb-6 flex max-w-xl gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Ej: "recuérdame comprar leche mañana" o "reunión el viernes a las 3pm"'
          className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
        >
          {loading ? "Pensando..." : "Crear"}
        </button>
      </form>

      {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="max-w-xl space-y-2">
        {results.map((r, i) => (
          <div
            key={i}
            className="rounded-lg border border-neutral-200 p-3 text-sm text-neutral-900 dark:border-neutral-800 dark:text-white"
          >
            {r.kind === "task" ? (
              <>
                ✅ <strong>Tarea creada:</strong> {r.item.title}
                <span className="ml-2 text-xs text-neutral-400 dark:text-neutral-500">
                  prioridad {r.item.priority}
                </span>
              </>
            ) : (
              <>
                📅 <strong>Evento creado:</strong> {r.item.title}
                <span className="ml-2 text-xs text-neutral-400 dark:text-neutral-500">
                  {new Date(r.item.startAt).toLocaleString("es-ES", {
                    dateStyle: "medium",
                    timeStyle: r.item.allDay ? undefined : "short",
                  })}
                </span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}