"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useState, useCallback } from "react";

type Todo = Doc<"todos">;

export function TodoItem({ todo }: { todo: Todo }) {
  const toggleComplete = useMutation(api.todos.toggleComplete);
  const updateTodo = useMutation(api.todos.update);
  const remove = useMutation(api.todos.remove);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleToggle = useCallback(() => {
    toggleComplete({ id: todo._id });
  }, [todo._id, toggleComplete]);

  const handleDelete = useCallback(() => {
    if (typeof window !== "undefined" && window.confirm("Delete this task?")) {
      remove({ id: todo._id });
    }
  }, [todo._id, remove]);

  const handleSaveEdit = useCallback(() => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) {
      updateTodo({ id: todo._id, text: trimmed });
    } else {
      setEditText(todo.text);
    }
    setEditing(false);
  }, [editText, todo.text, todo._id, updateTodo]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSaveEdit();
      if (e.key === "Escape") {
        setEditText(todo.text);
        setEditing(false);
      }
    },
    [handleSaveEdit, todo.text]
  );

  const checkClass = todo.completed
    ? "border-green-500 bg-green-500"
    : "border-neutral-600 bg-transparent";

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-3 transition duration-150 hover:border-neutral-700">
      <button
        type="button"
        onClick={handleToggle}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition duration-150 focus:outline-none focus:ring-2 focus:ring-neutral-600 ${checkClass}`}
        aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
      >
        {todo.completed && (
          <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      {editing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent py-1 text-neutral-100 outline-none"
          autoFocus
          aria-label="Edit todo"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className={`min-w-0 flex-1 truncate py-1 text-left transition duration-150 ${todo.completed ? "text-neutral-500 line-through" : "text-neutral-100"}`}
        >
          {todo.text}
        </button>
      )}
      <button
        type="button"
        onClick={handleDelete}
        className="rounded p-1.5 text-neutral-500 opacity-0 transition duration-150 hover:bg-neutral-800 hover:text-red-400 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-600"
        aria-label="Delete todo"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
