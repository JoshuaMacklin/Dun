"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export type PomodoroMode = "work" | "shortBreak" | "longBreak";

export interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  alarmVolume: number;
}

interface PomodoroContextValue {
  timeRemaining: number;
  isRunning: boolean;
  mode: PomodoroMode;
  completedSessions: number;
  settings: PomodoroSettings | undefined;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  playAlarm: () => void;
}

const DEFAULTS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  alarmVolume: 80,
};

const PomodoroContext = createContext<PomodoroContextValue | null>(null);

function getDurationSeconds(
  mode: PomodoroMode,
  settings: PomodoroSettings
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

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const settings = useQuery(api.pomodoroSettings.get);
  const effectiveSettings = settings ?? DEFAULTS;

  const [timeRemaining, setTimeRemaining] = useState(() =>
    getDurationSeconds("work", effectiveSettings)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<PomodoroMode>("work");
  const [completedSessions, setCompletedSessions] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const didAdvanceRef = useRef(false);

  const resetForMode = useCallback(
    (newMode: PomodoroMode) => {
      const duration = getDurationSeconds(newMode, effectiveSettings);
      setTimeRemaining(duration);
      setMode(newMode);
    },
    [effectiveSettings]
  );

  const advanceToNextMode = useCallback(() => {
    if (mode === "work") {
      const nextSession = completedSessions + 1;
      setCompletedSessions(nextSession);
      const isLongBreak =
        effectiveSettings.sessionsBeforeLongBreak > 0 &&
        nextSession % effectiveSettings.sessionsBeforeLongBreak === 0;
      resetForMode(isLongBreak ? "longBreak" : "shortBreak");
    } else {
      resetForMode("work");
    }
  }, [mode, completedSessions, effectiveSettings.sessionsBeforeLongBreak, resetForMode]);

  const playAlarm = useCallback(() => {
    const volume = Math.min(1, Math.max(0, effectiveSettings.alarmVolume / 100));
    try {
      const audio = new Audio("/sounds/alarm.mp3");
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch(() => playAlarmFallback(volume));
    } catch {
      playAlarmFallback(volume);
    }
  }, [effectiveSettings.alarmVolume]);

  const playAlarmFallback = useCallback((vol: number) => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      [0, 200, 400].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.type = "sine";
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(vol * 0.25, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime + delay / 1000);
        osc.stop(ctx.currentTime + delay / 1000 + 0.3);
      });
    } catch {
      // Ignore
    }
  }, []);

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
          playAlarm();
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
  }, [isRunning, playAlarm]);

  useEffect(() => {
    if (timeRemaining === 0 && !isRunning && !didAdvanceRef.current) {
      didAdvanceRef.current = true;
      advanceToNextMode();
    } else if (timeRemaining > 0) {
      didAdvanceRef.current = false;
    }
  }, [timeRemaining, isRunning, advanceToNextMode]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(getDurationSeconds(mode, effectiveSettings));
  }, [mode, effectiveSettings]);
  const skip = useCallback(() => {
    setIsRunning(false);
    advanceToNextMode();
  }, [advanceToNextMode]);

  useEffect(() => {
    if (intervalRef.current) return;
    setTimeRemaining(getDurationSeconds(mode, effectiveSettings));
  }, [effectiveSettings, mode]);

  const value: PomodoroContextValue = {
    timeRemaining,
    isRunning,
    mode,
    completedSessions,
    settings: settings ?? undefined,
    start,
    pause,
    reset,
    skip,
    playAlarm,
  };

  return (
    <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error("usePomodoro must be used within PomodoroProvider");
  return ctx;
}
