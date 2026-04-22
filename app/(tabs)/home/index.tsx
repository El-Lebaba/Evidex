import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, type Href } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { db } from '@/db/mainData';

const palette = {
  charcoal: '#19191F',
  copper: '#BC8559',
  cream: '#EEF5ED',
  creamDark: '#DFE9DC',
  sage: '#B8C7B1',
  sageDeep: '#AABBA1',
  ink: '#20242B',
  slate: '#536165',
  blue: '#7EA6E0',
  yellow: '#D8A94A',
  green: '#7CCFBF',
  white: '#FFFFFF',
};

const homeLogo = require('@/assets/images/evidexe-logo.png');
const studyingBoy = require('@/assets/images/studying-boy-hq.png');
const NOMBRE_VIGNETTES_ACCUEIL = 3;
const INDEX_CENTRAL_VIGNETTES = 2;
const OFFSETS_VIGNETTES_VISIBLES = [-2, -1, 0, 1, 2] as const;

type BubbleSpec = {
  height: number;
  left: number;
  opacity: number;
  top: number;
  width: number;
};

function seededValue(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function intersects(x: number, y: number, size: number, rect: { x: number; y: number; width: number; height: number }) {
  return x < rect.x + rect.width && x + size > rect.x && y < rect.y + rect.height && y + size > rect.y;
}

function createBubblesAccueil(panelWidth: number, panelHeight: number, isCompact: boolean): BubbleSpec[] {
  const safePadding = isCompact ? 14 : 18;
  const bubbleCount = isCompact ? 24 : 28;
  const maxBubble = isCompact ? 76 : 108;
  const minBubble = isCompact ? 14 : 18;
  const exclusionZones = isCompact
    ? [
        { x: panelWidth * 0.16, y: 120, width: panelWidth * 0.68, height: 250 },
        { x: panelWidth - 110, y: 14, width: 100, height: 64 },
      ]
    : [
        { x: panelWidth * 0.18, y: 150, width: panelWidth * 0.64, height: 260 },
        { x: panelWidth - 126, y: 14, width: 112, height: 64 },
      ];

  const bubbles: BubbleSpec[] = [];

  for (let index = 0; index < bubbleCount; index += 1) {
    let placed = false;

    for (let attempt = 0; attempt < 60 && !placed; attempt += 1) {
      const seed = index * 71 + attempt * 17 + panelWidth;
      const size = Math.round(minBubble + seededValue(seed) * (maxBubble - minBubble));
      const x = Math.round(safePadding + seededValue(seed + 1) * (panelWidth - size - safePadding * 2));
      const y = Math.round(safePadding + seededValue(seed + 2) * (panelHeight - size - safePadding * 2));
      const opacity = 0.14 + seededValue(seed + 3) * 0.16;
      const blocked = exclusionZones.some((zone) => intersects(x, y, size, zone));

      if (!blocked) {
        bubbles.push({
          height: size,
          left: x,
          opacity,
          top: y,
          width: size,
        });
        placed = true;
      }
    }
  }

  return bubbles;
}

function createSlideBubbles(panelWidth: number, panelHeight: number, isCompact: boolean, seedOffset: number) {
  return createBubblesAccueil(panelWidth + seedOffset, panelHeight, isCompact).map((bubble, index) => ({
    ...bubble,
    left: Math.max(0, Math.min(panelWidth - bubble.width, bubble.left + ((index % 3) - 1) * 6)),
  }));
}

function wrapSlideIndex(index: number) {
  return (index + NOMBRE_VIGNETTES_ACCUEIL) % NOMBRE_VIGNETTES_ACCUEIL;
}

type PropsVignetteAccueil = {
  slideWidth: number;
  panelHeight: number;
  isCompact: boolean;
  driftProgress: Animated.Value;
  animatedStyle: any;
  bubbles: BubbleSpec[];
  onExplore: () => void;
};

export default function HomeScreen() {


  const { width, height } = useWindowDimensions();
  const isCompact = width < 480;
  const slideWidth = Math.max(width - (isCompact ? 24 : 44), 280);
  const hauteurPanneauAccueil = isCompact ? Math.max(height - 150, 570) : Math.max(height - 146, 700);
  const [expandedPanel, setExpandedPanel] = useState<'cours' | 'simulations' | null>(null);
  const [featuresAnchorY, setFeaturesAnchorY] = useState(0);
  const [indexVignetteAccueil, setIndexVignetteAccueil] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [userXp, setUserXp] = useState(0);
  const [activeCourses, setActiveCourses] = useState(0);

  const expandProgress = useRef(new Animated.Value(0)).current;
  const translationXVignettesAccueil = useRef(new Animated.Value(-(INDEX_CENTRAL_VIGNETTES * slideWidth))).current;
  const bubbleDrift = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView | null>(null);
  const autoAdvanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartX = useRef(0);
  const animationVignettesEnCours = useRef(false);
  const indexVignetteAccueilCourant = useRef(0);
  const currentTranslateX = useRef(0);
  const coursesExpanded = expandedPanel === 'cours';
  const simulationsExpanded = expandedPanel === 'simulations';
  const expandedTitle = coursesExpanded ? 'Choisis ta matiere' : 'Choisis ta section';
  const expandedEyebrow = coursesExpanded ? 'Cours' : 'Simulations';
  const bubblesMarque = useMemo(
    () => createSlideBubbles(slideWidth - 12, hauteurPanneauAccueil, isCompact, 0),
    [hauteurPanneauAccueil, isCompact, slideWidth],
  );
  const bubblesAPropos = useMemo(
    () => createSlideBubbles(slideWidth - 12, hauteurPanneauAccueil, isCompact, 37),
    [hauteurPanneauAccueil, isCompact, slideWidth],
  );
  const bubblesProfil = useMemo(
    () => createSlideBubbles(slideWidth - 12, hauteurPanneauAccueil, isCompact, 91),
    [hauteurPanneauAccueil, isCompact, slideWidth],
  );
  const vignettesVisibles = useMemo(
    () =>
      OFFSETS_VIGNETTES_VISIBLES.map((offset) => ({
        indexReel: wrapSlideIndex(indexVignetteAccueil + offset),
        indexSlot: offset + INDEX_CENTRAL_VIGNETTES,
        offset,
      })),
    [indexVignetteAccueil],
  );

  const expandedCards = [
    {
      key: 'math',
      title: 'Math',
      subtitle: 'Fonctions, calcul et plus',
      accent: palette.yellow,
      icon: 'functions',
      href: (coursesExpanded ? { pathname: '/(tabs)/cours', params: { subject: 'math' } } : '/(tabs)/math') as Href
    },
    {
      key: 'physics',
      title: 'Physiques',
      subtitle: 'Mouvement, forces, energie',
      accent: palette.blue,
      icon: 'science',
      href: (coursesExpanded ? { pathname: '/(tabs)/cours', params: { subject: 'physique' } } : '/(tabs)/physics') as Href
    },
    {
      key: 'java',
      title: 'Java',
      subtitle: 'Programmation et logique',
      accent: palette.copper,
      icon: 'code',
      href: (coursesExpanded ? { pathname: '/(tabs)/cours', params: { subject: 'java' } } : '/(tabs)/java-programming') as Href
    }
  ];

  useEffect(() => {
    db.init();
    const user = db.getUser();
    const courses = db.getRecentCourses();
    setUserLevel(user.level);
    setUserXp(user.xp);
    setActiveCourses(courses.filter((course) => !course.completed).length);
  }, []);

  useEffect(() => {
    const isExpanded = expandedPanel !== null;
    Animated.timing(expandProgress, {
      duration: isExpanded ? 420 : 280,
      easing: isExpanded ? Easing.out(Easing.cubic) : Easing.inOut(Easing.ease),
      toValue: isExpanded ? 1 : 0,
      useNativeDriver: false,
    }).start();
  }, [expandedPanel, expandProgress]);

  useEffect(() => {
    if (expandedPanel === null) {
      return;
    }
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({
        animated: true,
        y: Math.max(featuresAnchorY + 180, 0),
      });
    }, 180);
    return () => clearTimeout(timer);
  }, [expandedPanel, featuresAnchorY]);

  useEffect(() => {
    const listenerId = translationXVignettesAccueil.addListener(({ value }) => {
      currentTranslateX.current = value;
    });

    return () => {
      translationXVignettesAccueil.removeListener(listenerId);
    };
  }, [translationXVignettesAccueil]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bubbleDrift, {
          duration: 3600,
          easing: Easing.inOut(Easing.sin),
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleDrift, {
          duration: 3600,
          easing: Easing.inOut(Easing.sin),
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [bubbleDrift]);

  useEffect(() => {
    const nextX = -(INDEX_CENTRAL_VIGNETTES * slideWidth);
    translationXVignettesAccueil.setValue(nextX);
    currentTranslateX.current = nextX;
  }, [slideWidth, translationXVignettesAccueil]);

  const synchroniserPositionVignettesAccueil = useCallback(
    (realIndex: number) => {
      indexVignetteAccueilCourant.current = realIndex;
      setIndexVignetteAccueil(realIndex);

      const nextX = -(INDEX_CENTRAL_VIGNETTES * slideWidth);
      translationXVignettesAccueil.setValue(nextX);
      currentTranslateX.current = nextX;
    },
    [slideWidth, translationXVignettesAccueil],
  );

  const cardWidth = expandProgress.interpolate({
    inputRange: [0, 1],
    outputRange: isCompact ? [164, 194] : [286, 338],
  });

  const detailHeight = expandProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, isCompact ? 1120 : 520],
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

  function togglePanel(panel: 'cours' | 'simulations') {
    setExpandedPanel((current) => (current === panel ? null : panel));
  }

  const scrollToExplore = useCallback(() => {
    scrollRef.current?.scrollTo({
      animated: true,
      y: Math.max(featuresAnchorY - 16, 0),
    });
  }, [featuresAnchorY]);

  function getSlideAnimatedStyle(trackIndex: number) {
    const inputRange = [-(trackIndex + 1) * slideWidth, -trackIndex * slideWidth, -(trackIndex - 1) * slideWidth];
    return {
      opacity: translationXVignettesAccueil.interpolate({
        inputRange,
        outputRange: [0.32, 1, 0.32],
        extrapolate: 'clamp',
      }),
      transform: [
        {
          translateY: translationXVignettesAccueil.interpolate({
            inputRange,
            outputRange: [16, 0, 16],
            extrapolate: 'clamp',
          }),
        },
        {
          scale: translationXVignettesAccueil.interpolate({
            inputRange,
            outputRange: [0.96, 1, 0.96],
            extrapolate: 'clamp',
          }),
        },
      ],
    };
  }

  const animerVersVignette = useCallback((indexPisteCible: number, indexVignetteCible: number) => {
    animationVignettesEnCours.current = true;
    translationXVignettesAccueil.stopAnimation((valeurCourante) => {
      currentTranslateX.current = valeurCourante;
    });

    Animated.spring(translationXVignettesAccueil, {
      damping: 22,
      mass: 0.9,
      stiffness: 190,
      toValue: -(indexPisteCible * slideWidth),
      useNativeDriver: true,
    }).start(({ finished }) => {
      animationVignettesEnCours.current = false;

      if (!finished) {
        return;
      }

      synchroniserPositionVignettesAccueil(indexVignetteCible);
    });
  }, [slideWidth, synchroniserPositionVignettesAccueil, translationXVignettesAccueil]);

  const scheduleAutoAdvance = useCallback(
    (nextIndex: number) => {
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
      }
      autoAdvanceTimeout.current = setTimeout(() => {
        const indexVignetteSuivante = wrapSlideIndex(nextIndex + 1);
        const nextTrackIndex = INDEX_CENTRAL_VIGNETTES + 1;

        animerVersVignette(nextTrackIndex, indexVignetteSuivante);
      }, 15000);
    },
    [animerVersVignette],
  );

  useEffect(() => {
    scheduleAutoAdvance(indexVignetteAccueil);
    return () => {
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
      }
    };
  }, [indexVignetteAccueil, scheduleAutoAdvance]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const reinitialiserVignettesApresVisibilite = () => {
      synchroniserPositionVignettesAccueil(indexVignetteAccueilCourant.current);
      scheduleAutoAdvance(indexVignetteAccueilCourant.current);
    };

    document.addEventListener('visibilitychange', reinitialiserVignettesApresVisibilite);
    window.addEventListener('blur', reinitialiserVignettesApresVisibilite);

    return () => {
      document.removeEventListener('visibilitychange', reinitialiserVignettesApresVisibilite);
      window.removeEventListener('blur', reinitialiserVignettesApresVisibilite);
    };
  }, [scheduleAutoAdvance, synchroniserPositionVignettesAccueil]);

  const gestionGlisserVignettesAccueil = useMemo(
    () =>
      PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        !animationVignettesEnCours.current &&
        Math.abs(gestureState.dx) > 6 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
      onPanResponderGrant: () => {
        if (autoAdvanceTimeout.current) {
          clearTimeout(autoAdvanceTimeout.current);
        }
        animationVignettesEnCours.current = false;
        translationXVignettesAccueil.stopAnimation((valeurCourante) => {
          currentTranslateX.current = valeurCourante;
          dragStartX.current = valeurCourante;
        });
      },
      onPanResponderMove: (_, gestureState) => {
        const nextX = dragStartX.current + gestureState.dx;
        const minX = -((OFFSETS_VIGNETTES_VISIBLES.length - 1) * slideWidth);
        translationXVignettesAccueil.setValue(
          Math.max(minX - 24, Math.min(slideWidth - 24, nextX)),
        );
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = slideWidth * 0.18;
        let nextTrackIndex = INDEX_CENTRAL_VIGNETTES;
        let indexVignetteSuivante = indexVignetteAccueilCourant.current;

        if (gestureState.dx <= -threshold || gestureState.vx <= -0.45) {
          nextTrackIndex = INDEX_CENTRAL_VIGNETTES + 1;
          indexVignetteSuivante = wrapSlideIndex(indexVignetteAccueilCourant.current + 1);
        } else if (gestureState.dx >= threshold || gestureState.vx >= 0.45) {
          nextTrackIndex = INDEX_CENTRAL_VIGNETTES - 1;
          indexVignetteSuivante = wrapSlideIndex(indexVignetteAccueilCourant.current - 1);
        }

        animerVersVignette(nextTrackIndex, indexVignetteSuivante);
      },
      onPanResponderTerminate: () => {
        animerVersVignette(INDEX_CENTRAL_VIGNETTES, indexVignetteAccueilCourant.current);
      },
    }),
    [animerVersVignette, slideWidth, translationXVignettesAccueil],
  );

  function renderVignetteAccueil(trackIndex: number, realIndex: number, offset: number) {
    const animatedStyle = getSlideAnimatedStyle(trackIndex);

    if (realIndex === 0) {
      return (
        <VignetteAccueilMarque
          key={`vignette-accueil-${offset}-marque`}
          animatedStyle={animatedStyle}
          bubbles={bubblesMarque}
          driftProgress={bubbleDrift}
          isCompact={isCompact}
          onExplore={scrollToExplore}
          panelHeight={hauteurPanneauAccueil}
          slideWidth={slideWidth}
        />
      );
    }

    if (realIndex === 1) {
      return (
        <VignetteAccueilAPropos
          key={`vignette-accueil-${offset}-apropos`}
          animatedStyle={animatedStyle}
          bubbles={bubblesAPropos}
          driftProgress={bubbleDrift}
          isCompact={isCompact}
          onExplore={scrollToExplore}
          panelHeight={hauteurPanneauAccueil}
          slideWidth={slideWidth}
        />
      );
    }

    return (
      <VignetteAccueilProfil
        key={`vignette-accueil-${offset}-profil`}
        activeCourses={activeCourses}
        animatedStyle={animatedStyle}
        bubbles={bubblesProfil}
        driftProgress={bubbleDrift}
        isCompact={isCompact}
        level={userLevel}
        onExplore={scrollToExplore}
        panelHeight={hauteurPanneauAccueil}
        slideWidth={slideWidth}
        xp={userXp}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        ref={scrollRef}
        showsVerticalScrollIndicator={false}>
        <View style={styles.zoneVignettesAccueil}>
          <View style={styles.homeProfileRow}>
            <Pressable onPress={() => router.push('/(tabs)/profile')} style={[styles.accountChip, isCompact ? styles.accountChipCompact : null]}>
              <MaterialIcons name="person-outline" size={18} color={palette.ink} />
              <Text selectable={false} style={styles.accountText}>Profil</Text>
            </Pressable>
          </View>

          <View {...gestionGlisserVignettesAccueil.panHandlers} style={styles.fenetreVignettesAccueil}>
            <Animated.View
              style={[
                styles.pisteVignettesAccueil,
                {
                  transform: [{ translateX: translationXVignettesAccueil }],
                  width: slideWidth * OFFSETS_VIGNETTES_VISIBLES.length,
                },
              ]}>
              {vignettesVisibles.map(({ indexReel, indexSlot, offset }) =>
                renderVignetteAccueil(indexSlot, indexReel, offset),
              )}
            </Animated.View>
          </View>

          <View style={styles.rangeePointsAccueil}>
            {[0, 1, 2].map((index) => (
              <View key={`dot-${index}`} style={[styles.pointAccueil, indexVignetteAccueil === index ? styles.pointAccueilActif : null]} />
            ))}
          </View>
        </View>

        <View
          onLayout={(event) => setFeaturesAnchorY(event.nativeEvent.layout.y)}
          style={[styles.featuresSection, isCompact ? styles.featuresSectionCompact : null]}>
          <View style={[styles.cardsGrid, isCompact ? styles.cardsGridCompact : null]}>
            <Animated.View style={[styles.cardWrap, { transform: [{ translateY: simulationCardLift }], width: cardWidth }]}>
              <Pressable
                onPress={() => togglePanel('cours')}
                style={({ hovered }) => [
                  styles.card,
                  isCompact ? styles.cardCompact : null,
                  coursesExpanded ? styles.simulationCardExpanded : null,
                  hovered && expandedPanel === null ? styles.cardHovered : null,
                  expandedPanel === null ? styles.cardDimmed : null,
                ]}>
                <View style={[styles.cardMedia, isCompact ? styles.cardMediaCompact : null, { backgroundColor: `${palette.yellow}20` }]}>
                  <View style={[styles.cardIconWrap, isCompact ? styles.cardIconWrapCompact : null, { backgroundColor: palette.yellow }]}>
                    <MaterialIcons name="menu-book" size={34} color={palette.ink} />
                  </View>
                </View>
                <View style={[styles.cardText, isCompact ? styles.cardTextCompact : null]}>
                  <Text style={[styles.cardTitle, isCompact ? styles.cardTitleCompact : null]}>Cours</Text>
                  <Text style={[styles.cardSubtitle, isCompact ? styles.cardSubtitleCompact : null]}>
                    {coursesExpanded ? 'Choisis une matiere' : 'Explorer les matieres'}
                  </Text>
                </View>
                <View style={[styles.cardFooter, isCompact ? styles.cardFooterCompact : null]}>
                  <Text style={[styles.cardFooterText, isCompact ? styles.cardFooterTextCompact : null]}>
                    {coursesExpanded ? 'Refermer' : 'Ouvrir'}
                  </Text>
                  <MaterialIcons name={coursesExpanded ? 'expand-less' : 'chevron-right'} size={22} color={palette.slate} />
                </View>
              </Pressable>
            </Animated.View>

            <Animated.View
              style={[styles.cardWrap, { transform: [{ translateY: simulationCardLift }], width: cardWidth },
              ]}>
              <Pressable
                onPress={() => togglePanel('simulations')}
                style={({ hovered, pressed }) => [
                  styles.card,
                  isCompact ? styles.cardCompact : null,
                  styles.simulationCard,
                  simulationsExpanded ? styles.simulationCardExpanded : null,
                  hovered && expandedPanel === null ? styles.cardHovered : null,
                  expandedPanel === null ? styles.cardDimmed : null,
                  pressed ? styles.cardPressed : null,
                ]}>
                <View style={[styles.cardMedia, isCompact ? styles.cardMediaCompact : null, { backgroundColor: `${palette.blue}20` }]}>
                  <View style={[styles.cardIconWrap, isCompact ? styles.cardIconWrapCompact : null, { backgroundColor: palette.blue }]}>
                    <MaterialIcons name="bolt" size={34} color={palette.ink} />
                  </View>
                </View>
                <View style={[styles.cardText, isCompact ? styles.cardTextCompact : null]}>
                  <Text style={[styles.cardTitle, isCompact ? styles.cardTitleCompact : null]}>Simulations</Text>
                  <Text style={[styles.cardSubtitle, isCompact ? styles.cardSubtitleCompact : null]}>
                    {simulationsExpanded ? 'Choisis une section' : 'Explorer les sections'}
                  </Text>
                </View>
                <View style={[styles.cardFooter, isCompact ? styles.cardFooterCompact : null]}>
                  <Text style={[styles.cardFooterText, isCompact ? styles.cardFooterTextCompact : null]}>{simulationsExpanded ? 'Refermer' : 'Ouvrir'}</Text>
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
              isCompact ? styles.sectionRevealCompact : null,
              { height: detailHeight, opacity: detailOpacity, transform: [{ translateY: detailTranslateY }] },
            ]}>
            <View style={[styles.sectionPanel, isCompact ? styles.sectionPanelCompact : null]}>
              <View style={[styles.sectionPanelHeader, isCompact ? styles.sectionPanelHeaderCompact : null]}>
                <Text style={[styles.sectionEyebrow, isCompact ? styles.sectionEyebrowCompact : null]}>{expandedEyebrow}</Text>
                <Text style={[styles.sectionTitle, isCompact ? styles.sectionTitleCompact : null]}>{expandedTitle}</Text>
              </View>

              <View style={[styles.sectionCardsGrid, isCompact ? styles.sectionCardsGridCompact : null]}>
                {expandedCards.map((card) => (
                  <Pressable
                    key={card.key}
                    onPress={() => router.push(card.href)}
                    style={({ hovered, pressed }) => [
                      styles.sectionCard,
                      isCompact ? styles.sectionCardCompact : null,
                      pressed || hovered ? styles.sectionCardPressed : null,
                    ]}>
                    <View style={[styles.sectionCardMedia, isCompact ? styles.sectionCardMediaCompact : null, { backgroundColor: `${card.accent}20` }]}>
                      <View style={[styles.sectionCardIcon, isCompact ? styles.sectionCardIconCompact : null, { backgroundColor: card.accent }]}>
                        <MaterialIcons name={card.icon as never} size={42} color={palette.ink} />
                      </View>
                    </View>
                    <Text style={[styles.sectionCardTitle, isCompact ? styles.sectionCardTitleCompact : null]}>{card.title}</Text>
                    <Text style={[styles.sectionCardSubtitle, isCompact ? styles.sectionCardSubtitleCompact : null]}>{card.subtitle}</Text>
                    <View style={[styles.sectionCardFooter, isCompact ? styles.sectionCardFooterCompact : null]}>
                      <Text style={[styles.sectionCardFooterText, isCompact ? styles.sectionCardFooterTextCompact : null]}>Entrer</Text>
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

function VignetteAccueilMarque({ animatedStyle, bubbles, driftProgress, isCompact, onExplore, panelHeight, slideWidth }: PropsVignetteAccueil) {
  return (
    <Animated.View style={[styles.vignetteAccueil, { width: slideWidth }, animatedStyle]}>
      <View style={[styles.panneauAccueil, isCompact ? styles.panneauAccueilCompact : null, { height: panelHeight, minHeight: panelHeight }]}>
        {bubbles.map((bubble, index) => (
          <Animated.View
            key={`brand-bubble-${index}`}
            style={[
              styles.cadreBulleAccueil,
              {
                left: bubble.left,
                top: bubble.top,
                transform: [
                  {
                    translateX: driftProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-((index % 4) + 2) * 2, ((index % 4) + 2) * 2],
                    }),
                  },
                  {
                    translateY: driftProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-((index % 5) + 2) * 2, ((index % 5) + 2) * 2],
                    }),
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.bulleAccueil,
                { height: bubble.height, opacity: bubble.opacity, width: bubble.width },
              ]}
            />
          </Animated.View>
        ))}
        <View style={[styles.blocTexteAccueil, isCompact ? styles.blocTexteAccueilCompact : null]}>
          <Text style={[styles.eyebrow, isCompact ? styles.eyebrowCompact : null]}>Accueil Evidex</Text>
          <Text style={[styles.titreAccueil, isCompact ? styles.titreAccueilCompact : null]}>Ton espace</Text>
          <Text style={[styles.titreAccueil, isCompact ? styles.titreAccueilCompact : null]}>d&apos;apprentissage</Text>
        </View>
        <View style={[styles.logoStage, isCompact ? styles.logoStageCompact : null]}>
          <View style={[styles.logoAura, isCompact ? styles.logoAuraCompact : null]}/>
          <Image resizeMode="contain" source={homeLogo} style={[styles.logoImage, isCompact ? styles.logoImageCompact : null]}/>
        </View>
        <Pressable onPress={onExplore} style={[styles.boutonExplorerAccueil, styles.boutonExplorerAccueilFlottant, isCompact ? styles.boutonExplorerAccueilCompact : null]}>
          <Text style={[styles.texteBoutonExplorerAccueil, isCompact ? styles.texteBoutonExplorerAccueilCompact : null]}>Explorer</Text>
          <MaterialIcons name="south" size={20} color={palette.ink} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

function VignetteAccueilAPropos({ animatedStyle, bubbles, driftProgress, isCompact, onExplore, panelHeight, slideWidth }: PropsVignetteAccueil) {
  return (
    <Animated.View style={[styles.vignetteAccueil, { width: slideWidth }, animatedStyle]}>
      <View style={[styles.panneauAccueil, styles.panneauAccueilSecondaire, isCompact ? styles.panneauAccueilCompact : null, { height: panelHeight, minHeight: panelHeight }]}>
        {bubbles.map((bubble, index) => (
          <Animated.View
            key={`about-bubble-${index}`}
            style={[
              styles.cadreBulleAccueil,
              {
                left: bubble.left,
                top: bubble.top,
                transform: [
                  {
                    translateX: driftProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-((index % 3) + 2) * 2, ((index % 3) + 2) * 2],
                    }),
                  },
                  {
                    translateY: driftProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-((index % 4) + 2) * 2, ((index % 4) + 2) * 2],
                    }),
                  },
                ],
              },
            ]}>
            <View style={[styles.bulleAccueil, { height: bubble.height, opacity: bubble.opacity, width: bubble.width }]} />
          </Animated.View>
        ))}
        <View style={[styles.aboutLayout, isCompact ? styles.aboutLayoutCompact : null]}>
          <View style={[styles.aboutCopyBlock, isCompact ? styles.aboutCopyBlockCompact : null]}>
            <Text style={[styles.eyebrow, isCompact ? styles.eyebrowCompact : null]}>A propos</Text>
            <Text style={[styles.aboutTitle, isCompact ? styles.aboutTitleCompact : null]}>Evidex rassemble cours, progression et simulations.</Text>
            <Text style={[styles.aboutText, isCompact ? styles.aboutTextCompact : null]}>
              Un seul espace pour apprendre, tester des idees et suivre ce qui compte vraiment dans ton parcours.
            </Text>
            <View style={[styles.aboutHighlights, isCompact ? styles.aboutHighlightsCompact : null]}>
              <View style={styles.aboutChip}>
                <MaterialIcons name="menu-book" size={18} color={palette.charcoal} />
                <Text style={styles.aboutChipText}>Cours</Text>
              </View>
              <View style={styles.aboutChip}>
                <MaterialIcons name="bolt" size={18} color={palette.charcoal} />
                <Text style={styles.aboutChipText}>Simulations</Text>
              </View>
            </View>
          </View>
          <View style={[styles.studyImageShell, isCompact ? styles.studyImageShellCompact : null]}>
            <View style={[styles.studyGlow, isCompact ? styles.studyGlowCompact : null]} />
            <Image resizeMode="cover" source={studyingBoy} style={[styles.studyImage, isCompact ? styles.studyImageCompact : null]} />
          </View>
        </View>
        <Pressable onPress={onExplore} style={[styles.boutonExplorerAccueil, styles.boutonExplorerAccueilFlottant, isCompact ? styles.boutonExplorerAccueilCompact : null]}>
          <Text style={[styles.texteBoutonExplorerAccueil, isCompact ? styles.texteBoutonExplorerAccueilCompact : null]}>Explorer</Text>
          <MaterialIcons name="south" size={20} color={palette.ink} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

