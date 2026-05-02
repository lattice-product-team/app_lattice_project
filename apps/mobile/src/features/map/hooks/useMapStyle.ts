import { useState, useEffect } from 'react';

/**
 * Cache for patched style objects to avoid redundant fetches and processing.
 */
const styleCache: Record<string, any> = {};
const pendingPromises: Record<string, Promise<any>> = {};

/**
 * Core function to fetch, patch and cache a MapTiler style.
 */
export const fetchAndPatchStyle = async (url: string) => {
  if (styleCache[url]) return styleCache[url];
  if (pendingPromises[url]) return await pendingPromises[url];

  const promise = fetch(url)
    .then((r) => r.json())
    .then((json) => {
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
        if (id && typeof id === 'string' && id.includes('Highway shield')) {
          return {
            ...layer,
            layout: { ...layer.layout, visibility: 'none' },
          };
        }

        return layer;
      });

      const patchedStyle = { ...json, layers: patchedLayers };
      styleCache[url] = patchedStyle;
      delete pendingPromises[url];
      return patchedStyle;
    })
    .catch((err) => {
      console.error('❌ [useMapStyle] Error patching style:', err);
      delete pendingPromises[url];
      return url; // Fallback to original URL
    });

  pendingPromises[url] = promise;
  return promise;
};

/**
 * Pre-warms the style cache by fetching and patching in the background.
 */
export const prewarmMapStyle = (url: string) => {
  fetchAndPatchStyle(url).catch(() => {}); // Fire and forget
};

/**
 * Custom hook to fetch and surgically patch MapTiler style JSONs.
 */
export const useMapStyle = (url: string) => {
  const [style, setStyle] = useState<any>(styleCache[url] || null);
  const [isLoading, setIsLoading] = useState(!styleCache[url]);

  useEffect(() => {
    let isMounted = true;

    if (styleCache[url]) {
      setStyle(styleCache[url]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetchAndPatchStyle(url).then((patchedStyle) => {
      if (isMounted) {
        setStyle(patchedStyle);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { style, isLoading };
};
