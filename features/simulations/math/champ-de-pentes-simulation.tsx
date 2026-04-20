import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

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

type GraphPoint = {
  x: number;
  y: number;
};

type SlopeEquation = {
  desc: string;
  fn: (x: number, y: number) => number;
  label: string;
  latex: string;
};

const SIMULATION_PAGE_BACKGROUND = '#EAE3D2';
const DOMAIN: Domain = { xMax: 4, xMin: -4, yMax: 4, yMin: -4 };
const DENSITY_MIN = 8;
const DENSITY_MAX = 24;
const Y0_MIN = -4;
const Y0_MAX = 4;
const THEME = {
  background: '#E9ECE4',
  border: '#243B53',
  fieldStrong: '#4E7FC4',
  fieldWeak: '#7F9B63',
  grid: '#B7C7B0',
  gridSoft: 'rgba(167, 184, 158, 0.35)',
  ink: '#243B53',
  mutedInk: '#6E7F73',
  panel: '#DDE4D5',
  point: '#D97B6C',
  solution: '#D8A94A',
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

const EQUATIONS: SlopeEquation[] = [
  { desc: 'y = x^2/2 + C', fn: (x) => x, label: "y' = x", latex: "y'=x" },
  { desc: 'y = Ce^x', fn: (_x, y) => y, label: "y' = y", latex: "y'=y" },
  { desc: 'y = Ce^(x^2/2)', fn: (x, y) => x * y, label: "y' = x·y", latex: "y'=xy" },
  { desc: 'y = -cos(x) + C', fn: (x) => Math.sin(x), label: "y' = sin(x)", latex: "y'=\\sin(x)" },
  { desc: 'y = Ce^(-x)', fn: (_x, y) => -y, label: "y' = -y", latex: "y'=-y" },
  { desc: 'y = x - 1 + Ce^(-x)', fn: (x, y) => x - y, label: "y' = x-y", latex: "y'=x-y" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return '--';
  }

  const absoluteValue = Math.abs(value);
  if (absoluteValue !== 0 && (absoluteValue >= 1000 || absoluteValue < 0.001)) {
    return value.toExponential(3);
  }

  return value.toFixed(2);
}

function getScreenPoint(x: number, y: number, width: number, height: number, domain: Domain): GraphPoint {
  return {
    x: ((x - domain.xMin) / (domain.xMax - domain.xMin)) * width,
    y: height - ((y - domain.yMin) / (domain.yMax - domain.yMin)) * height,
  };
}

function createPath(points: GraphPoint[]) {
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');
}

function buildSolutionPath(equation: SlopeEquation, y0: number, width: number, height: number) {
  const step = 0.05;
  const points: GraphPoint[] = [];
  let x = DOMAIN.xMin;
  let y = y0;

  while (x <= DOMAIN.xMax) {
    if (!Number.isFinite(y) || Math.abs(y) > 20) {
      break;
    }

    points.push(getScreenPoint(x, y, width, height, DOMAIN));
    y += equation.fn(x, y) * step;
    x += step;
  }

  return createPath(points);
}

function SlopeFieldGraph({
  density,
  equation,
  graphHeight,
  graphWidth,
  y0,
}: {
  density: number;
  equation: SlopeEquation;
  graphHeight: number;
  graphWidth: number;
  y0: number;
}) {
  const lineSegments = useMemo(() => {
    const segments: Array<{
      color: string;
      opacity: number;
      x1: number;
      x2: number;
      y1: number;
      y2: number;
    }> = [];
    const dx = (DOMAIN.xMax - DOMAIN.xMin) / density;
    const dy = (DOMAIN.yMax - DOMAIN.yMin) / density;
    const segLen = Math.min(dx, dy) * 0.7;

    for (let i = 0; i <= density; i += 1) {
      for (let j = 0; j <= density; j += 1) {
        const mx = DOMAIN.xMin + i * dx;
        const my = DOMAIN.yMin + j * dy;
        const slope = equation.fn(mx, my);

        if (!Number.isFinite(slope)) {
          continue;
        }

        const angle = Math.atan(slope);
        const ddx = (segLen * Math.cos(angle)) / 2;
        const ddy = (segLen * Math.sin(angle)) / 2;
        const center = getScreenPoint(mx, my, graphWidth, graphHeight, DOMAIN);
        const dScreenX = ddx * (graphWidth / (DOMAIN.xMax - DOMAIN.xMin));
        const dScreenY = ddy * (graphHeight / (DOMAIN.yMax - DOMAIN.yMin));
        const magnitude = Math.min(Math.abs(slope), 5) / 5;

        segments.push({
          color: magnitude > 0.45 ? THEME.fieldStrong : THEME.fieldWeak,
          opacity: 0.72 + magnitude * 0.24,
          x1: center.x - dScreenX,
          x2: center.x + dScreenX,
          y1: center.y + dScreenY,
          y2: center.y - dScreenY,
        });
      }
    }

    return segments;
  }, [density, equation, graphHeight, graphWidth]);

  const solutionPath = useMemo(
    () => buildSolutionPath(equation, y0, graphWidth, graphHeight),
    [equation, graphHeight, graphWidth, y0]
  );
  const startPoint = getScreenPoint(DOMAIN.xMin, y0, graphWidth, graphHeight, DOMAIN);

  return (
    <View style={[styles.graph, { height: graphHeight, width: graphWidth }]}>
      <Svg height={graphHeight} width={graphWidth}>
        <Rect fill={THEME.panel} height={graphHeight} width={graphWidth} x={0} y={0} />

        {Array.from({ length: 9 }, (_, index) => (
          <Line
            key={`h-${index}`}
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
            key={`v-${index}`}
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

        {lineSegments.map((segment, index) => (
          <Line
            key={`segment-${index}`}
            stroke={segment.color}
            strokeOpacity={segment.opacity}
            strokeWidth={1.2}
            x1={segment.x1}
            x2={segment.x2}
            y1={segment.y1}
            y2={segment.y2}
          />
        ))}

        <Path
          d={solutionPath}
          fill="none"
          stroke={THEME.solution}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3.1}
        />
        <Circle cx={startPoint.x} cy={startPoint.y} fill={THEME.point} r={5.5} />
      </Svg>

      <View style={styles.graphLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: THEME.fieldStrong }]} />
          <ThemedText lightColor={THEME.mutedInk} style={styles.legendText}>
            Pentes
          </ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: THEME.solution }]} />
          <ThemedText lightColor={THEME.mutedInk} style={styles.legendText}>
            Solution
          </ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendDot} />
          <ThemedText lightColor={THEME.mutedInk} style={styles.legendText}>
            Point initial
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

