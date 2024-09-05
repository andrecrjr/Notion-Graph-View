import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import AuthProvider from "@/components/Auth/AuthProvider";
import { GraphContextProvider } from "@/components/Graph/GraphContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notion Graph Mode",
  description: "Your Notion with Graph View in Pages like-Obsidian",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GraphContextProvider>
          <AuthProvider>{children}</AuthProvider>
        </GraphContextProvider>
      </body>
    </html>
  );
}
