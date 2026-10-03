"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Event = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startAt: string;
  endAt: string;
  allDay: boolean;
};

const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function monthLabel(date: Date) {
  const label = date.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function buildMonthGrid(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

  const cells: (Date | null)[] = Array(firstWeekday).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function CalendarPage() {
  const [monthDate, setMonthDate] = useState(() => new Date());
  const [events, setEvents] = useState<Event[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  useEffect(() => {
    const from = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const to = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59);
    const qs = `?from=${from.toISOString()}&to=${to.toISOString()}`;
    api<Event[]>(`/events${qs}`)
      .then(setEvents)
      .catch((err) => setError(err instanceof Error ? err.message : "Error inesperado"));
  }, [monthDate]);

  function changeMonth(delta: number) {
    setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }

  async function addEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return;
    setError(null);

    const startAt = allDay
      ? new Date(`${date}T00:00:00`)
      : new Date(`${date}T${startTime}:00`);
    const endAt = allDay
      ? new Date(`${date}T23:59:59`)
      : new Date(`${date}T${endTime}:00`);

    if (endAt < startAt) {
      setError("La hora de fin no puede ser antes que la de inicio");
      return;
    }

    try {
      const created = await api<Event>("/events", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          allDay,
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
        }),
      });
      setEvents((prev) => [...(prev ?? []), created]);
      setTitle("");
      setDate("");
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  async function deleteEvent(id: string) {
    setError(null);
    try {
      await api<void>(`/events/${id}`, { method: "DELETE" });
      setEvents((prev) => prev?.filter((e) => e.id !== id) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  const eventsByDay = new Map<string, Event[]>();
  events?.forEach((ev) => {
    const key = dateKey(new Date(ev.startAt));
    eventsByDay.set(key, [...(eventsByDay.get(key) ?? []), ev]);
  });

  const cells = buildMonthGrid(monthDate);
  const today = dateKey(new Date());

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            {monthLabel(monthDate)}
          </h1>
          <div className="flex gap-1">
            <button
              onClick={() => changeMonth(-1)}
              className="rounded-md border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700"
            >
              ‹
            </button>
            <button
              onClick={() => changeMonth(1)}
              className="rounded-md border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700"
            >
              ›
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          {showForm ? "Cancelar" : "Nuevo evento"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={addEvent}
          className="mb-6 flex flex-wrap items-end gap-2 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título del evento"
            className="min-w-[200px] flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          />
          <label className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-300">
            <input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />
            Todo el día
          </label>
          {!allDay && (
            <>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="rounded-lg border border-neutral-300 bg-white px-2 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="rounded-lg border border-neutral-300 bg-white px-2 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
            </>
          )}
          <button
            type="submit"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
          >
            Crear
          </button>
        </form>
      )}

      {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400">
        {dayNames.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cellDate, i) => {
          const key = cellDate ? dateKey(cellDate) : `empty-${i}`;
          const dayEvents = cellDate ? eventsByDay.get(key) ?? [] : [];
          const isToday = cellDate && key === today;

          return (
            <div
              key={key}
              className={`h-28 rounded-lg border p-1.5 text-left ${
                cellDate
                  ? "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
                  : "border-transparent"
              }`}
            >
              {cellDate && (
                <>
                  <span
                    className={`text-xs ${
                      isToday
                        ? "rounded-full bg-neutral-900 px-1.5 py-0.5 text-white dark:bg-white dark:text-neutral-900"
                        : "text-neutral-400 dark:text-neutral-500"
                    }`}
                  >
                    {cellDate.getDate()}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={() => deleteEvent(ev.id)}
                        title="Clic para borrar"
                        className="cursor-pointer truncate rounded bg-blue-100 px-1.5 py-0.5 text-[11px] text-blue-700 hover:bg-red-100 hover:text-red-700 dark:bg-blue-500/20 dark:text-blue-300 dark:hover:bg-red-500/20 dark:hover:text-red-300"
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}