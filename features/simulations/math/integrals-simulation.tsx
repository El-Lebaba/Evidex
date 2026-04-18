import { useEffect, useMemo, useState } from 'react';
import {
  GestureResponderEvent,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Line, Path, Polygon, Rect } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DefinitionPopover } from '@/features/simulations/core/definition-popover';
import { FormulaRenderer } from '@/features/simulations/core/formula-renderer';

type IntegralFunction = {
  exact: (a: number, b: number) => number;
  fn: (x: number) => number;
  integralLabel: string;
  integralLatex: string;
  label: string;
  latex: string;
};

type MethodKey = 'left' | 'right' | 'midpoint' | 'trapezoid';
type IntegralKind = 'definite' | 'indefinite';
type ViewMode = 'integral' | 'riemann';

type Domain = {
  xMax: number;
  xMin: number;
  yMax: number;
  yMin: number;
};

type Point = {
  x: number;
  y: number;
};

type TrapezoidSegment = {
  fill: string;
  points: string;
  stroke: string;
};

type GraphShape =
  | {
      kind: 'rect';
      rect: {
        fill: string;
        height: number;
        stroke: string;
        width: number;
        x: number;
        y: number;
      };
    }
  | {
      kind: 'segments';
      segments: TrapezoidSegment[];
    }
  | {
      kind: 'polygon';
      fill: string;
      points: string;
      stroke: string;
    };

const FUNCTIONS: IntegralFunction[] = [
  {
    exact: (a, b) => (b ** 2 - a ** 2) / 2,
    fn: (x) => x,
    integralLabel: 'x^2 / 2',
    integralLatex: '\\frac{x^2}{2}',
    label: 'x',
    latex: 'x',
  },
  {
    exact: (a, b) => (b ** 3 - a ** 3) / 3,
    fn: (x) => x * x,
    integralLabel: 'x^3 / 3',
    integralLatex: '\\frac{x^3}{3}',
    label: 'x^2',
    latex: 'x^2',
  },
  {
    exact: (a, b) => -Math.cos(b) + Math.cos(a),
    fn: (x) => Math.sin(x),
    integralLabel: '-cos(x)',
    integralLatex: '-\\cos(x)',
    label: 'sin(x)',
    latex: '\\sin(x)',
  },
  {
    exact: (a, b) => (b ** 4 / 4 - b ** 2 / 2) - (a ** 4 / 4 - a ** 2 / 2),
    fn: (x) => x * x * x - x,
    integralLabel: 'x^4 / 4 - x^2 / 2',
    integralLatex: '\\frac{x^4}{4}-\\frac{x^2}{2}',
    label: 'x^3 - x',
    latex: 'x^3-x',
  },
  {
    exact: (a, b) => (Math.exp(b) - Math.exp(a)) / 3,
    fn: (x) => Math.exp(x) / 3,
    integralLabel: 'e^x / 3',
    integralLatex: '\\frac{e^x}{3}',
    label: 'e^x / 3',
    latex: '\\frac{e^x}{3}',
  },
  {
    exact: (a, b) => Math.sin(b) - Math.sin(a),
    fn: (x) => Math.cos(x),
    integralLabel: 'sin(x)',
    integralLatex: '\\sin(x)',
    label: 'cos(x)',
    latex: '\\cos(x)',
  },
];

const METHODS: { key: MethodKey; label: string }[] = [
  { key: 'left', label: 'Gauche' },
  { key: 'right', label: 'Droite' },
  { key: 'midpoint', label: 'Milieu' },
  { key: 'trapezoid', label: 'Trapeze' },
];

const DOMAIN: Domain = { xMax: 4, xMin: -4, yMax: 5, yMin: -3 };
const THEME = {
  accent: '#D97B6C',
  approximation: 'rgba(124, 207, 191, 0.26)',
  approximationStroke: '#7EA6E0',
  approximationNegative: 'rgba(217, 123, 108, 0.24)',
  approximationNegativeStroke: '#D97B6C',
  background: '#E9ECE4',
  border: '#A8B59A',
  bounds: '#D8A94A',
  function: '#7CCFBF',
  grid: '#B7C7B0',
  gridSoft: 'rgba(167, 184, 158, 0.35)',
  ink: '#243B53',
  mutedInk: '#6E7F73',
  panel: '#DDE4D5',
  surface: '#F3F1E7',
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value: number) {
  return Number.isFinite(value) ? value.toFixed(3) : '--';
}

