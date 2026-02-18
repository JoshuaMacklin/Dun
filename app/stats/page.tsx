"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/Header";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function StatsPage() {
  const stats = useQuery(api.todos.completionStats);

  return (
    <div className="min-h-screen bg-neutral-950">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-xl font-semibold text-neutral-100">Task Statistics</h1>

        {stats === undefined ? (
          <div className="space-y-4">
            <div className="h-32 animate-pulse rounded-xl border border-neutral-800 bg-neutral-900/50" />
            <div className="h-24 animate-pulse rounded-xl border border-neutral-800 bg-neutral-900/50" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-6">
              <h2 className="text-sm font-medium text-neutral-400">Total tasks completed</h2>
              <p className="mt-1 text-3xl font-semibold text-neutral-100">
                {stats.totalCompleted}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-6">
              <h2 className="mb-4 text-sm font-medium text-neutral-400">
                Completed over the last 7 days
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={stats.dailyCounts.map((d) => ({
                      ...d,
                      label: formatDateLabel(d.date),
                    }))}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                    <XAxis
                      dataKey="label"
                      stroke="#737373"
                      tick={{ fill: "#a3a3a3", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#737373"
                      tick={{ fill: "#a3a3a3", fontSize: 12 }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#262626",
                        border: "1px solid #404040",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#a3a3a3" }}
                      formatter={(value: number | undefined) => [value ?? 0, "Completed"]}
                      labelFormatter={(label) => label}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ fill: "#22c55e", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