function NumericSlider({
  integer = false,
  label,
  max,
  min,
  onChange,
  step,
  value,
}: {
  integer?: boolean;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
}) {
  const [typedValue, setTypedValue] = useState(integer ? String(Math.round(value)) : value.toFixed(2));

  useEffect(() => {
    setTypedValue(integer ? String(Math.round(value)) : value.toFixed(2));
  }, [integer, value]);

  const normalizeValue = (nextValue: number) => {
    const clamped = clamp(nextValue, min, max);
    return integer ? Math.round(clamped) : Number(clamped.toFixed(2));
  };

  const commitTypedValue = () => {
    const normalized = typedValue.replace(',', '.').trim();
    const nextValue = Number(normalized);

    if (!Number.isFinite(nextValue)) {
      setTypedValue(integer ? String(Math.round(value)) : value.toFixed(2));
      return;
    }

    const resolvedValue = normalizeValue(nextValue);
    onChange(resolvedValue);
    setTypedValue(integer ? String(Math.round(resolvedValue)) : resolvedValue.toFixed(2));
  };

  const setFromEvent = (event: GestureResponderEvent) => {
    event.currentTarget.measure((_x, _y, measuredWidth, _height, pageX) => {
      const position = clamp(event.nativeEvent.pageX - pageX, 0, measuredWidth);
      const ratio = measuredWidth === 0 ? 0 : position / measuredWidth;
      const rawValue = min + ratio * (max - min);
      const snappedValue = normalizeValue(Math.round(rawValue / step) * step);
      onChange(snappedValue);
    });
  };

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
    [max, min, onChange, step]
  );

  const percent = ((value - min) / (max - min || 1)) * 100;

  return (
    <View style={styles.sliderBlock}>
      <View style={styles.sliderHeader}>
        <ThemedText lightColor={THEME.mutedInk} style={styles.label}>
          {label}
        </ThemedText>
        <TextInput
          inputMode={integer ? 'numeric' : 'decimal'}
          keyboardType="numeric"
          onBlur={commitTypedValue}
          onChangeText={setTypedValue}
          onSubmitEditing={commitTypedValue}
          selectTextOnFocus
          style={styles.sliderValueInput}
          value={typedValue}
        />
      </View>

      <View {...panResponder.panHandlers} style={[styles.sliderTrack, WEB_SLIDER_INTERACTION_STYLE]}>
        <View style={[styles.sliderFill, { width: `${percent}%` }]} />
        <View style={[styles.sliderThumb, WEB_SLIDER_INTERACTION_STYLE, { left: `${percent}%` }]} />
      </View>
    </View>
  );
}

