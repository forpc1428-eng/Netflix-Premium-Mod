import { useState, useEffect } from 'react';
import { GeneratedTicket } from '../types';
import { getTickets, deleteTicket, getActivePreset } from '../storage';
import { formatDateTime } from '../ticketUtils';
import { SITE_CONFIG } from '../siteConfig';

interface HistoryViewProps {
  onBack: () => void;
  onOpenTicket: (ticket: GeneratedTicket) => void;
}

export default function HistoryView({ onBack, onOpenTicket }: HistoryViewProps) {
  const [tickets, setTickets] = useState<GeneratedTicket[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');
  const preset = getActivePreset();
  const cfg = SITE_CONFIG.history;

  useEffect(() => {
    setTickets(getTickets());
  }, []);

  const now = Date.now();

  const filteredTickets = tickets.filter((t) => {
    const isExpired = new Date(t.expiryTime).getTime() < now;
    if (filter === 'active') return !isExpired;
    if (filter === 'expired') return isExpired;
    return true;
  });

  const handleDelete = (id: string) => {
    deleteTicket(id);
    setTickets(getTickets());
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      {/* Header */}
      <div
        className="px-4 pt-12 pb-6 text-white flex items-center gap-3"
        style={{ background: preset?.headerColor || SITE_CONFIG.defaultTicket.headerColor }}
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
          <p className="text-xs opacity-80">{tickets.length} total tickets</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 -mt-3 relative z-10">
        <div className="bg-white rounded-xl shadow-sm p-1 flex gap-1 mb-4">
          {(['all', 'active', 'expired'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                filter === f
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket List */}
      <div className="flex-1 px-4 pb-8 no-scrollbar overflow-y-auto">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">{cfg.noTickets}</p>
            <p className="text-slate-400 text-sm mt-1">Generate a new ticket to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket, i) => {
              const isExpired = new Date(ticket.expiryTime).getTime() < now;
              return (
                <div
                  key={ticket.ticketId}
                  className="bg-white rounded-xl shadow-sm overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <button
                    onClick={() => onOpenTicket(ticket)}
                    className="w-full p-4 text-left flex items-center gap-4 active:bg-slate-50 transition-colors"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white ${
                        isExpired ? 'bg-slate-400' : 'bg-emerald-500'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase">{isExpired ? 'EXP' : 'ACT'}</span>
                      <span className="text-[8px] opacity-80">{preset?.currency || SITE_CONFIG.defaultTicket.currency}{ticket.fare}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800 truncate">
                          {ticket.passengerName}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        #{ticket.ticketId}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {formatDateTime(new Date(ticket.bookingTime))}
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="px-4 pb-3 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(ticket.ticketId);
                      }}
                      className="text-[11px] text-red-400 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
