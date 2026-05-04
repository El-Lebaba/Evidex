import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

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
    <View style={[styles.wrap, centered ? styles.centered : undefined]}>
      <ThemedText
        lightColor="#243B53"
        style={[
          styles.fallback,
          centered ? styles.centered : undefined,
          { fontSize: FONT_SIZE[size], lineHeight: FONT_SIZE[size] + 6 },
        ]}>
        {displayFormula}
      </ThemedText>
    </View>
  );
}

export const FormulaRenderer = memo(FormulaRendererComponent);

const styles = StyleSheet.create({
  wrap: {
    justifyContent: 'center',
    minHeight: 32,
    width: '100%',
  },
  centered: {
    alignItems: 'center',
    textAlign: 'center',
  },
  fallback: {
    color: '#243B53',
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
});
