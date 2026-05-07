'use client';

import { useState, useCallback } from 'react';

export type InteractionMode = 'GLOBAL_VIEW' | 'DRAW_BOUNDARY' | 'PICK_COORDINATE';

export function useMapInteractions(initialMode: InteractionMode = 'GLOBAL_VIEW') {
  const [mode, setMode] = useState<InteractionMode>(initialMode);
  const [boundaryPoints, setBoundaryPoints] = useState<[number, number][]>([]);
  const [selectedPoi, setSelectedPoi] = useState<{ lng: number, lat: number } | null>(null);

  const addBoundaryPoint = useCallback((point: [number, number]) => {
    setBoundaryPoints(prev => [...prev, point]);
  }, []);

  const undoLastPoint = useCallback(() => {
    setBoundaryPoints(prev => prev.slice(0, -1));
  }, []);

  const clearBoundary = useCallback(() => {
    setBoundaryPoints([]);
  }, []);

  const selectPoi = useCallback((coords: { lng: number, lat: number }) => {
    setSelectedPoi(coords);
  }, []);

  const clearPoi = useCallback(() => {
    setSelectedPoi(null);
  }, []);

  const reset = useCallback(() => {
    setBoundaryPoints([]);
    setSelectedPoi(null);
  }, []);

  return {
    mode,
    setMode,
    boundaryPoints,
    setBoundaryPoints,
    addBoundaryPoint,
    undoLastPoint,
    clearBoundary,
    selectedPoi,
    setSelectedPoi,
    selectPoi,
    clearPoi,
    reset
  };
}
