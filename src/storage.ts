import { TicketPreset, GeneratedTicket } from './types';

const PRESETS_KEY = 'ticket_presets';
const TICKETS_KEY = 'generated_tickets';
const ACTIVE_PRESET_KEY = 'active_preset_id';

export function getPresets(): TicketPreset[] {
  try {
    const data = localStorage.getItem(PRESETS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePresets(presets: TicketPreset[]): void {
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}

export function savePreset(preset: TicketPreset): void {
  const presets = getPresets();
  const idx = presets.findIndex((p) => p.id === preset.id);
  if (idx >= 0) {
    presets[idx] = preset;
  } else {
    presets.push(preset);
  }
  savePresets(presets);
}

export function deletePreset(id: string): void {
  const presets = getPresets().filter((p) => p.id !== id);
  savePresets(presets);
}

export function getPresetById(id: string): TicketPreset | undefined {
  return getPresets().find((p) => p.id === id);
}

export function getActivePresetId(): string | null {
  return localStorage.getItem(ACTIVE_PRESET_KEY);
}

export function setActivePresetId(id: string): void {
  localStorage.setItem(ACTIVE_PRESET_KEY, id);
}

export function getActivePreset(): TicketPreset | undefined {
  const id = getActivePresetId();
  if (!id) return undefined;
  return getPresetById(id);
}

export function getTickets(): GeneratedTicket[] {
  try {
    const data = localStorage.getItem(TICKETS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTicket(ticket: GeneratedTicket): void {
  const tickets = getTickets();
  tickets.unshift(ticket);
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
}

export function getTicketById(id: string): GeneratedTicket | undefined {
  return getTickets().find((t) => t.ticketId === id);
}

export function deleteTicket(id: string): void {
  const tickets = getTickets().filter((t) => t.ticketId !== id);
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
}

export function updateTicketStatus(id: string, status: 'active' | 'expired'): void {
  const tickets = getTickets();
  const ticket = tickets.find((t) => t.ticketId === id);
  if (ticket) {
    ticket.status = status;
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
  }
}

export function exportPreset(preset: TicketPreset): void {
  const json = JSON.stringify(preset, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${preset.name.replace(/\s+/g, '-').toLowerCase()}-preset-v1.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importPreset(file: File): Promise<TicketPreset> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const preset = JSON.parse(e.target?.result as string) as TicketPreset;
        if (!preset.id || !preset.name || !preset.headerColor) {
          reject(new Error('Invalid preset structure'));
          return;
        }
        savePreset(preset);
        resolve(preset);
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to read image'));
    reader.readAsDataURL(file);
  });
}
