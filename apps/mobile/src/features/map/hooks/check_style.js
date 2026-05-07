const fetch = require('node-fetch');

const MAPTILER_KEY = 'iqk4irD5FCOr6M6VHVWZ';
const url = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

async function checkStyle() {
  try {
    const r = await fetch(url);
    const json = await r.json();
    console.log('Style loaded, sources:', Object.keys(json.sources));

    // Simulate patching
    const patchedLayers = json.layers.map((layer) => {
      const id = layer.id;
      const sourceLayer = layer['source-layer'];
      if (sourceLayer === 'poi')
        return { ...layer, layout: { ...layer.layout, visibility: 'none' } };
      return layer;
    });

    const patchedStyle = { ...json, layers: patchedLayers };
    console.log('Patched style created');

    // Check for sources without tiles
    for (const [id, source] of Object.entries(patchedStyle.sources)) {
      if (source.type === 'vector' || source.type === 'raster') {
        if (!source.tiles && !source.url) {
          console.error(`❌ Source "${id}" of type "${source.type}" has no tiles or url!`);
        }
      }
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

checkStyle();
