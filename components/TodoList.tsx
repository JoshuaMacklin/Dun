"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TodoItem } from "./TodoItem";
import { AddTodo } from "./AddTodo";
import { PomodoroTimer } from "./PomodoroTimer";

function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="h-12 flex-1 animate-pulse rounded-xl border border-neutral-800 bg-neutral-900/50" />
        <div className="h-12 w-20 animate-pulse rounded-xl border border-neutral-800 bg-neutral-900/50" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-xl border border-neutral-800 bg-neutral-900/50 transition-opacity"
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 py-16 text-center transition-colors">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800/50 text-neutral-600">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <p className="mt-4 font-medium text-neutral-400">No todos yet</p>
      <p className="mt-1 text-sm text-neutral-500">Add one using the field above.</p>
    </div>
  );
}

export function TodoList() {
  const [hideCompleted, setHideCompleted] = useState(false);
  const todos = useQuery(api.todos.list);
  const clearCompleted = useMutation(api.todos.clearCompleted);

  if (todos === undefined) return <Loading />;

  const visibleTodos = hideCompleted ? todos.filter((t) => !t.completed) : todos;
  const completedCount = todos.filter((t) => t.completed).length;
  const hasCompleted = completedCount > 0;

  return (
    <div className="space-y-4">
      <AddTodo />
      {todos.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="space-y-2">
            {visibleTodos.map((todo) => (
              <TodoItem key={todo._id} todo={todo} />
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-3">
            <button
              type="button"
              onClick={() => clearCompleted()}
              disabled={!hasCompleted}
              className="flex-1 min-w-0 rounded-lg border border-emerald-700/60 bg-emerald-900/30 px-3 py-2 text-sm font-medium text-emerald-400 transition duration-150 hover:bg-emerald-900/50 hover:border-emerald-600/60 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-emerald-900/30 disabled:hover:border-emerald-700/60"
            >
              Clear completed
            </button>
            <button
              type="button"
              onClick={() => setHideCompleted((h) => !h)}
              className="flex-1 min-w-0 rounded-lg border border-blue-700/60 bg-blue-900/30 px-3 py-2 text-sm font-medium text-blue-400 transition duration-150 hover:bg-blue-900/50 hover:border-blue-600/60"
            >
              {hideCompleted ? "Show completed" : "Hide completed"}
            </button>
          </div>
        </>
      )}
      <PomodoroTimer />
    </div>
  );
}
