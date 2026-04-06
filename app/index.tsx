import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PercentString = `${number}%`;

const palette = {
  cream: '#EEF5ED',
  sage: '#B8C7B1',
  copper: '#BC8559',
  charcoal: '#19191F',
  slate: '#536165',
  white: '#FFFFFF',
};

const symbolPool = [
  '+',
  '-',
  '=',
  'x',
  'y',
  '兀',
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
    symbol: symbolPool[index % symbolPool.length],
    left: toPercent(8 + horizontalBand),
    top: toPercent(10 + verticalBand),
    size: 16 + ((index * 7) % 18),
    duration: 3600 + ((index * 233) % 2600),
    delay: (index * 140) % 1800,
    driftX: -20 + ((index * 11) % 40),
    driftY: -26 - ((index * 13) % 34),
    rotate: -8 + ((index * 5) % 16),
  };
}

export default function IntroScreen() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.92)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const screenTranslateY = useRef(new Animated.Value(0)).current;
  const curtainTranslateY = useRef(new Animated.Value(-1200)).current;
  const symbolSeeds = useMemo(
    () => Array.from({ length: symbolCount }, (_, index) => createSymbolSeed(index)),
    []
  );
  const floatValues = useRef(symbolSeeds.map(() => new Animated.Value(0))).current;
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const heartbeat = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.06,
            duration: 1150,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1150,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 1150,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.92,
            duration: 1150,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    const floatAnimations = floatValues.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(symbolSeeds[index].delay),
          Animated.timing(value, {
            toValue: 1,
            duration: symbolSeeds[index].duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      )
    );

    heartbeat.start();
    floatAnimations.forEach((animation) => animation.start());

    return () => {
      heartbeat.stop();
      floatAnimations.forEach((animation) => animation.stop());
    };
  }, [floatValues, opacity, scale, symbolSeeds]);

  const handleStart = () => {
    if (isLeaving) {
      return;
    }

    setIsLeaving(true);

    Animated.parallel([
      Animated.timing(screenTranslateY, {
        toValue: -120,
        duration: 900,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 850,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(curtainTranslateY, {
        toValue: 0,
        duration: 900,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.replace('/(tabs)');
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.stage}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: screenOpacity,
              transform: [{ translateY: screenTranslateY }],
            },
          ]}>
          <View style={styles.glow} />

          {symbolSeeds.map((item, index) => {
            const animatedValue = floatValues[index];

            return (
              <Animated.Text
                key={`${item.symbol}-${index}`}
                style={[
                  styles.mathSymbol,
                  {
                    top: item.top,
                    left: item.left,
                    fontSize: item.size,
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
                    opacity: animatedValue.interpolate({
                      inputRange: [0, 0.18, 0.75, 1],
                      outputRange: [0, 0.18, 0.22, 0],
                    }),
                  },
                ]}>
                {item.symbol}
              </Animated.Text>
            );
          })}

          <Pressable style={styles.pressable} onPress={handleStart}>
            <Animated.View
              style={[
                styles.logoShell,
                {
                  opacity,
                  transform: [{ scale }],
                },
              ]}>
              <Image
                source={require('@/assets/images/evidexe-logo.png')}
                contentFit="contain"
                style={styles.logo}
              />
            </Animated.View>
          </Pressable>

          <Text style={styles.hint}>click logo to start</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.curtain,
            styles.noPointerEvents,
            {
              transform: [{ translateY: curtainTranslateY }],
            },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.cream,
  },
  stage: {
    flex: 1,
    backgroundColor: palette.cream,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: palette.cream,
  },
  glow: {
    position: 'absolute',
    width: 440,
    height: 440,
    borderRadius: 220,
    backgroundColor: 'rgba(184, 199, 177, 0.42)',
  },
  mathSymbol: {
    position: 'absolute',
    color: palette.charcoal,
    fontWeight: '700',
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoShell: {
    width: 390,
    height: 230,
    borderRadius: 40,
    paddingHorizontal: 24,
    paddingVertical: 34,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(188, 133, 89, 0.14)',
  },
  logo: {
    width: '100%',
    height: 138,
  },
  hint: {
    marginTop: 28,
    color: palette.slate,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'lowercase',
    zIndex: 2,
  },
  curtain: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: palette.cream,
  },
  noPointerEvents: {
    pointerEvents: 'none',
  },
});
