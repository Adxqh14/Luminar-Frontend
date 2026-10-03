import { ThemeToggle } from "./theme-toggle";

export function Topbar() {
  return (
    <header className="flex h-14 items-center justify-end border-b border-neutral-200 px-6 dark:border-neutral-800">
      <ThemeToggle />
    </header>
  );
}