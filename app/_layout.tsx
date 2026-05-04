import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { CompteurFpsDev } from '@/components/compteur-fps-dev';
import { useSchemaCouleur } from '@/hooks/use-schema-couleur';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const schemaCouleur = useSchemaCouleur();

  return (
    <ThemeProvider value={schemaCouleur === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <CompteurFpsDev />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
