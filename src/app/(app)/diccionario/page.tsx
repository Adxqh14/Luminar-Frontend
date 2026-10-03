"use client";

import { useState } from "react";
import { api } from "@/lib/api";

type Definition = {
  definition: string;
  examples?: string[];
};

type Meaning = {
  partOfSpeech: string;
  definitions: Definition[];
};

type Entry = {
  language: string;
  meanings: Meaning[];
};

type DictionaryResponse = {
  word: string;
  entries: Entry[];
};

const languageLabel: Record<string, string> = {
  es: "Español",
  en: "Inglés",
  pt: "Portugués",
  it: "Italiano",
  fr: "Francés",
  ca: "Catalán",
  gl: "Gallego",
  la: "Latín",
  an: "Aragonés",
  ast: "Asturiano",
};

export default function DictionaryPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<DictionaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    const word = query.trim();
    if (!word) return;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api<DictionaryResponse>(`/dictionary/${encodeURIComponent(word)}`);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-white">
        Diccionario
      </h1>

      <form onSubmit={search} className="mb-6 flex max-w-md gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar una palabra..."
          className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="max-w-2xl space-y-6">
        {result?.entries.map((entry, i) => (
          <div
            key={i}
            className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-800"
          >
            <div className="mb-3 flex items-baseline gap-2">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                {result.word}
              </h2>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                {languageLabel[entry.language] ?? entry.language}
              </span>
            </div>

            {entry.meanings.map((meaning, j) => (
              <div key={j} className="mb-4">
                <span className="text-xs font-medium uppercase text-neutral-400 dark:text-neutral-500">
                  {meaning.partOfSpeech}
                </span>
                <ol className="mt-1 list-decimal space-y-2 pl-5">
                  {meaning.definitions
                    .filter((def) => def.definition)
                    .map((def, k) => (
                      <li key={k} className="text-sm text-neutral-800 dark:text-neutral-200">
                        {def.definition}
                        {def.examples && def.examples.length > 0 && (
                          <div className="mt-0.5 text-xs italic text-neutral-400 dark:text-neutral-500">
                            &quot;{def.examples[0]}&quot;
                          </div>
                        )}
                      </li>
                    ))}
                </ol>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}