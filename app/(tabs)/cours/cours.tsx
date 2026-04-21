import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
  background: '#E9ECE4',
  border: '#A8B59A',
  ink: '#243B53',
  muted: '#6E7F73',
  panel: '#F3F1E7',
  soft: '#DDE4D5',
};

export default function CoursesScreen() {
  const [activeSubject, setActiveSubject] = useState<CourseSubject>('java');
  const [progressMap, setProgressMap] = useState(getCourseProgressMap);

  useFocusEffect(
    useCallback(() => {
      setProgressMap(getCourseProgressMap());
    }, [])
  );

  const courses = COURSE_SUBJECTS[activeSubject];
  const subjectProgress = useMemo(() => {
    const totalSlides = courses.reduce((total, course) => total + course.totalSlides, 0);
    const completedSlides = courses.reduce((total, course) => {
      const progressKey = `${activeSubject}:${course.id}`;

      if (!(progressKey in progressMap)) {
        return total;
      }

      const currentSlide = progressMap[progressKey];
      return total + Math.min(currentSlide + 1, course.totalSlides);
    }, 0);

    return totalSlides === 0 ? 0 : Math.round((completedSlides / totalSlides) * 100);
  }, [activeSubject, courses, progressMap]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView lightColor={THEME.background} style={styles.page}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.badge}>
              <MaterialCommunityIcons color={THEME.ink} name="book-education-outline" size={17} />
              <ThemedText lightColor={THEME.ink} style={styles.badgeText}>
                Espace cours
              </ThemedText>
            </View>

            <ThemedText lightColor={THEME.ink} style={styles.title}>
              Suivi des matieres
            </ThemedText>
            <ThemedText lightColor={THEME.muted} style={styles.subtitle}>
              Choisis une matiere, ouvre un cours, puis avance avec les fleches. Cette section est separee des animations.
            </ThemedText>
          </View>

          <View style={styles.subjectTabs}>
            {SUBJECTS.map((subject) => {
              const isActive = subject === activeSubject;

              return (
                <Pressable
                  key={subject}
                  onPress={() => setActiveSubject(subject)}
                  style={({ pressed }) => [
                    styles.subjectButton,
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

          <View style={styles.summaryCard}>
            <View>
              <ThemedText lightColor={THEME.ink} style={styles.summaryTitle}>
                {SUBJECT_LABELS[activeSubject]}
              </ThemedText>
              <ThemedText lightColor={THEME.muted} style={styles.summaryText}>
                {courses.length} cours disponibles
              </ThemedText>
            </View>
            <View style={styles.summaryProgress}>
              <ThemedText lightColor={THEME.ink} style={styles.summaryPercent}>
                {subjectProgress}%
              </ThemedText>
              <ThemedText lightColor={THEME.muted} style={styles.summaryText}>
                progression
              </ThemedText>
            </View>
          </View>

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
    flex: 1,
  },
  scrollContent: {
    alignSelf: 'center',
    gap: 18,
    maxWidth: 980,
    padding: 18,
    paddingBottom: 34,
    width: '100%',
  },
  header: {
    backgroundColor: THEME.panel,
    borderColor: THEME.border,
    borderRadius: 18,
    borderWidth: 1.5,
    gap: 12,
    padding: 20,
  },
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: THEME.soft,
    borderColor: THEME.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  title: {
    color: THEME.ink,
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 40,
  },
  subtitle: {
    color: THEME.muted,
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 760,
  },
  subjectTabs: {
    backgroundColor: THEME.soft,
    borderColor: THEME.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 6,
  },
  subjectButton: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  subjectButtonActive: {
    backgroundColor: THEME.panel,
    borderColor: THEME.ink,
    borderWidth: 1.5,
  },
  subjectText: {
    color: THEME.ink,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  subjectTextActive: {
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ translateY: 1 }],
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: THEME.panel,
    borderColor: THEME.border,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    padding: 16,
  },
  summaryTitle: {
    color: THEME.ink,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 26,
  },
  summaryText: {
    color: THEME.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  summaryProgress: {
    alignItems: 'flex-end',
  },
  summaryPercent: {
    color: THEME.ink,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 31,
  },
  courseList: {
    gap: 14,
  },
});
