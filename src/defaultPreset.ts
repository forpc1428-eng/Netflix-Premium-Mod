import { TicketPreset } from './types';
import { v4 as uuidv4 } from 'uuid';
import { SITE_CONFIG } from './siteConfig';

export function createDefaultPreset(): TicketPreset {
  const cfg = SITE_CONFIG.defaultTicket;
  return {
    id: uuidv4(),
    name: cfg.name,
    backgroundImage: '',
    logoImage: '',
    logoPosition: { x: 50, y: 8 },
    logoSize: cfg.logoSize,
    logoAnimation: {
      zoomEnabled: cfg.animation.enabled,
      zoomMin: cfg.animation.minScale,
      zoomMax: cfg.animation.maxScale,
      duration: cfg.animation.duration,
    },
    headerColor: cfg.headerColor,
    headerTextColor: cfg.headerTextColor,
    dividerColor: cfg.dividerColor,
    fontSettings: {
      family: cfg.fontFamily,
      headerSize: cfg.fontSizes.header,
      bodySize: cfg.fontSizes.body,
      ticketIdSize: cfg.fontSizes.ticketId,
      fareSize: cfg.fontSizes.fare,
      timerSize: cfg.fontSizes.timer,
    },
    fieldPositions: {
      ticketId: { x: 50, y: 0 },
      passengerName: { x: 50, y: 0 },
      fare: { x: 50, y: 0 },
      bookingTime: { x: 50, y: 0 },
      expiryTime: { x: 50, y: 0 },
      countdown: { x: 50, y: 0 },
      logo: { x: 50, y: 0 },
    },
    validityDurationHours: 24,
    fare: cfg.fare,
    fareLabel: cfg.fareLabel,
    currency: cfg.currency,
    headerTitle: cfg.headerTitle,
    headerSubtitle: cfg.headerSubtitle,
    editableFields: {
      name: true,
      fare: false,
      validity: false,
    },
  };
}
