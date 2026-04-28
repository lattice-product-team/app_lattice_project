import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "Lattice Studio",
  description: "Event Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${lexend.variable} font-sans antialiased`}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 glass-card border-r border-white/10 flex flex-col">
            <div className="p-6">
              <h1 className="text-2xl font-bold tracking-tighter text-primary">LATTICE STUDIO</h1>
            </div>
            
            <nav className="flex-1 px-4 space-y-2 mt-4">
              <a href="/venues" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
                <span className="text-sm font-medium">📍 Venues</span>
              </a>
              <a href="/events" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
                <span className="text-sm font-medium">📅 Events</span>
              </a>
              <a href="/map" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
                <span className="text-sm font-medium">🗺️ Map Editor</span>
              </a>
              <a href="/radar" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-primary font-bold">
                <span className="text-sm">👥 Crowd Radar</span>
              </a>
            </nav>

            <div className="p-6 mt-auto border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Admin User</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest">Master</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-black/40">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
