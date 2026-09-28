"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, clearToken, getToken } from "@/lib/api";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH";
};

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[] | null>(null);

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

  function logout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mis tareas</h1>
        <button onClick={logout} className="text-sm text-neutral-500 hover:text-neutral-900">
          Cerrar sesión
        </button>
      </div>

      {tasks === null && <p className="text-neutral-500">Cargando...</p>}
      {tasks?.length === 0 && <p className="text-neutral-500">Aún no tienes tareas.</p>}

      <ul className="space-y-2">
        {tasks?.map((task) => (
          <li key={task.id} className="rounded-lg border border-neutral-200 p-3">
            {task.title}
          </li>
        ))}
      </ul>
    </main>
  );
}