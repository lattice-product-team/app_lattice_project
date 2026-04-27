import React from 'react';

export default function VenuesPage() {
  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Venues</h2>
          <p className="text-white/40 mt-1">Manage physical locations and boundaries.</p>
        </div>
        <button className="bg-primary hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 active:scale-[0.98]">
          + Create Venue
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mock Venue Card */}
        <div className="glass-card rounded-2xl p-6 hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="w-full h-32 bg-white/5 rounded-xl mb-4 overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
               <span className="text-4xl">🗺️</span>
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-[10px] uppercase font-black tracking-widest text-primary">Active</span>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-1">Circuit de Barcelona</h3>
          <p className="text-sm text-white/40 mb-6">Montmeló, Spain • 4.6km track</p>
          
          <div className="flex items-center justify-between border-t border-white/5 pt-4">
            <div className="flex flex-col">
               <span className="text-[10px] text-white/20 uppercase font-black">Events</span>
               <span className="text-sm font-bold">12 active</span>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[10px] text-white/20 uppercase font-black">POIs</span>
               <span className="text-sm font-bold text-white/60">154</span>
            </div>
          </div>
        </div>

        {/* Empty Placeholder */}
        <div className="border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center p-8 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
          <span className="text-3xl mb-4">🆕</span>
          <p className="font-bold text-sm">Create New Venue</p>
        </div>
      </div>
    </div>
  );
}
