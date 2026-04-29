import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Avatar } from "@heroui/react";
import { SidebarNav } from "@/components/sidebar-nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased text-foreground bg-background`}>
        <Providers>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-background border-r border-white/5 flex flex-col z-50">
              <div className="p-6 pt-12 pb-2">
                <div className="flex items-center gap-3">
                  <Avatar 
                    name="Kate Moore" 
                    className="bg-accent/20 text-accent font-bold rounded-full w-10 h-10"
                  />
                  <div className="flex flex-col">
                    <span className="text-[16px] font-semibold text-white">Kate Moore</span>
                    <span className="text-[13px] text-white/50">Admin</span>
                  </div>
                </div>
              </div>
              
              <SidebarNav />
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-0 bg-background">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
