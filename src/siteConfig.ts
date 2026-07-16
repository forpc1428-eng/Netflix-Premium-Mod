/**
 * SITE CONFIGURATION
 * Simplified base configuration for the app.
 */

export interface AppSettings {
  siteName: string;
  overallScale: number;
  mobilePadding: number;
}

export interface BackgroundConfig {
  siteColor: string;
  useMobileFullHeight: boolean;
  path: string;
}

export interface ContainerConfig {
  boxWidth: number;
  boxHeight: number;
  borderRadius: string;
}

export interface LogoConfig {
  path: string;
  width: number;
  height: number;
  zoomMin: number;
  zoomMax: number;
  zoomDuration: string;
  spamInterval: number; // Speed of appearance in ms
  spamCount: number; // Number of logos to spam
}

export interface InteractionConfig {
  clickThreshold: number; // Number of clicks to trigger spam
  clickTimeWindow: number; // Time window for clicks in ms
}

export interface AudioConfig {
  songPath: string;
}

export interface SiteConfig {
  settings: AppSettings;
  background: BackgroundConfig;
  container: ContainerConfig;
  logo: LogoConfig;
  interaction: InteractionConfig;
  audio: AudioConfig;
}

export const SITE_CONFIG: SiteConfig = {
  // GLOBAL SETTINGS
  settings: {
    siteName: 'Netflix Premium Mod',
    overallScale: 1.0,
    mobilePadding: 2,
  },

  // BACKGROUND SETTINGS
  background: {
    siteColor: '#f0f0f0',
    useMobileFullHeight: true,
    path: '/images/123.jpg',
  },

  // MAIN CONTAINER SETTINGS
  container: {
    boxWidth: 380,
    boxHeight: 500,
    borderRadius: '16px',
  },

  // LOGO SETTINGS
  logo: {
    path: '/images/456.jpeg',
    width:200,
    height: 200,
    zoomMin: 1,
    zoomMax: 1,
    zoomDuration: '3s',
    spamInterval: 40, // Logos appear every 100ms
    spamCount: 250, // Total logos to spawn
  },

  // INTERACTION SETTINGS
  interaction: {
    clickThreshold: 2,
    clickTimeWindow: 3000,
  },

  // AUDIO SETTINGS
  audio: {
    songPath: '/audio/bg-music.mp3', // Placeholder path
  }
};
