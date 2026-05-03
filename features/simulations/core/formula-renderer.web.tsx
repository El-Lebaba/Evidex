import katex from 'katex';
import { memo, useEffect, useMemo } from 'react';

type FormulaRendererProps = {
  fallback: string;
  math: string;
  centered?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

function FormulaRendererComponent({ fallback, math, centered = false, size = 'md' }: FormulaRendererProps) {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const stylesheetId = 'katex-cdn-stylesheet';
    if (document.getElementById(stylesheetId)) {
      return;
    }

    const link = document.createElement('link');
    link.id = stylesheetId;
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.45/dist/katex.min.css';
    document.head.appendChild(link);
  }, []);

  const markup = useMemo(
    () =>
      katex.renderToString(math || fallback, {
        displayMode: false,
        output: 'html',
        throwOnError: false,
      }),
    [fallback, math]
  );

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

export const FormulaRenderer = memo(FormulaRendererComponent);
