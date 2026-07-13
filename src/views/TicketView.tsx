import { useState, useEffect, useCallback } from 'react';
import { TicketPreset, GeneratedTicket } from '../types';
import { formatDateTime, getCountdownWithPercentage, padZero } from '../ticketUtils';
import { SITE_CONFIG } from '../siteConfig';

interface TicketViewProps {
  ticket: GeneratedTicket;
  preset: TicketPreset;
  onBack: () => void;
}

export default function TicketView({ ticket, preset, onBack }: TicketViewProps) {
  const [countdown, setCountdown] = useState(
    getCountdownWithPercentage(ticket.bookingTime, ticket.expiryTime)
  );
  const [showBack, setShowBack] = useState(true);
  const labels = SITE_CONFIG.ticket.labels;
  const layout = SITE_CONFIG.ticket.layout;

  // Helper to apply opacity to hex colors
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const updateCountdown = useCallback(() => {
    setCountdown(getCountdownWithPercentage(ticket.bookingTime, ticket.expiryTime));
  }, [ticket.bookingTime, ticket.expiryTime]);

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [updateCountdown]);

  // Hide back button after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowBack(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const isExpired = countdown.isExpired;
  const isCritical = countdown.percentage < 10 && !isExpired;
  const bookingDate = new Date(ticket.bookingTime);
  const expiryDate = new Date(ticket.expiryTime);

  const logoAnimStyle: React.CSSProperties = preset.logoAnimation.zoomEnabled && !isExpired
    ? {
        '--zoom-min': preset.logoAnimation.zoomMin,
        '--zoom-max': preset.logoAnimation.zoomMax,
        '--zoom-duration': `${preset.logoAnimation.duration}ms`,
      } as React.CSSProperties
    : {};

  const layout = SITE_CONFIG.ticket.layout;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden ${
        isExpired ? 'ticket-expired' : ''
      }`}
      style={{
        background: 'linear-gradient(145deg, #e8eef5 0%, #dce4ed 30%, #d4dde8 70%, #cdd7e3 100%)',
      }}
      onClick={() => setShowBack((prev) => !prev)}
    >
      {/* Back button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onBack();
        }}
        className={`absolute top-4 left-4 z-50 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white transition-opacity duration-500 ${
          showBack ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Ticket Card */}
      <div
        className={`relative w-[92%] overflow-hidden animate-slide-up ${layout.showShadow ? 'shadow-2xl shadow-slate-400/30' : ''}`}
        style={{
          maxWidth: layout.cardMaxWidth,
          maxHeight: '92vh',
          borderRadius: layout.cardBorderRadius,
          fontFamily: preset.fontSettings.family,
          backgroundImage: preset.backgroundImage ? `url(${preset.backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Card Base (Overlay) */}
        <div
          className="relative z-10 h-full w-full"
          style={{
            backgroundColor: `rgba(255, 255, 255, ${layout.ticketBgOpacity})`,
            backdropFilter: `blur(${layout.ticketBgBlur})`,
            WebkitBackdropFilter: `blur(${layout.ticketBgBlur})`
          }}
        >
          {/* Layer 2 - Header Strip */}
          <div
            className="text-center relative overflow-hidden"
            style={{
              backgroundColor: hexToRgba(preset.headerColor, layout.headerBgOpacity),
              color: preset.headerTextColor,
              height: layout.headerHeight,
              padding: layout.headerPadding
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/20" />
              <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-white/10" />
            </div>
            <div className="relative z-10">
              <h2
                className="font-bold tracking-widest uppercase"
                style={{ fontSize: preset.fontSettings.headerSize }}
              >
                {preset.headerTitle}
              </h2>
              <p className="text-xs opacity-80 tracking-wider mt-0.5">{preset.headerSubtitle}</p>
            </div>
          </div>

          {/* Layer 4 - Logo (animated) */}
          {preset.logoImage && (
            <div
              className="flex justify-center relative z-20"
              style={{ marginTop: layout.logoMarginTop }}
            >
              <div
                className={`rounded-full bg-white shadow-lg ${
                  preset.logoAnimation.zoomEnabled && !isExpired ? 'logo-animate' : ''
                }`}
                style={{
                  ...logoAnimStyle,
                  padding: layout.logoBorderWidth
                }}
              >
                <img
                  src={preset.logoImage}
                  alt="Logo"
                  className="rounded-full object-cover"
                  style={{
                    width: preset.logoSize,
                    height: preset.logoSize,
                  }}
                />
              </div>
            </div>
          )}

          {/* Ticket Body */}
          <div style={{ padding: layout.bodyPadding }}>
            {/* Ticket ID */}
            <div className="text-center" style={{ marginBottom: layout.fieldSpacing }}>
              <p
                className="font-mono text-slate-400 tracking-widest"
                style={{ fontSize: preset.fontSettings.ticketIdSize }}
              >
                {layout.showLabels && labels.id}{ticket.ticketId}
              </p>
            </div>

            {/* Divider */}
            {layout.showDividers && (
              <div
                className="border-t-2 border-dashed"
                style={{
                  borderColor: preset.dividerColor,
                  margin: layout.dividerMargin,
                  marginBottom: layout.fieldSpacing
                }}
              />
            )}

            {/* Passenger Name */}
            <div className="text-center" style={{ marginBottom: layout.fieldSpacing }}>
              {layout.showLabels && <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">{labels.passenger}</p>}
              <p
                className="font-bold text-slate-800"
                style={{ fontSize: preset.fontSettings.bodySize + 4 }}
              >
                {ticket.passengerName}
              </p>
            </div>

            {/* Fare */}
            <div className="text-center" style={{ marginBottom: layout.fieldSpacing }}>
              {layout.showLabels && (
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">
                  {preset.fareLabel}
                </p>
              )}
              <p
                className="font-extrabold text-primary"
                style={{ fontSize: preset.fontSettings.fareSize }}
              >
                {preset.currency}{ticket.fare}
              </p>
            </div>

            {/* Divider */}
            {layout.showDividers && (
              <div
                className="border-t-2 border-dashed"
                style={{
                  borderColor: preset.dividerColor,
                  margin: layout.dividerMargin,
                  marginBottom: layout.fieldSpacing
                }}
              />
            )}

            {/* Time Info */}
            <div className="grid grid-cols-2 gap-3" style={{ marginBottom: layout.fieldSpacing }}>
              <div className="bg-slate-50/50 rounded-xl p-3 text-center">
                {layout.showLabels && <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{labels.booked}</p>}
                <p className="text-xs font-semibold text-slate-700">
                  {formatDateTime(bookingDate)}
                </p>
              </div>
              <div className="bg-slate-50/50 rounded-xl p-3 text-center">
                {layout.showLabels && <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{labels.validUntil}</p>}
                <p className="text-xs font-semibold text-slate-700">
                  {formatDateTime(expiryDate)}
                </p>
              </div>
            </div>

            {/* Layer 5 - Countdown Timer */}
            <div
              className={`rounded-2xl p-4 text-center transition-colors duration-500 ${
                isExpired
                  ? 'bg-slate-200/50'
                  : isCritical
                  ? 'bg-red-50/50 border-2 border-red-200/50'
                  : 'bg-emerald-50/50 border-2 border-emerald-200/50'
              }`}
            >
              {layout.showLabels && (
                <p
                  className={`text-xs uppercase tracking-widest mb-2 font-semibold ${
                    isExpired
                      ? 'text-slate-400'
                      : isCritical
                      ? 'text-red-500 animate-pulse'
                      : 'text-emerald-600'
                  }`}
                >
                  {isExpired ? labels.expired : isCritical ? labels.expiringSoon : labels.timeRemaining}
                </p>
              )}
              <div
                className={`font-mono font-extrabold tracking-wider ${
                  isExpired
                    ? 'text-slate-400'
                    : isCritical
                    ? 'text-red-600'
                    : 'text-emerald-700'
                }`}
                style={{ fontSize: preset.fontSettings.timerSize }}
              >
                {isExpired
                  ? '00:00:00'
                  : `${padZero(countdown.hours)}:${padZero(countdown.minutes)}:${padZero(
                      countdown.seconds
                    )}`}
              </div>
              {/* Progress bar */}
              {!isExpired && (
                <div className="mt-3 h-1.5 bg-slate-200/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isCritical ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${countdown.percentage}%` }}
                  />
                </div>
              )}
            </div>

            {/* Status Indicator */}
            <div className="flex justify-center" style={{ marginTop: layout.statusMarginTop }}>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isExpired
                    ? 'bg-slate-200/50 text-slate-500'
                    : 'bg-emerald-100/50 text-emerald-700'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isExpired ? 'bg-slate-400' : 'bg-emerald-500 animate-pulse'
                  }`}
                />
                {layout.showLabels && (isExpired ? labels.statusExpired : labels.statusValid)}
              </div>
            </div>
          </div>
        </div>

        {/* Layer 6 - Expired Watermark */}
        {isExpired && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <div className="expired-stamp border-[6px] border-red-500/60 rounded-2xl px-8 py-4 rotate-[-15deg]">
              <span className="text-red-500/60 text-4xl font-black tracking-[0.2em]">
                {SITE_CONFIG.ticket.watermark}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
