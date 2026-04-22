import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Rect } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DefinitionPopover } from '@/features/simulations/core/definition-popover';
import { FormulaRenderer } from '@/features/simulations/core/formula-renderer';
import {
  SIMULATION_HEADER_CONTENT_GAP,
  SIMULATION_HEADER_TOTAL_HEIGHT,
  SimulationScreenHeader,
} from '@/features/simulations/core/simulation-screen-header';

type Domain = {
  xMax: number;
  xMin: number;
  yMax: number;
  yMin: number;
};

type VectorFieldDefinition = {
  curl: string;
  desc: string;
  divergence: string;
  label: string;
  latex: string;
  p: (x: number, y: number) => number;
  q: (x: number, y: number) => number;
};

type Particle = {
  x: number;
  y: number;
};

const SIMULATION_PAGE_BACKGROUND = '#EAE3D2';
const DOMAIN: Domain = { xMax: 4, xMin: -4, yMax: 4, yMin: -4 };
const PARTICLE_COUNT = 25;
const FIELD_STEPS = 18;
const THEME = {
  accent: '#D8A94A',
  accentSoft: 'rgba(216, 169, 74, 0.2)',
  activeButton: '#7DC9BE',
  background: '#E9ECE4',
  border: '#243B53',
  fieldStrong: '#4E7FC4',
  fieldWeak: '#78A0D4',
  glow: 'rgba(216, 169, 74, 0.28)',
  grid: '#B7C7B0',
  gridSoft: 'rgba(167, 184, 158, 0.35)',
  ink: '#243B53',
  mutedInk: '#6E7F73',
  panel: '#DDE4D5',
  surface: '#F3F1E7',
};

