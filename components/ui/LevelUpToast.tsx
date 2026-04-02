"use client";

import { useState, useCallback, useRef } from "react";

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

interface ToastItem {
  id: number;
  title: string;
  subtitle?: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const show = useCallback((title: string, subtitle?: string) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, title, subtitle }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return { toasts, show };
}

// ---------------------------------------------------------------------------
// Renderer
// ---------------------------------------------------------------------------

export function ToastContainer({ toasts }: { toasts: ToastItem[] }) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-[toastIn_0.3s_ease-out] rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 shadow-lg dark:border-emerald-800 dark:bg-emerald-950"
        >
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            {t.title}
          </p>
          {t.subtitle && (
            <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">
              {t.subtitle}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
