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
            <Pressable onPress={() => router.push('/(tabs)/profile')} style={styles.accountChip}>
              <MaterialIcons name="person-outline" size={18} color={palette.ink} />
              <Text style={styles.accountText}>Profil</Text>
            </Pressable>
          </View>

          <View style={styles.heroTextBlock}>
            <Text style={styles.eyebrow}>Accueil Evidex</Text>
            <Text style={styles.heroTitle}>Ton espace</Text>
            <Text style={styles.heroTitle}>d&apos;apprentissage</Text>
          </View>

          <View style={styles.logoStage}>
            <View style={styles.logoAura} />
            <Image resizeMode="contain" source={homeLogo} style={styles.logoImage} />
          </View>
        </View>

        <View style={styles.featuresSection}>
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
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  heroTextBlock: {
    alignItems: 'center',
    marginTop: 20,
  },
  eyebrow: {
    color: 'rgba(25,25,31,0.55)',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: palette.ink,
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 46,
    textAlign: 'center',
  },
  heroCopy: {
    color: 'rgba(32,36,43,0.78)',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 25,
    marginTop: 20,
    maxWidth: 420,
    textAlign: 'center',
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
    height: 170,
    justifyContent: 'center',
    marginTop: 92,
    position: 'relative',
    width: '100%',
  },
  logoAura: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 180,
    height: 200,
    position: 'absolute',
    top: 10,
    width: 240,
  },
  logoImage: {
    height: 124,
    width: '90%',
  },
  featuresSection: {
    alignItems: 'center',
    marginTop: -96,
    paddingHorizontal: 16,
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
    minHeight: 350,
    paddingBottom: 22,
    paddingHorizontal: 18,
    paddingTop: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    width: 208,
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
    height: 186,
    justifyContent: 'center',
  },
  cardIconWrap: {
    alignItems: 'center',
    borderRadius: 18,
    height: 92,
    justifyContent: 'center',
    width: 92,
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
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
  },
  cardSubtitle: {
    color: palette.slate,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
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
    fontSize: 16,
    fontWeight: '800',
  },
});
