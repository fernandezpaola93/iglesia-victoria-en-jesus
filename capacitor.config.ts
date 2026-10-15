import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.victoriaenjesus',
  appName: 'Victoria en Jesús',
  webDir: 'capacitor-web',
  server: {
    url: 'https://iglesia-victoria-en-jesus.onrender.com',
    cleartext: true,
    androidScheme: 'https',
  },
  plugins: {
    Browser: {
      presentationStyle: 'fullscreen',
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
  ios: {
    scheme: 'io.victoriaenjesus',
  },
};

export default config;
