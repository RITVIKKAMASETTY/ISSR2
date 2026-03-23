import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Trust & Decision Study",
  description:
    "A behavioral experiment studying how AI interface design influences user decisions. Part of research on humanlike AI systems and trust attribution.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
