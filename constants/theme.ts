import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#6B4226',
    background: '#FFFBF5',
    tint: '#16a34a',
    icon: '#8B7355',
    tabIconDefault: '#8B7355',
    tabIconSelected: '#16a34a',
    card: '#FFFFFF',
    border: '#E8DFD3',
    primary: '#22c55e',
    secondary: '#f59e0b',
    muted: '#A89880',
  },
  dark: {
    text: '#F5F0EB',
    background: '#1C1917',
    tint: '#4ade80',
    icon: '#A8A29E',
    tabIconDefault: '#A8A29E',
    tabIconSelected: '#4ade80',
    card: '#292524',
    border: '#44403C',
    primary: '#4ade80',
    secondary: '#fbbf24',
    muted: '#78716C',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
