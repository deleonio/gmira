import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gmira lab",
  description:
    "Proof surfaces for the Gmira skill library. Each route commits to its own visual world.",
};

// Deliberately bare. No font, no palette, no chrome at the root: every proof route
// loads its own via its own layout. A shared house style here would make all four
// proofs look related, which is the exact claim this lab exists to disprove.
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
