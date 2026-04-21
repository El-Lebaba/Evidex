import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Href, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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

const heroBubbles = [
  { height: 92, left: -20, opacity: 0.24, top: 120, width: 92 },
  { height: 74, left: 22, opacity: 0.2, top: 174, width: 74 },
  { height: 56, left: 70, opacity: 0.22, top: 70, width: 56 },
  { height: 44, left: 106, opacity: 0.24, top: 124, width: 44 },
  { height: 36, left: 126, opacity: 0.26, top: 52, width: 36 },
  { height: 30, left: 148, opacity: 0.28, top: 98, width: 30 },
  { height: 26, left: 170, opacity: 0.3, top: 150, width: 26 },
  { height: 34, left: 110, opacity: 0.24, top: 210, width: 34 },
  { height: 24, left: 138, opacity: 0.28, top: 250, width: 24 },
  { height: 18, left: 164, opacity: 0.32, top: 294, width: 18 },
  { height: 14, left: 184, opacity: 0.36, top: 340, width: 14 },
  { height: 12, left: 152, opacity: 0.38, top: 382, width: 12 },
  { height: 20, left: 90, opacity: 0.26, top: 320, width: 20 },
  { height: 16, left: 72, opacity: 0.32, top: 270, width: 16 },
  { height: 12, left: 48, opacity: 0.36, top: 232, width: 12 },
  { height: 108, right: -28, opacity: 0.24, top: 112, width: 108 },
  { height: 80, right: 18, opacity: 0.2, top: 168, width: 80 },
  { height: 58, right: 72, opacity: 0.22, top: 66, width: 58 },
  { height: 42, right: 112, opacity: 0.24, top: 120, width: 42 },
  { height: 36, right: 132, opacity: 0.26, top: 42, width: 36 },
  { height: 30, right: 156, opacity: 0.28, top: 92, width: 30 },
  { height: 26, right: 180, opacity: 0.3, top: 146, width: 26 },
  { height: 34, right: 116, opacity: 0.24, top: 206, width: 34 },
  { height: 24, right: 146, opacity: 0.28, top: 248, width: 24 },
  { height: 18, right: 170, opacity: 0.32, top: 292, width: 18 },
  { height: 14, right: 190, opacity: 0.36, top: 336, width: 14 },
  { height: 12, right: 158, opacity: 0.38, top: 378, width: 12 },
  { height: 20, right: 96, opacity: 0.26, top: 314, width: 20 },
  { height: 16, right: 78, opacity: 0.32, top: 266, width: 16 },
  { height: 12, right: 54, opacity: 0.36, top: 228, width: 12 },
  { height: 26, left: 200, opacity: 0.26, top: 74, width: 26 },
  { height: 18, left: 218, opacity: 0.32, top: 126, width: 18 },
  { height: 14, left: 232, opacity: 0.36, top: 182, width: 14 },
  { height: 12, left: 240, opacity: 0.38, top: 238, width: 12 },
  { height: 12, right: 238, opacity: 0.38, top: 238, width: 12 },
  { height: 14, right: 232, opacity: 0.36, top: 182, width: 14 },
  { height: 18, right: 218, opacity: 0.32, top: 126, width: 18 },
  { height: 26, right: 200, opacity: 0.26, top: 74, width: 26 },
  { height: 12, left: 28, opacity: 0.34, top: 38, width: 12 },
  { height: 14, left: 18, opacity: 0.3, top: 284, width: 14 },
  { height: 16, left: 34, opacity: 0.28, top: 430, width: 16 },
  { height: 12, left: 96, opacity: 0.32, top: 458, width: 12 },
  { height: 12, right: 26, opacity: 0.34, top: 36, width: 12 },
  { height: 14, right: 18, opacity: 0.3, top: 280, width: 14 },
  { height: 16, right: 30, opacity: 0.28, top: 432, width: 16 },
  { height: 12, right: 98, opacity: 0.32, top: 456, width: 12 },
];

const sectionCards = [
  {
    key: 'math',
    title: 'Math',
    subtitle: 'Fonctions, calcul et plus',
    accent: palette.yellow,
    icon: 'functions',
    href: '/(tabs)/math' as const,
  },
  {
    key: 'physics',
    title: 'Physiques',
    subtitle: 'Mouvement, forces, energie',
    accent: palette.blue,
    icon: 'science',
    href: '/(tabs)/physics' as const,
  },
  {
    key: 'java',
    title: 'Java',
    subtitle: 'Programmation et logique',
    accent: palette.copper,
    icon: 'code',
    href: '/(tabs)/java-programming' as const,
  },
];

