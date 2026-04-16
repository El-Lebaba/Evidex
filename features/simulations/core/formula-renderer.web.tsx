import katex from 'katex';
import 'katex/dist/katex.min.css';

type FormulaRendererProps = {
  fallback: string;
  math: string;
  centered?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const FONT_SIZE = {
  sm: 0.92,
  md: 1.05,
  lg: 1.18,
} as const;

export function FormulaRenderer({ fallback, math, centered = false, size = 'md' }: FormulaRendererProps) {
  const markup = katex.renderToString(math || fallback, {
    displayMode: false,
    output: 'html',
    throwOnError: false,
  });

  return (
    <div
      style={{
        alignItems: centered ? 'center' : 'flex-start',
        color: '#243B53',
        display: 'flex',
        minHeight: 28,
        justifyContent: centered ? 'center' : 'flex-start',
        width: '100%',
      }}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
