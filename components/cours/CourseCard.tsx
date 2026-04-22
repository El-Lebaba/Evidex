import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CourseProgressDetails, CourseSubject, LearningCourse, SUBJECT_LABELS } from '@/data/courses';

type CourseCardProps = {
  course: LearningCourse;
  progressDetails: CourseProgressDetails;
  index: number;
  subject: CourseSubject;
};

const THEME = {
  border: '#243B53',
  ink: '#243B53',
  muted: '#243B53',
  panel: '#F3F1E7',
  soft: '#E9ECE4',
  pale: '#DDE4D5',
};

const accentColors = ['#D8A94A', '#7EA6E0', '#7CCFBF', '#BC8559', '#AAB58A', '#D97B6C'];

const subjectIcons: Record<CourseSubject, keyof typeof MaterialCommunityIcons.glyphMap> = {
  java: 'language-java',
  math: 'function-variant',
  physique: 'atom',
};

export default function CourseCard({ course, progressDetails, index, subject }: CourseCardProps) {
  const accent = accentColors[index % accentColors.length];
  // Course cards display saved tracking only; progress changes happen inside the reader/exercise flow.
  const hasStarted = progressDetails.progress > 0;
  const progress = progressDetails.progress;
  const exerciseStatus = progressDetails.exerciseCompleted ? 'exercice termine' : 'exercice a faire';
  const href = {
    pathname: '/(tabs)/cours/sujet/courseId',
    params: { courseId: course.id, subject },
  } as unknown as Href;

  return (
      <Pressable
          onPress={() => router.replace(href)}
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
            {hasStarted ? (
              <ThemedText lightColor={THEME.muted} style={styles.slideText}>
                {`${progress}%`}
              </ThemedText>
            ) : null}
            {hasStarted ? (
              <ThemedText lightColor={progressDetails.exerciseCompleted ? '#10A77A' : '#F59E0B'} style={styles.slideText}>
                {exerciseStatus}
              </ThemedText>
            ) : null}
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
    borderRadius: 18,
    borderWidth: 1,
    borderTopWidth: 4,
    flexBasis: 260,
    flexGrow: 1,
    gap: 16,
    minHeight: 240,
    overflow: 'hidden',
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
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
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  numberBadge: {
    alignItems: 'center',
    backgroundColor: THEME.soft,
    borderColor: THEME.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    minWidth: 42,
    paddingHorizontal: 10,
  },
  numberText: {
    color: THEME.muted,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 16,
  },
  openButton: {
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: THEME.pale,
    height: 42,
    justifyContent: 'center',
    width: 42,
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
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
  },
  description: {
    color: THEME.ink,
    fontSize: 15,
    lineHeight: 24,
  },
  cardFooter: {
    alignItems: 'center',
    borderTopColor: 'rgba(36,59,83,0.1)',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
  },
  footerMeta: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  slideText: {
    color: THEME.ink,
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
  },
});
