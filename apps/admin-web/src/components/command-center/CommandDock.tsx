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
    <div className="w-full px-4 sm:px-6 pt-[calc(var(--admin-safe-area)+1.5rem)] pb-2 z-20">
      <div className="max-w-4xl mx-auto bg-white border border-chalk shadow-massive rounded-full h-14 sm:h-16 flex items-center px-2 transition-all duration-500">
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
      </div>
    </div>
  );
};
