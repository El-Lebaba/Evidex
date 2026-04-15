import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type LineSimulationScreenProps = {
  title: string;
  color: string;
};

export function LineSimulationScreen({ title, color }: LineSimulationScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">{title}</ThemedText>
        <ThemedText style={styles.description}>
          Temporary simulation file. Replace this colored line with the real simulation code.
        </ThemedText>
        <View style={[styles.line, { backgroundColor: color }]} />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 20,
  },
  description: {
    maxWidth: 420,
    textAlign: 'center',
  },
  line: {
    width: 220,
    height: 8,
    borderRadius: 999,
  },
});
