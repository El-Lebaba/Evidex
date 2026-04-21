import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CourseCard from '@/components/cours/CourseCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  COURSE_SUBJECTS,
  CourseSubject,
  SUBJECT_LABELS,
  getCourseProgressMap,
} from '@/data/courses';
import { FloatingMathSymbols } from '@/features/simulations/core/floating-math-symbols';

const SUBJECTS: CourseSubject[] = ['java', 'math', 'physique'];

function isCourseSubject(value: string | undefined): value is CourseSubject {
  return Boolean(value && SUBJECTS.includes(value as CourseSubject));
}

const THEME = {
  background: '#EEF5ED',
  border: '#E2DACB',
  copper: '#BC8559',
  ink: '#20242B',
  muted: '#536165',
  panel: '#FFFFFF',
  sage: '#B8C7B1',
  soft: '#DFE9DC',
  yellow: '#D8A94A',
};

export default function CoursesScreen() {
  const params = useLocalSearchParams<{ subject?: string }>();
  const initialSubject = isCourseSubject(params.subject) ? params.subject : 'java';
  const [activeSubject, setActiveSubject] = useState<CourseSubject>(initialSubject);
  const [progressMap, setProgressMap] = useState(getCourseProgressMap);
  const subjectMotion = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isCourseSubject(params.subject)) {
      setActiveSubject(params.subject);
    }
  }, [params.subject]);

  useFocusEffect(
    useCallback(() => {
      setProgressMap(getCourseProgressMap());
    }, [])
  );

  const courses = COURSE_SUBJECTS[activeSubject];
  const totalSlides = useMemo(() => courses.reduce((total, course) => total + course.totalSlides, 0), [courses]);

  useEffect(() => {
    subjectMotion.setValue(0);
    Animated.timing(subjectMotion, {
      duration: 360,
      easing: Easing.out(Easing.cubic),
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [activeSubject, subjectMotion]);

  const subjectTranslate = subjectMotion.interpolate({
    inputRange: [0, 1],
    outputRange: [28, 0],
  });

  const subjectProgress = useMemo(() => {
    const completedSlides = courses.reduce((total, course) => {
      const progressKey = `${activeSubject}:${course.id}`;

      if (!(progressKey in progressMap)) {
        return total;
      }

      const currentSlide = progressMap[progressKey];
      return total + Math.min(currentSlide + 1, course.totalSlides);
    }, 0);

    return totalSlides === 0 ? 0 : Math.round((completedSlides / totalSlides) * 100);
  }, [activeSubject, courses, progressMap, totalSlides]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView lightColor={THEME.background} style={styles.page}>
        <FloatingMathSymbols showGlow={false} style={styles.mathSymbols} />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ThemedText lightColor={THEME.muted} style={styles.screenKicker}>
            Cours / {SUBJECT_LABELS[activeSubject]}
          </ThemedText>

          <Animated.View style={[styles.hero, { opacity: subjectMotion, transform: [{ translateY: subjectTranslate }] }]}>
            <View style={styles.badge}>
              <MaterialCommunityIcons color="#6357E8" name="code-tags" size={14} />
              <ThemedText lightColor="#6357E8" style={styles.badgeText}>
                Lab {SUBJECT_LABELS[activeSubject]}
              </ThemedText>
            </View>

            <ThemedText lightColor={THEME.ink} style={styles.title}>
              Apprendre {SUBJECT_LABELS[activeSubject]}
            </ThemedText>
            <ThemedText lightColor="#8f9b8e" style={styles.titleAccent}>
              visuellement.
            </ThemedText>
            <ThemedText lightColor={THEME.muted} style={styles.subtitle}>
              Mini-cours interactifs avec exemples clairs, suivi de progression et questions rapides.
            </ThemedText>

            <View style={styles.statsRow}>
              <ThemedText lightColor={THEME.muted} style={styles.statText}>
                {courses.length} mini-cours
              </ThemedText>
              <ThemedText lightColor={THEME.muted} style={styles.statText}>
                {totalSlides} diapos
              </ThemedText>
              <ThemedText lightColor={THEME.muted} style={styles.statText}>
                {subjectProgress}% termine
              </ThemedText>
            </View>
          </Animated.View>

          <Animated.View style={[styles.courseSection, { opacity: subjectMotion, transform: [{ translateX: subjectTranslate }] }]}>
            <ThemedText lightColor={THEME.muted} style={styles.sectionLabel}>
              Mini-cours
            </ThemedText>

            <View style={styles.courseList}>
              {courses.map((course, index) => {
                const progressKey = `${activeSubject}:${course.id}`;
                const currentSlide = progressKey in progressMap ? progressMap[progressKey] : -1;

                return (
                  <CourseCard
                    course={course}
                    currentSlide={currentSlide}
                    index={index}
                    key={course.id}
                    subject={activeSubject}
                  />
                );
              })}
            </View>
          </Animated.View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  page: {
    backgroundColor: THEME.background,
    flex: 1,
    overflow: 'hidden',
  },
  mathSymbols: {
    backgroundColor: THEME.background,
    opacity: 0.72,
  },
  scrollContent: {
    alignSelf: 'center',
    gap: 22,
    maxWidth: 980,
    padding: 16,
    paddingBottom: 42,
    width: '100%',
  },
  screenKicker: {
    color: THEME.muted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  hero: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 18,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: '#ECEBFF',
    borderColor: '#D6D3FF',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  badgeText: {
    color: THEME.ink,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  title: {
    color: THEME.ink,
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 48,
    textAlign: 'center',
  },
  titleAccent: {
    color: '#6B5CFF',
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 48,
    textAlign: 'center',
  },
  subtitle: {
    color: THEME.muted,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 560,
    textAlign: 'center',
  },
  subjectTabs: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    gap: 12,
  },
  subjectButton: {
    alignItems: 'center',
    backgroundColor: THEME.panel,
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    minHeight: 64,
    justifyContent: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000000',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
  },
  subjectButtonActive: {
    backgroundColor: '#111827',
    shadowColor: '#000000',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
  },
  subjectText: {
    color: THEME.ink,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  subjectTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ translateY: 1 }],
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'center',
    paddingTop: 10,
  },
  statText: {
    color: THEME.muted,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  courseSection: {
    gap: 14,
  },
  sectionLabel: {
    color: THEME.muted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  courseList: {
    flexDirection: "row",
    flexWrap: 'wrap',
    gap: 16,
    padding: 10
  },
});
