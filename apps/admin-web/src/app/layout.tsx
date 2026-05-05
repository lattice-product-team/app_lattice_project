import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Avatar } from "@heroui/react";
import { SidebarNav } from "@/components/sidebar-nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lattice Studio",
  description: "Event Management Platform",
};

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={`${inter.variable} ${cormorant.variable} font-sans antialiased text-foreground bg-eggshell`}>
        <Providers>
          <div className="flex h-screen overflow-hidden bg-eggshell">
            {/* Sidebar - Editorial Style */}
            <aside className="w-64 bg-eggshell border-r border-chalk flex flex-col z-50">
              <div className="p-8 pt-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-8 rounded-full bg-gradient-voice-spectrum shadow-hairline" />
                  <span className="waldenburg-display text-admin-xl tracking-pill uppercase font-bold text-obsidian">Lattice</span>
                </div>

                <div className="flex items-center gap-3 px-1 py-4 border-y border-chalk/50 mb-8">
                  <Avatar 
                    className="bg-powder text-obsidian font-bold rounded-full w-10 h-10 border border-chalk"
                  />
                  <div className="flex flex-col">
                    <span className="text-admin-base font-semibold text-obsidian leading-tight">Kate Moore</span>
                    <span className="text-admin-xs text-gravel font-medium">Administrator</span>
                  </div>
                </div>
              </div>
              
              <SidebarNav />
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-0 bg-eggshell">
              <div className="flex-1 overflow-y-auto px-8 py-12 max-w-300 mx-auto w-full">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