const VECTOR_FIELDS: VectorFieldDefinition[] = [
  {
    curl: '2',
    desc: 'Rotation pure avec un tourbillon uniforme.',
    divergence: '0',
    label: 'Rotation',
    latex: 'F(x,y)=(-y,\\ x)',
    p: (_x, y) => -y,
    q: (x) => x,
  },
  {
    curl: '0',
    desc: 'Source uniforme qui pousse vers l exterieur.',
    divergence: '2',
    label: 'Gradient',
    latex: 'F(x,y)=(x,\\ y)',
    p: (x) => x,
    q: (_x, y) => y,
  },
  {
    curl: '0',
    desc: 'Expansion sur un axe et compression sur l autre.',
    divergence: '0',
    label: 'Selle',
    latex: 'F(x,y)=(x,\\ -y)',
    p: (x) => x,
    q: (_x, y) => -y,
  },
  {
    curl: 'variable',
    desc: 'Tourbillon fort pres du centre puis plus doux plus loin.',
    divergence: '0',
    label: 'Tourbillon',
    latex: 'F(x,y)=\\left(\\frac{-y}{x^2+y^2+0.5},\\ \\frac{x}{x^2+y^2+0.5}\\right)',
    p: (x, y) => -y / (x * x + y * y + 0.5),
    q: (x, y) => x / (x * x + y * y + 0.5),
  },
  {
    curl: 'variable',
    desc: 'Champ de type dipole avec zones opposees.',
    divergence: 'variable',
    label: 'Dipole',
    latex:
      'F(x,y)=\\left(\\frac{x^2-y^2}{(x^2+y^2)^2+0.5},\\ \\frac{2xy}{(x^2+y^2)^2+0.5}\\right)',
    p: (x, y) => (x * x - y * y) / (Math.pow(x * x + y * y, 2) + 0.5),
    q: (x, y) => (2 * x * y) / (Math.pow(x * x + y * y, 2) + 0.5),
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function randomParticle(): Particle {
  return {
    x: Math.random() * (DOMAIN.xMax - DOMAIN.xMin) + DOMAIN.xMin,
    y: Math.random() * (DOMAIN.yMax - DOMAIN.yMin) + DOMAIN.yMin,
  };
}

function toScreenPoint(x: number, y: number, width: number, height: number) {
  return {
    x: ((x - DOMAIN.xMin) / (DOMAIN.xMax - DOMAIN.xMin)) * width,
    y: height - ((y - DOMAIN.yMin) / (DOMAIN.yMax - DOMAIN.yMin)) * height,
  };
}

function formatInvariant(value: string) {
  return value === '0' ? 'nul' : value;
}

function VectorFieldGraph({
  field,
  graphHeight,
  graphWidth,
  showParticles,
}: {
  field: VectorFieldDefinition;
  graphHeight: number;
  graphWidth: number;
  showParticles: boolean;
}) {
  const particlesRef = useRef<Particle[]>(
    Array.from({ length: PARTICLE_COUNT }, () => randomParticle())
  );
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!showParticles) {
      return;
    }

    const interval = setInterval(() => {
      particlesRef.current = particlesRef.current.map((particle) => {
        const vx = field.p(particle.x, particle.y);
        const vy = field.q(particle.x, particle.y);
        const magnitude = Math.sqrt(vx * vx + vy * vy) + 0.001;
        const nextParticle = {
          x: particle.x + (vx / magnitude) * 0.06,
          y: particle.y + (vy / magnitude) * 0.06,
        };

        if (
          !Number.isFinite(nextParticle.x) ||
          !Number.isFinite(nextParticle.y) ||
          Math.abs(nextParticle.x) > DOMAIN.xMax ||
          Math.abs(nextParticle.y) > DOMAIN.yMax
        ) {
          return randomParticle();
        }

        return nextParticle;
      });

      setFrame((current) => current + 1);
    }, 40);

    return () => clearInterval(interval);
  }, [field, showParticles]);

  const vectors = useMemo(() => {
    const items: {
      color: string;
      opacity: number;
      shaft: { x1: number; x2: number; y1: number; y2: number };
      wingA: { x1: number; x2: number; y1: number; y2: number };
      wingB: { x1: number; x2: number; y1: number; y2: number };
    }[] = [];
    const step = (DOMAIN.xMax - DOMAIN.xMin) / FIELD_STEPS;
    const scale = graphWidth / (DOMAIN.xMax - DOMAIN.xMin);

    for (let i = 0; i <= FIELD_STEPS; i += 1) {
      for (let j = 0; j <= FIELD_STEPS; j += 1) {
        const mx = DOMAIN.xMin + i * step;
        const my = DOMAIN.yMin + j * step;
        const vx = field.p(mx, my);
        const vy = field.q(mx, my);
        const magnitude = Math.sqrt(vx * vx + vy * vy);

        if (!Number.isFinite(magnitude) || magnitude < 0.001) {
          continue;
        }

        const normalizedMagnitude = Math.min(magnitude / 3, 1);
        const arrowLength = (10 + normalizedMagnitude * 14) * (scale / 50);
        const start = toScreenPoint(mx, my, graphWidth, graphHeight);
        const endX = start.x + (vx / magnitude) * arrowLength;
        const endY = start.y - (vy / magnitude) * arrowLength;
        const angle = Math.atan2(endY - start.y, endX - start.x);
        const wingLength = 4 + normalizedMagnitude * 1.6;
        const hue = 195 - normalizedMagnitude * 100;
        const color = `hsl(${hue}, 80%, ${50 + normalizedMagnitude * 20}%)`;

        items.push({
          color,
          opacity: 0.6 + normalizedMagnitude * 0.4,
          shaft: { x1: start.x, x2: endX, y1: start.y, y2: endY },
          wingA: {
            x1: endX,
            x2: endX - wingLength * Math.cos(angle - 0.4),
            y1: endY,
            y2: endY - wingLength * Math.sin(angle - 0.4),
          },
          wingB: {
            x1: endX,
            x2: endX - wingLength * Math.cos(angle + 0.4),
            y1: endY,
            y2: endY - wingLength * Math.sin(angle + 0.4),
          },
        });
      }
    }

    return items;
  }, [field, graphHeight, graphWidth]);

  const particles = useMemo(
    () =>
      particlesRef.current.map((particle, index) => ({
        key: `particle-${frame}-${index}`,
        ...toScreenPoint(particle.x, particle.y, graphWidth, graphHeight),
      })),
    [frame, graphHeight, graphWidth]
  );

  return (
    <View style={[styles.graph, { height: graphHeight, width: graphWidth }]}>
      <Svg height={graphHeight} width={graphWidth}>
        <Rect fill={THEME.panel} height={graphHeight} width={graphWidth} x={0} y={0} />

        {Array.from({ length: 9 }, (_, index) => (
          <Line
            key={`grid-h-${index}`}
            stroke={THEME.gridSoft}
            strokeWidth={1}
            x1={0}
            x2={graphWidth}
            y1={(index / 8) * graphHeight}
            y2={(index / 8) * graphHeight}
          />
        ))}
        {Array.from({ length: 9 }, (_, index) => (
          <Line
            key={`grid-v-${index}`}
            stroke={THEME.gridSoft}
            strokeWidth={1}
            x1={(index / 8) * graphWidth}
            x2={(index / 8) * graphWidth}
            y1={0}
            y2={graphHeight}
          />
        ))}

        <Line
          stroke={THEME.grid}
          strokeWidth={1.5}
          x1={0}
          x2={graphWidth}
          y1={graphHeight / 2}
          y2={graphHeight / 2}
        />
        <Line
          stroke={THEME.grid}
          strokeWidth={1.5}
          x1={graphWidth / 2}
          x2={graphWidth / 2}
          y1={0}
          y2={graphHeight}
        />

        {vectors.map((vector, index) => (
          <Line
            key={`vector-shaft-${index}`}
            stroke={vector.color}
            strokeOpacity={vector.opacity}
            strokeWidth={1.15}
            x1={vector.shaft.x1}
            x2={vector.shaft.x2}
            y1={vector.shaft.y1}
            y2={vector.shaft.y2}
          />
        ))}
        {vectors.map((vector, index) => (
          <Line
            key={`vector-wing-a-${index}`}
            stroke={vector.color}
            strokeOpacity={vector.opacity}
            strokeWidth={1.15}
            x1={vector.wingA.x1}
            x2={vector.wingA.x2}
            y1={vector.wingA.y1}
            y2={vector.wingA.y2}
          />
        ))}
        {vectors.map((vector, index) => (
          <Line
            key={`vector-wing-b-${index}`}
            stroke={vector.color}
            strokeOpacity={vector.opacity}
            strokeWidth={1.15}
            x1={vector.wingB.x1}
            x2={vector.wingB.x2}
            y1={vector.wingB.y1}
            y2={vector.wingB.y2}
          />
        ))}

        {showParticles
          ? particles.map((particle) => (
              <Circle
                key={`${particle.key}-glow`}
                cx={particle.x}
                cy={particle.y}
                fill={THEME.glow}
                r={6}
              />
            ))
          : null}
        {showParticles
          ? particles.map((particle) => (
              <Circle
                key={particle.key}
                cx={particle.x}
                cy={particle.y}
                fill={THEME.accent}
                r={2.8}
              />
            ))
          : null}
      </Svg>

      <View style={styles.graphLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: THEME.fieldStrong }]} />
          <ThemedText lightColor={THEME.mutedInk} style={styles.legendText}>
            Direction
          </ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: THEME.accent }]} />
          <ThemedText lightColor={THEME.mutedInk} style={styles.legendText}>
            Flux
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

