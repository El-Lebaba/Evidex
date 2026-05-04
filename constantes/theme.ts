import { Platform } from 'react-native';

const couleurTeinteClaire = '#BC8559';
const couleurTeinteSombre = '#E8E0C9';

export const Couleurs = {
  light: {
    text: '#19191F',
    background: '#F5F1E6',
    tint: couleurTeinteClaire,
    icon: '#728070',
    tabIconDefault: '#728070',
    tabIconSelected: couleurTeinteClaire,
  },
  dark: {
    text: '#F8F4EA',
    background: '#19191F',
    tint: couleurTeinteSombre,
    icon: '#B8C7B1',
    tabIconDefault: '#B8C7B1',
    tabIconSelected: couleurTeinteSombre,
  },
};

export const Polices = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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
