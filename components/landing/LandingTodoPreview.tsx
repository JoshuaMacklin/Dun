"use client";

import { useState } from "react";

const DEMO_TASKS = [
  { id: "1", text: "Focus for 25 minutes", completed: false },
  { id: "2", text: "Ship the landing page", completed: true },
  { id: "3", text: "Take a well deserved break", completed: false },
];

function PreviewTodoItem({
  text,
  completed,
  onToggle,
}: {
  text: string;
  completed: boolean;
  onToggle: () => void;
}) {
  const checkClass = completed
    ? "border-green-500 bg-green-500"
    : "border-neutral-600 bg-transparent";

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-3 transition duration-150 hover:border-neutral-700">
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition duration-150 focus:outline-none focus:ring-2 focus:ring-neutral-600 ${checkClass}`}
        aria-label={completed ? "Mark incomplete" : "Mark complete"}
      >
        {completed && (
          <svg
            className="h-3.5 w-3.5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      <span
        className={`min-w-0 flex-1 py-1 ${completed ? "text-neutral-500 line-through" : "text-neutral-100"}`}
      >
        {text}
      </span>
    </div>
  );
}

export function LandingTodoPreview() {
  const [tasks, setTasks] = useState(DEMO_TASKS);

  const handleToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <PreviewTodoItem
          key={task.id}
          text={task.text}
          completed={task.completed}
          onToggle={() => handleToggle(task.id)}
        />
      ))}
    </div>
  );
}
