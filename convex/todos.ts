import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) return [];
    const userId = identity.subject;
    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return todos.filter((t) => t.hidden !== true);
  },
});

export const get = query({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) return null;
    const userId = identity.subject;
    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== userId) return null;
    return todo;
  },
});

export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new Error("Not authenticated");
    const userId = identity.subject;
    return await ctx.db.insert("todos", {
      userId,
      text: args.text.trim(),
      completed: false,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("todos"),
    text: v.optional(v.string()),
    completed: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new Error("Not authenticated");
    const userId = identity.subject;
    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== userId) throw new Error("Todo not found");
    const { id, ...updates } = args;
    const patch: Record<string, unknown> = {};
    if (updates.text !== undefined) patch.text = updates.text.trim();
    if (updates.completed !== undefined) patch.completed = updates.completed;
    if (updates.order !== undefined) patch.order = updates.order;
    if (Object.keys(patch).length === 0) return id;
    await ctx.db.patch(id, patch);
    return id;
  },
});

export const toggleComplete = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new Error("Not authenticated");
    const userId = identity.subject;
    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== userId) throw new Error("Todo not found");
    await ctx.db.patch(args.id, {
      completed: !todo.completed,
      completedAt: todo.completed ? undefined : Date.now(),
    });
    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new Error("Not authenticated");
    const userId = identity.subject;
    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== userId) throw new Error("Todo not found");
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const clearCompleted = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new Error("Not authenticated");
    const userId = identity.subject;
    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const todo of todos) {
      if (todo.completed) {
        await ctx.db.patch(todo._id, { hidden: true });
      }
    }
  },
});

export const clearAll = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new Error("Not authenticated");
    const userId = identity.subject;
    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const todo of todos) {
      await ctx.db.delete(todo._id);
    }
  },
});

export const completionStats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null)
      return { dailyCounts: [], totalCompleted: 0 };
    const userId = identity.subject;
    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const completed = todos.filter((t) => t.completedAt != null);
    const totalCompleted = completed.length;
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const dailyCounts: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * dayMs);
      const dateStr = d.toISOString().slice(0, 10);
      const dayStart = new Date(dateStr).getTime();
      const dayEnd = dayStart + dayMs;
      const count = completed.filter(
        (t) => t.completedAt! >= dayStart && t.completedAt! < dayEnd
      ).length;
      dailyCounts.push({ date: dateStr, count });
    }
    return { dailyCounts, totalCompleted };
  },
});
