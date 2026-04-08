import Link from "next/link";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            OpenSkillTree
          </Link>
          <nav className="flex items-center gap-5 text-sm text-zinc-500 dark:text-zinc-400">
            <Link
              href="/#explore"
              className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/schema"
              className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Schema
            </Link>
            <a
              href="https://github.com/nathanqyu/OpenSkillTree"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </>
  );
}
