import { useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TexteTheme } from '@/components/texte-theme';
import { VueTheme } from '@/components/vue-theme';
import {
  EnteteEcranSimulation,
  ESPACE_CONTENU_ENTETE_SIMULATION,
  HAUTEUR_TOTALE_ENTETE_SIMULATION,
} from '@/features/simulations/core/entete-ecran-simulation';

type LineSimulationScreenProps = {
  title: string;
  type: string;
};

const SIMULATION_PAGE_BACKGROUND = '#EAE3D2';

export function EcranSimulationLigne({ title, type}: LineSimulationScreenProps) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -HAUTEUR_TOTALE_ENTETE_SIMULATION],
    extrapolate: 'clamp',
  });
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 120],
    outputRange: [1, 0.9, 0],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <VueTheme style={styles.container}>
        <Animated.View
          style={[
            styles.headerOverlay,
            {
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslateY }],
            },
          ]}>
          <EnteteEcranSimulation title={title} type={type} />
        </Animated.View>
        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}>
          <VueTheme style={styles.content}>
            <TexteTheme type="title">{title}</TexteTheme>
          </VueTheme>
        </Animated.ScrollView>
      </VueTheme>
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
    paddingTop: HAUTEUR_TOTALE_ENTETE_SIMULATION + ESPACE_CONTENU_ENTETE_SIMULATION,
  },
  content: {
    flex: 1,
    gap: 24,
    minHeight: 600,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
