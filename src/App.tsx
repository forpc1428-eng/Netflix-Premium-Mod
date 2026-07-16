import { useState, useCallback, useRef } from 'react';
import { SITE_CONFIG } from './siteConfig';

interface SpammedLogo {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export default function App() {
  const cfg = SITE_CONFIG;
  const [logos, setLogos] = useState<SpammedLogo[]>([]);
  const clickCount = useRef(0);
  const lastClickTime = useRef(0);
  const isFirstTap = useRef(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startSpam = useCallback(() => {
    let spawned = 0;
    const totalToSpawn = cfg.logo.spamCount;

    const intervalId = setInterval(() => {
      const newLogo: SpammedLogo = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        scale: Math.random() * (cfg.logo.zoomMax - cfg.logo.zoomMin) + cfg.logo.zoomMin,
        rotation: Math.random() * 360,
      };

      setLogos(prev => [...prev, newLogo]);
      spawned++;

      if (spawned >= totalToSpawn) {
        clearInterval(intervalId);
      }
    }, cfg.logo.spamInterval);
  }, [cfg.logo.spamCount, cfg.logo.spamInterval, cfg.logo.zoomMax, cfg.logo.zoomMin]);

  const handleClick = useCallback(() => {
    // Ensure Fullscreen on every tap if not already active
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }

    // 1. First Tap: Fullscreen only (already handled above)
    if (isFirstTap.current) {
      isFirstTap.current = false;
      return;
    }

    // 2. Click logic for Spam and Music (Double Tap or as configured)
    const now = Date.now();

    if (now - lastClickTime.current <= cfg.interaction.clickTimeWindow) {
      clickCount.current += 1;
    } else {
      clickCount.current = 1;
    }

    lastClickTime.current = now;

    if (clickCount.current >= cfg.interaction.clickThreshold) {
      // Start Music on the same trigger as the spam
      if (!audioRef.current) {
        audioRef.current = new Audio(cfg.audio.songPath);
        audioRef.current.loop = true;
        audioRef.current.play().catch(err => {
          console.error("Audio playback failed:", err);
        });
      }

      startSpam();
      clickCount.current = 0; // Reset after trigger
    }
  }, [cfg.audio.songPath, cfg.interaction.clickTimeWindow, cfg.interaction.clickThreshold, startSpam]);

  return (
    <div
      className="fixed inset-0 w-full overflow-hidden bg-center bg-no-repeat cursor-pointer"
      onClick={handleClick}
      style={{
        backgroundColor: cfg.background.siteColor,
        backgroundImage: `url("${cfg.background.path}")`,
        backgroundSize: '100% 100%',
        minHeight: cfg.background.useMobileFullHeight ? '-webkit-fill-available' : '100vh'
      }}
    >
      {logos.map((logo) => (
        <img
          key={logo.id}
          src={cfg.logo.path}
          alt="logo"
          className="absolute logo-animate pointer-events-none"
          style={{
            left: `${logo.x}%`,
            top: `${logo.y}%`,
            width: cfg.logo.width,
            height: cfg.logo.height,
            transform: `translate(-50%, -50%) scale(${logo.scale}) rotate(${logo.rotation}deg)`,
            '--zoom-min': cfg.logo.zoomMin,
            '--zoom-max': cfg.logo.zoomMax,
            '--zoom-duration': cfg.logo.zoomDuration,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