function getScreenPoint(x: number, y: number, width: number, height: number, domain: Domain): Point {
  return {
    x: ((x - domain.xMin) / (domain.xMax - domain.xMin)) * width,
    y: height - ((y - domain.yMin) / (domain.yMax - domain.yMin)) * height,
  };
}

function sampleFunction(
  fn: (x: number) => number,
  width: number,
  height: number,
  domain: Domain,
  steps = 220
) {
  const paths: Point[][] = [];
  let currentPath: Point[] = [];

  for (let index = 0; index <= steps; index += 1) {
    const x = domain.xMin + (index / steps) * (domain.xMax - domain.xMin);
    const y = fn(x);
    const isVisible = Number.isFinite(y) && y >= domain.yMin && y <= domain.yMax;

    if (isVisible) {
      currentPath.push(getScreenPoint(x, y, width, height, domain));
    } else if (currentPath.length > 0) {
      paths.push(currentPath);
      currentPath = [];
    }
  }

  if (currentPath.length > 0) {
    paths.push(currentPath);
  }

  return paths;
}

function createPathData(path: Point[]) {
  return path
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');
}

function PlotPath({
  color,
  paths,
  thickness,
}: {
  color: string;
  paths: Point[][];
  thickness: number;
}) {
  return paths.map((path, index) => (
    <Path
      d={createPathData(path)}
      fill="none"
      key={index}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={thickness}
    />
  ));
}

function evaluateSample(method: MethodKey, xi: number, dx: number) {
  if (method === 'left') {
    return xi;
  }

  if (method === 'right') {
    return xi + dx;
  }

  return xi + dx / 2;
}

function calculateApproximation(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number,
  method: MethodKey
) {
  const dx = (b - a) / n;
  let total = 0;

  for (let index = 0; index < n; index += 1) {
    const xi = a + index * dx;

    if (method === 'trapezoid') {
      total += ((fn(xi) + fn(xi + dx)) / 2) * dx;
      continue;
    }

    total += fn(evaluateSample(method, xi, dx)) * dx;
  }

  return total;
}