export default function HomeScreen() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [simulationsExpanded, setSimulationsExpanded] = useState(false);
  const expandProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(expandProgress, {
      duration: simulationsExpanded ? 420 : 280,
      easing: simulationsExpanded ? Easing.out(Easing.cubic) : Easing.inOut(Easing.ease),
      toValue: simulationsExpanded ? 1 : 0,
      useNativeDriver: false,
    }).start();
  }, [expandProgress, simulationsExpanded]);

  const simulationCardWidth = expandProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [208, 240],
  });

  const detailHeight = expandProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 520],
  });

  const detailOpacity = expandProgress.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0, 0.2, 1],
  });

  const detailTranslateY = expandProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-24, 0],
  });

  const simulationCardLift = expandProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          {heroBubbles.map((bubble, index) => (
            <View
              key={`bubble-${index}`}
              style={[
                styles.heroBubble,
                {
                  height: bubble.height,
                  left: bubble.left,
                  opacity: bubble.opacity,
                  right: bubble.right,
                  top: bubble.top,
                  width: bubble.width,
                },
              ]}
            />
          ))}

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
            <View style={styles.sideBadgeLeft}>
              <MaterialIcons name="auto-graph" size={28} color={palette.charcoal} />
              <Text style={styles.sideBadgeText}>XP</Text>
            </View>
            <Image resizeMode="contain" source={homeLogo} style={styles.logoImage} />
            <View style={styles.sideBadgeRight}>
              <MaterialIcons name="science" size={28} color={palette.charcoal} />
              <Text style={styles.sideBadgeText}>Lab</Text>
            </View>
            <View style={styles.sideAccentLeft} />
            <View style={styles.sideAccentRight} />
          </View>
        </View>

        <View style={styles.featuresSection}>
          <View style={styles.cardsGrid}>
            <Animated.View style={[styles.cardWrap, {width: simulationCardWidth}]}>
              <Pressable
                onHoverIn={() => setHoveredCard('cours')}
                onHoverOut={() => setHoveredCard((current) => (current === 'cours' ? null : current))}
                onPress={() => router.push('/(tabs)/cours' as Href)}
                style={({ hovered }) => [
                  styles.card,
                  hovered && !simulationsExpanded ? styles.cardHovered : null,
                  hoveredCard === 'simulations' && !simulationsExpanded ? styles.cardDimmed : null,
                ]}>
                <View style={[styles.cardMedia, { backgroundColor: `${palette.yellow}20` }]}>
                  <View style={[styles.cardIconWrap, { backgroundColor: palette.yellow }]}>
                    <MaterialIcons name="menu-book" size={34} color={palette.ink} />
                  </View>
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>Cours</Text>
                  <Text style={styles.cardSubtitle}>Tous les cours</Text>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardFooterText}>Ouvrir</Text>
                  <MaterialIcons name="chevron-right" size={22} color={palette.slate} />
                </View>
              </Pressable>
            </Animated.View>

            <Animated.View
              style={[
                styles.cardWrap,
                {
                  transform: [{ translateY: simulationCardLift }],
                  width: simulationCardWidth,
                },
              ]}>
              <Pressable
                onHoverIn={() => setHoveredCard('simulations')}
                onHoverOut={() => setHoveredCard((current) => (current === 'simulations' ? null : current))}
                onPress={() => setSimulationsExpanded((current) => !current)}
                style={({ hovered, pressed }) => [
                  styles.card,
                  styles.simulationCard,
                  simulationsExpanded ? styles.simulationCardExpanded : null,
                  hovered && !simulationsExpanded ? styles.cardHovered : null,
                  hoveredCard === 'cours' && !simulationsExpanded ? styles.cardDimmed : null,
                  pressed ? styles.cardPressed : null,
                ]}>
                <View style={[styles.cardMedia, { backgroundColor: `${palette.blue}20` }]}>
                  <View style={[styles.cardIconWrap, { backgroundColor: palette.blue }]}>
                    <MaterialIcons name="bolt" size={34} color={palette.ink} />
                  </View>
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>Simulations</Text>
                  <Text style={styles.cardSubtitle}>
                    {simulationsExpanded ? 'Choisis une section' : 'Explorer les sections'}
                  </Text>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardFooterText}>
                    {simulationsExpanded ? 'Refermer' : 'Ouvrir'}
                  </Text>
                  <MaterialIcons
                    name={simulationsExpanded ? 'expand-less' : 'chevron-right'}
                    size={22}
                    color={palette.slate}
                  />
                </View>
              </Pressable>
            </Animated.View>
          </View>

          <Animated.View
            style={[
              styles.sectionReveal,
              {
                height: detailHeight,
                opacity: detailOpacity,
                transform: [{ translateY: detailTranslateY }],
              },
            ]}>
            <View style={styles.sectionPanel}>
              <View style={styles.sectionPanelHeader}>
                <Text style={styles.sectionEyebrow}>Simulations</Text>
                <Text style={styles.sectionTitle}>Choisis ta section</Text>
              </View>

              <View style={styles.sectionCardsGrid}>
                {sectionCards.map((card) => (
                  <Pressable
                    key={card.key}
                    onPress={() => router.push(card.href)}
                    style={({ hovered, pressed }) => [
                      styles.sectionCard,
                      pressed || hovered ? styles.sectionCardPressed : null,
                    ]}>
                    <View style={[styles.sectionCardMedia, { backgroundColor: `${card.accent}20` }]}>
                      <View style={[styles.sectionCardIcon, { backgroundColor: card.accent }]}>
                        <MaterialIcons name={card.icon as never} size={42} color={palette.ink} />
                      </View>
                    </View>
                    <Text style={styles.sectionCardTitle}>{card.title}</Text>
                    <Text style={styles.sectionCardSubtitle}>{card.subtitle}</Text>
                    <View style={styles.sectionCardFooter}>
                      <Text style={styles.sectionCardFooterText}>Entrer</Text>
                      <MaterialIcons name="chevron-right" size={24} color={palette.slate} />
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          </Animated.View>
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
    paddingBottom: 56,
  },
  hero: {
    backgroundColor: palette.sage,
    minHeight: 620,
    overflow: 'hidden',
    paddingHorizontal: 22,
    paddingTop: 18,
    position: 'relative',
  },
  heroBubble: {
    backgroundColor: 'rgba(255,255,255,0.42)',
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 999,
    borderWidth: 1,
    position: 'absolute',
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
    marginTop: 30,
    position: 'relative',
    width: '100%',
  },
  logoAura: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 220,
    height: 250,
    position: 'absolute',
    top: 2,
    width: 320,
  },
  sideBadgeLeft: {
    alignItems: 'center',
    backgroundColor: 'rgba(238,245,237,0.78)',
    borderColor: 'rgba(25,25,31,0.08)',
    borderRadius: 22,
    borderWidth: 1,
    gap: 4,
    left: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    position: 'absolute',
    top: 54,
    transform: [{ rotate: '-7deg' }],
  },
  sideBadgeRight: {
    alignItems: 'center',
    backgroundColor: 'rgba(188,133,89,0.2)',
    borderColor: 'rgba(25,25,31,0.08)',
    borderRadius: 22,
    borderWidth: 1,
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    position: 'absolute',
    right: 6,
    top: 52,
    transform: [{ rotate: '8deg' }],
  },
  sideBadgeText: {
    color: palette.charcoal,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  sideAccentLeft: {
    backgroundColor: 'rgba(188,133,89,0.28)',
    borderRadius: 999,
    height: 10,
    left: 84,
    position: 'absolute',
    top: 198,
    width: 52,
  },
  sideAccentRight: {
    backgroundColor: 'rgba(32,36,43,0.14)',
    borderRadius: 999,
    height: 10,
    position: 'absolute',
    right: 86,
    top: 196,
    width: 60,
  },
  logoImage: {
    height: 164,
    width: '96%',
  },
  featuresSection: {
    alignItems: 'center',
    marginTop: -120,
    paddingHorizontal: 16,
  },
  cardsGrid: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    width: '100%',
  },
  cardWrap: {
    overflow: 'visible',
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
    width: '100%',
  },
  cardDisabled: {
    opacity: 0.84,
  },
  simulationCard: {
    borderColor: 'rgba(126,166,224,0.3)',
  },
  simulationCardExpanded: {
    shadowOpacity: 0.14,
    shadowRadius: 22,
  },
  cardHovered: {
    opacity: 1,
    transform: [{ scale: 1.06 }],
  },
  cardDimmed: {
    opacity: 0.62,
    transform: [{ scale: 0.93 }],
  },
  cardPressed: {
    transform: [{ scale: 1.02 }],
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
  sectionReveal: {
    marginTop: 18,
    overflow: 'hidden',
    width: '100%',
  },
  sectionPanel: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderColor: 'rgba(184,199,177,0.5)',
    borderRadius: 34,
    borderWidth: 1,
    paddingBottom: 22,
    paddingHorizontal: 18,
    paddingTop: 20,
  },
  sectionPanelHeader: {
    alignItems: 'center',
    marginBottom: 18,
  },
  sectionEyebrow: {
    color: palette.slate,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: palette.ink,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  sectionCard: {
    backgroundColor: palette.cream,
    borderColor: '#E2DACB',
    borderRadius: 30,
    borderWidth: 1,
    minHeight: 330,
    paddingBottom: 20,
    paddingHorizontal: 18,
    paddingTop: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    width: 250,
  },
  sectionCardPressed: {
    transform: [{ scale: 1.02 }],
  },
  sectionCardMedia: {
    alignItems: 'center',
    borderRadius: 24,
    height: 170,
    justifyContent: 'center',
  },
  sectionCardIcon: {
    alignItems: 'center',
    borderRadius: 24,
    height: 110,
    justifyContent: 'center',
    width: 110,
  },
  sectionCardTitle: {
    color: palette.ink,
    fontSize: 32,
    fontWeight: '900',
    marginTop: 22,
    textAlign: 'center',
  },
  sectionCardSubtitle: {
    color: palette.slate,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  sectionCardFooter: {
    alignItems: 'center',
    borderTopColor: '#E2DACB',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 20,
    paddingTop: 14,
  },
  sectionCardFooterText: {
    color: palette.slate,
    fontSize: 16,
    fontWeight: '800',
  },
});
