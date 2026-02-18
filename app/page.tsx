"use client";

import { Header } from "@/components/Header";
import { SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-8 text-center">
          <h2 className="text-xl font-semibold text-neutral-100">
            Dunn
          </h2>
          <p className="mt-2 text-neutral-400">
            Sign in to manage your tasks.
          </p>
          <br />
          <SignInButton mode="modal">
            <button
              type="button"
              className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm font-medium text-neutral-200 transition duration-150 hover:bg-neutral-700"
            >
              Sign in
            </button>
          </SignInButton>
        </div>
      </main>
    </div>
  );
}