type PropsVignetteProfilAccueil = PropsVignetteAccueil & {
  activeCourses: number;
  level: number;
  xp: number;
};

function VignetteAccueilProfil({ activeCourses, animatedStyle, bubbles, driftProgress, isCompact, level, onExplore, panelHeight, slideWidth, xp }: PropsVignetteProfilAccueil) {
  return (
    <Animated.View style={[styles.vignetteAccueil, { width: slideWidth }, animatedStyle]}>
      <View style={[styles.panneauAccueil, styles.panneauAccueilSecondaire, isCompact ? styles.panneauAccueilCompact : null, { height: panelHeight, minHeight: panelHeight }]}>
        {bubbles.map((bubble, index) => (
          <Animated.View
            key={`profile-bubble-${index}`}
            style={[
              styles.cadreBulleAccueil,
              {
                left: bubble.left,
                top: bubble.top,
                transform: [
                  {
                    translateX: driftProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-((index % 3) + 2) * 2, ((index % 3) + 2) * 2],
                    }),
                  },
                  {
                    translateY: driftProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-((index % 4) + 2) * 2, ((index % 4) + 2) * 2],
                    }),
                  },
                ],
              },
            ]}>
            <View style={[styles.bulleAccueil, { height: bubble.height, opacity: bubble.opacity, width: bubble.width }]} />
          </Animated.View>
        ))}
        <View style={[styles.enTeteApercuProfilAccueil, isCompact ? styles.enTeteApercuProfilAccueilCompact : null]}>
          <Text style={[styles.eyebrow, isCompact ? styles.eyebrowCompact : null]}>Profil en bref</Text>
          <Text style={[styles.titreApercuProfilAccueil, isCompact ? styles.titreApercuProfilAccueilCompact : null]}>Un apercu rapide de ta progression</Text>
        </View>
        <View style={[styles.profilePreviewCard, isCompact ? styles.profilePreviewCardCompact : null]}>
          <View style={styles.profileBadgeRow}>
            <View style={styles.profileAvatar}>
              <MaterialIcons name="person" size={24} color={palette.white} />
            </View>
            <View>
              <Text style={[styles.profileName, isCompact ? styles.profileNameCompact : null]}>Tony</Text>
              <Text style={styles.profileTag}>Compte Evidex</Text>
            </View>
          </View>
          <View style={[styles.profileStatsGrid, isCompact ? styles.profileStatsGridCompact : null]}>
            <View style={[styles.profileStatCard, isCompact ? styles.profileStatCardCompact : null]}>
              <Text style={[styles.profileStatValue, { color: palette.blue }]}>{level}</Text>
              <Text style={styles.profileStatLabel}>Niveau</Text>
            </View>
            <View style={[styles.profileStatCard, isCompact ? styles.profileStatCardCompact : null]}>
              <Text style={[styles.profileStatValue, { color: palette.yellow }]}>{xp}</Text>
              <Text style={styles.profileStatLabel}>XP</Text>
            </View>
            <View style={[styles.profileStatCard, isCompact ? styles.profileStatCardCompact : null]}>
              <Text style={[styles.profileStatValue, { color: palette.green }]}>{activeCourses}</Text>
              <Text style={styles.profileStatLabel}>Cours actifs</Text>
            </View>
          </View>
        </View>
        <Pressable onPress={onExplore} style={[styles.boutonExplorerAccueil, styles.boutonExplorerAccueilFlottant, isCompact ? styles.boutonExplorerAccueilCompact : null]}>
          <Text style={[styles.texteBoutonExplorerAccueil, isCompact ? styles.texteBoutonExplorerAccueilCompact : null]}>Explorer</Text>
          <MaterialIcons name="south" size={20} color={palette.ink} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: palette.cream, flex: 1 },
  content: { backgroundColor: palette.cream, paddingBottom: 56 },
  zoneVignettesAccueil: { backgroundColor: palette.cream, paddingHorizontal: 22, paddingTop: 8, position: 'relative' },
  homeProfileRow: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  fenetreVignettesAccueil: { overflow: 'hidden' },
  pisteVignettesAccueil: {
    flexDirection: 'row',
    userSelect: 'none',
  },
  vignetteAccueil: { paddingRight: 12 },
  panneauAccueil: {
    backgroundColor: palette.sage,
    borderRadius: 38,
    overflow: 'hidden',
    paddingHorizontal: 22,
    paddingTop: 18,
    position: 'relative',
  },
  panneauAccueilSecondaire: { backgroundColor: palette.sageDeep },
  panneauAccueilCompact: {
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  bulleAccueil: {
    backgroundColor: 'rgba(255,255,255,0.42)',
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 999,
    borderWidth: 1,
  },
  cadreBulleAccueil: {
    position: 'absolute',
  },
  blocTexteAccueil: { alignItems: 'center', marginTop: 20 },
  blocTexteAccueilCompact: { marginTop: 44 },
  rangeePointsAccueil: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 24,
    zIndex: 5,
  },
  pointAccueil: { backgroundColor: 'rgba(32,36,43,0.18)', borderRadius: 999, height: 8, width: 8 },
  pointAccueilActif: { backgroundColor: palette.charcoal, width: 24 },
  eyebrow: {
    color: 'rgba(25,25,31,0.55)',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  eyebrowCompact: {
    fontSize: 12,
    marginBottom: 8,
  },
  titreAccueil: { color: palette.ink, fontSize: 44, fontWeight: '900', lineHeight: 46, textAlign: 'center' },
  titreAccueilCompact: {
    fontSize: 28,
    lineHeight: 31,
    maxWidth: 280,
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
  accountText: { color: palette.ink, fontSize: 14, fontWeight: '800', userSelect: 'none' },
  accountChipCompact: {
    paddingHorizontal: 12,
    paddingVertical: 8,
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
  logoStageCompact: {
    height: 200,
    marginTop: 26,
  },
  logoAura: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 220,
    height: 250,
    position: 'absolute',
    top: 2,
    width: 320,
  },
  logoAuraCompact: {
    borderRadius: 160,
    height: 196,
    width: 250,
  },
  logoImage: { height: 164, width: '96%' },
  logoImageCompact: {
    height: 108,
    width: '82%',
  },
  boutonExplorerAccueil: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderColor: 'rgba(32,36,43,0.08)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  boutonExplorerAccueilFlottant: {
    bottom: 24,
    marginTop: 0,
    position: 'absolute',
  },
  boutonExplorerAccueilCompact: {
    bottom: 18,
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  texteBoutonExplorerAccueil: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  texteBoutonExplorerAccueilCompact: {
    fontSize: 13,
  },
  aboutLayout: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    paddingBottom: 36,
    paddingTop: 42,
  },
  aboutLayoutCompact: {
    alignItems: 'stretch',
    flexDirection: 'column',
    gap: 18,
    justifyContent: 'flex-start',
    paddingBottom: 28,
    paddingTop: 52,
  },
  aboutCopyBlock: { flex: 0.9, maxWidth: 360, paddingLeft: 10 },
  aboutCopyBlockCompact: {
    flex: 0,
    maxWidth: '100%',
    paddingLeft: 0,
  },
  aboutTitle: { color: palette.ink, fontSize: 34, fontWeight: '900', lineHeight: 40 },
  aboutTitleCompact: {
    fontSize: 26,
    lineHeight: 31,
    textAlign: 'center',
  },
  aboutText: { color: 'rgba(32,36,43,0.76)', fontSize: 17, fontWeight: '600', lineHeight: 25, marginTop: 16 },
  aboutTextCompact: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    textAlign: 'center',
  },
  aboutHighlights: { flexDirection: 'row', gap: 10, marginTop: 20 },
  aboutHighlightsCompact: {
    justifyContent: 'center',
    marginTop: 16,
  },
  aboutChip: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderColor: 'rgba(32,36,43,0.08)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  aboutChipText: { color: palette.charcoal, fontSize: 14, fontWeight: '800' },
  studyImageShell: {
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    borderColor: 'rgba(255,255,255,0.76)',
    borderRadius: 24,
    borderWidth: 3,
    flex: 1.15,
    justifyContent: 'center',
    minWidth: 320,
    overflow: 'hidden',
    position: 'relative',
  },
  studyImageShellCompact: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 22,
    flex: 0,
    height: 230,
    minWidth: 0,
    overflow: 'hidden',
    width: '100%',
  },
  studyGlow: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 220,
    height: 320,
    position: 'absolute',
    right: 18,
    width: 320,
  },
  studyGlowCompact: {
    height: 220,
    right: undefined,
    width: 220,
  },
  studyImage: {
    height: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    width: '100%',
  },
  studyImageCompact: {
    height: '100%',
    width: '100%',
  },
  enTeteApercuProfilAccueil: { alignItems: 'center', paddingTop: 46 },
  enTeteApercuProfilAccueilCompact: { paddingTop: 54 },
  titreApercuProfilAccueil: { color: palette.ink, fontSize: 34, fontWeight: '900', lineHeight: 40, maxWidth: 520, textAlign: 'center' },
  titreApercuProfilAccueilCompact: {
    fontSize: 26,
    lineHeight: 31,
    maxWidth: 280,
  },
  profilePreviewCard: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderColor: 'rgba(32,36,43,0.08)',
    borderRadius: 30,
    borderWidth: 1,
    marginTop: 34,
    maxWidth: 560,
    padding: 22,
    width: '100%',
  },
  profilePreviewCardCompact: {
    marginBottom: 28,
    marginTop: 20,
    padding: 16,
  },
  profileBadgeRow: { alignItems: 'center', flexDirection: 'row', gap: 14 },
  profileAvatar: { alignItems: 'center', backgroundColor: palette.blue, borderRadius: 24, height: 48, justifyContent: 'center', width: 48 },
  profileName: { color: palette.ink, fontSize: 18, fontWeight: '900' },
  profileNameCompact: {
    fontSize: 16,
  },
  profileTag: { color: palette.slate, fontSize: 13, fontWeight: '700', marginTop: 2 },
  profileStatsGrid: { flexDirection: 'row', gap: 12, marginTop: 20 },
  profileStatsGridCompact: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 14,
  },
  profileStatCard: { alignItems: 'center', backgroundColor: palette.cream, borderColor: '#E2DACB', borderRadius: 20, borderWidth: 1, flex: 1, padding: 18 },
  profileStatCardCompact: {
    flex: 0,
    minHeight: 78,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  profileStatValue: { fontSize: 30, fontWeight: '900' },
  profileStatLabel: { color: palette.slate, fontSize: 13, fontWeight: '800', marginTop: 6, textAlign: 'center' },
  featuresSection: { alignItems: 'center', marginTop: 54, paddingHorizontal: 16 },
  featuresSectionCompact: {
    marginTop: 28,
    paddingHorizontal: 12,
  },
  symbolField: {
    backgroundColor: 'transparent',
    bottom: 16,
    left: 10,
    overflow: 'hidden',
    position: 'absolute',
    right: 10,
    top: 122,
    zIndex: 0,
  },
  symbolFieldCompact: {
    bottom: 12,
    left: 8,
    right: 8,
    top: 104,
  },
  cardsGrid: { alignItems: 'flex-end', flexDirection: 'row', gap: 16, justifyContent: 'center', width: '100%', zIndex: 1 },
  cardsGridCompact: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: 10,
  },
  cardWrap: { overflow: 'visible' },
  card: {
    alignItems: 'stretch',
    backgroundColor: palette.cream,
    borderColor: '#E2DACB',
    borderRadius: 26,
    borderWidth: 1,
    elevation: 2,
    minHeight: 430,
    paddingBottom: 26,
    paddingHorizontal: 22,
    paddingTop: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    width: '100%',
  },
  cardCompact: {
    minHeight: 272,
    paddingBottom: 14,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  cardDisabled: { opacity: 0.84 },
  simulationCard: { borderColor: 'rgba(126,166,224,0.3)' },
  simulationCardExpanded: { shadowOpacity: 0.14, shadowRadius: 22 },
  cardHovered: { opacity: 1, transform: [{ scale: 1.06 }] },
  cardDimmed: {
    backgroundColor: '#E6EDE3',
    borderColor: '#D6E0D2',
    shadowOpacity: 0.04,
    transform: [{ scale: 0.93 }],
  },
  cardPressed: { transform: [{ scale: 1.02 }] },
  cardMedia: { alignItems: 'center', borderRadius: 24, height: 226, justifyContent: 'center' },
  cardMediaCompact: {
    height: 122,
  },
  cardIconWrap: { alignItems: 'center', borderRadius: 22, height: 116, justifyContent: 'center', width: 116 },
  cardIconWrapCompact: {
    borderRadius: 16,
    height: 64,
    width: 64,
  },
  cardText: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 4, paddingTop: 18 },
  cardTextCompact: {
    paddingHorizontal: 0,
    paddingTop: 10,
  },
  cardTitle: { color: palette.ink, fontSize: 38, fontWeight: '900', textAlign: 'center' },
  cardTitleCompact: {
    fontSize: 18,
    lineHeight: 22,
  },
  cardSubtitle: { color: palette.slate, fontSize: 18, fontWeight: '700', lineHeight: 24, marginTop: 10, textAlign: 'center' },
  cardSubtitleCompact: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 6,
  },
  cardFooter: { alignItems: 'center', borderTopColor: '#E2DACB', borderTopWidth: 1, flexDirection: 'row', gap: 6, justifyContent: 'center', paddingTop: 14 },
  cardFooterCompact: {
    paddingTop: 10,
  },
  cardFooterText: { color: palette.slate, fontSize: 16, fontWeight: '800' },
  cardFooterTextCompact: {
    fontSize: 13,
  },
  sectionReveal: { marginTop: 18, overflow: 'hidden', width: '100%' },
  sectionRevealCompact: {
    marginTop: 12,
  },
  sectionPanel: { backgroundColor: 'rgba(255,255,255,0.55)', borderColor: 'rgba(184,199,177,0.5)', borderRadius: 34, borderWidth: 1, paddingBottom: 22, paddingHorizontal: 18, paddingTop: 20 },
  sectionPanelCompact: {
    borderRadius: 24,
    paddingBottom: 16,
    paddingHorizontal: 12,
    paddingTop: 14,
  },
  sectionPanelHeader: { alignItems: 'center', marginBottom: 18 },
  sectionPanelHeaderCompact: {
    marginBottom: 12,
  },
  sectionEyebrow: { color: palette.slate, fontSize: 13, fontWeight: '900', letterSpacing: 0.6, textTransform: 'uppercase' },
  sectionEyebrowCompact: {
    fontSize: 11,
  },
  sectionTitle: { color: palette.ink, fontSize: 28, fontWeight: '900', marginTop: 8, textAlign: 'center' },
  sectionTitleCompact: {
    fontSize: 22,
    marginTop: 4,
  },
  sectionCardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
  sectionCardsGridCompact: {
    gap: 12,
  },
  sectionCard: { backgroundColor: palette.cream, borderColor: '#E2DACB', borderRadius: 30, borderWidth: 1, minHeight: 330, paddingBottom: 20, paddingHorizontal: 18, paddingTop: 18, shadowColor: '#000000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 18, width: 250 },
  sectionCardCompact: {
    minHeight: 250,
    paddingBottom: 14,
    paddingHorizontal: 14,
    paddingTop: 14,
    width: '100%',
  },
  sectionCardPressed: { transform: [{ scale: 1.02 }] },
  sectionCardMedia: { alignItems: 'center', borderRadius: 24, height: 170, justifyContent: 'center' },
  sectionCardMediaCompact: {
    height: 120,
  },
  sectionCardIcon: { alignItems: 'center', borderRadius: 24, height: 110, justifyContent: 'center', width: 110 },
  sectionCardIconCompact: {
    borderRadius: 18,
    height: 74,
    width: 74,
  },
  sectionCardTitle: { color: palette.ink, fontSize: 32, fontWeight: '900', marginTop: 22, textAlign: 'center' },
  sectionCardTitleCompact: {
    fontSize: 24,
    marginTop: 14,
  },
  sectionCardSubtitle: { color: palette.slate, fontSize: 16, fontWeight: '700', lineHeight: 22, marginTop: 8, textAlign: 'center' },
  sectionCardSubtitleCompact: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  sectionCardFooter: { alignItems: 'center', borderTopColor: '#E2DACB', borderTopWidth: 1, flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 20, paddingTop: 14 },
  sectionCardFooterCompact: {
    marginTop: 14,
    paddingTop: 10,
  },
  sectionCardFooterText: { color: palette.slate, fontSize: 16, fontWeight: '800' },
  sectionCardFooterTextCompact: {
    fontSize: 14,
  },
});
