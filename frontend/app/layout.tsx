import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "TaskAI | AI-Powered Task Manager",
  description: "Stop forgetting. Start achieving. Let AI organize your life.",
  keywords: ["todo", "panaversity", "hackathon", "nextjs", "fastapi", "ai"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
