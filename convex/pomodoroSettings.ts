import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const DEFAULTS = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  alarmVolume: 80,
};

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) return DEFAULTS;
    const userId = identity.subject;
    const settings = await ctx.db
      .query("pomodoroSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!settings) return DEFAULTS;
    return {
      workDuration: settings.workDuration,
      shortBreakDuration: settings.shortBreakDuration,
      longBreakDuration: settings.longBreakDuration,
      sessionsBeforeLongBreak: settings.sessionsBeforeLongBreak,
      alarmVolume: settings.alarmVolume,
    };
  },
});

export const update = mutation({
  args: {
    workDuration: v.optional(v.number()),
    shortBreakDuration: v.optional(v.number()),
    longBreakDuration: v.optional(v.number()),
    sessionsBeforeLongBreak: v.optional(v.number()),
    alarmVolume: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new Error("Not authenticated");
    const userId = identity.subject;
    const existing = await ctx.db
      .query("pomodoroSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    const settings = {
      workDuration: args.workDuration ?? existing?.workDuration ?? DEFAULTS.workDuration,
      shortBreakDuration: args.shortBreakDuration ?? existing?.shortBreakDuration ?? DEFAULTS.shortBreakDuration,
      longBreakDuration: args.longBreakDuration ?? existing?.longBreakDuration ?? DEFAULTS.longBreakDuration,
      sessionsBeforeLongBreak: args.sessionsBeforeLongBreak ?? existing?.sessionsBeforeLongBreak ?? DEFAULTS.sessionsBeforeLongBreak,
      alarmVolume: args.alarmVolume ?? existing?.alarmVolume ?? DEFAULTS.alarmVolume,
    };
    if (existing) {
      await ctx.db.patch(existing._id, settings);
      return existing._id;
    }
    return await ctx.db.insert("pomodoroSettings", {
      userId,
      ...settings,
    });
  },
});
