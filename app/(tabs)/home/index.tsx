import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title">Home</ThemedText>
          <ThemedText style={styles.description}>
            Choisis rapidement une section pour continuer ton travail.
          </ThemedText>
        </View>

        <View style={styles.buttonStack}>
          <Link href="/(tabs)/math" style={styles.link}>
            <ThemedText style={styles.linkText}>Math</ThemedText>
          </Link>
          <Link href="/(tabs)/physics" style={styles.link}>
            <ThemedText style={styles.linkText}>Physics</ThemedText>
          </Link>
          <Link href="/(tabs)/java-programming" style={styles.link}>
            <ThemedText style={styles.linkText}>Prog</ThemedText>
          </Link>
        </View>
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
    gap: 28,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    gap: 12,
  },
  description: {
    maxWidth: 420,
    textAlign: 'center',
  },
  buttonStack: {
    alignSelf: 'center',
    gap: 14,
    width: '100%',
    maxWidth: 320,
  },
  link: {
    alignItems: 'center',
    backgroundColor: '#F3F1E7',
    borderColor: '#A8B59A',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  linkText: {
    color: '#243B53',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
});
