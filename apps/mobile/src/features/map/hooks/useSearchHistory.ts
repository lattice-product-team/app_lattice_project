import { useState, useEffect, useCallback } from 'react';
import { storage } from '../../../services/storage';

const SEARCH_HISTORY_KEY = 'recent_searches';
const MAX_HISTORY_ITEMS = 10;

export const useSearchHistory = () => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = storage.getString(SEARCH_HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse search history', e);
        setHistory([]);
      }
    }
  }, []);

  const saveSearch = useCallback((query: string) => {
    if (!query || query.trim() === '') return;

    const trimmed = query.trim();

    setHistory((prev) => {
      //Remove if already exists to move it to the top
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const newHistory = [trimmed, ...filtered].slice(0, MAX_HISTORY_ITEMS);

      //Persist
      storage.set(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const removeSearch = useCallback((query: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((item) => item !== query);
      storage.set(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    storage.remove(SEARCH_HISTORY_KEY);
  }, []);

  return {
    history,
    saveSearch,
    removeSearch,
    clearHistory,
  };
};
