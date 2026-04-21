import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
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
  getCourseProgressMap,
} from '@/data/courses';

const SUBJECTS: CourseSubject[] = ['java', 'math', 'physique'];

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

const backgroundBubbles = [
  { height: 92, left: -24, opacity: 0.28, top: 82, width: 92 },
  { height: 56, left: 44, opacity: 0.22, top: 154, width: 56 },
  { height: 28, left: 132, opacity: 0.26, top: 58, width: 28 },
  { height: 18, left: 188, opacity: 0.28, top: 214, width: 18 },
  { height: 120, opacity: 0.22, right: -34, top: 110, width: 120 },
  { height: 66, opacity: 0.2, right: 34, top: 226, width: 66 },
  { height: 34, opacity: 0.24, right: 148, top: 68, width: 34 },
  { height: 22, opacity: 0.28, right: 210, top: 178, width: 22 },
  { height: 84, left: -18, opacity: 0.18, top: 520, width: 84 },
  { height: 42, left: 78, opacity: 0.22, top: 650, width: 42 },
  { height: 96, opacity: 0.18, right: -28, top: 610, width: 96 },
  { height: 30, opacity: 0.24, right: 112, top: 520, width: 30 },
];

export default function CoursesScreen() {
  const [activeSubject, setActiveSubject] = useState<CourseSubject>('java');
  const [progressMap, setProgressMap] = useState(getCourseProgressMap);
  const subjectMotion = useRef(new Animated.Value(1)).current;

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
        <View pointerEvents="none" style={styles.bubbleLayer}>
          {backgroundBubbles.map((bubble, index) => (
            <View
              key={`course-bubble-${index}`}
              style={[
                styles.bubble,
                {
                  height: bubble.height,
                  left: bubble.left,
                  opacity: bubble.opacity,
                  right: bubble.right,
                  top: bubble.top,
                  width: bubble.width,
                },
              ]}
            />
          ))}
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.subjectTabs}>
            {SUBJECTS.map((subject) => {
              const isActive = subject === activeSubject;

              return (
                <Pressable
                  key={subject}
                  onPress={() => setActiveSubject(subject)}
                  style={({ pressed }) => [
                    styles.subjectButton,
                    { borderColor: isActive ? THEME.ink : THEME.border },
                    isActive ? styles.subjectButtonActive : null,
                    pressed ? styles.pressed : null,
                  ]}>
                  <ThemedText lightColor={THEME.ink} style={[styles.subjectText, isActive ? styles.subjectTextActive : null]}>
                    {SUBJECT_LABELS[subject]}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <Animated.View style={[styles.hero, { opacity: subjectMotion, transform: [{ translateY: subjectTranslate }] }]}>
            <View style={styles.badge}>
              <MaterialCommunityIcons color="#6357E8" name="code-tags" size={14} />
              <ThemedText lightColor="#6357E8" style={styles.badgeText}>
                {SUBJECT_LABELS[activeSubject]} Learning Lab
              </ThemedText>
            </View>

            <ThemedText lightColor={THEME.ink} style={styles.title}>
              Learn {SUBJECT_LABELS[activeSubject]}
            </ThemedText>
            <ThemedText lightColor="#6B5CFF" style={styles.titleAccent}>
              Visually.
            </ThemedText>
            <ThemedText lightColor={THEME.muted} style={styles.subtitle}>
              Interactive mini-courses with clear examples, progress tracking, and quick checkpoints.
            </ThemedText>

            <View style={styles.statsRow}>
              <ThemedText lightColor={THEME.muted} style={styles.statText}>
                {courses.length} mini courses
              </ThemedText>
              <ThemedText lightColor={THEME.muted} style={styles.statText}>
                {totalSlides} slides
              </ThemedText>
              <ThemedText lightColor={THEME.muted} style={styles.statText}>
                {subjectProgress}% done
              </ThemedText>
            </View>
          </Animated.View>

          <Animated.View style={[styles.courseSection, { opacity: subjectMotion, transform: [{ translateX: subjectTranslate }] }]}>
            <ThemedText lightColor={THEME.muted} style={styles.sectionLabel}>
              Mini courses
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
  bubbleLayer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.58)',
    borderColor: 'rgba(184,199,177,0.42)',
    borderRadius: 999,
    borderWidth: 1,
    position: 'absolute',
  },
  scrollContent: {
    alignSelf: 'center',
    gap: 22,
    maxWidth: 980,
    padding: 16,
    paddingBottom: 42,
    width: '100%',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
});
