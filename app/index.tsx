import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingMathSymbols } from '@/features/simulations/core/floating-math-symbols';

const introLogo = require('@/assets/images/evidexe-logo.png');

const palette = {
  charcoal: '#19191F',
  copper: '#BC8559',
  cream: '#EEF5ED',
  sage: '#B8C7B1',
  slate: '#536165',
};

export default function IntroScreen() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.92)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const screenTranslateY = useRef(new Animated.Value(0)).current;
  const curtainTranslateY = useRef(new Animated.Value(-1200)).current;
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const animationtiming = 1150;
    const heartbeat = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            duration: animationtiming,
            easing: Easing.inOut(Easing.ease),
            toValue: 1.06,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            duration: animationtiming,
            easing: Easing.inOut(Easing.ease),
            toValue: 1,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            duration: animationtiming,
            easing: Easing.inOut(Easing.ease),
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            duration: animationtiming,
            easing: Easing.inOut(Easing.ease),
            toValue: 0.92,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    heartbeat.start();

    return () => {
      heartbeat.stop();
    };
  }, [opacity, scale]);

  //animation entrer écran d'acceuil
  const handleStart = () => {
    if (isLeaving) {
      return;
    }
    setIsLeaving(true);
    const animationtiming = 900;
    Animated.parallel([
      Animated.timing(screenTranslateY, {
        duration: animationtiming,
        easing: Easing.inOut(Easing.cubic),
        toValue: -120,
        useNativeDriver: true,
      }),
      Animated.timing(screenOpacity, {
        duration: animationtiming,
        easing: Easing.inOut(Easing.ease),
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(curtainTranslateY, {
        duration: animationtiming,
        easing: Easing.inOut(Easing.cubic),
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.replace('/(tabs)/home');
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.stage}>
        <Animated.View style={[
            styles.container,
            {
              opacity: screenOpacity,
              transform: [{ translateY: screenTranslateY }],
            },
          ]}>
          <FloatingMathSymbols/>
          <Pressable onPress={handleStart} style={styles.pressable}>
            <Animated.View
              style={[
                styles.logoShell,
                {
                  opacity,
                  transform: [{ scale }],
                },
              ]}>
              <Image
                resizeMode="contain"
                source={introLogo}
                style={styles.logo}
              />
            </Animated.View>
          </Pressable>
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
    backgroundColor: palette.cream,
    flex: 1,
  },
  stage: {
    backgroundColor: palette.cream,
    flex: 1,
  },
  container: {
    alignItems: 'center',
    backgroundColor: palette.cream,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 390,
    width: '100%',
  },
  logoShell: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
    height: 190,
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    width: '100%',
  },
  logo: {
    height: 138,
    width: '100%',
  },
  curtain: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: palette.cream,
  },
  noPointerEvents: {
    pointerEvents: 'none',
  },
});
