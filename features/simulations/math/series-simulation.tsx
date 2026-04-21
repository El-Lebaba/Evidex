import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import Svg, { Line, Path, Rect } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DefinitionPopover } from '@/features/simulations/core/definition-popover';
import { FormulaRenderer } from '@/features/simulations/core/formula-renderer';
import {
  SIMULATION_HEADER_CONTENT_GAP,
  SIMULATION_HEADER_TOTAL_HEIGHT,
  SimulationScreenHeader,
} from '@/features/simulations/core/simulation-screen-header';

type SeriesDefinition = {
  converges: boolean;
  desc: string;
  exact: number;
  formulaLabel: string;
  formulaLatex: string;
  label: string;
  limitLabel: string;
  term: (n: number) => number;
};

type Point = {
  x: number;
  y: number;
};

const SIMULATION_PAGE_BACKGROUND = '#EAE3D2';
const TERMS_MIN = 5;
const TERMS_MAX = 100;
const TERM_STEP = 5;
const CHART_HEIGHT = 300;
const BAR_HEIGHT = 170;
const MAX_BAR_COUNT = 40;
const THEME = {
  accent: '#D8A94A',
  accentSoft: 'rgba(216, 169, 74, 0.2)',
  background: '#E9ECE4',
  border: '#243B53',
  function: '#7CCFBF',
  functionSoft: 'rgba(124, 207, 191, 0.22)',
  grid: '#B7C7B0',
  gridSoft: 'rgba(167, 184, 158, 0.35)',
  ink: '#243B53',
  limit: '#7EA6E0',
  mutedInk: '#6E7F73',
  negative: '#D97B6C',
  panel: '#DDE4D5',
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

const SERIES: SeriesDefinition[] = [
  {
    converges: true,
    desc: 'Suite geometrique positive qui se stabilise rapidement.',
    exact: 2,
    formulaLabel: '1/2^n',
    formulaLatex: '\\left(\\frac{1}{2}\\right)^n',
    label: 'Geometrique',
    limitLabel: '2',
    term: (n) => Math.pow(0.5, n),
  },
  {
    converges: false,
    desc: 'Serie harmonique qui diverge lentement.',
    exact: Number.POSITIVE_INFINITY,
    formulaLabel: '1/n',
    formulaLatex: '\\frac{1}{n}',
    label: 'Harmonique',
    limitLabel: '\\infty',
    term: (n) => 1 / n,
  },
  {
    converges: true,
    desc: 'Serie de Bâle qui converge vers pi carre sur 6.',
    exact: (Math.PI * Math.PI) / 6,
    formulaLabel: '1/n^2',
    formulaLatex: '\\frac{1}{n^2}',
    label: 'Bale',
    limitLabel: '\\frac{\\pi^2}{6}',
    term: (n) => 1 / (n * n),
  },
  {
    converges: true,
    desc: 'Serie alternee classique qui converge vers ln(2).',
    exact: Math.log(2),
    formulaLabel: '(-1)^(n+1)/n',
    formulaLatex: '\\frac{(-1)^{n+1}}{n}',
    label: 'Alternee',
    limitLabel: '\\ln(2)',
    term: (n) => Math.pow(-1, n + 1) / n,
  },
  {
    converges: true,
    desc: 'Serie de Leibniz qui approche pi sur 4.',
    exact: Math.PI / 4,
    formulaLabel: '(-1)^n/(2n+1)',
    formulaLatex: '\\frac{(-1)^n}{2n+1}',
    label: 'Leibniz',
    limitLabel: '\\frac{\\pi}{4}',
    term: (n) => Math.pow(-1, n) / (2 * n + 1),
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return '∞';
  }

  return value.toFixed(5);
}

function createPathData(points: Point[]) {
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');
}

function buildPartialSums(series: SeriesDefinition, nTerms: number) {
  const items: { n: number; sum: number; term: number }[] = [];
  let total = 0;

  for (let n = 1; n <= Math.min(nTerms, TERMS_MAX); n += 1) {
    const termValue = series.term(n);
    total += termValue;
    items.push({ n, sum: total, term: termValue });
  }

  return items;
}

function PartialSumsGraph({
  graphHeight,
  graphWidth,
  partialSums,
  series,
}: {
  graphHeight: number;
  graphWidth: number;
  partialSums: { n: number; sum: number; term: number }[];
  series: SeriesDefinition;
}) {
  const values = partialSums.map((entry) => entry.sum);
  const minValue = Math.min(...values, series.converges ? series.exact : values[0] ?? 0, 0);
  const maxValue = Math.max(...values, series.converges ? series.exact : values[values.length - 1] ?? 0, 0);
  const domainPadding = Math.max((maxValue - minValue) * 0.14, 0.35);
  const yMin = minValue - domainPadding;
  const yMax = maxValue + domainPadding;
  const xMax = Math.max(partialSums.length, 2);

  const toPoint = (n: number, value: number): Point => ({
    x: ((n - 1) / Math.max(xMax - 1, 1)) * graphWidth,
    y: graphHeight - ((value - yMin) / Math.max(yMax - yMin, 0.0001)) * graphHeight,
  });

  const linePoints = partialSums.map((entry) => toPoint(entry.n, entry.sum));
  const areaPath =
    linePoints.length > 1
      ? `${createPathData(linePoints)} L ${linePoints[linePoints.length - 1].x.toFixed(2)} ${graphHeight.toFixed(
          2
        )} L ${linePoints[0].x.toFixed(2)} ${graphHeight.toFixed(2)} Z`
      : '';
  const curvePath = linePoints.length > 1 ? createPathData(linePoints) : '';
  const zeroY = toPoint(1, 0).y;
  const limitY = series.converges ? toPoint(1, series.exact).y : null;

  return (
    <View style={[styles.graph, { height: graphHeight, width: graphWidth }]}>
      <Svg height={graphHeight} width={graphWidth}>
        <Rect fill={THEME.panel} height={graphHeight} width={graphWidth} x={0} y={0} />

        {Array.from({ length: 6 }, (_, index) => (
          <Line
            key={`grid-h-${index}`}
            stroke={THEME.gridSoft}
            strokeWidth={1}
            x1={0}
            x2={graphWidth}
            y1={(index / 5) * graphHeight}
            y2={(index / 5) * graphHeight}
          />
        ))}
        {Array.from({ length: 6 }, (_, index) => (
          <Line
            key={`grid-v-${index}`}
            stroke={THEME.gridSoft}
            strokeWidth={1}
            x1={(index / 5) * graphWidth}
            x2={(index / 5) * graphWidth}
            y1={0}
            y2={graphHeight}
          />
        ))}

        <Line stroke={THEME.grid} strokeWidth={1.5} x1={0} x2={graphWidth} y1={zeroY} y2={zeroY} />

        {series.converges && limitY !== null ? (
          <Line
            stroke={THEME.limit}
            strokeDasharray="8 6"
            strokeWidth={2}
            x1={0}
            x2={graphWidth}
            y1={limitY}
            y2={limitY}
          />
        ) : null}

        {areaPath ? <Path d={areaPath} fill={THEME.functionSoft} /> : null}
        {curvePath ? (
          <Path
            d={curvePath}
            fill="none"
            stroke={THEME.function}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
          />
        ) : null}
      </Svg>

      <View style={styles.graphLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: THEME.function }]} />
          <ThemedText lightColor={THEME.mutedInk} style={styles.legendText}>
            Sommes partielles
          </ThemedText>
        </View>
        {series.converges ? (
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, styles.legendDashed, { backgroundColor: THEME.limit }]} />
            <ThemedText lightColor={THEME.mutedInk} style={styles.legendText}>
              Limite
            </ThemedText>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function TermsBarsGraph({
  graphHeight,
  graphWidth,
  partialSums,
}: {
  graphHeight: number;
  graphWidth: number;
  partialSums: { n: number; sum: number; term: number }[];
}) {
  const visibleTerms = partialSums.slice(0, MAX_BAR_COUNT);
  const maxMagnitude = Math.max(...visibleTerms.map((entry) => Math.abs(entry.term)), 0.001);
  const gap = 2;
  const count = Math.max(visibleTerms.length, 1);
  const barWidth = Math.max((graphWidth - gap * (count - 1)) / count, 2);

  return (
    <View style={[styles.graph, { height: graphHeight, width: graphWidth }]}>
      <Svg height={graphHeight} width={graphWidth}>
        <Rect fill={THEME.panel} height={graphHeight} width={graphWidth} x={0} y={0} />
        <Line stroke={THEME.grid} strokeWidth={1.5} x1={0} x2={graphWidth} y1={graphHeight} y2={graphHeight} />

        {visibleTerms.map((entry, index) => {
          const normalized = Math.abs(entry.term) / maxMagnitude;
          const barHeight = normalized * (graphHeight - 18);
          const x = index * (barWidth + gap);
          const y = graphHeight - barHeight;

          return (
            <Rect
              key={`bar-${entry.n}`}
              fill={entry.term >= 0 ? THEME.function : THEME.negative}
              height={barHeight}
              rx={3}
              ry={3}
              width={barWidth}
              x={x}
              y={y}
            />
          );
        })}
      </Svg>
    </View>
  );
}

function IntegerSlider({
  label,
  max,
  min,
  onChange,
  step,
  value,
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
}) {
  const [typedValue, setTypedValue] = useState(String(value));

  useEffect(() => {
    setTypedValue(String(value));
  }, [value]);

  const normalizeValue = useCallback(
    (nextValue: number) => clamp(Math.round(nextValue), min, max),
    [max, min]
  );

  const commitTypedValue = () => {
    const nextValue = Number(typedValue.trim());

    if (!Number.isFinite(nextValue)) {
      setTypedValue(String(value));
      return;
    }

    const resolvedValue = normalizeValue(Math.round(nextValue / step) * step);
    onChange(resolvedValue);
    setTypedValue(String(resolvedValue));
  };

  const setFromEvent = useCallback((event: GestureResponderEvent) => {
    event.currentTarget.measure((_x, _y, measuredWidth, _height, pageX) => {
      const position = clamp(event.nativeEvent.pageX - pageX, 0, measuredWidth);
      const ratio = measuredWidth === 0 ? 0 : position / measuredWidth;
      const rawValue = min + ratio * (max - min);
      const snappedValue = normalizeValue(Math.round(rawValue / step) * step);
      onChange(snappedValue);
    });
  }, [max, min, normalizeValue, onChange, step]);

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

  const percent = ((value - min) / (max - min || 1)) * 100;

  return (
    <View style={styles.sliderBlock}>
      <View style={styles.sliderHeader}>
        <ThemedText lightColor={THEME.mutedInk} style={styles.label}>
          {label}
        </ThemedText>
        <TextInput
          inputMode="numeric"
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

export function SeriesSimulation() {
  const [seriesIndex, setSeriesIndex] = useState(0);
  const [nTerms, setNTerms] = useState(20);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

  const horizontalPadding = width >= 1200 ? 12 : 16;
  const contentWidth = width - horizontalPadding * 2;
  const isWide = width >= 980;
  const isCompact = width < 560;
  const graphWidth = isWide ? Math.round(contentWidth * 0.665) : contentWidth;
  const sideWidth = isWide ? contentWidth - graphWidth - 20 : contentWidth;

  const activeSeries = SERIES[seriesIndex];
  const partialSums = useMemo(
    () => buildPartialSums(activeSeries, nTerms),
    [activeSeries, nTerms]
  );
  const currentSum = partialSums[partialSums.length - 1]?.sum ?? 0;
  const error = activeSeries.converges ? Math.abs(activeSeries.exact - currentSum) : Number.NaN;
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
          <SimulationScreenHeader title="Series" type="math" />
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
                paddingLeft: isWide ? 22 : 0,
                paddingRight: isWide ? 22 : 0,
                width: contentWidth,
              },
            ]}>
            <View style={[styles.graphColumn, { width: graphWidth }]}>
              <View style={styles.formulaCard}>
                <FormulaRenderer centered fallback={'S_n = Σ a_k'} math={'S_n=\\sum_{k=1}^{n} a_k'} size="md" />
              </View>

              <View style={styles.chartPanel}>
                <ThemedText lightColor={THEME.mutedInk} style={styles.panelLabel}>
                  Sommes partielles
                </ThemedText>
                <PartialSumsGraph
                  graphHeight={CHART_HEIGHT}
                  graphWidth={graphWidth - 32}
                  partialSums={partialSums}
                  series={activeSeries}
                />
              </View>

              <View style={styles.chartPanel}>
                <ThemedText lightColor={THEME.mutedInk} style={styles.panelLabel}>
                  Valeur des termes |a_n|
                </ThemedText>
                <TermsBarsGraph
                  graphHeight={BAR_HEIGHT}
                  graphWidth={graphWidth - 32}
                  partialSums={partialSums}
                />
              </View>
            </View>

            <View style={[styles.sidebar, { paddingRight: isWide ? 44 : 0, width: sideWidth }]}>
              <View style={styles.panel}>
                <View style={styles.controlHeader}>
                  <ThemedText lightColor={THEME.mutedInk} style={styles.label}>
                    Serie
                  </ThemedText>
                </View>

                <View style={styles.seriesList}>
                  {SERIES.map((series, index) => {
                    const isActive = seriesIndex === index;

                    return (
                      <Pressable
                        key={series.label}
                        onPress={() => setSeriesIndex(index)}
                        style={[styles.seriesButton, isActive ? styles.seriesButtonActive : undefined]}>
                        <View style={styles.seriesButtonRow}>
                          <ThemedText lightColor={THEME.ink} style={styles.seriesButtonTitle}>
                            {series.label}
                          </ThemedText>
                          <View style={styles.seriesButtonFormula}>
                            <FormulaRenderer centered fallback={series.formulaLabel} math={series.formulaLatex} size="sm" />
                          </View>
                        </View>
                        <ThemedText lightColor={THEME.mutedInk} style={styles.seriesButtonDescription}>
                          {series.desc}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.panel}>
                <IntegerSlider
                  label="Nombre de termes n"
                  max={TERMS_MAX}
                  min={TERMS_MIN}
                  onChange={setNTerms}
                  step={TERM_STEP}
                  value={nTerms}
                />
              </View>

              <View style={[styles.statsGrid, { flexDirection: isCompact ? 'column' : 'row' }]}>
                <View style={styles.statCard}>
                  <ThemedText lightColor={THEME.mutedInk} style={styles.statLabel}>
                    S({nTerms})
                  </ThemedText>
                  <ThemedText lightColor={THEME.ink} style={styles.statValue}>
                    {formatNumber(currentSum)}
                  </ThemedText>
                </View>
                <View style={styles.statCard}>
                  <ThemedText lightColor={THEME.mutedInk} style={styles.statLabel}>
                    Limite
                  </ThemedText>
                  <View style={styles.statFormulaWrap}>
                    <FormulaRenderer
                      centered
                      fallback={activeSeries.converges ? activeSeries.limitLabel : '∞'}
                      math={activeSeries.converges ? activeSeries.limitLabel : '\\infty'}
                      size="sm"
                    />
                  </View>
                </View>
                <View style={styles.statCard}>
                  <ThemedText lightColor={THEME.mutedInk} style={styles.statLabel}>
                    Ecart
                  </ThemedText>
                  <ThemedText lightColor={THEME.ink} style={styles.statValue}>
                    {activeSeries.converges ? formatNumber(error) : '∞'}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      </ThemedView>

      <DefinitionPopover
        body={[
          'Une suite fournit des termes a_1, a_2, a_3 et ainsi de suite. Une serie additionne ces termes pour former les sommes partielles S_n.',
          'Si les sommes partielles se stabilisent vers une valeur finie, la serie converge. Sinon, elle diverge ou oscille sans se fixer.',
        ]}
        exampleLabel="Lecture rapide"
        exampleText="La courbe verte montre S_n et la ligne bleue represente la limite quand elle existe."
        eyebrow="Definition"
        title="Qu est ce qu une serie ?"
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
  chartPanel: {
    backgroundColor: THEME.panel,
    borderColor: THEME.border,
    borderRadius: 8,
    borderWidth: 1.5,
    gap: 12,
    padding: 16,
    width: '100%',
  },
  panelLabel: {
    color: THEME.mutedInk,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 16,
    textTransform: 'uppercase',
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
    maxWidth: 240,
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
  legendDashed: {
    borderStyle: 'dashed',
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
  seriesList: {
    gap: 10,
  },
  seriesButton: {
    backgroundColor: THEME.surface,
    borderColor: THEME.border,
    borderRadius: 8,
    borderWidth: 1.5,
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  seriesButtonActive: {
    backgroundColor: THEME.functionSoft,
    borderColor: THEME.border,
  },
  seriesButtonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  seriesButtonTitle: {
    color: THEME.ink,
    flexShrink: 1,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 18,
  },
  seriesButtonFormula: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 92,
  },
  seriesButtonDescription: {
    color: THEME.mutedInk,
    fontSize: 13,
    lineHeight: 18,
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
  statFormulaWrap: {
    minHeight: 26,
    width: '100%',
  },
});
