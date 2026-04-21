import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { db } from '@/db/mainData';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
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
  const activeTint = darkMode ? '#8FB7EE' : Colors[colorScheme ?? 'light'].tint;
  const inactiveTint = darkMode ? '#B7C7B0' : Colors[colorScheme ?? 'light'].tabIconDefault;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarStyle: {
          backgroundColor: tabBackground,
          borderTopColor: tabBorder,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="math"
        options={{
          title: 'Math',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="function" color={color} />,
        }}
      />
      <Tabs.Screen
        name="physics"
        options={{
          title: 'Physiques',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="atom" color={color} />,
        }}
      />
      <Tabs.Screen
        name="java-programming"
        options={{
          title: 'Java',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="chevron.left.forwardslash.chevron.right" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="simulations"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
