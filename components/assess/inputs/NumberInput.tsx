"use client";

import { useState, useEffect } from "react";

interface NumberInputProps {
  value: number | null;
  onChange: (value: number) => void;
}

export default function NumberInput({ value, onChange }: NumberInputProps) {
  const [text, setText] = useState(value?.toString() ?? "");

  // Reset when value prop changes (question navigation)
  useEffect(() => {
    setText(value?.toString() ?? "");
  }, [value]);

  return (
    <div className="mt-4">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={text}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9]/g, "");
          setText(raw);
          const num = parseInt(raw, 10);
          if (!isNaN(num)) onChange(num);
        }}
        placeholder="Type your answer..."
        className="w-full max-w-xs rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-lg font-mono text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-600 dark:focus:border-zinc-600"
        autoFocus
      />
    </div>
  );
}
