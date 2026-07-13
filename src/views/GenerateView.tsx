import { useState } from 'react';
import { TicketPreset, GeneratedTicket } from '../types';
import { saveTicket } from '../storage';
import { generateTicketId, formatDateTime, calculateExpiry } from '../ticketUtils';
import { SITE_CONFIG } from '../siteConfig';

interface GenerateViewProps {
  preset: TicketPreset;
  onBack: () => void;
  onTicketCreated: (ticket: GeneratedTicket) => void;
}

export default function GenerateView({ preset, onBack, onTicketCreated }: GenerateViewProps) {
  const [passengerName, setPassengerName] = useState('');
  const [fare, setFare] = useState(preset.fare);
  const [isGenerating, setIsGenerating] = useState(false);
  const cfg = SITE_CONFIG.generate;

  const handleGenerate = () => {
    if (preset.editableFields.name && !passengerName.trim()) {
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const now = new Date();
      const expiry = calculateExpiry(now, preset.validityDurationHours);

      const ticket: GeneratedTicket = {
        ticketId: generateTicketId(),
        presetId: preset.id,
        passengerName: passengerName.trim() || 'Passenger',
        fare: fare,
        bookingTime: now.toISOString(),
        expiryTime: expiry.toISOString(),
        status: 'active',
        createdAt: now.toISOString(),
      };

      saveTicket(ticket);
      setIsGenerating(false);
      onTicketCreated(ticket);
    }, 800);
  };

  const now = new Date();
  const expiry = calculateExpiry(now, preset.validityDurationHours);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      {/* Header */}
      <div
        className="px-4 pt-12 pb-6 text-white flex items-center gap-3"
        style={{ background: preset.headerColor }}
      >
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center active:scale-95 transition-transform"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-bold">{cfg.title}</h1>
          <p className="text-xs opacity-80">{preset.headerTitle}</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-4 -mt-3 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 animate-fade-in">
          {/* Logo Preview */}
          {preset.logoImage && (
            <div className="flex justify-center mb-6">
              <img
                src={preset.logoImage}
                alt="Logo"
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 shadow-md"
              />
            </div>
          )}

          <p className="text-sm text-slate-500 mb-6 text-center">{cfg.subtitle}</p>

          {/* Passenger Name */}
          {preset.editableFields.name && (
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {cfg.passengerLabel}
              </label>
              <input
                type="text"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                placeholder={cfg.passengerPlaceholder}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-0 outline-none text-sm font-medium text-slate-800 bg-slate-50 transition-colors"
                autoFocus
              />
            </div>
          )}

          {/* Fare */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {preset.fareLabel || cfg.fareLabel}
            </label>
            {preset.editableFields.fare ? (
              <input
                type="number"
                value={fare}
                onChange={(e) => setFare(Number(e.target.value))}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-primary focus:ring-0 outline-none text-sm font-medium text-slate-800 bg-slate-50 transition-colors"
              />
            ) : (
              <div className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-lg font-bold text-slate-700">
                {preset.currency}{fare}
              </div>
            )}
          </div>

          {/* Validity */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {SITE_CONFIG.ticket.labels.statusValid}
            </label>
            <div className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-sm font-medium text-slate-700">
              Valid until 11:59 PM today
            </div>
          </div>

          {/* Preview Info */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
              Ticket Preview
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">{SITE_CONFIG.ticket.labels.booked}:</span>
                <span className="font-medium text-slate-700">{formatDateTime(now)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{SITE_CONFIG.ticket.labels.validUntil}:</span>
                <span className="font-medium text-slate-700">{formatDateTime(expiry)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expires:</span>
                <span className="font-medium text-slate-700">11:59 PM Today</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || (preset.editableFields.name && !passengerName.trim())}
              className="w-full py-4 rounded-xl font-bold text-white text-base shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: `linear-gradient(135deg, ${preset.headerColor}, ${preset.headerColor}dd)` }}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </div>
              ) : (
                cfg.generateBtn
              )}
            </button>
            <button
              onClick={onBack}
              className="w-full py-4 rounded-xl font-bold text-slate-500 text-sm active:scale-[0.98] transition-all"
            >
              {cfg.cancelBtn}
            </button>
          </div>
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
