import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CourseCard from '@/components/cours/CourseCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  COURSE_SUBJECTS,
  CourseSubject,
  SUBJECT_LABELS,
  getLearningCourseSummaries,
} from '@/data/courses';
import { FloatingMathSymbols } from '@/features/simulations/core/floating-math-symbols';

const SUBJECTS: CourseSubject[] = ['java', 'math', 'physique'];

function isCourseSubject(value: string | undefined): value is CourseSubject {
  return Boolean(value && SUBJECTS.includes(value as CourseSubject));
}

const THEME = {
  background: '#EAE3D2',
  border: '#243B53',
  copper: '#BC8559',
  ink: '#243B53',
  muted: '#6E7F73',
  panel: '#DDE4D5',
  sage: '#B7C7B0',
  soft: '#F3F1E7',
  blue: '#7EA6E0',
  yellow: '#D8A94A',
};

export function CoursesScreen() {
  const params = useLocalSearchParams<{ subject?: string }>();
  const initialSubject = isCourseSubject(params.subject) ? params.subject : 'java';
  const [activeSubject, setActiveSubject] = useState<CourseSubject>(initialSubject);
  const [courseSummaries, setCourseSummaries] = useState(getLearningCourseSummaries);
  const subjectMotion = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isCourseSubject(params.subject)) {
      setActiveSubject(params.subject);
    }
  }, [params.subject]);

  useFocusEffect(
      useCallback(() => {
        setCourseSummaries(getLearningCourseSummaries());
      }, [])
  );

  const courses = COURSE_SUBJECTS[activeSubject];
  // Summaries join catalog courses to local user progress so the course tab and profile tab show the same state.
  const courseSummaryMap = useMemo(
      () => new Map(courseSummaries.map((summary) => [summary.id, summary])),
      [courseSummaries],
  );
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
    const totalCourseProgress = courses.reduce((total, course) => {
      const progressKey = `${activeSubject}:${course.id}`;
      return total + (courseSummaryMap.get(progressKey)?.progress ?? 0);
    }, 0);

    return courses.length === 0 ? 0 : Math.round(totalCourseProgress / courses.length);
  }, [activeSubject, courses, courseSummaryMap]);

  return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView lightColor={THEME.background} style={styles.page}>
          <FloatingMathSymbols showGlow={false} style={styles.mathSymbols} />
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Pressable
              onPress={() => {
                router.dismissAll();
                router.push('/(tabs)/home');
              }}
              style={styles.backButton}>
              <MaterialCommunityIcons color={THEME.ink} name="arrow-left" size={18} />
              <ThemedText lightColor={THEME.ink} style={styles.backButtonText}>
                Retour
              </ThemedText>
            </Pressable>

            <ThemedText lightColor={THEME.muted} style={styles.screenKicker}>
              Cours / {SUBJECT_LABELS[activeSubject]}
            </ThemedText>

            <Animated.View style={[styles.hero, { opacity: subjectMotion, transform: [{ translateY: subjectTranslate }] }]}>
              <Pressable onPress={() => router.push('/(tabs)/home')} style={styles.logoBadge}>
                <Image
                  contentFit="contain"
                  source={require('@/assets/images/evidexe-logo.png')}
                  style={styles.logoBadgeImage}
                />
              </Pressable>

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
                  const progressDetails = courseSummaryMap.get(progressKey) ?? {
                    completed: false,
                    exerciseCompleted: false,
                    highestSlideIndex: -1,
                    progress: 0,
                  };

                  return (
                      <CourseCard
                          course={course}
                          progressDetails={progressDetails}
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
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: THEME.soft,
    borderColor: THEME.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  backButtonText: {
    color: THEME.ink,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 18,
  },
  hero: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 18,
  },
  logoBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  logoBadgeImage: {
    height: 50,
    width: 160,
  },
  title: {
    color: THEME.ink,
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 48,
    textAlign: 'center',
  },
  titleAccent: {
    color: THEME.yellow,
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 48,
    textAlign: 'center',
  },
  subtitle: {
    color: THEME.muted,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 760,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginTop: 8,
  },
  statText: {
    backgroundColor: THEME.soft,
    borderColor: THEME.border,
    borderRadius: 999,
    borderWidth: 1,
    color: THEME.ink,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  courseSection: {
    gap: 16,
  },
  sectionLabel: {
    color: THEME.muted,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  courseList: {
    gap: 14,
    flexWrap: 'wrap',
    flexDirection: 'row',
    flexGrow: 1,
  },
});
