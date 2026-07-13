import { useEffect, useState } from 'react';
import { TicketPreset, GeneratedTicket, AppView } from '../types';
import { getTickets } from '../storage';
import { SITE_CONFIG } from '../siteConfig';

interface HomeViewProps {
  preset: TicketPreset | undefined;
  onNavigate: (view: AppView) => void;
  onHeaderTap: () => void;
  onOpenTicket: (ticket: GeneratedTicket) => void;
}

export default function HomeView({ preset, onNavigate, onHeaderTap, onOpenTicket }: HomeViewProps) {
  const [recentTickets, setRecentTickets] = useState<GeneratedTicket[]>([]);

  useEffect(() => {
    const tickets = getTickets();
    setRecentTickets(tickets.slice(0, 3));
  }, []);

  const allTickets = getTickets();
  const activeCount = allTickets.filter((t) => {
    const expiry = new Date(t.expiryTime).getTime();
    return expiry > Date.now();
  }).length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-8 text-white relative overflow-hidden"
        style={{ background: preset?.headerColor || SITE_CONFIG.defaultTicket.headerColor }}
        onClick={onHeaderTap}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/20" />
          <div className="absolute -left-5 -bottom-5 w-24 h-24 rounded-full bg-white/10" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1">
            {preset?.logoImage && (
              <img
                src={preset.logoImage}
                alt="Logo"
                className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
              />
            )}
            <div>
              <h1 className="text-xl font-bold tracking-wide">
                {preset?.headerTitle || SITE_CONFIG.app.title}
              </h1>
              <p className="text-xs opacity-80 tracking-wider uppercase">
                {preset?.headerSubtitle || SITE_CONFIG.app.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 -mt-4 relative z-10">
        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-4 mb-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-primary">{activeCount}</div>
              <div className="text-xs text-slate-500 mt-1">Active Tickets</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-xl">
              <div className="text-2xl font-bold text-amber-600">{allTickets.length}</div>
              <div className="text-xs text-slate-500 mt-1">Total Tickets</div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="px-1 mb-4">
          <h2 className="text-lg font-bold text-slate-800">{SITE_CONFIG.home.welcome}</h2>
          <p className="text-xs text-slate-500">{SITE_CONFIG.home.instruction}</p>
        </div>

        {/* Generate Button */}
        <button
          onClick={() => onNavigate('generate')}
          className="w-full bg-gradient-to-r from-primary to-primary-light text-white rounded-2xl p-5 mb-4 shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform animate-slide-up flex items-center justify-between"
        >
          <div className="text-left">
            <div className="text-lg font-bold">{SITE_CONFIG.home.generateBtn}</div>
            <div className="text-xs opacity-80 mt-1">
              {preset?.fareLabel || SITE_CONFIG.defaultTicket.fareLabel} • {preset?.currency || SITE_CONFIG.defaultTicket.currency}{preset?.fare || SITE_CONFIG.defaultTicket.fare}
            </div>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </button>

        {/* Recent Tickets */}
        {recentTickets.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Recent Tickets
              </h2>
              <button
                onClick={() => onNavigate('history')}
                className="text-xs text-primary font-medium"
              >
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {recentTickets.map((ticket) => {
                const isExpired = new Date(ticket.expiryTime).getTime() < Date.now();
                return (
                  <button
                    key={ticket.ticketId}
                    onClick={() => onOpenTicket(ticket)}
                    className="w-full bg-white rounded-xl p-4 shadow-sm text-left flex items-center gap-4 active:scale-[0.98] transition-transform"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                        isExpired ? 'bg-slate-400' : 'bg-emerald-500'
                      }`}
                    >
                      {isExpired ? 'EXP' : 'ACT'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800 truncate">
                        {ticket.passengerName || SITE_CONFIG.ticket.labels.passenger}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        #{ticket.ticketId}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-700">
                        {preset?.currency || SITE_CONFIG.defaultTicket.currency}{ticket.fare}
                      </div>
                      <div className={`text-xs mt-0.5 ${isExpired ? 'text-red-400' : 'text-emerald-500'}`}>
                        {isExpired ? SITE_CONFIG.ticket.labels.statusExpired : SITE_CONFIG.ticket.labels.statusValid}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* History Button */}
        <button
          onClick={() => onNavigate('history')}
          className="w-full mt-4 mb-6 bg-white rounded-xl p-4 shadow-sm text-center text-slate-600 font-medium text-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {SITE_CONFIG.home.historyBtn}
        </button>
      </div>

      {/* Bottom Safe Area */}
      <div className="h-8" />
    </div>
  );
}
