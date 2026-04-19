import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type LineSimulationScreenProps = {
  title: string;
};

const SIMULATION_PAGE_BACKGROUND = '#EAE3D2';

export function LineSimulationScreen({ title }: LineSimulationScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">{title}</ThemedText>
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
    paddingHorizontal: 20,
    paddingTop: 24,
  },
});
