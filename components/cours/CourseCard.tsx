import { MaterialCommunityIcons } from '@expo/vector-icons';
import {Href, Link, router} from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CourseSubject, LearningCourse, SUBJECT_LABELS } from '@/data/courses';

type CourseCardProps = {
  course: LearningCourse;
  currentSlide: number;
  index: number;
  subject: CourseSubject;
};

const THEME = {
  border: '#E2DACB',
  ink: '#111827',
  muted: '#5F6B7A',
  panel: '#FFFFFF',
  soft: '#DFE9DC',
};

const accentColors = ['#6B5CFF', '#10A77A', '#F59E0B', '#F97316', '#0EA5E9', '#8B5CF6'];

const subjectIcons: Record<CourseSubject, keyof typeof MaterialCommunityIcons.glyphMap> = {
  java: 'language-java',
  math: 'function-variant',
  physique: 'atom',
};

export default function CourseCard({ course, currentSlide, index, subject }: CourseCardProps) {
  const accent = accentColors[index % accentColors.length];
  const hasStarted = currentSlide >= 0;
  const safeSlide = hasStarted ? Math.min(currentSlide, Math.max(course.totalSlides - 1, 0)) : 0;
  const progress =
    !hasStarted || course.totalSlides === 0 ? 0 : Math.round(((safeSlide + 1) / course.totalSlides) * 100);
  const href = {
    pathname: '/(tabs)/cours/sujet/courseId',
    params: { courseId: course.id, subject },
  } as unknown as Href;

  return (
      <Pressable
          onPress={() => router.push(href)}
          style={({ pressed }) => [
              styles.card,
            { borderTopColor: accent },
            pressed ? styles.pressed : null,
          ]}>
        <View style={styles.cardTop}>
          <View style={[styles.iconBox, { backgroundColor: `${accent}18` }]}>
            <MaterialCommunityIcons color={accent} name={subjectIcons[subject]} size={27} />
          </View>
          <View style={styles.numberBadge}>
            <ThemedText lightColor={THEME.muted} style={styles.numberText}>
              {String(index + 1).padStart(2, '0')}
            </ThemedText>
          </View>
        </View>

        <View style={styles.meta}>
          <ThemedText lightColor={THEME.ink} style={styles.title}>
            {course.title}
          </ThemedText>
          <ThemedText lightColor={accent} style={styles.subjectLabel}>
            {course.subtitle || SUBJECT_LABELS[subject]}
          </ThemedText>
          <ThemedText lightColor={THEME.muted} numberOfLines={2} style={styles.description}>
            {course.description}
          </ThemedText>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.footerMeta}>
            <ThemedText lightColor={THEME.muted} style={styles.slideText}>
              {course.totalSlides} diapos
            </ThemedText>
            <ThemedText lightColor={THEME.muted} style={styles.slideText}>
              {hasStarted ? `${progress}%` : 'demarrer'}
            </ThemedText>
          </View>
          <View style={[styles.openButton, { backgroundColor: `${accent}12` }]}>
            <MaterialCommunityIcons color={accent} name="chevron-right" size={22} />
          </View>
        </View>
      </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.panel,
    borderColor: THEME.border,
    borderRadius: 12,
    borderWidth: 1,
    borderTopWidth: 4,
    flexBasis: 260,
    flexGrow: 1,
    gap: 16,
    minHeight: 220,
    overflow: 'hidden',
    padding: 18,
    shadowColor: '#000000',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }, { translateY: 1 }],
  },
  cardTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconBox: {
    alignItems: 'center',
    borderRadius: 10,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  numberBadge: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    height: 24,
    justifyContent: 'center',
    minWidth: 32,
    paddingHorizontal: 8,
  },
  numberText: {
    color: THEME.muted,
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 14,
  },
  openButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  meta: {
    flex: 1,
    gap: 7,
  },
  subjectLabel: {
    color: THEME.ink,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  title: {
    color: THEME.ink,
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 25,
  },
  description: {
    color: THEME.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  cardFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  footerMeta: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  slideText: {
    color: THEME.muted,
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
  },
});
