import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes'
import { ConvexClientProvider } from "@/lib/ConvexClientProvider";
import { PomodoroProvider } from "@/lib/PomodoroContext";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Dun - The Ultimate Task Management App",
  description: "Full-stack task management app built with Convex and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider
          appearance={{
            theme: dark,
          }}
        >
          <ConvexClientProvider>
          <PomodoroProvider>
          {children}
          <Toaster theme="dark" position="top-center" />
          </PomodoroProvider>
        </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
