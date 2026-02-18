"use client";

import { Header } from "@/components/Header";
import { SignUpButton } from "@clerk/nextjs";
import { LandingTodoPreview } from "@/components/landing/LandingTodoPreview";
import { LandingPomodoroPreview } from "@/components/landing/LandingPomodoroPreview";
import { LandingStatsPreview } from "@/components/landing/LandingStatsPreview";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        {/* Hero */}
        <section
          className="opacity-0 animate-fade-in text-center"
          style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-neutral-100 sm:text-5xl">
            Git &apos;Er Dun
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-400">
            Tasks that stick. A built-in Pomodoro timer to keep you focused. No
            fluff, just a clean way to ship what matters.
          </p>
        </section>

        {/* Preview: Todo + Pomodoro */}
        <section
          className="mt-16 opacity-0 animate-fade-in"
          style={{ animationDelay: "150ms", animationFillMode: "forwards" }}
        >
          <h2 className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-neutral-500">
            See it in action & Track your progress
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-4">
              <h3 className="mb-4 text-sm font-medium text-neutral-400">
                Tasks
              </h3>
              <LandingTodoPreview />
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-4">
              <h3 className="mb-4 text-sm font-medium text-neutral-400">
                Pomodoro Timer
              </h3>
              <LandingPomodoroPreview />
            </div>
          </div>
        </section>

        {/* Stats Preview */}
        <section
          className="mt-16 opacity-0 animate-fade-in"
          style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
        >
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-4 sm:p-6">
            <LandingStatsPreview />
          </div>
        </section>

        {/* CTA */}
        <section
          className="mt-16 opacity-0 animate-fade-in text-center"
          style={{ animationDelay: "450ms", animationFillMode: "forwards" }}
        >
          <h2 className="text-2xl font-bold text-neutral-100 sm:text-3xl">
            Start getting shit Dun!
          </h2>
          <p className="mt-3 text-neutral-400">
            Sign up free and ship what matters.
          </p>
          <SignUpButton mode="modal">
            <button
              type="button"
              className="mt-6 rounded-xl border border-emerald-600/60 bg-emerald-600/20 px-8 py-4 text-base font-semibold text-emerald-400 transition duration-150 hover:bg-emerald-600/30 hover:border-emerald-500/60"
            >
              Sign up
            </button>
          </SignUpButton>
        </section>
      </main>
    </div>
  );
}
