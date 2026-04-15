import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  SIMULATION_CATALOG,
  SimulationSection,
} from '@/features/simulations/simulation-catalog';

type SectionIndexScreenProps = {
  section: SimulationSection;
  title: string;
};

export function SectionIndexScreen({ section, title }: SectionIndexScreenProps) {
  const entries = SIMULATION_CATALOG[section];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">{title}</ThemedText>
        <ThemedText style={styles.description}>
          Temporary simulation files are ready below. Open any file to test the section.
        </ThemedText>

        <ScrollView contentContainerStyle={styles.listContent} style={styles.list}>
          {entries.map((entry) => (
            <Link href={entry.href} key={entry.href} asChild>
              <Pressable style={styles.card}>
                <ThemedText type="defaultSemiBold">{entry.title}</ThemedText>
              </Pressable>
            </Link>
          ))}
        </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
    gap: 16,
  },
  description: {
    maxWidth: 460,
  },
  list: {
    flex: 1,
    width: '100%',
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: 'rgba(188, 133, 89, 0.28)',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
  },
});