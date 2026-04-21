import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, Link } from 'expo-router';
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
  border: '#A8B59A',
  ink: '#243B53',
  muted: '#6E7F73',
  panel: '#F3F1E7',
  soft: '#DDE4D5',
};

const accentColors = ['#AAB18E', '#7CCFBF', '#D8A94A', '#D97B6C', '#7EA6E0'];

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
    pathname: '/(tabs)/cours/[subject]/[courseId]',
    params: { courseId: course.id, subject },
  } as unknown as Href;

  return (
    <Link href={href} asChild>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          { borderColor: accent },
          pressed ? styles.pressed : null,
        ]}>
        <View style={[styles.accent, { backgroundColor: accent }]} />

        <View style={styles.topRow}>
          <View style={[styles.iconBox, { borderColor: accent }]}>
            <MaterialCommunityIcons color={THEME.ink} name={subjectIcons[subject]} size={24} />
          </View>

          <View style={styles.meta}>
            <ThemedText lightColor={THEME.muted} style={styles.subjectLabel}>
              {SUBJECT_LABELS[subject]} - cours {index + 1}
            </ThemedText>
            <ThemedText lightColor={THEME.ink} style={styles.title}>
              {course.title}
            </ThemedText>
          </View>

          <MaterialCommunityIcons color={accent} name="arrow-right" size={24} />
        </View>

        <ThemedText lightColor={THEME.muted} numberOfLines={2} style={styles.description}>
          {course.description}
        </ThemedText>

        <View style={styles.progressBlock}>
          <View style={styles.progressMeta}>
            <ThemedText lightColor={THEME.ink} style={styles.progressText}>
              {hasStarted ? `Page ${safeSlide + 1}/${course.totalSlides}` : 'Non commence'}
            </ThemedText>
            <ThemedText lightColor={THEME.muted} style={styles.progressText}>
              {progress}%
            </ThemedText>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { backgroundColor: accent, width: `${progress}%` }]} />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.panel,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 13,
    overflow: 'hidden',
    padding: 16,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ translateY: 1 }],
  },
  accent: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 5,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: THEME.soft,
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  subjectLabel: {
    color: THEME.muted,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  title: {
    color: THEME.ink,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 25,
  },
  description: {
    color: THEME.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  progressBlock: {
    gap: 8,
  },
  progressMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
  },
  progressTrack: {
    backgroundColor: THEME.soft,
    borderColor: THEME.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});
