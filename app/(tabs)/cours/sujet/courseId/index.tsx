import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  CourseSubject,
  SUBJECT_LABELS,
  findCourse,
  getCourseProgress,
  getCourseProgressDetails,
} from '@/data/courses';
import { db } from '@/db/mainData';

const THEME = {
  background: '#EEF5ED',
  border: '#E2DACB',
  ink: '#111827',
  muted: '#5F6B7A',
  panel: '#FFFFFF',
  soft: '#DFE9DC',
  purple: '#6B5CFF',
};

const SUBJECTS: CourseSubject[] = ['java', 'math', 'physique'];

function isCourseSubject(value: string): value is CourseSubject {
  return SUBJECTS.includes(value as CourseSubject);
}

const highlightedKeywords = [
  'variable',
  'variables',
  'condition',
  'conditions',
  'methode',
  'methodes',
  'parametres',
  'tableau',
  'tableaux',
  'index',
  'classe',
  'classes',
  'objet',
  'objets',
  'constructeur',
  'boucle',
  'boucles',
  'booleen',
  'booleens',
  'String',
  'boolean',
  'true',
  'false',
  'if',
  'else',
  'switch',
  'case',
  'default',
  'break',
  'for',
  'while',
  'return',
  'final',
  'new',
  'derivee',
  'derivees',
  'integrale',
  'integrales',
  'limite',
  'limites',
  'fonction',
  'fonctions',
  'tangente',
  'vitesse',
  'acceleration',
  'position',
  'force',
  'forces',
  'energie',
  'travail',
  'conservation',
];

function normalizeText(value: string) {
  return value
    .replace(/â€”/g, '-')
    .replace(/â†’/g, '->')
    .replace(/âœ“/g, 'ok')
    .replace(/âœ—/g, 'non')
    .replace(/Ã—/g, 'x');
}

