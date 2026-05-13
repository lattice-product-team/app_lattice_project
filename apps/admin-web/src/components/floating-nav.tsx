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

export function FloatingNav() {
  const pathname = usePathname();
  const { isOpen: isSidebarOpen, open: openSidebar } = useSidebar();

  return (
    <nav className="flex items-center gap-4">
      {!isSidebarOpen && (
        <button 
          onClick={openSidebar}
          className="h-11 w-11 rounded-full bg-white/40 backdrop-blur-xl border border-white/20 shadow-hairline flex items-center justify-center text-obsidian hover:bg-white/60 transition-all duration-300"
        >
          <Icons.Menu className="w-4 h-4" />
        </button>
      )}
      
      <div className="bg-white/40 backdrop-blur-xl border border-white/20 shadow-hairline rounded-full px-2 py-1.5 flex items-center gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = (Icons as any)[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 sm:px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-2",
                isActive 
                  ? "bg-powder text-obsidian shadow-sm scale-105" 
                  : "text-gravel hover:text-obsidian hover:bg-powder/30"
              )}
            >
              {Icon && <Icon className={cn("w-3 h-3", isActive ? "text-obsidian" : "text-gravel")} />}
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
      className="h-11 px-4 sm:px-6 rounded-full bg-white/40 backdrop-blur-xl border border-white/20 shadow-hairline flex items-center gap-3 text-obsidian hover:bg-white/60 transition-all duration-500 group"
    >
      <Icons.LogOut className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] hidden sm:inline">Logout</span>
    </button>
  );
}
