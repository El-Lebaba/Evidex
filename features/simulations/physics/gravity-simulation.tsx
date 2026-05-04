import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Circle,
  Defs,
  Line,
  Path,
  RadialGradient,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DefinitionPopover } from '@/features/simulations/core/definition-popover';
import { FormulaRenderer } from '@/features/simulations/core/formula-renderer';
import {
  SIMULATION_HEADER_CONTENT_GAP,
  SIMULATION_HEADER_TOTAL_HEIGHT,
  SimulationScreenHeader,
} from '@/features/simulations/core/simulation-screen-header';
import {
  calculateGravitationalForce,
  EARTH_GRAVITY,
  formatBodyWeightRatio,
  formatBodyWeightRatioLatex,
  formatForceNewtonsLatex,
  formatCompactScientific,
  formatScientificLatexNumber,
  formatScientificNumber,
} from '@/features/simulations/physics/gravity-physics';

type NumericSliderProps = {
  integer?: boolean;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  scale?: 'linear' | 'power';
  step: number;
  unit: string;
  value: number;
};

type RangePreset = 'distance' | 'mass';

const SIMULATION_PAGE_BACKGROUND = '#EAE3D2';
const THEME = {
  accent: '#D8A94A',
  background: '#E9ECE4',
  bodyA: '#7CCFBF',
  bodyADeep: '#3F8D83',
  bodyASoft: 'rgba(124, 207, 191, 0.22)',
  bodyB: '#D8A94A',
  bodyBDeep: '#9A7432',
  bodyBSoft: 'rgba(216, 169, 74, 0.2)',
  border: '#243B53',
  field: '#7DC9BE',
  grid: '#B7C7B0',
  gridSoft: 'rgba(167, 184, 158, 0.35)',
  ink: '#243B53',
  mutedInk: '#6E7F73',
  panel: '#DDE4D5',
  pull: '#D97B6C',
  surface: '#F3F1E7',
};

const WEB_SLIDER_INTERACTION_STYLE =
  Platform.OS === 'web'
    ? ({
        cursor: 'ew-resize',
        touchAction: 'none',
        userSelect: 'none',
      } as any)
    : undefined;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function roundToStep(value: number, step: number) {
  return Math.round(value / step) * step;
}

function getAdaptiveStep(value: number, preset: RangePreset) {
  if (preset === 'distance') {
    if (value < 100) {
      return 5;
    }

    if (value < 1000) {
      return 25;
    }

    return 100;
  }

  if (value < 100) {
    return 5;
  }

  if (value < 1000) {
    return 25;
  }

  if (value < 10000) {
    return 100;
  }

  return 1000;
}

function valueFromSliderPercent(percent: number, min: number, max: number, scale: NumericSliderProps['scale']) {
  if (scale !== 'power') {
    return min + percent * (max - min);
  }

  return min + Math.pow(percent, 3.2) * (max - min);
}

function sliderPercentFromValue(value: number, min: number, max: number, scale: NumericSliderProps['scale']) {
  const linearPercent = clamp((value - min) / (max - min), 0, 1);

  if (scale !== 'power') {
    return linearPercent * 100;
  }

  return Math.pow(linearPercent, 1 / 3.2) * 100;
}