function cleanCodeText(value: string) {
  return normalizeText(value).replace(/\*\*/g, '').replace(/`/g, '');
}

function renderHighlightedText(value: string) {
  const text = normalizeText(value);
  const markerPattern = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  const keywordPattern = new RegExp(`\\b(${highlightedKeywords.join('|')})\\b`, 'gi');

  return text.split(markerPattern).flatMap((part, index) => {
    if (!part) {
      return [];
    }

    const markedAsCode = part.startsWith('`') && part.endsWith('`');
    const markedAsBold = part.startsWith('**') && part.endsWith('**');

    if (markedAsCode || markedAsBold) {
      const content = markedAsCode ? part.slice(1, -1) : part.slice(2, -2);

      return (
        <Text key={`marked-${index}`} style={markedAsCode ? styles.inlineCode : styles.keywordText}>
          {content}
        </Text>
      );
    }

    return part.split(keywordPattern).map((piece, pieceIndex) => {
      const isKeyword = highlightedKeywords.some((keyword) => keyword.toLowerCase() === piece.toLowerCase());

      return isKeyword ? (
        <Text key={`keyword-${index}-${pieceIndex}`} style={styles.keywordText}>
          {piece}
        </Text>
      ) : (
        piece
      );
    });
  });
}

function buildQuiz(courseTitle: string) {
  return {
    question: `Quel est le concept principal de ce cours?`,
    choices: [
      courseTitle,
      'La configuration du profil',
      'Le changement de theme',
      'La navigation entre onglets',
    ],
    answerIndex: 0,
  };
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
  const [savedProgressDetails, setSavedProgressDetails] = useState(() =>
    subject && courseId ? getCourseProgressDetails(subject, courseId) : {
      completed: false,
      exerciseCompleted: false,
      highestSlideIndex: -1,
      progress: 0,
    }
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    setSlideIndex(initialSlide);
    setSavedProgressDetails(
      subject && courseId ? getCourseProgressDetails(subject, courseId) : {
        completed: false,
        exerciseCompleted: false,
        highestSlideIndex: -1,
        progress: 0,
      }
    );
    setSelectedAnswer(null);
  }, [courseId, initialSlide, subject]);

  // Each opened page is persisted immediately so the home/profile cards can show the same integer percentage.
  useEffect(() => {
    if (subject && courseId && course) {
      db.saveCourseProgress(
        subject,
        courseId,
        slideIndex,
        course.totalSlides,
        `${SUBJECT_LABELS[subject]} - ${course.title}`,
        savedProgressDetails.exerciseCompleted,
      );
      setSavedProgressDetails(getCourseProgressDetails(subject, courseId));
    }
  }, [course, courseId, savedProgressDetails.exerciseCompleted, slideIndex, subject]);

  if (!subject || !courseId || !course) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ThemedView lightColor={THEME.background} style={styles.emptyPage}>
          <ThemedText lightColor={THEME.ink} style={styles.emptyTitle}>
            Cours introuvable
          </ThemedText>
          <Pressable onPress={() => router.replace('/(tabs)/cours' as Href)} style={styles.backButton}>
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
  const progress = savedProgressDetails.progress;
  const isLastSlide = slideIndex === maxSlideIndex;
  const quiz = buildQuiz(course.title);
  const canGoPrevious = slideIndex > 0;
  const canGoNext = slideIndex < maxSlideIndex;
  const codeLines = slide.code ? cleanCodeText(slide.code).split('\n') : [];

  function goPrevious() {
    setSlideIndex((currentIndex) => Math.max(currentIndex - 1, 0));
  }

  function goNext() {
    setSlideIndex((currentIndex) => Math.min(currentIndex + 1, maxSlideIndex));
  }

  function goBackToCourses() {
    router.replace({
      pathname: '/(tabs)/cours',
      params: { subject },
    } as unknown as Href);
  }

  function chooseAnswer(answerIndex: number) {
    setSelectedAnswer(answerIndex);

    // The final exercise acts as the 100% gate: correct answer sets the boolean flag and awards XP in db once.
    if (answerIndex === quiz.answerIndex && subject && courseId && course) {
      db.saveCourseProgress(
        subject,
        courseId,
        maxSlideIndex,
        course.totalSlides,
        `${SUBJECT_LABELS[subject]} - ${course.title}`,
        true,
      );
      setSavedProgressDetails(getCourseProgressDetails(subject, courseId));
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView lightColor={THEME.background} style={styles.page}>
        <View style={styles.topBar}>
          <Pressable onPress={goBackToCourses} style={styles.iconButton}>
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
              {renderHighlightedText(slide.theory)}
            </ThemedText>

            {slide.code ? (
              <View style={styles.codeWindow}>
                <View style={styles.codeChrome}>
                  <View style={[styles.windowDot, { backgroundColor: '#EF4444' }]} />
                  <View style={[styles.windowDot, { backgroundColor: '#F59E0B' }]} />
                  <View style={[styles.windowDot, { backgroundColor: '#10B981' }]} />
                  <ThemedText lightColor="#8492A6" style={styles.fileName}>
                    Main.java
                  </ThemedText>
                </View>
                <View style={styles.codeBody}>
                  {codeLines.map((line, index) => (
                    <View key={`${line}-${index}`} style={styles.codeLine}>
                      <ThemedText lightColor="#526071" style={styles.lineNumber}>
                        {index + 1}
                      </ThemedText>
                      <ThemedText lightColor="#E5E7EB" style={styles.codeText}>
                        {line}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            {isLastSlide ? (
              <View style={styles.quizCard}>
                <ThemedText lightColor={THEME.muted} style={styles.quizKicker}>
                  Question rapide
                </ThemedText>
                <ThemedText lightColor={THEME.ink} style={styles.quizQuestion}>
                  {quiz.question}
                </ThemedText>
                <View style={styles.choiceList}>
                  {quiz.choices.map((choice, index) => {
                    const selected = selectedAnswer === index;
                    const correct = selected && index === quiz.answerIndex;
                    const incorrect = selected && index !== quiz.answerIndex;

                    return (
                      <Pressable
                        key={choice}
                        onPress={() => chooseAnswer(index)}
                        style={[
                          styles.choiceButton,
                          selected ? styles.choiceButtonSelected : null,
                          correct ? styles.choiceButtonCorrect : null,
                          incorrect ? styles.choiceButtonIncorrect : null,
                        ]}>
                        <ThemedText lightColor={THEME.ink} style={styles.choiceText}>
                          {choice}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
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
    backgroundColor: THEME.background,
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
    borderRadius: 14,
    borderWidth: 1,
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
    borderRadius: 10,
    borderWidth: 1,
    height: 14,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: THEME.purple,
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
    borderWidth: 1,
    gap: 18,
    padding: 22,
    shadowColor: '#000000',
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
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
  keywordText: {
    backgroundColor: '#ECEBFF',
    borderRadius: 6,
    color: THEME.purple,
    fontWeight: '900',
    paddingHorizontal: 4,
  },
  inlineCode: {
    backgroundColor: '#E8EEF6',
    borderRadius: 6,
    color: '#0F172A',
    fontFamily: 'monospace',
    fontWeight: '900',
    paddingHorizontal: 4,
  },
  codeWindow: {
    backgroundColor: '#0B1020',
    borderRadius: 10,
    overflow: 'hidden',
  },
  codeChrome: {
    alignItems: 'center',
    backgroundColor: '#172033',
    flexDirection: 'row',
    gap: 8,
    minHeight: 38,
    paddingHorizontal: 14,
  },
  windowDot: {
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  fileName: {
    color: '#8492A6',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 8,
  },
  codeBody: {
    gap: 6,
    padding: 18,
  },
  codeLine: {
    flexDirection: 'row',
    gap: 14,
  },
  lineNumber: {
    color: '#526071',
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 22,
    minWidth: 22,
    textAlign: 'right',
  },
  codeText: {
    color: '#E5E7EB',
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 22,
  },
  quizCard: {
    backgroundColor: '#F8FAFC',
    borderColor: THEME.border,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  quizKicker: {
    color: THEME.muted,
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  quizQuestion: {
    color: THEME.ink,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
  },
  choiceList: {
    gap: 8,
  },
  choiceButton: {
    backgroundColor: THEME.panel,
    borderColor: THEME.border,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  choiceButtonSelected: {
    borderColor: THEME.purple,
  },
  choiceButtonCorrect: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
  },
  choiceButtonIncorrect: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
  },
  choiceText: {
    color: THEME.ink,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 19,
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
    borderRadius: 14,
    borderWidth: 1,
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
