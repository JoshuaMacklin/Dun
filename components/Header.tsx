"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950/80 px-4 py-3 backdrop-blur-sm">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-lg font-semibold text-neutral-100">Dun</Link>
          <Authenticated>
            <Link href="/stats" className="text-sm font-medium text-neutral-400 transition hover:text-neutral-200">Stats</Link>
            <Link href="/settings" className="text-sm font-medium text-neutral-400 transition hover:text-neutral-200">Settings</Link>
          </Authenticated>
        </div>
        <div className="flex items-center gap-2">
          <AuthLoading>
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm font-medium text-neutral-200 transition duration-150 hover:bg-neutral-700"
              >
                Sign in
              </button>
            </SignInButton>
          </AuthLoading>
          <Authenticated>
            <UserButton afterSignOutUrl="/" />
          </Authenticated>
          <Unauthenticated>
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm font-medium text-neutral-200 transition duration-150 hover:bg-neutral-700"
              >
                Sign in
              </button>
            </SignInButton>
          </Unauthenticated>
        </div>
      </div>
    </header>
  );
}
