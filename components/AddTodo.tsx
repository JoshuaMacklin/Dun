"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useCallback, KeyboardEvent } from "react";

export function AddTodo() {
  const create = useMutation(api.todos.create);
  const [text, setText] = useState("");

  const handleSubmit = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText("");
    await create({ text: trimmed });
  }, [text, create]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSubmit();
    },
    [handleSubmit]
  );

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Add a task..."
        className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-neutral-100 placeholder-neutral-500 outline-none transition duration-150 focus:border-neutral-600 focus:ring-2 focus:ring-neutral-700"
        aria-label="New task text"
      />
      <button
        type="button"
        onClick={handleSubmit}
        className="rounded-xl border border-neutral-800 bg-neutral-800 px-4 py-3 font-medium text-neutral-200 transition duration-150 hover:bg-neutral-700 hover:text-white"
      >
        Add
      </button>
    </div>
  );
}