export function ChampDePentesSimulation() {
  const [equationIndex, setEquationIndex] = useState(0);
  const [y0, setY0] = useState(1);
  const [density, setDensity] = useState(16);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

  const horizontalPadding = width >= 1200 ? 12 : 16;
  const contentWidth = width - horizontalPadding * 2;
  const isWide = width >= 980;
  const isCompact = width < 560;
  const graphWidth = isWide ? Math.round(contentWidth * 0.665) : contentWidth;
  const graphHeight = isWide
    ? clamp(Math.round(graphWidth * 0.82), 540, 820)
    : clamp(Math.round(graphWidth * 0.82), 420, 600);
  const sideWidth = isWide ? contentWidth - graphWidth - 20 : contentWidth;

  const activeEquation = EQUATIONS[equationIndex];
  const initialSlope = activeEquation.fn(DOMAIN.xMin, y0);
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -SIMULATION_HEADER_TOTAL_HEIGHT],
    extrapolate: 'clamp',
  });
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 120],
    outputRange: [1, 0.9, 0],
    extrapolate: 'clamp',
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
          <SimulationScreenHeader title="Champ de pentes" />
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
                alignItems: 'flex-start',
                flexDirection: isWide ? 'row' : 'column',
                minHeight: isWide ? graphHeight + 40 : undefined,
                paddingLeft: isWide ? 22 : 0,
                paddingRight: isWide ? 22 : 0,
                width: contentWidth,
              },
            ]}>
            <View style={[styles.graphColumn, { width: graphWidth }]}>
              <SlopeFieldGraph
                density={density}
                equation={activeEquation}
                graphHeight={graphHeight}
                graphWidth={graphWidth}
                y0={y0}
              />
            </View>

            <View style={[styles.sidebar, { paddingRight: isWide ? 44 : 0, width: sideWidth }]}>
              <View style={styles.formulaCard}>
                <FormulaRenderer centered fallback={"y' = f(x, y)"} math={"y'=f(x,y)"} size="md" />
              </View>

              <View style={styles.panel}>
                <View style={styles.controlHeader}>
                  <ThemedText lightColor={THEME.mutedInk} style={styles.label}>
                    Equation
                  </ThemedText>
                </View>

                <View style={styles.equationGrid}>
                  {EQUATIONS.map((equation, index) => {
                    const isActive = equationIndex === index;

                    return (
                      <Pressable
                        key={equation.label}
                        onPress={() => setEquationIndex(index)}
                        style={[styles.equationButton, isActive ? styles.equationButtonActive : undefined]}>
                        <View style={styles.equationButtonFormula}>
                          <FormulaRenderer centered fallback={equation.label} math={equation.latex} size="sm" />
                        </View>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.infoCard}>
                  <ThemedText lightColor={THEME.mutedInk} style={styles.infoLabel}>
                    Solution generale
                  </ThemedText>
                  <FormulaRenderer fallback={activeEquation.desc} math={activeEquation.desc} />
                </View>
              </View>

              <View style={styles.panel}>
                <NumericSlider label="Point initial y0" max={Y0_MAX} min={Y0_MIN} onChange={setY0} step={0.1} value={y0} />
                <NumericSlider integer label="Densite du champ" max={DENSITY_MAX} min={DENSITY_MIN} onChange={setDensity} step={2} value={density} />
              </View>

              <View style={[styles.statsGrid, { flexDirection: isCompact ? 'column' : 'row' }]}>
                <View style={styles.statCard}>
                  <View style={styles.statFormulaWrap}>
                    <ThemedText lightColor={THEME.mutedInk} style={styles.statLabel}>
                      y0
                    </ThemedText>
                  </View>
                  <ThemedText lightColor={THEME.ink} style={styles.statValue}>
                    {formatNumber(y0)}
                  </ThemedText>
                </View>
                <View style={styles.statCard}>
                  <View style={styles.statFormulaWrap}>
                    <ThemedText lightColor={THEME.mutedInk} style={styles.statLabel}>
                      Pente initiale
                    </ThemedText>
                  </View>
                  <ThemedText lightColor={THEME.ink} style={styles.statValue}>
                    {formatNumber(initialSlope)}
                  </ThemedText>
                </View>
                <View style={styles.statCard}>
                  <View style={styles.statFormulaWrap}>
                    <ThemedText lightColor={THEME.mutedInk} style={styles.statLabel}>
                      Densite
                    </ThemedText>
                  </View>
                  <ThemedText lightColor={THEME.ink} style={styles.statValue}>
                    {density}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      </ThemedView>

      <DefinitionPopover
        body={[
          'Un champ de pentes dessine une petite pente en chaque point du plan pour representer une equation differentielle.',
          "On ne voit pas directement une seule courbe, mais toute la direction que suivraient les solutions possibles. La courbe orange montre une solution particuliere qui part du point initial choisi.",
        ]}
        exampleLabel="Lecture rapide"
        exampleText="Les petits segments bleus donnent la direction locale, et la courbe orange suit ce flux."
        eyebrow="Definition"
        title="Qu est ce qu un champ de pentes ?"
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
    maxWidth: 260,
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
    backgroundColor: THEME.point,
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
  equationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  equationButton: {
    alignItems: 'center',
    backgroundColor: THEME.surface,
    borderColor: THEME.border,
    borderRadius: 8,
    borderWidth: 1.5,
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  equationButtonActive: {
    backgroundColor: THEME.fieldStrong,
    borderColor: THEME.fieldStrong,
  },
  equationButtonFormula: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 24,
    width: '100%',
  },
  infoCard: {
    backgroundColor: THEME.surface,
    borderColor: THEME.border,
    borderRadius: 8,
    borderWidth: 1.5,
    gap: 6,
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
  sliderBlock: {
    gap: 16,
  },
  sliderHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderValueInput: {
    color: THEME.ink,
    fontSize: 18,
    fontWeight: '800',
    minWidth: 58,
    padding: 0,
    textAlign: 'right',
  },
  sliderTrack: {
    backgroundColor: THEME.surface,
    borderColor: THEME.border,
    borderRadius: 999,
    borderWidth: 1.5,
    height: 30,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sliderFill: {
    backgroundColor: THEME.grid,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
  },
  sliderThumb: {
    backgroundColor: THEME.ink,
    borderColor: THEME.panel,
    borderRadius: 9,
    borderWidth: 2,
    height: 18,
    marginLeft: -9,
    position: 'absolute',
    width: 18,
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
  statFormulaWrap: {
    minHeight: 24,
    width: '100%',
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
