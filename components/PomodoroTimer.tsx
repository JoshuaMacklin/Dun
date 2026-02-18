"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePomodoro } from "@/lib/PomodoroContext";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function getModeLabel(mode: "work" | "shortBreak" | "longBreak"): string {
  switch (mode) {
    case "work":
      return "Work";
    case "shortBreak":
      return "Short Break";
    case "longBreak":
      return "Long Break";
  }
}

function getTotalSeconds(
  mode: "work" | "shortBreak" | "longBreak",
  settings: { workDuration: number; shortBreakDuration: number; longBreakDuration: number }
): number {
  switch (mode) {
    case "work":
      return settings.workDuration * 60;
    case "shortBreak":
      return settings.shortBreakDuration * 60;
    case "longBreak":
      return settings.longBreakDuration * 60;
  }
}

export function PomodoroTimer() {
  const {
    timeRemaining,
    isRunning,
    mode,
    completedSessions,
    settings,
    start,
    pause,
    reset,
    skip,
  } = usePomodoro();
  const updateSettings = useMutation(api.pomodoroSettings.update);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editWork, setEditWork] = useState(25);
  const [editShortBreak, setEditShortBreak] = useState(5);
  const [editLongBreak, setEditLongBreak] = useState(15);
  const [editSessions, setEditSessions] = useState(4);

  const effectiveSettings = settings ?? {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    alarmVolume: 80,
  };

  const totalSeconds = getTotalSeconds(mode, effectiveSettings);
  const progress = totalSeconds > 0 ? 1 - timeRemaining / totalSeconds : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - progress);

  const openEditModal = () => {
    setEditWork(effectiveSettings.workDuration);
    setEditShortBreak(effectiveSettings.shortBreakDuration);
    setEditLongBreak(effectiveSettings.longBreakDuration);
    setEditSessions(effectiveSettings.sessionsBeforeLongBreak);
    setShowEditModal(true);
  };

  const saveEdit = () => {
    updateSettings({
      workDuration: Math.max(1, Math.min(60, editWork)),
      shortBreakDuration: Math.max(1, Math.min(30, editShortBreak)),
      longBreakDuration: Math.max(1, Math.min(60, editLongBreak)),
      sessionsBeforeLongBreak: Math.max(1, Math.min(10, editSessions)),
    });
    setShowEditModal(false);
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-neutral-800"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-blue-500 transition-all duration-1000"
            />
          </svg>
          <div className="absolute flex flex-col items-center gap-0.5">
            <span className="text-3xl font-semibold tabular-nums text-neutral-100">
              {formatTime(timeRemaining)}
            </span>
            <span className="text-sm font-medium text-neutral-400">
              {getModeLabel(mode)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={isRunning ? pause : start}
            className="rounded-lg border border-blue-700/60 bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-400 transition duration-150 hover:bg-blue-900/50 hover:border-blue-600/60"
            aria-label={isRunning ? "Pause" : "Start"}
          >
            {isRunning ? (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7L8 5z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-neutral-600 bg-neutral-800/50 px-4 py-2 text-sm font-medium text-neutral-300 transition duration-150 hover:bg-neutral-800 hover:text-neutral-100"
            aria-label="Reset"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            type="button"
            onClick={skip}
            className="rounded-lg border border-neutral-600 bg-neutral-800/50 px-4 py-2 text-sm font-medium text-neutral-300 transition duration-150 hover:bg-neutral-800 hover:text-neutral-100"
            aria-label="Skip"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {effectiveSettings.sessionsBeforeLongBreak > 1 && (
          <div className="flex items-center gap-1.5">
            {Array.from({ length: effectiveSettings.sessionsBeforeLongBreak }).map(
              (_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i < completedSessions % effectiveSettings.sessionsBeforeLongBreak
                      ? "bg-blue-500"
                      : "bg-neutral-700"
                  }`}
                  aria-hidden
                />
              )
            )}
          </div>
        )}

        <button
          type="button"
          onClick={openEditModal}
          className="text-xs font-medium text-neutral-500 transition duration-150 hover:text-neutral-300"
        >
          Edit intervals
        </button>
      </div>

      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowEditModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-intervals-title"
        >
          <div
            className="w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-900 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="edit-intervals-title" className="mb-4 text-lg font-semibold text-neutral-100">
              Pomodoro intervals
            </h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm text-neutral-400">Work (min)</span>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={editWork}
                  onChange={(e) => setEditWork(Number(e.target.value) || 1)}
                  className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100"
                />
              </label>
              <label className="block">
                <span className="text-sm text-neutral-400">Short break (min)</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={editShortBreak}
                  onChange={(e) => setEditShortBreak(Number(e.target.value) || 1)}
                  className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100"
                />
              </label>
              <label className="block">
                <span className="text-sm text-neutral-400">Long break (min)</span>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={editLongBreak}
                  onChange={(e) => setEditLongBreak(Number(e.target.value) || 1)}
                  className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100"
                />
              </label>
              <label className="block">
                <span className="text-sm text-neutral-400">Sessions before long break</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={editSessions}
                  onChange={(e) => setEditSessions(Number(e.target.value) || 1)}
                  className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-neutral-100"
                />
              </label>
            </div>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 rounded-lg border border-neutral-600 bg-neutral-800/50 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="flex-1 rounded-lg border border-blue-700/60 bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-400 hover:bg-blue-900/50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
