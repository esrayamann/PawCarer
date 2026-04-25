// PawCarer Design System — Web ile uyumlu renk paleti
export const Colors = {
  // Brand (web ile aynı)
  primary: '#8B5A2B',        // --primary-color
  primaryDark: '#754B24',    // --primary-hover
  primaryLight: '#C48A5A',
  secondary: '#F47B20',      // --secondary-color
  secondaryDark: '#E36B15',  // --secondary-hover
  accent: '#2F79A8',         // --accent-color
  success: '#79B851',        // --success-color

  // Backgrounds (web light theme)
  background: '#FDFBF7',     // --bg-color
  surface: '#FFFFFF',
  surfaceHigh: '#FFF8F2',    // turuncu tonu açık
  card: '#FFFFFF',
  cardBorder: 'rgba(139,90,43,0.12)',
  border: 'rgba(139,90,43,0.15)',

  // Text
  textPrimary: '#3A3029',    // --text-dark
  textSecondary: '#857D77',  // --text-muted
  textMuted: '#A09890',
  textOnPrimary: '#FDFBF7',  // --text-light
  textOnSecondary: '#FFFFFF',

  // Status
  error: '#DC2626',
  warning: '#F59E0B',

  // UI
  overlay: 'rgba(58,48,41,0.5)',
  danger: '#DC2626',

  // Gradient stops
  gradientStart: 'rgba(244,123,32,0.08)',
  gradientEnd: 'rgba(139,90,43,0.08)',
};

export const Typography = {
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 30,
    xxxl: 38,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#8B5A2B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#8B5A2B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
};
