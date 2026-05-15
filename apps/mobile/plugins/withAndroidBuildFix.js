const { withAndroidManifest, withGradleProperties } = require('@expo/config-plugins');

/**
 * Config plugin to fix Android build issues:
 * 1. Fixes Manifest merger conflicts by adding 'tools:replace' attributes.
 * 2. Enables Jetifier to handle legacy support libraries.
 */
const withAndroidBuildFix = (config) => {
  // 1. Fix AndroidManifest.xml merger issues
  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    const application = androidManifest.manifest.application[0];

    if (application) {
      // Ensure the tools namespace is present in the <manifest> tag
      if (!androidManifest.manifest.$['xmlns:tools']) {
        androidManifest.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
      }

      // Attributes we want to ensure are in tools:replace
      const attributesToReplace = ['android:appComponentFactory', 'android:usesCleartextTraffic'];

      const currentReplace = application.$['tools:replace'] || '';
      let replaceArray = currentReplace ? currentReplace.split(',').map((s) => s.trim()) : [];

      attributesToReplace.forEach((attr) => {
        if (!replaceArray.includes(attr)) {
          replaceArray.push(attr);
        }
      });

      application.$['tools:replace'] = replaceArray.join(',');

      if (!application.$['android:appComponentFactory']) {
        application.$['android:appComponentFactory'] = 'androidx.core.app.CoreComponentFactory';
      }
      if (!application.$['android:usesCleartextTraffic']) {
        application.$['android:usesCleartextTraffic'] = 'true';
      }
    }

    return config;
  });

  // 2. Enable Jetifier in gradle.properties
  config = withGradleProperties(config, (config) => {
    // Search for existing property and update it, or add if missing
    let found = false;
    config.modResults = config.modResults.map((item) => {
      if (item.key === 'android.enableJetifier') {
        found = true;
        return { ...item, value: 'true' };
      }
      return item;
    });

    if (!found) {
      config.modResults.push({
        type: 'property',
        key: 'android.enableJetifier',
        value: 'true',
      });
    }

    return config;
  });

  return config;
};

module.exports = withAndroidBuildFix;
