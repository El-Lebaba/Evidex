import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SECTION_CONTENT, SectionKey } from '@/features/sections/section-content';

type SectionScreenProps = {
  section: SectionKey;
};

export function SectionScreen({ section }: SectionScreenProps) {
  const content = SECTION_CONTENT[section];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">{content.title}</ThemedText>
        <ThemedText style={styles.description}>{content.description}</ThemedText>
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
    gap: 16,
  },
  description: {
    maxWidth: 420,
    textAlign: 'center',
  },
});
