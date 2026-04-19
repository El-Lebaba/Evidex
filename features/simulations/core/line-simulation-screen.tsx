import { useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  SimulationScreenHeader,
  SIMULATION_HEADER_CONTENT_GAP,
  SIMULATION_HEADER_TOTAL_HEIGHT,
} from '@/features/simulations/core/simulation-screen-header';

type LineSimulationScreenProps = {
  title: string;
};

const SIMULATION_PAGE_BACKGROUND = '#EAE3D2';

export function LineSimulationScreen({ title }: LineSimulationScreenProps) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -SIMULATION_HEADER_TOTAL_HEIGHT],
    extrapolate: 'clamp',
  });
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 120],
    outputRange: [1, 0.9, 0],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <Animated.View
          style={[
            styles.headerOverlay,
            {
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslateY }],
            },
          ]}>
          <SimulationScreenHeader title={title} />
        </Animated.View>
        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.content}>
            <ThemedText type="title">{title}</ThemedText>
          </ThemedView>
        </Animated.ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: SIMULATION_PAGE_BACKGROUND,
    flex: 1,
  },
  container: {
    backgroundColor: SIMULATION_PAGE_BACKGROUND,
    flex: 1,
  },
  headerOverlay: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
  scrollContent: {
    paddingTop: SIMULATION_HEADER_TOTAL_HEIGHT + SIMULATION_HEADER_CONTENT_GAP,
  },
  content: {
    flex: 1,
    gap: 24,
    minHeight: 600,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
