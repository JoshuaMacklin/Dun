"use client";

import { useState, useEffect, useCallback, useRef } from "react";

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

const SETTINGS = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
};

function getTotalSeconds(
  mode: "work" | "shortBreak" | "longBreak",
  settings: typeof SETTINGS
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

export function LandingPomodoroPreview() {
  const [timeRemaining, setTimeRemaining] = useState(
    getTotalSeconds("work", SETTINGS)
  );
  const [isRunning, setIsRunning] = useState(true);
  const [mode, setMode] = useState<"work" | "shortBreak" | "longBreak">("work");
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const didAdvanceRef = useRef(false);

  const resetForMode = useCallback((newMode: "work" | "shortBreak" | "longBreak") => {
    const duration = getTotalSeconds(newMode, SETTINGS);
    setTimeRemaining(duration);
    setMode(newMode);
  }, []);

  const advanceToNextMode = useCallback(() => {
    if (mode === "work") {
      const nextSession = completedSessions + 1;
      setCompletedSessions(nextSession);
      const isLongBreak =
        nextSession % SETTINGS.sessionsBeforeLongBreak === 0;
      resetForMode(isLongBreak ? "longBreak" : "shortBreak");
    } else {
      resetForMode("work");
    }
  }, [mode, completedSessions, resetForMode]);

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return;
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeRemaining, advanceToNextMode]);

  useEffect(() => {
    if (timeRemaining === 0 && !isRunning && !didAdvanceRef.current) {
      didAdvanceRef.current = true;
      advanceToNextMode();
    } else if (timeRemaining > 0) {
      didAdvanceRef.current = false;
    }
  }, [timeRemaining, isRunning, advanceToNextMode]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setTimeRemaining(getTotalSeconds(mode, SETTINGS));
  };
  const skip = () => {
    setIsRunning(false);
    advanceToNextMode();
  };

  useEffect(() => {
    if (intervalRef.current) return;
    setTimeRemaining(getTotalSeconds(mode, SETTINGS));
  }, [mode]);

  const totalSeconds = getTotalSeconds(mode, SETTINGS);
  const progress = totalSeconds > 0 ? 1 - timeRemaining / totalSeconds : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - progress);

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
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={skip}
            className="rounded-lg border border-neutral-600 bg-neutral-800/50 px-4 py-2 text-sm font-medium text-neutral-300 transition duration-150 hover:bg-neutral-800 hover:text-neutral-100"
            aria-label="Skip"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {SETTINGS.sessionsBeforeLongBreak > 1 && (
          <div className="flex items-center gap-1.5">
            {Array.from({ length: SETTINGS.sessionsBeforeLongBreak }).map(
              (_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    i < completedSessions % SETTINGS.sessionsBeforeLongBreak
                      ? "bg-blue-500"
                      : "bg-neutral-700"
                  }`}
                  aria-hidden
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
