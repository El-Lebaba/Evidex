import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Href, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const palette = {
  background: '#EEF5ED',
  panel: '#F8F5EE',
  border: '#D7CDBE',
  text: '#1B232C',
  muted: '#66766A',
  mint: '#18C2A0',
  blue: '#7EA6E0',
  yellow: '#D8A94A',
  coral: '#D97B6C',
};

const sections = [
  {
    key: 'mathematiques',
    title: 'Math',
    icon: 'functions',
    color: palette.blue,
    href: '/(tabs)/mathematiques' as const,
  },
  {
    key: 'physique',
    title: 'Physique',
    icon: 'science',
    color: palette.yellow,
    href: '/(tabs)/physique' as const,
  },
  {
    key: 'java',
    title: 'Java',
    icon: 'code',
    color: palette.coral,
    href: '/(tabs)/programmation-java' as const,
  },
];

export default function SimulationsHubScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.page}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={22} color={palette.text} />
          <Text style={styles.backText}>Retour</Text>
        </Pressable>

        <Text style={styles.eyebrow}>Simulations</Text>
        <Text style={styles.title}>Choisis une section temporaire</Text>
        <Text style={styles.copy}>
          Cette page sert de point de passage pour l&apos;instant. Chaque bouton ouvre la section
          correspondante.
        </Text>

        <View style={styles.buttonStack}>
          {sections.map((section) => (
            <Pressable
              key={section.key}
              onPress={() => router.push(section.href as Href)}
              style={({ pressed }) => [
                styles.sectionButton,
                { borderColor: section.color },
                pressed && styles.sectionButtonPressed,
              ]}>
              <View style={[styles.sectionIcon, { backgroundColor: section.color }]}>
                <MaterialIcons name={section.icon as never} size={24} color={palette.text} />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <MaterialIcons name="chevron-right" size={26} color={palette.muted} />
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: palette.background,
    flex: 1,
  },
  page: {
    backgroundColor: palette.background,
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 26,
    paddingVertical: 8,
  },
  backText: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '800',
  },
  eyebrow: {
    color: palette.mint,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: palette.text,
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 36,
    marginTop: 8,
    maxWidth: 300,
  },
  copy: {
    color: palette.muted,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    marginTop: 12,
    maxWidth: 340,
  },
  buttonStack: {
    gap: 14,
    marginTop: 28,
  },
  sectionButton: {
    alignItems: 'center',
    backgroundColor: palette.panel,
    borderRadius: 22,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 14,
    minHeight: 86,
    paddingHorizontal: 18,
  },
  sectionButtonPressed: {
    transform: [{ scale: 0.985 }],
  },
  sectionIcon: {
    alignItems: 'center',
    borderRadius: 16,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  sectionTitle: {
    color: palette.text,
    flex: 1,
    fontSize: 22,
    fontWeight: '900',
  },
});

