"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, getToken } from "@/lib/api";

type NowPlaying = {
  isPlaying: boolean;
  track: {
    name: string;
    artists: string;
    albumImage?: string;
    durationMs: number;
    progressMs: number;
  };
} | null;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SpotifyPage() {
  const searchParams = useSearchParams();
  const connectFailed = searchParams.get("error") === "1";

  const [connected, setConnected] = useState<boolean | null>(null);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    api<{ connected: boolean }>("/spotify/status")
      .then((r) => setConnected(r.connected))
      .catch(() => setConnected(false));
  }, []);

  useEffect(() => {
    if (!connected) return;
    const load = () =>
      api<NowPlaying>("/spotify/now-playing")
        .then(setNowPlaying)
        .catch(() => setNowPlaying(null));
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [connected]);

  function connectSpotify() {
    const token = getToken();
    // Navegación a una URL de otro origen (el backend), no una ruta interna de Next.js.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `${API_URL}/spotify/connect?token=${token}`;
  }

  async function disconnectSpotify() {
    setActionError(null);
    try {
      await api<void>("/spotify/disconnect", { method: "DELETE" });
      setConnected(false);
      setNowPlaying(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Error al desconectar");
    }
  }

  async function control(action: "play" | "pause" | "next" | "previous") {
    setActionError(null);
    try {
      const method = action === "play" || action === "pause" ? "PUT" : "POST";
      await api<void>(`/spotify/${action}`, { method });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Error controlando Spotify");
    }
  }

  if (connected === null) {
    return <div className="p-6 text-neutral-500 dark:text-neutral-400">Cargando...</div>;
  }

  const errorMessage = connectFailed
    ? "No se pudo conectar con Spotify. Intenta de nuevo."
    : actionError;

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-white">Spotify</h1>

      {connected && (
        <button
          onClick={disconnectSpotify}
          className="mb-4 text-sm text-neutral-400 hover:text-red-600 dark:text-neutral-500 dark:hover:text-red-400"
        >
          Desconectar cuenta de Spotify
        </button>
      )}

      {errorMessage && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      )}

      {!connected ? (
        <button
          onClick={connectSpotify}
          className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700"
        >
          Conectar con Spotify
        </button>
      ) : !nowPlaying ? (
        <p className="text-neutral-500 dark:text-neutral-400">
          No hay nada sonando ahora mismo. Reproduce algo desde la app de Spotify.
        </p>
      ) : (
        <div className="max-w-md rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
          <div className="flex gap-4">
            {nowPlaying.track.albumImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={nowPlaying.track.albumImage}
                alt=""
                className="h-20 w-20 rounded-lg object-cover"
              />
            )}
            <div>
              <p className="font-medium text-neutral-900 dark:text-white">
                {nowPlaying.track.name}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {nowPlaying.track.artists}
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={() => control("previous")}
              className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700"
            >
              ‹‹
            </button>
            <button
              onClick={() => control(nowPlaying.isPlaying ? "pause" : "play")}
              className="rounded-full bg-neutral-900 px-4 py-1.5 text-sm text-white dark:bg-white dark:text-neutral-900"
            >
              {nowPlaying.isPlaying ? "Pausar" : "Reproducir"}
            </button>
            <button
              onClick={() => control("next")}
              className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700"
            >
              ››
            </button>
          </div>
        </div>
      )}
    </div>
  );
}