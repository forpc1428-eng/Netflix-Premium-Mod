/**
 * SITE CONFIGURATION
 * Use this file to control EVERYTHING on the site.
 */

export const SITE_CONFIG = {
  // APP & LOGIC SETTINGS
  settings: {
    fareValue: '₹35',           // Fixed fare displayed everywhere
    longPressDuration: 3000,    // Time (ms) to hold username to edit it
    multiTapCount: 4,           // Number of taps anywhere to edit username
    multiTapDuration: 2000,     // Time (ms) within which taps must occur
    autoFullscreen: true,       // Enter full screen mode on first click
    localStorageKey: 'ticket_name', // Key used to save name in browser
    mobilePadding: 20,          // Side padding for mobile scaling
    countdownPrefix: 'Expires in ', // Text before the live timer
  },

  // BACKGROUND SETTINGS
  background: {
    siteColor: '#efc9c6',      // Background color of the whole page
    useMobileFullHeight: true,  // Makes the site feel like a real app on phones
  },

  // FONT SETTINGS
  fontSettings: {
    // Options: 'Montserrat', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Sarala', 'Arial', 'Kohinoor Devanagari'
    globalFont: 'Sarala',
    forceGlobalFont: true,    // Set to true to make all fields use the globalFont
  },

  // TICKET SETTINGS
  ticket: {
    imagePath: '/images/default-ticket.png',

    // BOX SETTINGS (The frame)
    boxWidth: 380,             // Width of the frame
    boxHeight: 490,            // Height of the frame
    borderRadius: '24px',      // Frame corners
    backgroundColor: '#bd2929', // Color behind image
    showShadow: false,          // Shadow around the frame
    shadowStyle: '0 10px 30px rgba(0,0,0,0.15)', // Custom shadow CSS

    // TICKET IMAGE SETTINGS (Inside the frame)
    imageWidth: 380,           // Width of the actual image
    imageHeight: 490,          // Height of the actual image
    imageOffsetX: '0px',       // Move image horizontally inside frame
    imageOffsetY: '0px',       // Move image vertically inside frame

    // Animation (Zoom In/Out)
    animation: {
      enabled: false,          // Set to true to animate the ticket
      minScale: 1.0,
      maxScale: 1.05,
      duration: 5000,
    }
  },

  // LOGO SETTINGS
  logo: {
    imagePath: '/images/default-logo.png',

    // BOX SETTINGS (The container)
    boxWidth: 195,             // Width of the box
    boxHeight: 105,            // Height of the box

    // LOGO IMAGE SETTINGS (Inside the box)
    logoWidth: 135,             // Width of the logo image
    logoHeight: 105,            // Height of the logo image

    borderRadius: '1px',      // '0px' for square, '50%' for circle
    backgroundColor: '#F8F6F5', // Background color of the box
    padding: '1px',            // Space around the logo inside the box
    showShadow: false,         // Set to true to show shadow around the logo box
    shadowStyle: '0 4px 12px rgba(0,0,0,0.1)', // Custom shadow CSS

    // PLACEMENT (Move logo anywhere on the ticket)
    positionY: '72%',          // Distance from Top (e.g. '10%', '50px')
    positionX: '50%',          // Distance from Left (usually '50%' for center)

    // Animation (Zoom In/Out)
    animation: {
      enabled: true,
      minScale: 0.9,           // Normal size
      maxScale: 1.2,           // Zoomed size
      duration: 3000,          // Time for one zoom cycle (milliseconds)
    }
  },

  // TEXT FIELDS (12 Editable Fields)
  // Codes: {{USER_NAME}}, {{FARE}}, {{BOOKING_TIME}}, {{EXPIRY_TIME}}, {{SERIAL}}, {{COUNTDOWN}}
  textFields: [
    { id: 1, text: 'Rajkot Rajpath Ltd', posX: '50%', posY: '11%', fontSize: '16px', color: '#fefdfd', fontWeight: 'normal', letterSpacing: '1px', fontFamily: 'Montserrat', textAlign: 'center' },
    { id: 2, text: 'ID', posX: '11%', posY: '17%', fontSize: '14px', color: '#a6a6a6', fontWeight: 'normal', letterSpacing: '0px', fontFamily: 'Montserrat', textAlign: 'left' },
    { id: 3, text: '{{USER_NAME}}', posX: '11%', posY: '20%', fontSize: '15px', color: '#000000', fontWeight: 'bold', letterSpacing: '0px', fontFamily: 'Montserrat', textAlign: 'left' },
    { id: 4, text: 'Fare', posX: '61%', posY: '17%', fontSize: '14px', color: '#a6a6a6', fontWeight: 'normal', letterSpacing: '0px', fontFamily: 'Montserrat', textAlign: 'left' },
    { id: 5, text: '{{FARE}}', posX: '61%', posY: '20%', fontSize: '16px', color: '#000000', fontWeight: 'bold', letterSpacing: '2px', fontFamily: 'Montserrat', textAlign: 'left' },
    { id: 6, text: 'Booking Time', posX: '11%', posY: '34.5%', fontSize: '13px', color: '#a6a6a6', fontWeight: 'normal', letterSpacing: '0px', fontFamily: 'Montserrat', textAlign: 'left' },
    { id: 7, text: '{{BOOKING_TIME}}', posX: '11%', posY: '38%', fontSize: '12px', color: '#000000', fontWeight: 'bold', letterSpacing: '0px', fontFamily: 'Montserrat', textAlign: 'left' },
    { id: 8, text: 'Validity Time', posX: '55%', posY: '34.5%', fontSize: '13px', color: '#a6a6a6', fontWeight: 'normal', letterSpacing: '0px', fontFamily: 'Montserrat', textAlign: 'left' },
    { id: 9, text: '{{EXPIRY_TIME}}', posX: '55%', posY: '38%', fontSize: '12px', color: '#000000', fontWeight: 'bold', letterSpacing: '0px', fontFamily: 'Montserrat', textAlign: 'left' },
    { id: 10, text: '{{SERIAL}}', posX: '50%', posY: '46%', fontSize: '13.6px', color: '#000000', fontWeight: 'normal', letterSpacing: '0.25px', fontFamily: 'Montserrat', textAlign: 'center' },
    { id: 11, text: 'One Day Pass', posX: '50%', posY: '54.5%', fontSize: '14px', color: '#ffffff', fontWeight: 'normal', letterSpacing: '0.9px', fontFamily: 'Montserrat', textAlign: 'center' },
    { id: 12, text: '{{COUNTDOWN}}', posX: '50%', posY: '89%', fontSize: '14px', color: '#000000', fontWeight: 'normal', letterSpacing: '0px', fontFamily: 'Montserrat', textAlign: 'center' },
  ]
};
