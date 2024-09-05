import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import AuthProvider from "@/components/Auth/AuthProvider";
import { Footer } from "@/components/Footer";
import { GraphContextProvider } from "@/components/Graph/GraphContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notion Graph Mode",
  description: "Your Notion Pages with Graph View in Pages like-Obsidian",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-screen">
        <main className="h-screen flex flex-col overflow-hidden bg-gray-50 text-gray-900">
          <GraphContextProvider>
            <AuthProvider>{children}</AuthProvider>
          </GraphContextProvider>
        </main>
      </body>
    </html>
  );
}
