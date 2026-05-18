import React, { useState, useRef } from 'react';

interface ZoomableProps {
  children: React.ReactNode;
}

export default function ZoomableDiagram({ children }: ZoomableProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const zoomIn = (e: React.MouseEvent) => {
    e.preventDefault();
    setScale((s) => Math.min(s + 0.2, 3));
  };

  const zoomOut = (e: React.MouseEvent) => {
    e.preventDefault();
    setScale((s) => Math.max(s - 0.2, 0.4));
  };

  const reset = (e: React.MouseEvent) => {
    e.preventDefault();
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950/60 select-none my-6 shadow-sm">
      {/* Top Bar info */}
      <div className="absolute top-3 left-4 z-10 text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium pointer-events-none flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Arrastra para mover | Zoom: {Math.round(scale * 100)}%</span>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-md">
        <button
          onClick={zoomOut}
          className="w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition active:scale-95 text-base font-bold cursor-pointer text-zinc-800 dark:text-zinc-200"
          title="Zoom Out"
        >
          -
        </button>
        <button
          onClick={reset}
          className="px-3 h-8 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition active:scale-95 text-xs font-semibold cursor-pointer text-zinc-800 dark:text-zinc-200"
          title="Reset View"
        >
          Reset
        </button>
        <button
          onClick={zoomIn}
          className="w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition active:scale-95 text-base font-bold cursor-pointer text-zinc-800 dark:text-zinc-200"
          title="Zoom In"
        >
          +
        </button>
      </div>

      {/* The viewport */}
      <div
        ref={containerRef}
        className="w-full min-h-[350px] md:min-h-[500px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing p-6 md:p-12"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="transition-transform duration-75 origin-center w-full flex justify-center items-center nextra-mermaid-zoom-container"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
