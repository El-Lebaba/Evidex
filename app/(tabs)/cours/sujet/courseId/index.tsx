import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  CourseSubject,
  SUBJECT_LABELS,
  findCourse,
  getCourseProgress,
  saveCourseProgress,
} from '@/data/courses';

const THEME = {
  background: '#E9ECE4',
  border: '#A8B59A',
  ink: '#243B53',
  muted: '#6E7F73',
  panel: '#F3F1E7',
  soft: '#DDE4D5',
};

const SUBJECTS: CourseSubject[] = ['java', 'math', 'physique'];

function isCourseSubject(value: string): value is CourseSubject {
  return SUBJECTS.includes(value as CourseSubject);
}

function cleanText(value: string) {
  return value
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/â€”/g, '-')
    .replace(/â†’/g, '->')
    .replace(/âœ“/g, 'ok')
    .replace(/âœ—/g, 'non')
    .replace(/Ã—/g, 'x');
}

export default function CourseReaderScreen() {
  const params = useLocalSearchParams<{ courseId?: string; subject?: string }>();
  const subject = params.subject && isCourseSubject(params.subject) ? params.subject : undefined;
  const courseId = params.courseId;
  const course = subject && courseId ? findCourse(subject, courseId) : undefined;

  const initialSlide = useMemo(() => {
    if (!subject || !courseId || !course) {
      return 0;
    }

    return Math.min(getCourseProgress(subject, courseId), Math.max(course.totalSlides - 1, 0));
  }, [course, courseId, subject]);

  const [slideIndex, setSlideIndex] = useState(initialSlide);

  useEffect(() => {
    setSlideIndex(initialSlide);
  }, [initialSlide]);

  useEffect(() => {
    if (subject && courseId && course) {
      saveCourseProgress(subject, courseId, slideIndex);
    }
  }, [course, courseId, slideIndex, subject]);

  if (!subject || !courseId || !course) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView lightColor={THEME.background} style={styles.emptyPage}>
          <ThemedText lightColor={THEME.ink} style={styles.emptyTitle}>
            Cours introuvable
          </ThemedText>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons color={THEME.ink} name="arrow-left" size={18} />
            <ThemedText lightColor={THEME.ink} style={styles.backButtonText}>
              Retour
            </ThemedText>
          </Pressable>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const slide = course.slides[slideIndex];
  const maxSlideIndex = course.totalSlides - 1;
  const progress = Math.round(((slideIndex + 1) / course.totalSlides) * 100);
  const canGoPrevious = slideIndex > 0;
  const canGoNext = slideIndex < maxSlideIndex;

  function goPrevious() {
    setSlideIndex((currentIndex) => Math.max(currentIndex - 1, 0));
  }

  function goNext() {
    setSlideIndex((currentIndex) => Math.min(currentIndex + 1, maxSlideIndex));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView lightColor={THEME.background} style={styles.page}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <MaterialCommunityIcons color={THEME.ink} name="arrow-left" size={22} />
          </Pressable>

          <View style={styles.topMeta}>
            <ThemedText lightColor={THEME.muted} numberOfLines={1} style={styles.subjectText}>
              {SUBJECT_LABELS[subject]}
            </ThemedText>
            <ThemedText lightColor={THEME.ink} numberOfLines={1} style={styles.courseTitle}>
              {course.title}
            </ThemedText>
          </View>
        </View>

        <View style={styles.progressWrap}>
          <View style={styles.progressMeta}>
            <ThemedText lightColor={THEME.ink} style={styles.progressLabel}>
              Page {slideIndex + 1}/{course.totalSlides}
            </ThemedText>
            <ThemedText lightColor={THEME.ink} style={styles.progressLabel}>
              {progress}%
            </ThemedText>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.slideCard}>
            <ThemedText lightColor={THEME.muted} style={styles.slideKicker}>
              {course.subtitle}
            </ThemedText>
            <ThemedText lightColor={THEME.ink} style={styles.slideTitle}>
              {slide.title}
            </ThemedText>
            <ThemedText lightColor={THEME.ink} style={styles.theoryText}>
              {cleanText(slide.theory)}
            </ThemedText>

            {slide.code ? (
              <View style={styles.codeBlock}>
                <ThemedText lightColor={THEME.ink} style={styles.codeText}>
                  {cleanText(slide.code)}
                </ThemedText>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            disabled={!canGoPrevious}
            onPress={goPrevious}
            style={({ pressed }) => [
              styles.navButton,
              !canGoPrevious ? styles.navButtonDisabled : null,
              pressed ? styles.pressed : null,
            ]}>
            <MaterialCommunityIcons color={THEME.ink} name="chevron-left" size={24} />
            <ThemedText lightColor={THEME.ink} style={styles.navButtonText}>
              Precedent
            </ThemedText>
          </Pressable>

          <Pressable
            disabled={!canGoNext}
            onPress={goNext}
            style={({ pressed }) => [
              styles.navButton,
              !canGoNext ? styles.navButtonDisabled : null,
              pressed ? styles.pressed : null,
            ]}>
            <ThemedText lightColor={THEME.ink} style={styles.navButtonText}>
              Suivant
            </ThemedText>
            <MaterialCommunityIcons color={THEME.ink} name="chevron-right" size={24} />
          </Pressable>
        </View>
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
  emptyPage: {
    alignItems: 'center',
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    padding: 20,
  },
  emptyTitle: {
    color: THEME.ink,
    fontSize: 24,
    fontWeight: '900',
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: THEME.panel,
    borderColor: THEME.border,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  topBar: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 12,
    maxWidth: 980,
    padding: 16,
    width: '100%',
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: THEME.panel,
    borderColor: THEME.border,
    borderRadius: 12,
    borderWidth: 1.5,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  topMeta: {
    flex: 1,
  },
  subjectText: {
    color: THEME.muted,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  courseTitle: {
    color: THEME.ink,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 26,
  },
  progressWrap: {
    alignSelf: 'center',
    gap: 8,
    maxWidth: 980,
    paddingHorizontal: 16,
    width: '100%',
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: THEME.ink,
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
  },
  progressTrack: {
    backgroundColor: THEME.soft,
    borderColor: THEME.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 14,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#AAB18E',
    height: '100%',
  },
  content: {
    alignSelf: 'center',
    maxWidth: 980,
    padding: 16,
    paddingBottom: 110,
    width: '100%',
  },
  slideCard: {
    backgroundColor: THEME.panel,
    borderColor: THEME.border,
    borderRadius: 18,
    borderWidth: 1.5,
    gap: 16,
    padding: 20,
  },
  slideKicker: {
    color: THEME.muted,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  slideTitle: {
    color: THEME.ink,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 36,
  },
  theoryText: {
    color: THEME.ink,
    fontSize: 17,
    lineHeight: 27,
  },
  codeBlock: {
    backgroundColor: THEME.soft,
    borderColor: THEME.border,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  codeText: {
    color: THEME.ink,
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 21,
  },
  footer: {
    alignSelf: 'center',
    backgroundColor: THEME.background,
    bottom: 0,
    flexDirection: 'row',
    gap: 12,
    maxWidth: 980,
    padding: 16,
    position: 'absolute',
    width: '100%',
  },
  navButton: {
    alignItems: 'center',
    backgroundColor: THEME.panel,
    borderColor: THEME.border,
    borderRadius: 12,
    borderWidth: 1.5,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: 12,
  },
  navButtonDisabled: {
    opacity: 0.42,
  },
  navButtonText: {
    color: THEME.ink,
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ translateY: 1 }],
  },
});
