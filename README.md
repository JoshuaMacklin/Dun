# Dun

**Tasks that stick.** A task app with a built-in Pomodoro timer to keep you focused. No fluff, just a clean way to ship what matters.

[Live Demo](https://dun-tasks.vercel.app)

<img width="917" height="1088" alt="Dun app screenshot" src="https://github.com/user-attachments/assets/a13ed91e-d541-43e1-88f0-bee51442096d" />

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Backend** | Convex (real-time database, serverless functions) |
| **Auth** | Clerk |
| **Charts** | Recharts |
| **Toasts** | Sonner |

---

## Features

- **Todo list** — Add tasks, mark complete, reorder. Syncs in real time.
- **Pomodoro timer** — Work intervals, short breaks, long breaks. Built-in alarm.
- **Customizable intervals** — Adjust work (1–60 min), short break (1–30 min), long break (1–60 min), and sessions before a long break.
- **Stats** — Total tasks completed and a 7-day completion chart.
- **Settings** — Alarm volume, timer intervals, and a data reset option.
- **Auth** — Sign up and sign in with Clerk. Data is scoped per user.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Convex account
- Clerk account

### Setup

1. **Clone and install**

   ```bash
   git clone <repo-url>
   cd ai-todo
   npm install
   ```

2. **Configure environment**

   Copy `.env.local.example` to `.env.local` and add:

   - `NEXT_PUBLIC_CONVEX_URL` and `CONVEX_DEPLOYMENT` — from Convex (`npx convex dev` will help set these up)
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` — from [Clerk Dashboard](https://dashboard.clerk.com)

   For Convex + Clerk auth, set `CLERK_JWT_ISSUER_DOMAIN` in the Convex dashboard (from Clerk → JWT Templates → Convex template).

3. **Start Convex**

   ```bash
   npx convex dev
   ```

4. **Start the dev server**

   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing
│   ├── dashboard/          # Todo list
│   ├── stats/              # Completion stats & chart
│   └── settings/           # Pomodoro & data settings
├── components/
├── convex/                  # Convex backend (schema, functions)
├── lib/                     # PomodoroContext, ConvexProvider
└── public/
```

---

## License

Private — All rights reserved.
