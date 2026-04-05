import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const palette = {
  cream: '#F5F1E6',
  sand: '#E8E0C9',
  sage: '#B8C7B1',
  copper: '#BC8559',
  charcoal: '#19191F',
  slate: '#536165',
  white: '#FFFFFF',
};

const highlights = [
  { value: 'Clair', label: 'suivi des dossiers' },
  { value: 'Rapide', label: 'acces aux informations' },
  { value: 'Structure', label: 'travail equipe' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.glowTop} />
          <View style={styles.glowBottom} />

          <View style={styles.logoWrap}>
            <Image
              source={require('@/assets/images/evidexe-logo.png')}
              contentFit="contain"
              style={styles.logo}
            />
          </View>

          <View style={styles.copyBlock}>
            <Text style={styles.eyebrow}>Ecran d&apos;accueil</Text>
            <Text style={styles.title}>La connaissance prend une forme simple.</Text>
            <Text style={styles.subtitle}>
              Evidexe centralise vos idees, vos dossiers et vos points clefs dans une interface
              lisible, calme et immediate.
            </Text>
          </View>

          <Link href="/(tabs)/explore" style={styles.primaryAction}>
            <Text style={styles.primaryActionText}>Decouvrir la plateforme</Text>
          </Link>

          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewKicker}>Ambiance</Text>
              <Text style={styles.previewTag}>Sauge / cuivre / creme</Text>
            </View>
            <Image
              source={require('@/assets/images/home-illustration.png')}
              contentFit="cover"
              style={styles.previewImage}
            />
          </View>
        </View>

        <View style={styles.highlightsRow}>
          {highlights.map((item) => (
            <View key={item.value} style={styles.highlightCard}>
              <Text style={styles.highlightValue}>{item.value}</Text>
              <Text style={styles.highlightLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.cream,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 22,
  },
  hero: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 26,
    backgroundColor: palette.sand,
    borderWidth: 1,
    borderColor: 'rgba(83, 97, 101, 0.12)',
  },
  glowTop: {
    position: 'absolute',
    top: -80,
    right: -30,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(184, 199, 177, 0.55)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -120,
    left: -60,
    width: 250,
    height: 250,
    borderRadius: 999,
    backgroundColor: 'rgba(188, 133, 89, 0.18)',
  },
  logoWrap: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 22,
  },
  logo: {
    width: 178,
    height: 56,
  },
  copyBlock: {
    gap: 12,
    marginBottom: 22,
  },
  eyebrow: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: palette.sage,
    color: palette.charcoal,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  title: {
    maxWidth: 320,
    color: palette.charcoal,
    fontSize: 34,
    lineHeight: 39,
    fontWeight: '800',
  },
  subtitle: {
    maxWidth: 330,
    color: palette.slate,
    fontSize: 16,
    lineHeight: 24,
  },
  primaryAction: {
    alignSelf: 'flex-start',
    marginBottom: 22,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: palette.charcoal,
  },
  primaryActionText: {
    color: palette.white,
    fontSize: 15,
    fontWeight: '700',
  },
  previewCard: {
    borderRadius: 28,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(25, 25, 31, 0.08)',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  previewKicker: {
    color: palette.charcoal,
    fontSize: 14,
    fontWeight: '700',
  },
  previewTag: {
    color: palette.copper,
    fontSize: 12,
    fontWeight: '700',
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1.93,
    borderRadius: 20,
    backgroundColor: palette.sage,
  },
  highlightsRow: {
    gap: 14,
  },
  highlightCard: {
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: 'rgba(151, 168, 134, 0.18)',
  },
  highlightValue: {
    color: palette.copper,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  highlightLabel: {
    color: palette.slate,
    fontSize: 14,
    lineHeight: 20,
  },
});
