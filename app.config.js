const pkg = require('./package.json')

module.exports = {
  expo: {
    name: 'Popaga !',
    slug: pkg.name,
    version: pkg.version,
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#fef2a4',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
      package: 'com.julienusson.popaga',
      versionCode: parseInt(pkg.versionCode),
    },
    extra: {
      eas: {
        projectId: '54872d9a-5e3c-432a-9ee2-048b1ff79ed9',
      },
    },
  },
  plugins: [
    [
      'expo-screen-orientation',
      {
        initialOrientation: 'PORTRAIT',
      },
    ],
  ],
}
