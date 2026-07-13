export interface LogoAnimation {
  zoomEnabled: boolean;
  zoomMin: number;
  zoomMax: number;
  duration: number;
}

export interface FontSettings {
  family: string;
  headerSize: number;
  bodySize: number;
  ticketIdSize: number;
  fareSize: number;
  timerSize: number;
}

export interface FieldPosition {
  x: number;
  y: number;
}

export interface FieldPositions {
  ticketId: FieldPosition;
  passengerName: FieldPosition;
  fare: FieldPosition;
  bookingTime: FieldPosition;
  expiryTime: FieldPosition;
  countdown: FieldPosition;
  logo: FieldPosition;
}

export interface EditableFields {
  name: boolean;
  fare: boolean;
  validity: boolean;
}

export interface TicketPreset {
  id: string;
  name: string;
  backgroundImage: string;
  logoImage: string;
  logoPosition: FieldPosition;
  logoSize: number;
  logoAnimation: LogoAnimation;
  headerColor: string;
  headerTextColor: string;
  dividerColor: string;
  fontSettings: FontSettings;
  fieldPositions: FieldPositions;
  validityDurationHours: number;
  fare: number;
  fareLabel: string;
  currency: string;
  headerTitle: string;
  headerSubtitle: string;
  editableFields: EditableFields;
}

export interface GeneratedTicket {
  ticketId: string;
  presetId: string;
  passengerName: string;
  fare: number;
  bookingTime: string;
  expiryTime: string;
  status: 'active' | 'expired';
  createdAt: string;
}

export type AppView = 'home' | 'generate' | 'view' | 'admin' | 'history' | 'ticket';