function IntegralGraph({
  a,
  activeFunction,
  b,
  graphHeight,
  graphWidth,
  integralKind,
  method,
  n,
  viewMode,
}: {
  a: number;
  activeFunction: IntegralFunction;
  b: number;
  graphHeight: number;
  graphWidth: number;
  integralKind: IntegralKind;
  method: MethodKey;
  n: number;
  viewMode: ViewMode;
}) {
  const functionPaths = useMemo(
    () => sampleFunction(activeFunction.fn, graphWidth, graphHeight, DOMAIN),
    [activeFunction, graphHeight, graphWidth]
  );

  const origin = getScreenPoint(0, 0, graphWidth, graphHeight, DOMAIN);
  const boundA = getScreenPoint(a, 0, graphWidth, graphHeight, DOMAIN);
  const boundB = getScreenPoint(b, 0, graphWidth, graphHeight, DOMAIN);

  const shapes = useMemo(() => {
    const dx = (b - a) / n;

    return Array.from({ length: n }, (_, index): GraphShape => {
      const xLeft = a + index * dx;
      const xRight = xLeft + dx;
      const baseLeft = getScreenPoint(xLeft, 0, graphWidth, graphHeight, DOMAIN);
      const baseRight = getScreenPoint(xRight, 0, graphWidth, graphHeight, DOMAIN);

      if (method === 'trapezoid') {
        const yLeft = activeFunction.fn(xLeft);
        const yRight = activeFunction.fn(xRight);
        const topLeft = getScreenPoint(xLeft, yLeft, graphWidth, graphHeight, DOMAIN);
        const topRight = getScreenPoint(xRight, yRight, graphWidth, graphHeight, DOMAIN);
        const sameSign = yLeft === 0 || yRight === 0 || yLeft * yRight > 0;

        if (sameSign) {
          return {
            kind: 'polygon',
            fill: yLeft >= 0 || yRight >= 0 ? THEME.approximation : THEME.approximationNegative,
            points: [
              `${baseLeft.x},${baseLeft.y}`,
              `${topLeft.x},${topLeft.y}`,
              `${topRight.x},${topRight.y}`,
              `${baseRight.x},${baseRight.y}`,
            ].join(' '),
            stroke: yLeft >= 0 || yRight >= 0 ? THEME.approximationStroke : THEME.approximationNegativeStroke,
          };
        }

        const zeroX = xLeft + ((0 - yLeft) * (xRight - xLeft)) / (yRight - yLeft);
        const zeroPoint = getScreenPoint(zeroX, 0, graphWidth, graphHeight, DOMAIN);

        return {
          kind: 'segments',
          segments: yLeft > 0
            ? [
                {
                  fill: THEME.approximation,
                  points: [
                    `${baseLeft.x},${baseLeft.y}`,
                    `${topLeft.x},${topLeft.y}`,
                    `${zeroPoint.x},${zeroPoint.y}`,
                  ].join(' '),
                  stroke: THEME.approximationStroke,
                },
                {
                  fill: THEME.approximationNegative,
                  points: [
                    `${zeroPoint.x},${zeroPoint.y}`,
                    `${topRight.x},${topRight.y}`,
                    `${baseRight.x},${baseRight.y}`,
                  ].join(' '),
                  stroke: THEME.approximationNegativeStroke,
                },
              ]
            : [
                {
                  fill: THEME.approximationNegative,
                  points: [
                    `${baseLeft.x},${baseLeft.y}`,
                    `${topLeft.x},${topLeft.y}`,
                    `${zeroPoint.x},${zeroPoint.y}`,
                  ].join(' '),
                  stroke: THEME.approximationNegativeStroke,
                },
                {
                  fill: THEME.approximation,
                  points: [
                    `${zeroPoint.x},${zeroPoint.y}`,
                    `${topRight.x},${topRight.y}`,
                    `${baseRight.x},${baseRight.y}`,
                  ].join(' '),
                  stroke: THEME.approximationStroke,
                },
              ],
        };
      }

      const xEval = evaluateSample(method, xLeft, dx);
      const y = activeFunction.fn(xEval);
      const topY = getScreenPoint(xLeft, y, graphWidth, graphHeight, DOMAIN).y;
      const rectY = y >= 0 ? topY : baseLeft.y;
      const rectHeight = Math.abs(baseLeft.y - topY);

      return {
        kind: 'rect',
        rect: {
          fill: y >= 0 ? THEME.approximation : THEME.approximationNegative,
          height: rectHeight,
          stroke: y >= 0 ? THEME.approximationStroke : THEME.approximationNegativeStroke,
          width: baseRight.x - baseLeft.x,
          x: baseLeft.x,
          y: rectY,
            },
      };
    });
  }, [a, activeFunction, b, graphHeight, graphWidth, method, n]);

  const integralAreaPolygons = useMemo(() => {
    const steps = 320;
    const rangeStart = integralKind === 'indefinite' ? DOMAIN.xMin : a;
    const rangeEnd = integralKind === 'indefinite' ? DOMAIN.xMax : b;
    const xValues = Array.from({ length: steps + 1 }, (_, index) => rangeStart + (index / steps) * (rangeEnd - rangeStart));
    const positivePoints: string[] = [];
    const negativePoints: string[] = [];

    const startBase = getScreenPoint(rangeStart, 0, graphWidth, graphHeight, DOMAIN);
    positivePoints.push(`${startBase.x},${startBase.y}`);
    negativePoints.push(`${startBase.x},${startBase.y}`);

    xValues.forEach((x) => {
      const y = activeFunction.fn(x);
      const positivePoint = getScreenPoint(x, Math.max(y, 0), graphWidth, graphHeight, DOMAIN);
      const negativePoint = getScreenPoint(x, Math.min(y, 0), graphWidth, graphHeight, DOMAIN);
      positivePoints.push(`${positivePoint.x},${positivePoint.y}`);
      negativePoints.push(`${negativePoint.x},${negativePoint.y}`);
    });

    const endBase = getScreenPoint(rangeEnd, 0, graphWidth, graphHeight, DOMAIN);
    positivePoints.push(`${endBase.x},${endBase.y}`);
    negativePoints.push(`${endBase.x},${endBase.y}`);

    return {
      negative: negativePoints.join(' '),
      positive: positivePoints.join(' '),
    };
  }, [a, activeFunction, b, graphHeight, graphWidth, integralKind]);

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

        <Line stroke={THEME.grid} strokeWidth={1.5} x1={0} x2={graphWidth} y1={origin.y} y2={origin.y} />
        <Line stroke={THEME.grid} strokeWidth={1.5} x1={origin.x} x2={origin.x} y1={0} y2={graphHeight} />

        {viewMode === 'integral' ? (
          <>
            <Polygon
              fill={THEME.approximation}
              points={integralAreaPolygons.positive}
              stroke={THEME.approximationStroke}
              strokeWidth={1.2}
            />
            <Polygon
              fill={THEME.approximationNegative}
              points={integralAreaPolygons.negative}
              stroke={THEME.approximationNegativeStroke}
              strokeWidth={1.2}
            />
          </>
        ) : (
          shapes.map((shape, index) =>
            shape.kind === 'rect'
              ? (
                  <Rect
                    fill={shape.rect.fill}
                    height={shape.rect.height}
                    key={index}
                    stroke={shape.rect.stroke}
                    strokeWidth={1}
                    width={shape.rect.width}
                    x={shape.rect.x}
                    y={shape.rect.y}
                  />
                )
              : shape.kind === 'segments'
                ? shape.segments.map((segment: TrapezoidSegment, segmentIndex: number) => (
                    <Polygon
                      fill={segment.fill}
                      key={`${index}-${segmentIndex}`}
                      points={segment.points}
                      stroke={segment.stroke}
                      strokeWidth={1.2}
                    />
                  ))
                : (
                    <Polygon
                      fill={shape.fill}
                      key={index}
                      points={shape.points}
                      stroke={shape.stroke}
                      strokeWidth={1.2}
                    />
                  )
          )
        )}

        <PlotPath color={THEME.function} paths={functionPaths} thickness={3.25} />

        {viewMode === 'riemann' || integralKind === 'definite' ? (
          <>
            <Line stroke={THEME.bounds} strokeDasharray="6 6" strokeWidth={2} x1={boundA.x} x2={boundA.x} y1={0} y2={graphHeight} />
            <Line stroke={THEME.bounds} strokeDasharray="6 6" strokeWidth={2} x1={boundB.x} x2={boundB.x} y1={0} y2={graphHeight} />
          </>
        ) : null}
      </Svg>

      <View style={styles.graphLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: THEME.function }]} />
          <ThemedText lightColor={THEME.mutedInk} style={styles.legendText}>
            f(x)
          </ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: THEME.approximationStroke }]} />
          <ThemedText lightColor={THEME.mutedInk} style={styles.legendText}>
            {viewMode === 'integral' ? 'Aire' : 'Somme'}
          </ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: THEME.bounds }]} />
          <ThemedText lightColor={THEME.mutedInk} style={styles.legendText}>
            Bornes
          </ThemedText>
        </View>
      </View>

      {viewMode === 'riemann' || integralKind === 'definite' ? (
        <>
          <View style={[styles.boundPill, { left: clamp(boundA.x - 18, 8, graphWidth - 38) }]}>
            <ThemedText lightColor={THEME.ink} style={styles.boundText}>
              a
            </ThemedText>
          </View>
          <View style={[styles.boundPill, { left: clamp(boundB.x - 18, 8, graphWidth - 38) }]}>
            <ThemedText lightColor={THEME.ink} style={styles.boundText}>
              b
            </ThemedText>
          </View>
        </>
      ) : null}
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
    const clampedValue = clamp(nextValue, min, max);
    return integer ? Math.round(clampedValue) : Number(clampedValue.toFixed(2));
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
        onPanResponderGrant: setFromEvent,
        onPanResponderMove: setFromEvent,
        onStartShouldSetPanResponder: () => true,
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
          inputMode="decimal"
          keyboardType="numeric"
          onBlur={commitTypedValue}
          onChangeText={setTypedValue}
          onSubmitEditing={commitTypedValue}
          selectTextOnFocus
          style={styles.sliderValueInput}
          value={typedValue}
        />
      </View>
      <View {...panResponder.panHandlers} style={styles.sliderTrack}>
        <View style={[styles.sliderFill, { width: `${percent}%` }]} />
        <View style={[styles.sliderThumb, { left: `${percent}%` }]} />
      </View>
    </View>
  );
}

