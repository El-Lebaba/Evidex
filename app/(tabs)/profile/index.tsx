import { useCallback, useEffect, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CoursesPanel, { Course } from '@/components/home/CoursesPanel';
import FlashcardsPanel from '@/components/home/FlashcardsPanel';
import SettingsPanel, { AppSettings } from '@/components/home/SettingsPanel';
import TopBar from '@/components/home/TopBar';
import XPPanel, { UserInfo } from '@/components/home/XPPanel';
import { db } from '@/db/mainData';
import { FloatingMathSymbols } from '@/features/simulations/core/floating-math-symbols';

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

export default function EvidexProfile() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<UserInfo>({ xp: 0, level: 1 });
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: false,
    language: 'fr',
    notifications: true,
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
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
  const theme = settings.darkMode ? darkColors : lightColors;

  const stats = [
    { label: 'cours actifs', value: activeCount, color: theme.green },
    { label: 'cours termines', value: completedCount, color: theme.red },
    { label: 'niveau', value: user.level, color: theme.blue },
    { label: 'xp total', value: user.xp, color: theme.yellow },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.page, { backgroundColor: theme.background }]}>
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
          <View style={styles.cardsGrid}>
            <PanelBox accentColor={theme.blue} colors={theme}>
              <FlashcardsPanel darkMode={settings.darkMode} />
            </PanelBox>
            <PanelBox accentColor={theme.green} colors={theme}>
              <CoursesPanel
                courses={courses}
                darkMode={settings.darkMode}
                onCourseUpdate={refreshCourses}
              />
            </PanelBox>
            <PanelBox accentColor={theme.yellow} colors={theme}>
              <XPPanel
                darkMode={settings.darkMode}
                user={user}
                onUserUpdate={refreshUser}
              />
            </PanelBox>
          </View>
          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <View
                key={stat.label}
                style={[
                  styles.statCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: `${theme.border}30`,
                  },
                ]}>
                <Text style={[styles.statValue, { color: stat.color }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statLabel, { color: theme.muted }]}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
        <Animated.View
          style={[
            {
              opacity: new Animated.Value(1),
              transform: [{ translateY: new Animated.Value(0) }],
            },
          ]}>
          <FloatingMathSymbols
            showGlow={!settings.darkMode}
            style={{ backgroundColor: theme.background, opacity: 1 }}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

type ThemeColors = typeof lightColors;

type PanelBoxProps = {
  accentColor: string;
  colors: ThemeColors;
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
      ]}>
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
    flexBasis: 300,
    flexGrow: 1,
    flexShrink: 1,
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
    flexBasis: 150,
    flexGrow: 1,
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
