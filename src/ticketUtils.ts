export function generateTicketId(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let random = '';
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${yy}${mm}${dd}${hh}${min}${random}`;
}

export function formatDateTime(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const mmm = months[date.getMonth()];
  const yy = String(date.getFullYear()).slice(-2);
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const hh = String(hours).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return `${dd} ${mmm}, ${yy} | ${hh}:${min} ${ampm}`;
}

export function calculateExpiry(bookingTime: Date, _durationHours?: number): Date {
  // Always expire at 11:59:59 PM on the same day the ticket was booked
  const expiry = new Date(bookingTime);
  expiry.setHours(23, 59, 59, 999);
  return expiry;
}

export function getCountdown(expiryTime: Date): {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  percentage: number;
  isExpired: boolean;
} {
  const now = new Date().getTime();
  const expiry = new Date(expiryTime).getTime();
  const total = expiry - now;

  if (total <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, total: 0, percentage: 0, isExpired: true };
  }

  const hours = Math.floor(total / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, total, percentage: -1, isExpired: false };
}

export function getCountdownWithPercentage(
  bookingTime: string,
  expiryTime: string
): ReturnType<typeof getCountdown> & { percentage: number } {
  const booking = new Date(bookingTime).getTime();
  const expiry = new Date(expiryTime).getTime();
  const now = new Date().getTime();
  const totalDuration = expiry - booking;
  const remaining = expiry - now;

  const countdown = getCountdown(new Date(expiryTime));
  const percentage = totalDuration > 0 ? Math.max(0, (remaining / totalDuration) * 100) : 0;

  return { ...countdown, percentage };
}

export function padZero(n: number): string {
  return String(n).padStart(2, '0');
}
