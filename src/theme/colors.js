// JalPravah — Design System Colors
// Inspired by the OALET reference: clean white, black accents, mint/teal highlights

export const Colors = {
  // Base
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',

  // Brand
  primary: '#00C9A7',       // Teal/mint — water theme
  primaryDark: '#00A88A',
  primaryLight: '#E0FAF5',
  secondary: '#1A1A2E',     // Deep navy
  accent: '#6C63FF',        // Purple accent

  // Alert levels (flood risk)
  green: '#00C9A7',
  greenBg: '#E0FAF5',
  yellow: '#FFB800',
  yellowBg: '#FFF8E1',
  orange: '#FF6B35',
  orangeBg: '#FFF0EB',
  red: '#FF3B5C',
  redBg: '#FFE8ED',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#5A6478',
  textMuted: '#9BA3B2',
  textInverse: '#FFFFFF',

  // UI
  border: '#E8ECF0',
  borderLight: '#F0F3F7',
  divider: '#F0F3F7',
  shadow: 'rgba(0,0,0,0.08)',
  overlay: 'rgba(26,26,46,0.6)',

  // Status
  success: '#00C9A7',
  warning: '#FFB800',
  error: '#FF3B5C',
  info: '#4A90E2',

  // Glassmorphism
  glass: 'rgba(255,255,255,0.85)',
  glassBorder: 'rgba(255,255,255,0.6)',
  glassDark: 'rgba(26,26,46,0.75)',
};

export const RiskColors = {
  GREEN: { bg: '#E0FAF5', text: '#00A88A', dot: '#00C9A7', label: 'Prepared' },
  YELLOW: { bg: '#FFF8E1', text: '#CC9200', dot: '#FFB800', label: 'Caution' },
  ORANGE: { bg: '#FFF0EB', text: '#CC4400', dot: '#FF6B35', label: 'High Risk' },
  RED: { bg: '#FFE8ED', text: '#CC0033', dot: '#FF3B5C', label: 'Critical' },
};
