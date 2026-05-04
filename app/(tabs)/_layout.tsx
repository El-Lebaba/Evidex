import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { donneesLocales } from '@/db/donnees-principales';

export default function DispositionOnglets() {
  const [modeSombre, definirModeSombre] = useState(false);

  useEffect(() => {
    function rafraichirParametres() {
      definirModeSombre(donneesLocales.obtenirParametres().darkMode);
    }

    donneesLocales.init();
    rafraichirParametres();

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('evidex_settings_changed', rafraichirParametres);
      return () => window.removeEventListener('evidex_settings_changed', rafraichirParametres);
    }
  }, []);

  const arrierePlanOnglet = modeSombre ? '#1F2A32' : undefined;
  const bordureOnglet = modeSombre ? '#9DB2C0' : undefined;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: arrierePlanOnglet,
          borderTopColor: bordureOnglet,
          display: 'none',
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="accueil/index"
        options={{ title: 'Accueil' }}
      />
      <Tabs.Screen
        name="profil/index"
        options={{ title: 'Profil' }}
      />
      <Tabs.Screen
        name="cours"
        options={{ title: 'Cours' }}
      />
      <Tabs.Screen
        name="mathematiques"
        options={{ title: 'Math' }}
      />
      <Tabs.Screen
        name="physique"
        options={{ title: 'Physiques' }}
      />
      <Tabs.Screen
        name="programmation-java"
        options={{ title: 'Java' }}
      />
      <Tabs.Screen
        name="simulations/index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

