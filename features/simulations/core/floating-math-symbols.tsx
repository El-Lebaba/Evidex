import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type PercentString = `${number}%`;

type FloatingMathSymbolsProps = {
  showGlow?: boolean;
  style?: StyleProp<ViewStyle>;
};

const palette = {
  cream: '#EEF5ED',
  sageGlow: 'rgba(184, 199, 177, 0.42)',
  symbol: '#19191F',
};

const symbolPool = [
  '+',
  '-',
  '=',
  'x',
  'y',
  '∀',
  '%',
  '∫',
  '∅',
  '∂',
  '⋢',
  '∡',
  '∰',
  '∑',
  'β',
  'ψ',
  'ζ',
  '>',
  '<',
  '1/2',
];

const symbolCount = 26;

function toPercent(value: number): PercentString {
  return `${value}%`;
}

function createSymbolSeed(index: number) {
  const horizontalBand = (index * 37) % 84;
  const verticalBand = (index * 19) % 72;

  return {
    delay: (index * 140) % 1800,
    driftX: -20 + ((index * 11) % 40),
    driftY: -26 - ((index * 13) % 34),
    duration: 3600 + ((index * 233) % 2600),
    left: toPercent(8 + horizontalBand),
    rotate: -8 + ((index * 5) % 16),
    size: 16 + ((index * 7) % 18),
    symbol: symbolPool[index % symbolPool.length],
    top: toPercent(10 + verticalBand),
  };
}

export function FloatingMathSymbols({ showGlow = true, style }: FloatingMathSymbolsProps) {
  const symbolSeeds = useMemo(
    () => Array.from({ length: symbolCount }, (_, index) => createSymbolSeed(index)),
    []
  );
  const floatValues = useRef(symbolSeeds.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const floatAnimations = floatValues.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(symbolSeeds[index].delay),
          Animated.timing(value, {
            duration: symbolSeeds[index].duration,
            easing: Easing.inOut(Easing.ease),
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            duration: 0,
            toValue: 0,
            useNativeDriver: true,
          }),
        ])
      )
    );

    floatAnimations.forEach((animation) => animation.start());

    return () => {
      floatAnimations.forEach((animation) => animation.stop());
    };
  }, [floatValues, symbolSeeds]);

  return (
    <View pointerEvents="none" style={[styles.container, style]}>
      {showGlow ? <View style={styles.glow} /> : null}

      {symbolSeeds.map((item, index) => {
        const animatedValue = floatValues[index];

        return (
          <Animated.Text
            key={`${item.symbol}-${index}`}
            style={[
              styles.mathSymbol,
              {
                fontSize: item.size,
                left: item.left,
                opacity: animatedValue.interpolate({
                  inputRange: [0, 0.18, 0.75, 1],
                  outputRange: [0, 0.18, 0.22, 0],
                }),
                top: item.top,
                transform: [
                  {
                    translateX: animatedValue.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, item.driftX, item.driftX / 2],
                    }),
                  },
                  {
                    translateY: animatedValue.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [16, item.driftY, item.driftY - 16],
                    }),
                  },
                  {
                    rotate: animatedValue.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: ['0deg', `${item.rotate}deg`, '0deg'],
                    }),
                  },
                ],
              },
            ]}>
            {item.symbol}
          </Animated.Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: palette.cream,
    overflow: 'hidden',
  },
  glow: {
    backgroundColor: palette.sageGlow,
    borderRadius: 220,
    height: 440,
    left: '50%',
    marginLeft: -220,
    marginTop: -220,
    position: 'absolute',
    top: '50%',
    width: 440,
  },
  mathSymbol: {
    color: palette.symbol,
    fontWeight: '700',
    position: 'absolute',
  },
});