export function IntegralsSimulation() {
  const [functionIndex, setFunctionIndex] = useState(0);
  const [a, setA] = useState(-2);
  const [b, setB] = useState(2);
  const [integralKind, setIntegralKind] = useState<IntegralKind>('definite');
  const [n, setN] = useState(10);
  const [method, setMethod] = useState<MethodKey>('midpoint');
  const [viewMode, setViewMode] = useState<ViewMode>('riemann');
  const { width } = useWindowDimensions();

  const horizontalPadding = width >= 1200 ? 12 : 16;
  const contentWidth = width - horizontalPadding * 2;
  const isWide = width >= 980;
  const isCompact = width < 560;
  const graphWidth = isWide ? Math.round(contentWidth * 0.665) : contentWidth;
  const graphHeight = isWide
    ? clamp(Math.round(graphWidth * 0.82), 540, 820)
    : clamp(Math.round(graphWidth * 0.82), 400, 580);
  const sideWidth = isWide ? contentWidth - graphWidth - 20 : contentWidth;

  const activeFunction = FUNCTIONS[functionIndex];
  const exact = activeFunction.exact(a, b);
  const approximation = calculateApproximation(activeFunction.fn, a, b, n, method);
  const error = Math.abs(approximation - exact);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView lightColor={THEME.background} style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
            <View style={[styles.graphColumn, { width: graphWidth }]}>
              <View style={styles.panel}>
                <View style={styles.modeGrid}>
                  <Pressable
                    onPress={() => setViewMode('integral')}
                    style={[styles.modeButton, viewMode === 'integral' ? styles.functionButtonActive : undefined]}>
                    <ThemedText lightColor="#000000" style={styles.methodText}>
                      Integrale
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    onPress={() => setViewMode('riemann')}
                    style={[styles.modeButton, viewMode === 'riemann' ? styles.functionButtonActive : undefined]}>
                    <ThemedText lightColor="#000000" style={styles.methodText}>
                      Somme de Riemann
                    </ThemedText>
                  </Pressable>
                </View>
              </View>

            <IntegralGraph
              a={a}
              activeFunction={activeFunction}
              b={b}
              graphHeight={graphHeight}
              graphWidth={graphWidth}
              integralKind={integralKind}
              method={method}
              n={n}
              viewMode={viewMode}
            />
            </View>

            <View style={[styles.sidebar, { paddingRight: isWide ? 44 : 0, width: sideWidth }]}>
              <View style={styles.formulaCard}>
                <FormulaRenderer
                  centered
                  fallback={'∫[a,b] f(x) dx = lim n->inf Σ f(x_i)Δx'}
                  math={'\\int_a^b f(x)\\,dx=\\lim_{n\\to\\infty}\\sum f(x_i)\\Delta x'}
                  size="md"
                />
              </View>

              {viewMode === 'integral' ? (
                <View style={styles.typeCard}>
                  <ThemedText lightColor={THEME.mutedInk} style={styles.errorLabel}>
                    Type d integrale
                  </ThemedText>
                  <View style={styles.modeGrid}>
                    <Pressable
                      onPress={() => setIntegralKind('definite')}
                      style={[styles.modeButton, integralKind === 'definite' ? styles.functionButtonActive : undefined]}>
                      <ThemedText lightColor="#000000" style={styles.methodText}>
                        Definie
                      </ThemedText>
                    </Pressable>
                    <Pressable
                      onPress={() => setIntegralKind('indefinite')}
                      style={[styles.modeButton, integralKind === 'indefinite' ? styles.functionButtonActive : undefined]}>
                      <ThemedText lightColor="#000000" style={styles.methodText}>
                        Indefinie
                      </ThemedText>
                    </Pressable>
                  </View>
                </View>
              ) : null}

              <View style={styles.panel}>
                <View style={styles.controlHeader}>
                  <ThemedText lightColor={THEME.mutedInk} style={styles.label}>
                    Fonction
                  </ThemedText>
                  <View style={styles.activeFormulaWrap}>
                    <FormulaRenderer fallback={activeFunction.label} math={activeFunction.latex} size="sm" />
                  </View>
                </View>

                <View style={styles.functionGridFour}>
                  {FUNCTIONS.map((entry, index) => {
                    const isActive = functionIndex === index;

                    return (
                      <Pressable
                        key={entry.label}
                        onPress={() => setFunctionIndex(index)}
                        style={[styles.functionButtonWide, isActive ? styles.functionButtonActive : undefined]}>
                        <View style={styles.functionButtonFormula}>
                          <FormulaRenderer centered fallback={entry.label} math={entry.latex} size="sm" />
                        </View>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.derivativeFormulaCard}>
                  <ThemedText lightColor={THEME.mutedInk} style={styles.derivativeFormulaLabel}>
                    Primitive
                  </ThemedText>
                  <FormulaRenderer fallback={`f(x) = ${activeFunction.label}`} math={`f(x)=${activeFunction.latex}`} />
                  <FormulaRenderer fallback={`F(x) = ${activeFunction.integralLabel}`} math={`F(x)=${activeFunction.integralLatex}`} />
                </View>
              </View>

              {viewMode === 'riemann' ? (
                <View style={styles.panel}>
                  <View style={styles.controlHeader}>
                    <ThemedText lightColor={THEME.mutedInk} style={styles.label}>
                      Methode
                    </ThemedText>
                  </View>
                  <View style={styles.methodGrid}>
                    {METHODS.map((entry) => {
                      const isActive = method === entry.key;

                      return (
                        <Pressable
                          key={entry.key}
                          onPress={() => setMethod(entry.key)}
                          style={[styles.methodButton, isActive ? styles.methodButtonActive : undefined]}>
                          <ThemedText lightColor="#000000" style={styles.methodText}>
                            {entry.label}
                          </ThemedText>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ) : null}

              {viewMode === 'riemann' || integralKind === 'definite' ? (
                <View style={styles.panel}>
                  {viewMode === 'riemann' || integralKind === 'definite' ? (
                    <>
                      <NumericSlider label="Borne a" max={b - 0.5} min={DOMAIN.xMin} onChange={setA} step={0.1} value={a} />
                      <NumericSlider label="Borne b" max={DOMAIN.xMax} min={a + 0.5} onChange={setB} step={0.1} value={b} />
                    </>
                  ) : null}
                  {viewMode === 'riemann' ? (
                    <NumericSlider integer label="Rectangles n" max={100} min={1} onChange={setN} step={1} value={n} />
                  ) : null}
                </View>
              ) : null}

              <View style={[styles.statsGrid, { flexDirection: isCompact ? 'column' : 'row' }]}>
                {viewMode === 'riemann' ? (
                  <View style={styles.statCard}>
                    <View style={styles.statFormulaWrap}>
                      <ThemedText lightColor={THEME.mutedInk} style={styles.statCaption}>
                        Somme de Riemann
                      </ThemedText>
                    </View>
                    <ThemedText lightColor={THEME.ink} style={styles.statValue}>
                      {approximation.toFixed(4)}
                    </ThemedText>
                  </View>
                ) : null}
                {!(viewMode === 'integral' && integralKind === 'indefinite') ? (
                  <View style={styles.statCard}>
                    <View style={styles.statFormulaWrap}>
                      <ThemedText lightColor={THEME.mutedInk} style={styles.statCaption}>
                        Valeur
                      </ThemedText>
                    </View>
                    <ThemedText lightColor={THEME.ink} style={styles.statValue}>
                      {exact.toFixed(4)}
                    </ThemedText>
                  </View>
                ) : null}
              </View>

              {viewMode === 'riemann' ? (
                <View style={styles.errorCard}>
                  <ThemedText lightColor={THEME.mutedInk} style={styles.errorLabel}>
                    Erreur
                  </ThemedText>
                  <ThemedText lightColor={THEME.ink} style={styles.errorValue}>
                    {error.toFixed(5)}
                  </ThemedText>
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </ThemedView>
      <DefinitionPopover
        body={[
          'Une integrale definie mesure l aire nette sous une courbe entre deux bornes a et b.',
          'La somme de Riemann approche cette aire avec des rectangles ou des trapezes. Quand n augmente, l approximation se rapproche de la valeur exacte.',
        ]}
        exampleLabel="Lecture rapide"
        exampleText={'La somme de Riemann donne une approximation, tandis que la valeur exacte vient de la primitive.'}
        eyebrow="Definition"
        title="Qu est-ce qu une integrale ?"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 28,
    paddingHorizontal: 12,
    paddingTop: 20,
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
    borderColor: THEME.grid,
    borderRadius: 8,
    borderWidth: 1,
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
  legendSwatch: {
    borderRadius: 4,
    height: 10,
    width: 10,
  },
  legendText: {
    color: THEME.mutedInk,
    fontSize: 11,
    lineHeight: 14,
  },
  boundPill: {
    alignItems: 'center',
    backgroundColor: THEME.surface,
    borderColor: THEME.bounds,
    borderRadius: 8,
    borderWidth: 1,
    bottom: 12,
    height: 24,
    justifyContent: 'center',
    position: 'absolute',
    width: 24,
  },
  boundText: {
    color: THEME.ink,
    fontSize: 12,
    fontWeight: '800',
  },
  panel: {
    backgroundColor: THEME.panel,
    borderColor: THEME.border,
    borderRadius: 8,
    borderWidth: 1,
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
  activeFormulaWrap: {
    minWidth: 84,
  },
  functionGridFour: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  functionButtonWide: {
    alignItems: 'center',
    backgroundColor: THEME.surface,
    borderColor: THEME.grid,
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: '47%',
    flexGrow: 1,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  functionButtonActive: {
    backgroundColor: THEME.function,
    borderColor: THEME.function,
  },
  functionButtonFormula: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 24,
    width: '100%',
  },
  methodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  modeGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  modeButton: {
    alignItems: 'center',
    backgroundColor: THEME.surface,
    borderColor: THEME.grid,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    height: 42,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  methodButton: {
    alignItems: 'center',
    backgroundColor: THEME.surface,
    borderColor: THEME.grid,
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: '47%',
    flexGrow: 1,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  methodButtonActive: {
    backgroundColor: THEME.approximation,
    borderColor: THEME.approximationStroke,
  },
  methodText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '700',
  },
  derivativeFormulaCard: {
    backgroundColor: THEME.surface,
    borderColor: THEME.grid,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  derivativeFormulaLabel: {
    color: THEME.mutedInk,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  sliderBlock: {
    gap: 14,
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
    minWidth: 64,
    padding: 0,
    textAlign: 'right',
  },
  sliderTrack: {
    backgroundColor: THEME.surface,
    borderColor: THEME.grid,
    borderRadius: 999,
    borderWidth: 1,
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
    borderWidth: 1,
    flex: 1,
    gap: 6,
    padding: 18,
  },
  statFormulaWrap: {
    minHeight: 24,
    width: '100%',
  },
  statCaption: {
    color: THEME.mutedInk,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  statValue: {
    color: THEME.ink,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
  },
  errorCard: {
    alignItems: 'center',
    backgroundColor: THEME.surface,
    borderColor: THEME.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  typeCard: {
    alignItems: 'center',
    backgroundColor: THEME.panel,
    borderColor: THEME.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  errorLabel: {
    color: THEME.mutedInk,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  errorValue: {
    color: THEME.ink,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
  },
});
