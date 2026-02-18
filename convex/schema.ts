import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    userId: v.string(),
    text: v.string(),
    completed: v.boolean(),
    createdAt: v.number(),
    order: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    hidden: v.optional(v.boolean()),
  }).index("by_user", ["userId"]),
  pomodoroSettings: defineTable({
    userId: v.string(),
    workDuration: v.number(),
    shortBreakDuration: v.number(),
    longBreakDuration: v.number(),
    sessionsBeforeLongBreak: v.number(),
    alarmVolume: v.number(),
  }).index("by_user", ["userId"]),
});
