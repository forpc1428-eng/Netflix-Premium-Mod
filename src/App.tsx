import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { SITE_CONFIG } from './siteConfig';
import { formatDateTime, calculateExpiry, getCountdown, padZero } from './ticketUtils';

export default function App() {
  const cfg = SITE_CONFIG;
  const [scale, setScale] = useState(1);
  const [now, setNow] = useState(new Date());
  const [userName, setUserName] = useState('USERNAME');

  // Use refs for tracking taps to avoid re-render race conditions with prompt()
  const tapCountRef = useRef(0);
  const tapResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPromptOpen = useRef(false);

  // 1. Initialize userName from localStorage or URL
  useEffect(() => {
    const savedName = localStorage.getItem(cfg.settings.localStorageKey);
    const params = new URLSearchParams(window.location.search);
    const urlName = params.get('name');

    if (savedName) {
      setUserName(savedName.toUpperCase());
    } else if (urlName) {
      const upperUrlName = urlName.toUpperCase();
      setUserName(upperUrlName);
      localStorage.setItem(cfg.settings.localStorageKey, upperUrlName);
    }
  }, [cfg.settings.localStorageKey]);

  // 2. Get initial static values
  const ticketData = useMemo(() => {
    // Generate Serial
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let random = '';
    for (let i = 0; i < 6; i++) random += chars.charAt(Math.floor(Math.random() * chars.length));
    const serial = `${yy}${mm}${dd}${hh}${min}${random}`;

    const bookingTime = new Date();
    const expiryTime = calculateExpiry(bookingTime);

    return {
      serial,
      bookingTime,
      expiryTime
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. Live Update Logic (Countdown)
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 4. Responsive Scaling Logic
  useEffect(() => {
    const handleResize = () => {
      const ticketWidth = parseInt(cfg.ticket.boxWidth.toString());
      const padding = cfg.settings.mobilePadding;
      if (window.innerWidth < ticketWidth + padding) {
        setScale(window.innerWidth / (ticketWidth + padding));
      } else {
        setScale(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cfg.ticket.boxWidth, cfg.settings.mobilePadding]);

  const triggerEdit = useCallback(() => {
    if (isPromptOpen.current) return; // Prevent double prompt

    isPromptOpen.current = true;
    // Small delay to ensure click events have finished processing
    setTimeout(() => {
      const newName = prompt('Enter new username:', userName);
      if (newName && newName.trim()) {
        const upperName = newName.trim().toUpperCase();
        setUserName(upperName);
        localStorage.setItem(cfg.settings.localStorageKey, upperName);
      }
      isPromptOpen.current = false;
    }, 100);
  }, [userName, cfg.settings.localStorageKey]);

  // 5. Multi-Tap Logic
  const handleBgClick = () => {
    // Auto Fullscreen Logic
    if (cfg.settings.autoFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    tapCountRef.current += 1;

    if (tapCountRef.current >= cfg.settings.multiTapCount) {
      tapCountRef.current = 0; // Reset immediately
      if (tapResetTimer.current) clearTimeout(tapResetTimer.current);
      triggerEdit();
      return;
    }

    if (tapResetTimer.current) clearTimeout(tapResetTimer.current);
    tapResetTimer.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, cfg.settings.multiTapDuration);
  };

  // 6. Helper to replace placeholders
  const getProcessedText = (text: string) => {
    const countdown = getCountdown(ticketData.expiryTime);
    const countdownStr = `${cfg.settings.countdownPrefix}${padZero(countdown.hours)}:${padZero(countdown.minutes)}:${padZero(countdown.seconds)}`;

    return text
      .replace('{{USER_NAME}}', userName)
      .replace('{{FARE}}', cfg.settings.fareValue)
      .replace('{{BOOKING_TIME}}', formatDateTime(ticketData.bookingTime))
      .replace('{{EXPIRY_TIME}}', formatDateTime(ticketData.expiryTime))
      .replace('{{SERIAL}}', ticketData.serial)
      .replace('{{COUNTDOWN}}', countdownStr);
  };

  const getFontFamily = (fieldFont: string | undefined) => {
    const font = cfg.fontSettings.forceGlobalFont ? cfg.fontSettings.globalFont : (fieldFont || cfg.fontSettings.globalFont);
    if (font === 'Arial') return 'Arial, Helvetica, sans-serif';
    if (font === 'Kohinoor Devanagari') return '"Kohinoor Devanagari", "Kohinoor", Arial, sans-serif';
    return font;
  };

  const logoAnimStyle = cfg.logo.animation.enabled
    ? ({
        '--zoom-min': cfg.logo.animation.minScale,
        '--zoom-max': cfg.logo.animation.maxScale,
        '--zoom-duration': `${cfg.logo.animation.duration}ms`,
      } as React.CSSProperties)
    : {};

  const ticketAnimStyle = cfg.ticket.animation.enabled
    ? ({
        '--t-zoom-min': cfg.ticket.animation.minScale,
        '--t-zoom-max': cfg.ticket.animation.maxScale,
        '--t-zoom-duration': `${cfg.ticket.animation.duration}ms`,
      } as React.CSSProperties)
    : {};

  return (
    <div
      className="fixed inset-0 w-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: cfg.background.siteColor,
        touchAction: 'none'
      }}
      onClick={handleBgClick}
    >
      <div
        className="flex items-center justify-center pointer-events-none"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease-out'
        }}
      >
        <div
          className="relative pointer-events-auto"
          style={{
            width: cfg.ticket.boxWidth,
            height: cfg.ticket.boxHeight,
            boxShadow: cfg.ticket.showShadow ? cfg.ticket.shadowStyle : 'none'
          }}
        >
          <div
            className={`absolute w-full h-full overflow-hidden ${cfg.ticket.animation.enabled ? 'ticket-animate' : ''}`}
            style={{
              ...ticketAnimStyle,
              backgroundImage: `url(${cfg.ticket.imagePath})`,
              backgroundSize: `${cfg.ticket.imageWidth}px ${cfg.ticket.imageHeight}px`,
              backgroundPosition: `${cfg.ticket.imageOffsetX} ${cfg.ticket.imageOffsetY}`,
              backgroundRepeat: 'no-repeat',
              borderRadius: cfg.ticket.borderRadius,
              zIndex: 1
            }}
          />

          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              top: cfg.logo.positionY,
              left: cfg.logo.positionX,
              zIndex: 10
            }}
          >
            <div
              className={cfg.logo.animation.enabled ? 'logo-animate' : ''}
              style={{
                ...logoAnimStyle,
                backgroundColor: cfg.logo.backgroundColor,
                padding: cfg.logo.padding,
                borderRadius: cfg.logo.borderRadius,
                width: cfg.logo.boxWidth,
                height: cfg.logo.boxHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: cfg.logo.showShadow ? cfg.logo.shadowStyle : 'none'
              }}
            >
              <img
                src={cfg.logo.imagePath}
                alt="Logo"
                style={{
                  width: cfg.logo.logoWidth,
                  height: cfg.logo.logoHeight,
                  borderRadius: `calc(${cfg.logo.borderRadius} * 0.8)`,
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>

          {cfg.textFields.map((field) => (
            <div
              key={field.id}
              className="absolute whitespace-nowrap select-none pointer-events-none"
              style={{
                top: field.posY,
                left: field.posX,
                fontSize: field.fontSize,
                color: field.color,
                fontWeight: field.fontWeight,
                letterSpacing: field.letterSpacing,
                fontFamily: getFontFamily(field.fontFamily),
                textAlign: field.textAlign as any,
                transform: field.textAlign === 'center'
                  ? 'translate(-50%, -50%)'
                  : field.textAlign === 'right'
                  ? 'translate(-100%, -50%)'
                  : 'translateY(-50%)',
                zIndex: 5
              }}
            >
              {getProcessedText(field.text)}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes logoZoom {
          0%, 100% { transform: scale(var(--zoom-min)); }
          50% { transform: scale(var(--zoom-max)); }
        }
        .logo-animate {
          animation: logoZoom var(--zoom-duration) ease-in-out infinite;
        }
        @keyframes ticketZoom {
          0%, 100% { transform: scale(var(--t-zoom-min)); }
          50% { transform: scale(var(--t-zoom-max)); }
        }
        .ticket-animate {
          animation: ticketZoom var(--t-zoom-duration) ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
