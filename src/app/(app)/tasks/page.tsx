"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, clearToken, getToken } from "@/lib/api";

type Priority = "LOW" | "MEDIUM" | "HIGH";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
};

const priorityLabel: Record<Priority, string> = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
};

const priorityStyle: Record<Priority, string> = {
  LOW: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
  MEDIUM: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  HIGH: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    api<Task[]>("/tasks")
      .then(setTasks)
      .catch(() => {
        clearToken();
        router.replace("/login");
      });
  }, [router]);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setError(null);
    try {
      const task = await api<Task>("/tasks", {
        method: "POST",
        body: JSON.stringify({ title: trimmed, priority }),
      });
      setTasks((prev) => [task, ...(prev ?? [])]);
      setTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  async function toggleTask(task: Task) {
    setError(null);
    try {
      const updated = await api<Task>(`/tasks/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: !task.completed }),
      });
      setTasks((prev) => prev?.map((t) => (t.id === updated.id ? updated : t)) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  async function deleteTask(id: string) {
    setError(null);
    try {
      await api<void>(`/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev?.filter((t) => t.id !== id) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-white">Mis tareas</h1>

      <form onSubmit={addTask} className="mb-6 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva tarea..."
          className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="rounded-lg border border-neutral-300 bg-white px-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
        >
          <option value="LOW">Baja</option>
          <option value="MEDIUM">Media</option>
          <option value="HIGH">Alta</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Agregar
        </button>
      </form>

      {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {tasks === null && <p className="text-neutral-500 dark:text-neutral-400">Cargando...</p>}
      {tasks?.length === 0 && (
        <p className="text-neutral-500 dark:text-neutral-400">Aún no tienes tareas.</p>
      )}

      <ul className="space-y-2">
        {tasks?.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task)}
              className="h-4 w-4"
            />
            <span
              className={`flex-1 text-neutral-900 dark:text-white ${
                task.completed ? "text-neutral-400 line-through dark:text-neutral-500" : ""
              }`}
            >
              {task.title}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-xs ${priorityStyle[task.priority]}`}>
              {priorityLabel[task.priority]}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-sm text-neutral-400 hover:text-red-600 dark:text-neutral-500 dark:hover:text-red-400"
            >
              Borrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}