import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const palette = {
  charcoal: '#19191F',
  copper: '#BC8559',
  cream: '#EEF5ED',
  creamDark: '#DFE9DC',
  sage: '#B8C7B1',
  ink: '#20242B',
  slate: '#536165',
  blue: '#7EA6E0',
  yellow: '#D8A94A',
  white: '#FFFFFF',
};

const homeLogo = require('@/assets/images/evidexe-logo.png');

const featureCards = [
  {
    key: 'cours',
    title: 'Cours',
    subtitle: 'Bientot disponible',
    icon: 'menu-book',
    accent: palette.yellow,
    onPress: undefined,
  },
  {
    key: 'simulations',
    title: 'Simulations',
    subtitle: 'Explorer les sections',
    icon: 'bolt',
    accent: palette.blue,
    onPress: () => router.push('/(tabs)/simulations'),
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.eyebrow}>Accueil Evidex</Text>
              <Text style={styles.heroTitle}>Ton espace</Text>
              <Text style={styles.heroTitle}>d&apos;apprentissage</Text>
            </View>
            <Pressable onPress={() => router.push('/(tabs)/profile')} style={styles.accountChip}>
              <MaterialIcons name="person-outline" size={18} color={palette.ink} />
              <Text style={styles.accountText}>Profil</Text>
            </Pressable>
          </View>

          <Text style={styles.heroCopy}>
            Trouve rapidement le bon point d&apos;entree pour tes cours et tes simulations, dans
            un espace plus clair et plus simple.
          </Text>

          <View style={styles.logoStage}>
            <View style={styles.logoAura} />
            <View style={styles.logoCard}>
              <Image resizeMode="contain" source={homeLogo} style={styles.logoImage} />
            </View>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionLabel}>Choisis ton point de depart</Text>
          <View style={styles.cardsGrid}>
            {featureCards.map((card) => {
              const isDisabled = !card.onPress;

              return (
                <Pressable
                  key={card.key}
                  onPress={card.onPress}
                  style={({ pressed }) => [
                    styles.card,
                    isDisabled && styles.cardDisabled,
                    pressed && !isDisabled && styles.cardPressed,
                  ]}>
                  <View style={[styles.cardMedia, { backgroundColor: `${card.accent}20` }]}>
                    <View style={[styles.cardIconWrap, { backgroundColor: card.accent }]}>
                      <MaterialIcons name={card.icon as never} size={34} color={palette.ink} />
                    </View>
                  </View>

                  <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={styles.cardFooterText}>{isDisabled ? 'Bientot' : 'Ouvrir'}</Text>
                    <MaterialIcons
                      name={isDisabled ? 'schedule' : 'chevron-right'}
                      size={22}
                      color={palette.slate}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: palette.cream,
    flex: 1,
  },
  content: {
    backgroundColor: palette.cream,
    paddingBottom: 48,
  },
  hero: {
    backgroundColor: palette.sage,
    minHeight: 560,
    overflow: 'hidden',
    paddingHorizontal: 22,
    paddingTop: 18,
    position: 'relative',
  },
  heroTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: 'rgba(25,25,31,0.55)',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: palette.ink,
    fontSize: 35,
    fontWeight: '900',
    lineHeight: 38,
  },
  heroCopy: {
    color: 'rgba(32,36,43,0.78)',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 23,
    marginTop: 18,
    maxWidth: 360,
  },
  accountChip: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderColor: 'rgba(32,36,43,0.1)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  accountText: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: '800',
  },
  logoStage: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 260,
    justifyContent: 'center',
    marginTop: 72,
    position: 'relative',
    width: '100%',
  },
  logoAura: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 180,
    height: 240,
    position: 'absolute',
    top: 10,
    width: 240,
  },
  logoCard: {
    alignItems: 'center',
    backgroundColor: palette.white,
    borderColor: 'rgba(188,133,89,0.18)',
    borderRadius: 42,
    borderWidth: 1,
    elevation: 5,
    height: 174,
    justifyContent: 'center',
    paddingHorizontal: 26,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    width: '88%',
  },
  logoImage: {
    height: 96,
    width: '100%',
  },
  featuresSection: {
    alignItems: 'center',
    marginTop: -82,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    color: palette.slate,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 14,
    textTransform: 'uppercase',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    alignItems: 'stretch',
    backgroundColor: palette.cream,
    borderColor: '#E2DACB',
    borderRadius: 26,
    borderWidth: 1,
    elevation: 2,
    minHeight: 280,
    paddingBottom: 18,
    paddingHorizontal: 16,
    paddingTop: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    width: 164,
  },
  cardDisabled: {
    opacity: 0.84,
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
  },
  cardMedia: {
    alignItems: 'center',
    borderRadius: 20,
    height: 148,
    justifyContent: 'center',
  },
  cardIconWrap: {
    alignItems: 'center',
    borderRadius: 18,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
  cardText: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingTop: 18,
  },
  cardTitle: {
    color: palette.ink,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  cardSubtitle: {
    color: palette.slate,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  cardFooter: {
    alignItems: 'center',
    borderTopColor: '#E2DACB',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingTop: 14,
  },
  cardFooterText: {
    color: palette.slate,
    fontSize: 14,
    fontWeight: '800',
  },
});