function formatCompactValue(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(value >= 10000000 ? 0 : 1)}M`;
  }

  if (value >= 10000) {
    return `${(value / 1000).toFixed(value >= 100000 ? 0 : 1)}k`;
  }

  return value.toFixed(0);
}

function describeForce(force: number) {
  if (force >= 1) {
    return 'Tres forte';
  }

  if (force >= 1e-3) {
    return 'Forte';
  }

  if (force >= 1e-7) {
    return 'Visible';
  }

  if (force >= 1e-11) {
    return 'Tres faible';
  }

  return 'Minuscule';
}

function NumericSlider({
  integer = false,
  label,
  max,
  min,
  onChange,
  scale = 'linear',
  step,
  unit,
  value,
}: NumericSliderProps) {
  const setFromEvent = useCallback((event: GestureResponderEvent) => {
    event.currentTarget.measure((_x, _y, measuredWidth, _height, pageX) => {
      const position = clamp(event.nativeEvent.pageX - pageX, 0, measuredWidth);
      const rawValue = valueFromSliderPercent(position / measuredWidth, min, max, scale);
      const adaptiveStep = scale === 'power' ? getAdaptiveStep(rawValue, unit === 'm' ? 'distance' : 'mass') : step;
      const nextValue = clamp(roundToStep(rawValue, adaptiveStep), min, max);
      onChange(integer ? Math.round(nextValue) : Number(nextValue.toFixed(1)));
    });
  }, [integer, max, min, onChange, scale, step, unit]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: setFromEvent,
        onPanResponderMove: setFromEvent,
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
      }),
    [setFromEvent]
  );

  const percent = sliderPercentFromValue(value, min, max, scale);
  const displayValue = integer ? value.toFixed(0) : value.toFixed(1);

  return (
    <View style={styles.sliderBlock}>
      <View style={styles.sliderHeader}>
        <ThemedText lightColor={THEME.mutedInk} style={styles.label}>
          {label}
        </ThemedText>
        <ThemedText lightColor={THEME.ink} style={styles.sliderValueText}>
          {scale === 'power' ? formatCompactValue(value) : displayValue} {unit}
        </ThemedText>
      </View>
      <View {...panResponder.panHandlers} style={[styles.sliderTrack, WEB_SLIDER_INTERACTION_STYLE]}>
        <View style={[styles.sliderFill, { width: `${percent}%` }]} />
        <View style={[styles.sliderThumb, WEB_SLIDER_INTERACTION_STYLE, { left: `${percent}%` }]} />
      </View>
    </View>
  );
}

function GravityGraph({
  distance,
  graphHeight,
  graphWidth,
  mass1,
  mass2,
  phase,
  visualForce,
}: {
  distance: number;
  graphHeight: number;
  graphWidth: number;
  mass1: number;
  mass2: number;
  phase: number;
  visualForce: number;
}) {
  const centerY = graphHeight / 2;
  const centerX = graphWidth / 2;
  const distancePercent = Math.log(distance / 5) / Math.log(10000 / 5);
  const visualDistance = clamp(96 + distancePercent * graphWidth * 0.46, 96, graphWidth * 0.68);
  const x1 = centerX - visualDistance / 2;
  const x2 = centerX + visualDistance / 2;
  const r1 = 18 + Math.log10(mass1 / 5 + 1) * 11;
  const r2 = 18 + Math.log10(mass2 / 5 + 1) * 11;
  const arrowLength = clamp(14 + visualForce * 42, 14, 56);

  const fieldLines = useMemo(() => {
    const count = clamp(Math.round(visualForce * 12) + 9, 9, 21);

    return Array.from({ length: count }, (_, index) => {
      const ratio = count === 1 ? 0 : index / (count - 1);
      const offset = (ratio - 0.5) * 2;
      const wave = Math.sin(phase * 1.7 + index * 0.65) * 5;
      const startX = x1 + r1 * (0.7 + Math.abs(offset) * 0.1);
      const startY = centerY + offset * r1 * 0.82 + wave;
      const endX = x2 - r2 * (0.7 + Math.abs(offset) * 0.1);
      const endY = centerY - offset * r2 * 0.82 - wave;
      const pinchY = centerY + Math.sin(phase + index) * 7;

      return {
        d: `M ${startX.toFixed(2)} ${startY.toFixed(2)} Q ${centerX.toFixed(2)} ${pinchY.toFixed(2)} ${endX.toFixed(2)} ${endY.toFixed(2)}`,
        opacity: 0.2 + (1 - Math.abs(offset)) * 0.34,
      };
    });
  }, [centerX, centerY, phase, r1, r2, visualForce, x1, x2]);

  return (
    <View style={[styles.graph, { height: graphHeight, width: graphWidth }]}>
      <Svg height={graphHeight} width={graphWidth}>
        <Defs>
          <RadialGradient cx="38%" cy="34%" id="bodyA" r="70%">
            <Stop offset="0%" stopColor="#DDF8EF" />
            <Stop offset="48%" stopColor={THEME.bodyA} />
            <Stop offset="100%" stopColor={THEME.bodyADeep} />
          </RadialGradient>
          <RadialGradient cx="38%" cy="34%" id="bodyB" r="70%">
            <Stop offset="0%" stopColor="#FFE9B2" />
            <Stop offset="50%" stopColor={THEME.bodyB} />
            <Stop offset="100%" stopColor={THEME.bodyBDeep} />
          </RadialGradient>
        </Defs>

        <Rect fill={THEME.panel} height={graphHeight} width={graphWidth} x={0} y={0} />

        {Array.from({ length: 8 }, (_, index) => (
          <Line
            key={`grid-h-${index}`}
            stroke={THEME.gridSoft}
            strokeWidth={1}
            x1={0}
            x2={graphWidth}
            y1={(index / 7) * graphHeight}
            y2={(index / 7) * graphHeight}
          />
        ))}

        {fieldLines.map((line, index) => (
          <Path
            d={line.d}
            fill="none"
            key={`field-${index}`}
            stroke={THEME.field}
            strokeOpacity={line.opacity}
            strokeWidth={1.25}
          />
        ))}

        <Line
          stroke={THEME.grid}
          strokeDasharray="5 5"
          strokeOpacity={0.9}
          strokeWidth={1.5}
          x1={x1}
          x2={x2}
          y1={graphHeight - 42}
          y2={graphHeight - 42}
        />
        <Line stroke={THEME.grid} strokeWidth={1.5} x1={x1} x2={x1} y1={graphHeight - 48} y2={graphHeight - 36} />
        <Line stroke={THEME.grid} strokeWidth={1.5} x1={x2} x2={x2} y1={graphHeight - 48} y2={graphHeight - 36} />

        <Line
          stroke={THEME.pull}
          strokeLinecap="round"
          strokeWidth={3}
          x1={x1 + r1 + 8}
          x2={x1 + r1 + 8 + arrowLength}
          y1={centerY}
          y2={centerY}
        />
        <Path
          d={`M ${x1 + r1 + 8 + arrowLength} ${centerY} l -9 -7 m 9 7 l -9 7`}
          fill="none"
          stroke={THEME.pull}
          strokeLinecap="round"
          strokeWidth={3}
        />
        <Line
          stroke={THEME.pull}
          strokeLinecap="round"
          strokeWidth={3}
          x1={x2 - r2 - 8}
          x2={x2 - r2 - 8 - arrowLength}
          y1={centerY}
          y2={centerY}
        />
        <Path
          d={`M ${x2 - r2 - 8 - arrowLength} ${centerY} l 9 -7 m -9 7 l 9 7`}
          fill="none"
          stroke={THEME.pull}
          strokeLinecap="round"
          strokeWidth={3}
        />

        <Circle cx={x1} cy={centerY} fill={THEME.bodyASoft} r={r1 + 20} />
        <Circle cx={x1} cy={centerY} fill={THEME.bodyASoft} r={r1 + 12} />
        <Circle cx={x2} cy={centerY} fill={THEME.bodyBSoft} r={r2 + 20} />
        <Circle cx={x2} cy={centerY} fill={THEME.bodyBSoft} r={r2 + 12} />
        <Circle cx={x1} cy={centerY} fill="url(#bodyA)" r={r1} stroke={THEME.surface} strokeOpacity={0.45} strokeWidth={1.5} />
        <Circle cx={x2} cy={centerY} fill="url(#bodyB)" r={r2} stroke={THEME.surface} strokeOpacity={0.45} strokeWidth={1.5} />

        <SvgText fill={THEME.ink} fontSize="12" fontWeight="700" textAnchor="middle" x={x1} y={centerY + r1 + 24}>
          m1 = {formatCompactValue(mass1)} kg
        </SvgText>
        <SvgText fill={THEME.ink} fontSize="12" fontWeight="700" textAnchor="middle" x={x2} y={centerY + r2 + 24}>
          m2 = {formatCompactValue(mass2)} kg
        </SvgText>
        <SvgText fill={THEME.mutedInk} fontSize="12" fontWeight="700" textAnchor="middle" x={centerX} y={graphHeight - 20}>
          d = {formatCompactValue(distance)} m
        </SvgText>
      </Svg>

      <View style={styles.graphLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: THEME.field }]} />
          <ThemedText lightColor={THEME.mutedInk} style={styles.legendText}>
            Champ
          </ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: THEME.pull }]} />
          <ThemedText lightColor={THEME.mutedInk} style={styles.legendText}>
            Force
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

export function GravitySimulation() {
  const isFocused = useIsFocused();
  const [mass1, setMass1] = useState(50);
  const [mass2, setMass2] = useState(30);
  const [distance, setDistance] = useState(150);
  const [phase, setPhase] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    const interval = setInterval(() => {
      setPhase((current) => current + 0.035);
    }, 40);

    return () => clearInterval(interval);
  }, [isFocused]);

  const horizontalPadding = width >= 1200 ? 12 : 16;
  const contentWidth = width - horizontalPadding * 2;
  const isWide = width >= 980;
  const isCompact = width < 560;
  const graphWidth = isWide ? Math.round(contentWidth * 0.665) : contentWidth;
  const graphHeight = isWide
    ? clamp(Math.round(graphWidth * 0.62), 460, 680)
    : clamp(Math.round(graphWidth * 0.74), 340, 500);
  const sideWidth = isWide ? contentWidth - graphWidth - 20 : contentWidth;
  const force = calculateGravitationalForce(mass1, mass2, distance);
  const acceleration1 = force / mass1;
  const acceleration2 = force / mass2;
  const earthWeight1 = mass1 * EARTH_GRAVITY;
  const earthWeightRatio = earthWeight1 > 0 && Number.isFinite(force) ? force / earthWeight1 : null;
  const visualForce = force > 0 ? clamp((Math.log10(force) + 12) / 12, 0, 1) : 0;

  const headerTranslateY = scrollY.interpolate({
    extrapolate: 'clamp',
    inputRange: [0, 120],
    outputRange: [0, -SIMULATION_HEADER_TOTAL_HEIGHT],
  });
  const headerOpacity = scrollY.interpolate({
    extrapolate: 'clamp',
    inputRange: [0, 60, 120],
    outputRange: [1, 0.9, 0],
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView lightColor={THEME.background} style={styles.container}>
        <Animated.View
          style={[
            styles.headerOverlay,
            {
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslateY }],
            },
          ]}>
          <SimulationScreenHeader title="Gravite" type="physics" />
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
                alignItems: isWide ? 'center' : 'stretch',
                flexDirection: isWide ? 'row' : 'column',
                minHeight: isWide ? graphHeight + 40 : undefined,
                paddingLeft: isWide ? 22 : 0,
                paddingRight: isWide ? 22 : 0,
                width: contentWidth,
              },
            ]}>
            <GravityGraph
              distance={distance}
              graphHeight={graphHeight}
              graphWidth={graphWidth}
              mass1={mass1}
              mass2={mass2}
              phase={phase}
              visualForce={visualForce}
            />

            <View style={[styles.sidebar, { paddingRight: isWide ? 44 : 0, width: sideWidth }]}>
              <View style={styles.formulaCard}>
                <FormulaRenderer
                  centered
                  fallback="F = (G * m1 * m2) / d^2"
                  math={'F=\\frac{G\\,m_1m_2}{d^2}'}
                  size="md"
                />
              </View>

              <View style={styles.panel}>
                <NumericSlider
                  integer
                  label="Masse 1"
                  max={1000000}
                  min={5}
                  onChange={setMass1}
                  scale="power"
                  step={1}
                  unit="kg"
                  value={mass1}
                />
                <NumericSlider
                  integer
                  label="Masse 2"
                  max={1000000}
                  min={5}
                  onChange={setMass2}
                  scale="power"
                  step={1}
                  unit="kg"
                  value={mass2}
                />
                <NumericSlider
                  integer
                  label="Distance"
                  max={10000}
                  min={5}
                  onChange={setDistance}
                  scale="power"
                  step={1}
                  unit="m"
                  value={distance}
                />
              </View>

              <View style={[styles.statsGrid, { flexDirection: isCompact ? 'column' : 'row' }]}>
                <View style={[styles.statCard, isCompact ? undefined : styles.statCardSlim]}>
                  <ThemedText lightColor={THEME.mutedInk} style={styles.statLabel}>
                    Force
                  </ThemedText>
                  <View style={styles.statValueFormulaWrap}>
                    <FormulaRenderer
                      fallback={formatScientificNumber(force) + ' N'}
                      math={formatForceNewtonsLatex(force)}
                      centered
                      size="sm"
                    />
                  </View>
                </View>
                <View style={[styles.statCard, isCompact ? undefined : styles.statCardWide]}>
                  <ThemedText lightColor={THEME.mutedInk} style={styles.statLabel}>
                    Accel. grav.
                  </ThemedText>
                  <View style={styles.accelerationRows}>
                    <View style={styles.accelerationFormulaLine}>
                      <FormulaRenderer
                        fallback={`a1 = ${formatCompactScientific(acceleration1)}`}
                        math={`a_1=${formatScientificLatexNumber(acceleration1)}`}
                        centered
                        size="sm"
                      />
                    </View>
                    <View style={styles.accelerationFormulaLine}>
                      <FormulaRenderer
                        fallback={`a2 = ${formatCompactScientific(acceleration2)}`}
                        math={`a_2=${formatScientificLatexNumber(acceleration2)}`}
                        centered
                        size="sm"
                      />
                    </View>
                    <ThemedText lightColor={THEME.mutedInk} style={styles.accelerationUnit}>
                      m/s^2
                    </ThemedText>
                  </View>
                </View>
                <View style={[styles.statCard, isCompact ? undefined : styles.statCardSlim]}>
                  <ThemedText lightColor={THEME.mutedInk} style={styles.statLabel}>
                    Etat
                  </ThemedText>
                  <ThemedText lightColor={THEME.ink} style={styles.statValueSmall}>
                    {describeForce(force)}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.comparisonCard}>
                <ThemedText lightColor={THEME.mutedInk} style={styles.infoLabel}>
                  Compare au poids terrestre
                </ThemedText>
                <View style={styles.earthWeightFormulaWrap}>
                  <FormulaRenderer
                    fallback={formatBodyWeightRatio(earthWeightRatio).replace('body weight', 'poids')}
                    math={formatBodyWeightRatioLatex(earthWeightRatio)}
                    centered
                    size="sm"
                  />
                </View>
                <ThemedText lightColor={THEME.mutedInk} style={styles.earthWeightSubtext}>
                  Force / poids terrestre de la masse 1
                </ThemedText>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      </ThemedView>

      <DefinitionPopover
        body={[
          'La gravitation universelle dit que deux objets avec une masse s attirent toujours.',
          'La force est proportionnelle au produit des masses et inversement proportionnelle au carre de la distance.',
        ]}
        exampleLabel="Lecture rapide"
        exampleText="Si tu doubles une masse, la force double. Si tu doubles la distance, la force devient quatre fois plus petite."
        eyebrow="Definition"
        title="Qu est ce que la gravitation ?"
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
    gap: 20,
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
  label: {
    color: THEME.mutedInk,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  sliderBlock: {
    gap: 12,
  },
  sliderHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderValueText: {
    color: THEME.ink,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
    textAlign: 'center',
  },
  sliderTrack: {
    backgroundColor: THEME.surface,
    borderColor: THEME.border,
    borderRadius: 999,
    borderWidth: 1.5,
    height: 16,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sliderFill: {
    backgroundColor: THEME.accent,
    borderRadius: 999,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
  },
  sliderThumb: {
    backgroundColor: THEME.ink,
    borderColor: THEME.surface,
    borderRadius: 10,
    borderWidth: 2,
    height: 20,
    marginLeft: -10,
    position: 'absolute',
    width: 20,
  },
  infoLabel: {
    color: THEME.mutedInk,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
    textTransform: 'uppercase',
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
    justifyContent: 'center',
    minHeight: 108,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  statCardSlim: {
    flex: 0.82,
  },
  statCardWide: {
    flex: 1.55,
  },
  statLabel: {
    color: THEME.mutedInk,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  statFormulaWrap: {
    minHeight: 30,
    width: '100%',
  },
  statValueFormulaWrap: {
    minHeight: 36,
    width: '100%',
  },
  accelerationRows: {
    gap: 4,
    width: '100%',
  },
  accelerationFormulaLine: {
    minHeight: 30,
    width: '100%',
  },
  accelerationUnit: {
    color: THEME.mutedInk,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
    textAlign: 'right',
    width: '100%',
  },
  statValue: {
    color: THEME.ink,
    fontSize: 21,
    fontWeight: '800',
    lineHeight: 27,
    textAlign: 'center',
  },
  statValueSmall: {
    color: THEME.ink,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 20,
    textAlign: 'center',
  },
  comparisonCard: {
    backgroundColor: THEME.surface,
    borderColor: THEME.border,
    borderRadius: 8,
    borderWidth: 1.5,
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  earthWeightFormulaWrap: {
    minHeight: 34,
    width: '100%',
  },
  earthWeightSubtext: {
    color: THEME.mutedInk,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  comparisonText: {
    color: THEME.ink,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
});
