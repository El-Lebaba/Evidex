import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import katex from 'katex';
import { WebView } from 'react-native-webview';

import { ThemedText } from '@/components/themed-text';

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

export function FormulaRenderer({
  fallback,
  math,
  centered = false,
  size = 'md',
}: FormulaRendererProps) {
  const html = useMemo(() => {
    try {
      const markup = katex.renderToString(math || fallback, {
        displayMode: false,
        output: 'html',
        throwOnError: false,
      });

      return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.45/dist/katex.min.css" />
    <style>
      html, body {
        background: transparent;
        margin: 0;
        padding: 0;
      }

      body {
        align-items: ${centered ? 'center' : 'flex-start'};
        color: #243B53;
        display: flex;
        font-size: 18px;
        justify-content: ${centered ? 'center' : 'flex-start'};
        min-height: 28px;
        overflow: hidden;
        width: 100%;
      }

      .katex {
        font-size: ${FONT_SIZE[size]}em;
      }
    </style>
  </head>
  <body>${markup}</body>
</html>`;
    } catch {
      return null;
    }
  }, [centered, fallback, math, size]);

  return (
    <View style={styles.wrap}>
      {html ? (
        <WebView
          originWhitelist={['*']}
          scrollEnabled={false}
          source={{ html }}
          style={styles.webview}
        />
      ) : (
        <ThemedText lightColor="#243B53" style={styles.fallback}>
          {fallback}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    justifyContent: 'center',
    minHeight: 32,
    width: '100%',
  },
  webview: {
    backgroundColor: 'transparent',
    height: 34,
  },
  fallback: {
    color: '#243B53',
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
});
