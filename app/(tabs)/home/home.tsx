import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CoursesPanel, { Course } from '@/components/home edit/CoursesPanel';
import FlashcardsPanel from '@/components/home edit/FlashcardsPanel';
import SettingsPanel, { AppSettings } from '@/components/home edit/SettingsPanel';
import TopBar from '@/components/home edit/TopBar';
import XPPanel, { UserInfo } from '@/components/home edit/XPPanel';
import { db } from '@/db/mainData';
import {FloatingMathSymbols} from "@/features/simulations/core/floating-math-symbols";

const lightColors = {
  background: '#E9ECE4',
  surface: '#F3F1E7',
  border: '#243B53',
  text: '#243B53',
  muted: '#6E7F73',
  green: '#7CCFBF',
  blue: '#7EA6E0',
  yellow: '#D8A94A',
  red: '#D97B6C',
};

const darkColors = {
  background: '#151C22',
  surface: '#1F2A32',
  border: '#9DB2C0',
  text: '#F3F1E7',
  muted: '#B7C7B0',
  green: '#7CCFBF',
  blue: '#8FB7EE',
  yellow: '#E0B95A',
  red: '#E08A7B',
};

const colors = lightColors;

export default function EvidexHome() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<UserInfo>({ xp: 0, level: 1 });
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: false,
    language: 'fr',
    notifications: true,
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    // Load saved data once when the page opens.
    db.init();
    setCourses(db.getCourses());
    setUser(db.getUser());
    setSettings(db.getSettings());
  }, []);

  const refreshCourses = useCallback(() => {
    setCourses(db.getCourses());
  }, []);

  const refreshUser = useCallback((updatedUser?: UserInfo) => {
    setUser(updatedUser ?? db.getUser());
  }, []);

  function saveSettings(nextSettings: AppSettings) {
    db.saveSettings(nextSettings);
    setSettings(nextSettings);
  }

  const activeCount = courses.filter((course) => !course.completed).length;
  const completedCount = courses.filter((course) => course.completed).length;
  const colors = settings.darkMode ? darkColors : lightColors;

  const stats = [
    { label: 'cours actifs', value: activeCount, color: colors.green },
    { label: 'cours termines', value: completedCount, color: colors.red },
    { label: 'Niveau', value: user.level, color: colors.blue },
    { label: 'XP total', value: user.xp, color: colors.yellow },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.page, { backgroundColor: colors.background }]}>
        <TopBar
          darkMode={settings.darkMode}
          onSettingsClick={() => setSettingsOpen(true)}
          user={user}
        />
        <SettingsPanel
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          settings={settings}
            onSave={saveSettings}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Main dashboard columns */}
          <View style={styles.cardsGrid}>
            <PanelBox accentColor={colors.blue} colors={colors}>
              <FlashcardsPanel darkMode={settings.darkMode} />
            </PanelBox>
            <PanelBox accentColor={colors.green} colors={colors}>
              <CoursesPanel
                courses={courses}
                darkMode={settings.darkMode}
                onCourseUpdate={refreshCourses}
              />
            </PanelBox>
            <PanelBox accentColor={colors.yellow} colors={colors}>
              <XPPanel
                darkMode={settings.darkMode}
                user={user}
                onUserUpdate={refreshUser}
              />
            </PanelBox>
          </View>
          {/* Quick numbers at the bottom */}
          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <View
                key={stat.label}
                style={[
                  styles.statCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: `${colors.border}30`,
                  },
                ]}
              >
                <Text style={[styles.statValue, { color: stat.color }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
        <Animated.View style={[
          {
            opacity: new Animated.Value(1),
            transform: [{ translateY: new Animated.Value(0) }],
          },
        ]}>
          <FloatingMathSymbols
            showGlow={!settings.darkMode}
            style={{ backgroundColor: colors.background, opacity: 1 }}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

type PanelBoxProps = {
  accentColor: string;
  colors: typeof lightColors;
  children: React.ReactNode;
};

function PanelBox({ accentColor, colors, children }: PanelBoxProps) {
  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: colors.surface,
          borderColor: `${colors.border}30`,
        },
      ]}
    >
      <View style={[styles.panelAccent, { backgroundColor: accentColor }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  page: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContent: {
    gap: 18,
    padding: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  panel: {
    backgroundColor: colors.surface,
    borderColor: '#243B5330',
    borderRadius: 10,
    borderWidth: 1,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 300,
    minHeight: 520,
    overflow: 'hidden',
    padding: 16,
  },
  panelAccent: {
    height: 4,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: '#243B5330',
    borderRadius: 10,
    borderWidth: 1,
    flexGrow: 1,
    flexBasis: 150,
    padding: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
});
