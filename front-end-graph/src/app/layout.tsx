import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import "./globals.css";
import AuthProvider from "@/components/Auth/AuthProvider";
import { GraphContextProvider } from "@/components/Graph/GraphContext";

const roboto = Roboto({ subsets: ["latin"], weight: ["100", "300", "400"] });

export const metadata: Metadata = {
  title: "Notion Graph Mode",
  description: "Your Notion Pages with Graph View in Pages like-Obsidian",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("ENVIRONMENT:", process.env.NODE_ENV);
  return (
    <html lang="en">
      <body className={`w-screen ${roboto.className}`}>
        <main className="h-screen flex flex-col overflow-hidden bg-gray-50 text-gray-900">
          <GraphContextProvider>
            <AuthProvider>{children}</AuthProvider>
          </GraphContextProvider>
        </main>
      </body>
    </html>
  );
}
