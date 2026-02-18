"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/Header";
import { usePomodoro } from "@/lib/PomodoroContext";
import { toast } from "sonner";

export default function SettingsPage() {
  const todos = useQuery(api.todos.list);
  const settings = useQuery(api.pomodoroSettings.get);
  const clearAll = useMutation(api.todos.clearAll);
  const updateSettings = useMutation(api.pomodoroSettings.update);
  const { playAlarm } = usePomodoro();

  const [volume, setVolume] = useState(80);
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);

  useEffect(() => {
    if (settings) {
      setVolume(settings.alarmVolume);
      setWorkDuration(settings.workDuration);
      setShortBreakDuration(settings.shortBreakDuration);
      setLongBreakDuration(settings.longBreakDuration);
      setSessionsBeforeLongBreak(settings.sessionsBeforeLongBreak);
    }
  }, [settings]);

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    updateSettings({ alarmVolume: v });
  };

  const handleSaveIntervals = () => {
    updateSettings({
      workDuration: Math.max(1, Math.min(60, workDuration)),
      shortBreakDuration: Math.max(1, Math.min(30, shortBreakDuration)),
      longBreakDuration: Math.max(1, Math.min(60, longBreakDuration)),
      sessionsBeforeLongBreak: Math.max(1, Math.min(10, sessionsBeforeLongBreak)),
    });
    toast.success("Pomodoro settings saved.");
  };

  const handleTestAlarm = () => {
    playAlarm();
  };

  const handleDeleteAll = () => {
    toast("Are you sure you want to delete all your data?", {
      action: {
        label: "Confirm",
        onClick: () => {
          clearAll();
          toast.success("All data has been deleted.");
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-xl font-semibold text-neutral-100">Settings</h1>

        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-6">
            <h2 className="text-sm font-medium text-neutral-400">Pomodoro</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Adjust alarm volume and timer intervals.
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm text-neutral-400">
                  Alarm volume: {volume}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="mt-2 h-2 w-full appearance-none rounded-lg bg-neutral-800 accent-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <label className="block">
                  <span className="text-xs text-neutral-500">Work (min)</span>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={workDuration}
                    onChange={(e) => setWorkDuration(Number(e.target.value) || 1)}
                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-neutral-500">Short break (min)</span>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={shortBreakDuration}
                    onChange={(e) => setShortBreakDuration(Number(e.target.value) || 1)}
                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-neutral-500">Long break (min)</span>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={longBreakDuration}
                    onChange={(e) => setLongBreakDuration(Number(e.target.value) || 1)}
                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-neutral-500">Sessions before long</span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={sessionsBeforeLongBreak}
                    onChange={(e) => setSessionsBeforeLongBreak(Number(e.target.value) || 1)}
                    className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleTestAlarm}
                  className="rounded-lg border border-blue-700/60 bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-400 transition duration-150 hover:bg-blue-900/50 hover:border-blue-600/60"
                >
                  Test alarm
                </button>
                <button
                  type="button"
                  onClick={handleSaveIntervals}
                  className="rounded-lg border border-emerald-700/60 bg-emerald-900/30 px-4 py-2 text-sm font-medium text-emerald-400 transition duration-150 hover:bg-emerald-900/50 hover:border-emerald-600/60"
                >
                  Save intervals
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-6">
            <h2 className="text-sm font-medium text-neutral-400">Danger zone</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Permanently delete all your tasks and related data. This cannot be undone.
            </p>
            <button
              type="button"
              onClick={handleDeleteAll}
              disabled={todos === undefined || todos.length === 0}
              className="mt-4 rounded-lg border border-red-700/60 bg-red-900/30 px-4 py-2 text-sm font-medium text-red-400 transition duration-150 hover:bg-red-900/50 hover:border-red-600/60 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-red-900/30 disabled:hover:border-red-700/60"
            >
              Delete all data
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
