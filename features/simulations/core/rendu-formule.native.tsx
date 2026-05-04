import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { TexteTheme } from '@/components/texte-theme';
import { formaterFormulePourAffichage } from '@/features/simulations/core/formater-formule';

type ProprietesRenduFormule = {
  fallback: string;
  mathematiques: string;
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

function ComposantRenduFormule({
  fallback,
  centered = false,
  size = 'md',
}: ProprietesRenduFormule) {
  const displayFormula = useMemo(() => formaterFormulePourAffichage(fallback), [fallback]);

  return (
    <View style={[styles.wrap, centered ? styles.centered : undefined]}>
      <TexteTheme
        lightColor="#243B53"
        style={[
          styles.fallback,
          centered ? styles.centered : undefined,
          { fontSize: FONT_SIZE[size], lineHeight: FONT_SIZE[size] + 6 },
        ]}>
        {displayFormula}
      </TexteTheme>
    </View>
  );
}

export const RenduFormule = memo(ComposantRenduFormule);

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
