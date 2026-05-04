import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PanneauCours, { CoursLocal } from '@/components/accueil/PanneauCours';
import PanneauCartesMemoire from '@/components/accueil/PanneauCartesMemoire';
import PanneauParametres, { ParametresApplication } from '@/components/accueil/PanneauParametres';
import BarreSuperieure from '@/components/accueil/BarreSuperieure';
import PanneauXP, { InfosUtilisateur } from '@/components/accueil/PanneauXP';
import { obtenirCoursApprentissageRecents } from '@/data/cours';
import { donneesLocales } from '@/db/donnees-principales';
import { SymbolesMathematiquesFlottants } from '@/features/simulations/core/symboles-mathematiques-flottants';

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

const Couleurs = lightColors;

export default function EvidexProfile() {
  const [courses, setCourses] = useState<CoursLocal[]>([]);
  const [user, setUser] = useState<InfosUtilisateur>({ xp: 0, level: 1 });
  const [settings, setSettings] = useState<ParametresApplication>({
    darkMode: false,
    language: 'fr',
    notifications: true,
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    donneesLocales.init();
    setCourses(obtenirCoursApprentissageRecents().filter((CoursLocal) => CoursLocal.progress > 0));
    setUser(donneesLocales.obtenirUtilisateur());
    setSettings(donneesLocales.obtenirParametres());
  }, []);

  const refreshCourses = useCallback(() => {
    setCourses(obtenirCoursApprentissageRecents().filter((CoursLocal) => CoursLocal.progress > 0));
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshCourses();
    }, [refreshCourses])
  );

  const refreshUser = useCallback((updatedUser?: InfosUtilisateur) => {
    setUser(updatedUser ?? donneesLocales.obtenirUtilisateur());
  }, []);

  function enregistrerParametres(nextSettings: ParametresApplication) {
    setSettings(nextSettings);
  }

  const activeCount = courses.filter((CoursLocal) => !CoursLocal.completed).length;
  const completedCount = courses.filter((CoursLocal) => CoursLocal.completed).length;
  const themeActif = settings.darkMode ? darkColors : lightColors;

  const stats = [
    { label: 'cours actifs', value: activeCount, color: themeActif.green },
    { label: 'cours termines', value: completedCount, color: themeActif.red },
    { label: 'niveau', value: user.level, color: themeActif.blue },
    { label: 'xp total', value: user.xp, color: themeActif.yellow },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeActif.background }]}>
      <View style={[styles.page, { backgroundColor: themeActif.background }]}>
        <BarreSuperieure
          darkMode={settings.darkMode}
          onSettingsClick={() => setSettingsOpen(true)}
          user={user}
        />
        <PanneauParametres
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          settings={settings}
          onSave={enregistrerParametres}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.cardsGrid}>
            <PanelBox accentColor={themeActif.blue} Couleurs={themeActif}>
              <PanneauCartesMemoire darkMode={settings.darkMode} />
            </PanelBox>
            <PanelBox accentColor={themeActif.green} Couleurs={themeActif}>
              <PanneauCours
                courses={courses}
                darkMode={settings.darkMode}
                onCourseUpdate={refreshCourses}
              />
            </PanelBox>
            <PanelBox accentColor={themeActif.yellow} Couleurs={themeActif}>
              <PanneauXP
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
                    backgroundColor: themeActif.surface,
                    borderColor: `${themeActif.border}30`,
                  },
                ]}>
                <Text style={[styles.statValue, { color: stat.color }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statLabel, { color: themeActif.muted }]}>
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
          <SymbolesMathematiquesFlottants
            showGlow={!settings.darkMode}
            style={{ backgroundColor: themeActif.background, opacity: 1 }}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

type ThemeColors = typeof lightColors;

type PanelBoxProps = {
  accentColor: string;
  Couleurs: ThemeColors;
  children: React.ReactNode;
};

function PanelBox({ accentColor, Couleurs, children }: PanelBoxProps) {
  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: Couleurs.surface,
          borderColor: `${Couleurs.border}30`,
        },
      ]}>
      <View style={[styles.panelAccent, { backgroundColor: accentColor }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Couleurs.background,
    flex: 1,
  },
  page: {
    backgroundColor: Couleurs.background,
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
    backgroundColor: Couleurs.surface,
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
    backgroundColor: Couleurs.surface,
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
    color: Couleurs.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },
});

