"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (isClient && !getToken()) {
      router.replace("/login");
    }
  }, [isClient, router]);

  if (!isClient || !getToken()) return null;

  return (
    <div className="flex bg-neutral-50 dark:bg-neutral-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
          <Topbar />
        {children}
        </main>
    </div>
  );
}