import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { db } from '@/db/mainData';

export default function TabLayout() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    function refreshSettings() {
      setDarkMode(db.getSettings().darkMode);
    }

    db.init();
    refreshSettings();

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('evidex_settings_changed', refreshSettings);
      return () => window.removeEventListener('evidex_settings_changed', refreshSettings);
    }
  }, []);

  const tabBackground = darkMode ? '#1F2A32' : undefined;
  const tabBorder = darkMode ? '#9DB2C0' : undefined;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: tabBackground,
          borderTopColor: tabBorder,
          display: 'none',
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="home/index"
        options={{ title: 'Home' }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{ title: 'Profile' }}
      />
      <Tabs.Screen
        name="cours"
        options={{ title: 'Cours' }}
      />
      <Tabs.Screen
        name="math"
        options={{ title: 'Math' }}
      />
      <Tabs.Screen
        name="physics"
        options={{ title: 'Physiques' }}
      />
      <Tabs.Screen
        name="java-programming"
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
