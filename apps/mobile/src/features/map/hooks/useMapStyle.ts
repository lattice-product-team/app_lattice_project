import { useState, useEffect } from 'react';

/**
 * Cache for patched style objects to avoid redundant fetches and processing.
 */
const styleCache: Record<string, any> = {};

/**
 * Custom hook to fetch and surgically patch MapTiler style JSONs.
 * Specifically designed to hide POIs, Ferry lines, and Highway shields
 * while maintaining performance and theme-switch reliability.
 */
export const useMapStyle = (url: string) => {
  const [style, setStyle] = useState<any>(styleCache[url] || url);
  const [isLoading, setIsLoading] = useState(!styleCache[url]);

  useEffect(() => {
    // If already in cache, just use it
    if (styleCache[url]) {
      setStyle(styleCache[url]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        if (!isMounted) return;

        // Perform surgical patching of layers
        const patchedLayers = json.layers.map((layer: any) => {
          const id = layer.id;
          const sourceLayer = layer['source-layer'];

          // 1. Suppression of POIs (Shops, Restaurants, etc.)
          if (sourceLayer === 'poi') {
            return {
              ...layer,
              layout: { ...layer.layout, visibility: 'none' },
            };
          }

          // 2. Suppression of Maritime Routes (Ferry lines and labels)
          if (id === 'Ferry line' || id === 'Ferry') {
            return {
              ...layer,
              layout: { ...layer.layout, visibility: 'none' },
            };
          }

          // 3. Suppression of Highway Shields (Road number icons)
          // We use includes to catch all variations (US, interstate, etc.)
          if (id && typeof id === 'string' && id.includes('Highway shield')) {
            return {
              ...layer,
              layout: { ...layer.layout, visibility: 'none' },
            };
          }

          return layer;
        });

        const patchedStyle = { ...json, layers: patchedLayers };
        
        // Cache and update state
        styleCache[url] = patchedStyle;
        setStyle(patchedStyle);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('❌ [useMapStyle] Error patching style:', err);
        if (isMounted) {
          setStyle(url); // Fallback to original URL on error
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { style, isLoading };
};