export function ChampVectorielSimulation() {
  const [fieldIndex, setFieldIndex] = useState(0);
  const [showParticles, setShowParticles] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

  const horizontalPadding = width >= 1200 ? 12 : 16;
  const contentWidth = width - horizontalPadding * 2;
  const isWide = width >= 980;
  const isCompact = width < 560;
  const graphWidth = isWide ? Math.round(contentWidth * 0.665) : contentWidth;
  const graphHeight = isWide
    ? clamp(Math.round(graphWidth * 0.72), 500, 760)
    : clamp(Math.round(graphWidth * 0.78), 360, 520);
  const sideWidth = isWide ? contentWidth - graphWidth - 20 : contentWidth;

  const activeField = VECTOR_FIELDS[fieldIndex];
  const headerTranslateY = scrollY.interpolate({
    extrapolate: 'clamp',
    inputRange: [0, 48],
    outputRange: [0, -(SIMULATION_HEADER_TOTAL_HEIGHT + 64)],
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView lightColor={THEME.background} style={styles.container}>
        <Animated.View
          style={[
            styles.headerOverlay,
            {
              transform: [{ translateY: headerTranslateY }],
            },
          ]}>
          <SimulationScreenHeader title="Champ vectoriel" type="math" />
        </Animated.View>

        <Animated.ScrollView
          contentContainerStyle={styles.content}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
            useNativeDriver: true,
          })}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.workspace,
              {
                flexDirection: isWide ? 'row' : 'column',
                minHeight: isWide ? graphHeight + 40 : undefined,
                paddingLeft: isWide ? 22 : 0,
                paddingRight: isWide ? 22 : 0,
                width: contentWidth,
              },
            ]}>
            <View style={[styles.graphColumn, { width: graphWidth }]}>
              <VectorFieldGraph
                field={activeField}
                graphHeight={graphHeight}
                graphWidth={graphWidth}
                showParticles={showParticles}
              />
            </View>

            <View style={[styles.sidebar, { paddingRight: isWide ? 44 : 0, width: sideWidth }]}>
              <View style={styles.formulaCard}>
                <FormulaRenderer
                  centered
                  fallback={'F(x,y)=P(x,y)i + Q(x,y)j'}
                  math={'\\vec{F}(x,y)=P(x,y)\\hat{i}+Q(x,y)\\hat{j}'}
                  size="md"
                />
              </View>

              <View style={styles.panel}>
                <View style={styles.controlHeader}>
                  <ThemedText lightColor={THEME.mutedInk} style={styles.label}>
                    Type de champ
                  </ThemedText>
                </View>

                <View style={styles.fieldGrid}>
                  {VECTOR_FIELDS.map((field, index) => {
                    const isActive = fieldIndex === index;

                    return (
                      <Pressable
                        key={field.label}
                        onPress={() => setFieldIndex(index)}
                        style={[styles.fieldButton, isActive ? styles.fieldButtonActive : undefined]}>
                        <ThemedText
                          darkColor={THEME.ink}
                          lightColor={THEME.ink}
                          style={[
                            styles.fieldButtonText,
                            isActive ? styles.fieldButtonTextActive : undefined,
                          ]}>
                          {field.label}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.infoCard}>
                  <ThemedText lightColor={THEME.mutedInk} style={styles.infoLabel}>
                    Mode actif
                  </ThemedText>
                  <FormulaRenderer fallback={activeField.label} math={activeField.latex} />
                  <ThemedText lightColor={THEME.ink} style={styles.infoBody}>
                    {activeField.desc}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.panel}>
                <Pressable
                  onPress={() => setShowParticles((current) => !current)}
                  style={[
                    styles.toggleButton,
                    showParticles ? styles.toggleButtonActive : undefined,
                  ]}>
                  <ThemedText
                    lightColor={showParticles ? THEME.ink : THEME.mutedInk}
                    darkColor={showParticles ? THEME.ink : THEME.mutedInk}
                    style={[
                      styles.toggleButtonText,
                      showParticles ? styles.toggleButtonTextActive : undefined,
                    ]}>
                    {showParticles ? 'Flux anime actif' : 'Afficher les particules de flux'}
                  </ThemedText>
                </Pressable>
              </View>

              <View style={[styles.statsGrid, { flexDirection: isCompact ? 'column' : 'row' }]}>
                <View style={styles.statCard}>
                  <ThemedText lightColor={THEME.mutedInk} style={styles.statLabel}>
                    Rotation
                  </ThemedText>
                  <ThemedText lightColor={THEME.ink} style={styles.statValue}>
                    {formatInvariant(activeField.curl)}
                  </ThemedText>
                </View>
                <View style={styles.statCard}>
                  <ThemedText lightColor={THEME.mutedInk} style={styles.statLabel}>
                    Divergence
                  </ThemedText>
                  <ThemedText lightColor={THEME.ink} style={styles.statValue}>
                    {formatInvariant(activeField.divergence)}
                  </ThemedText>
                </View>
                <View style={styles.statCard}>
                  <ThemedText lightColor={THEME.mutedInk} style={styles.statLabel}>
                    Particules
                  </ThemedText>
                  <ThemedText lightColor={THEME.ink} style={styles.statValue}>
                    {showParticles ? 'Actif' : 'Inactif'}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      </ThemedView>

      <DefinitionPopover
        body={[
          'Un champ vectoriel associe un vecteur a chaque point du plan. Chaque fleche montre la direction locale et l intensite du mouvement.',
          'La rotation mesure l effet tourbillon du champ, tandis que la divergence mesure si le champ agit comme une source ou un puits.',
        ]}
        exampleLabel="Lecture rapide"
        exampleText="Les fleches indiquent la direction locale et les points dores suivent ce flux pour reveler la structure globale."
        eyebrow="Definition"
        title="Qu est ce qu un champ vectoriel ?"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: SIMULATION_PAGE_BACKGROUND,
    flex: 1,
  },
  container: {
    backgroundColor: SIMULATION_PAGE_BACKGROUND,
    flex: 1,
  },
  headerOverlay: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
  content: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 28,
    paddingHorizontal: 12,
    paddingTop: SIMULATION_HEADER_TOTAL_HEIGHT + SIMULATION_HEADER_CONTENT_GAP,
  },
  workspace: {
    alignItems: 'flex-start',
    gap: 20,
  },
  graphColumn: {
    gap: 16,
  },
  sidebar: {
    gap: 16,
  },
  formulaCard: {
    backgroundColor: THEME.surface,
    borderColor: THEME.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  graph: {
    backgroundColor: THEME.panel,
    borderColor: THEME.border,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  graphLegend: {
    backgroundColor: THEME.surface,
    borderColor: THEME.border,
    borderRadius: 8,
    borderWidth: 1.5,
    bottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    left: 12,
    maxWidth: 220,
    paddingHorizontal: 10,
    paddingVertical: 8,
    position: 'absolute',
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  legendLine: {
    borderRadius: 999,
    height: 3,
    width: 26,
  },
  legendDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  legendText: {
    color: THEME.mutedInk,
    fontSize: 11,
    lineHeight: 14,
  },
  panel: {
    backgroundColor: THEME.panel,
    borderColor: THEME.border,
    borderRadius: 8,
    borderWidth: 1.5,
    gap: 18,
    padding: 16,
    width: '100%',
  },
  controlHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: THEME.mutedInk,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  fieldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  fieldButton: {
    alignItems: 'center',
    backgroundColor: THEME.surface,
    borderColor: THEME.border,
    borderRadius: 8,
    borderWidth: 1.5,
    flexBasis: '47%',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  fieldButtonActive: {
    backgroundColor: THEME.activeButton,
    borderColor: THEME.border,
  },
  fieldButtonText: {
    color: THEME.ink,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
    textAlign: 'center',
  },
  fieldButtonTextActive: {
    color: THEME.ink,
  },
  infoCard: {
    backgroundColor: THEME.surface,
    borderColor: THEME.border,
    borderRadius: 8,
    borderWidth: 1.5,
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  infoLabel: {
    color: THEME.mutedInk,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  infoBody: {
    color: THEME.ink,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  toggleButton: {
    alignItems: 'center',
    backgroundColor: THEME.surface,
    borderColor: THEME.border,
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    width: '100%',
  },
  toggleButtonActive: {
    backgroundColor: THEME.accentSoft,
    borderColor: THEME.accent,
  },
  toggleButtonText: {
    color: THEME.ink,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    textAlign: 'center',
  },
  toggleButtonTextActive: {
    color: THEME.ink,
  },
  statsGrid: {
    gap: 12,
    width: '100%',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: THEME.panel,
    borderColor: THEME.border,
    borderRadius: 8,
    borderWidth: 1.5,
    flex: 1,
    gap: 6,
    padding: 18,
  },
  statLabel: {
    color: THEME.mutedInk,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  statValue: {
    color: THEME.ink,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    textAlign: 'center',
  },
});
