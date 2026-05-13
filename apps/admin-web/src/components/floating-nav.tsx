'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icons } from './icons';

const NAV_ITEMS = [
  { label: 'Map', href: '/', icon: 'Map' },
  { label: 'Events', href: '/events', icon: 'Calendar' },
  { label: 'POIs', href: '/pois', icon: 'MapPin' },
];

export function FloatingNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center">
      <div className="bg-white border border-chalk/40 shadow-hairline rounded-full px-2 py-1.5 flex items-center gap-2">
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
              {Icon && <Icon className={cn("w-3 h-3", isActive ? "text-obsidian" : "text-gravel")} />}
              {item.label}
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
      onClick={() => {/* Logout logic */}}
      className="h-11 px-6 rounded-full bg-white border border-chalk/40 shadow-hairline flex items-center gap-3 text-obsidian hover:bg-powder transition-all duration-500 group"
    >
      <Icons.LogOut className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
      <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Logout</span>
    </button>
  );
}
