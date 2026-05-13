'use client';

import React from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { logout } from '@/app/actions';
import { cn } from '@/lib/utils';

interface CommandDockProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
}

export const CommandDock: React.FC<CommandDockProps> = ({
  searchTerm,
  onSearchChange,
  isSidebarOpen,
  onOpenSidebar,
}) => {
  return (
    <div className="w-full px-4 sm:px-6 pt-4 sm:pt-6 pb-2 shrink-0 h-[var(--command-dock-height)]">
      <div className="bg-white/70 backdrop-blur-md border border-chalk/60 shadow-massive rounded-full h-full flex items-center px-2">
        {!isSidebarOpen && (
          <Button 
            variant="ghost" 
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-none shadow-none shrink-0"
            onClick={onOpenSidebar}
          >
            <Icons.Menu className="w-5 h-5" />
          </Button>
        )}
        
        <div className="flex-1 flex items-center px-4 gap-3">
          <Icons.Search className="w-4 h-4 text-gravel opacity-50" />
          <input 
            type="text" 
            placeholder="Search global assets..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-admin-sm font-medium text-obsidian placeholder:text-gravel/40"
          />
        </div>

        <div className="h-8 w-[1px] bg-chalk mx-2" />
        
        <div className="flex items-center gap-4 px-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black uppercase tracking-widest text-gravel">System</span>
            <span className="text-[10px] font-bold text-success uppercase tracking-tighter">Live</span>
          </div>
          <button 
            onClick={() => logout()}
            className="h-10 w-10 rounded-full bg-obsidian text-white flex items-center justify-center hover:bg-ember transition-colors shadow-subtle"
            title="Secure Logout"
          >
            <Icons.LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
