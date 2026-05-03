import { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { formatFormulaForDisplay } from '@/features/simulations/core/format-formula';

type FormulaRendererProps = {
  fallback: string;
  math: string;
  centered?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
};

const FONT_SIZE = {
  sm: 16,
  md: 18,
  lg: 20,
  xl: 36,
  xxl: 44,
} as const;

function FormulaRendererComponent({
  fallback,
  centered = false,
  size = 'md',
}: FormulaRendererProps) {
  const displayFormula = useMemo(() => formatFormulaForDisplay(fallback), [fallback]);

  return (
    <ThemedText
      lightColor="#000000"
      style={[
        styles.fallback,
        centered ? styles.centered : undefined,
        { fontSize: FONT_SIZE[size], lineHeight: FONT_SIZE[size] + 6 },
      ]}>
      {displayFormula}
    </ThemedText>
  );
}

export const FormulaRenderer = memo(FormulaRendererComponent);

const styles = StyleSheet.create({
  fallback: {
    color: '#000000',
    fontFamily: 'monospace',
    fontWeight: '900',
  },
  centered: {
    textAlign: 'center',
    width: '100%',
  },
});
