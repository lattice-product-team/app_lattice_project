'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icons } from './icons';
import { logout } from '@/app/actions';
import { useSidebar } from '@/hooks/use-sidebar';

const NAV_ITEMS = [
  { label: 'Map', href: '/', icon: 'Map' },
  { label: 'Events', href: '/events', icon: 'Calendar' },
  { label: 'POIs', href: '/pois', icon: 'MapPin' },
];

export function FloatingSidebarToggle() {
  const pathname = usePathname();
  const { isOpen: isSidebarOpen, toggle: toggleSidebar } = useSidebar();

  if (isSidebarOpen || pathname !== '/') return null;

  return (
    <button 
      onClick={toggleSidebar}
      className={cn(
        "fixed top-8 left-8 sm:left-12 z-[100] h-11 px-5 rounded-full border border-chalk shadow-hairline flex items-center gap-3 transition-all duration-300 active:scale-95 group pointer-events-auto bg-white text-obsidian hover:bg-white/90"
      )}
      title="Open Control Panel"
    >
      <Icons.Menu className="w-3.5 h-3.5" />
      <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Menu</span>
    </button>
  );
}

export function FloatingNav() {
  const pathname = usePathname();
  const { close: closeSidebar } = useSidebar();

  // Close sidebar on every route change
  React.useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  return (
    <nav className="flex items-center">
      <div className="bg-white border border-chalk shadow-hairline rounded-full px-2 py-1.5 flex items-center gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = (Icons as any)[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-2",
                isActive 
                  ? "bg-powder text-obsidian shadow-sm scale-105" 
                  : "text-gravel hover:text-obsidian hover:bg-powder/30"
              )}
            >
              {Icon && <Icon className={cn("w-3.5 h-3.5", isActive ? "text-obsidian" : "text-gravel")} />}
              <span className="hidden xs:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function FloatingLogout() {
  return (
    <button 
      onClick={() => logout()}
      className="fixed top-8 right-8 sm:right-12 z-[100] h-11 px-5 rounded-full bg-white border border-chalk shadow-hairline flex items-center gap-3 text-obsidian hover:bg-white/90 transition-all duration-300 group active:scale-95 pointer-events-auto"
    >
      <Icons.LogOut className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] hidden sm:inline">Logout</span>
    </button>
  );
}
