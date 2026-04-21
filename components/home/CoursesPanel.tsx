import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Href, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CourseSubject } from '@/data/courses';

const colors = {
  background: '#E9ECE4',
  panel: '#DDE4D5',
  border: '#243B53',
  text: '#243B53',
  muted: '#6E7F73',
  green: '#7CCFBF',
  red: '#D97B6C',
  grid: '#B7C7B0',
};

const darkColors = {
  background: '#151C22',
  panel: '#2A3741',
  border: '#9DB2C0',
  text: '#F3F1E7',
  muted: '#B7C7B0',
  green: '#7CCFBF',
  red: '#E08A7B',
  grid: '#6E7F73',
};

export type Course = {
  id: number | string;
  name: string;
  progress: number;
  completed: boolean;
  subject?: CourseSubject;
  courseId?: string;
  totalSlides?: number;
};

type CoursesPanelProps = {
  courses: Course[];
  darkMode?: boolean;
  onCourseUpdate?: () => void;
};

export default function CoursesPanel({
  courses,
  darkMode = false,
}: CoursesPanelProps) {
  const theme = darkMode ? darkColors : colors;
  const activeCourses = courses.filter((course) => course.progress > 0 && course.subject && course.courseId);

  function openCourse(course: Course) {
    if (!course.subject || !course.courseId) {
      return;
    }

    router.push({
      pathname: '/(tabs)/cours/[subject]/[courseId]',
      params: { courseId: course.courseId, subject: course.subject },
    } as unknown as Href);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Cours actifs</Text>
        <View style={[styles.syncBadge, { borderColor: `${theme.border}30` }]}>
          <MaterialIcons name="lock-outline" size={17} color={theme.muted} />
          <Text style={[styles.syncBadgeText, { color: theme.muted }]}>Lecture</Text>
        </View>
      </View>

      <View style={styles.list}>
        {activeCourses.length === 0 ? (
          <View style={styles.emptyBox}>
            <MaterialIcons name="menu-book" size={34} color={theme.muted} />
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              Commence un cours pour le voir ici.
            </Text>
          </View>
        ) : (
          activeCourses.map((course) => (
            <Pressable
              key={course.id}
              onPress={() => openCourse(course)}
              style={({ pressed }) => [
                styles.courseCard,
                {
                  backgroundColor: theme.panel,
                  borderColor: `${theme.border}25`,
                },
                pressed ? styles.pressed : null,
              ]}>
              <View style={styles.courseTop}>
                <View style={styles.courseMeta}>
                  <Text style={[styles.courseName, { color: theme.text }]}>{course.name}</Text>
                  <Text style={[styles.courseSubject, { color: theme.muted }]}>
                    {course.progress}% termine
                  </Text>
                </View>
                <View style={[styles.openButton, { backgroundColor: theme.background }]}>
                  <MaterialIcons name="chevron-right" size={22} color={theme.text} />
                </View>
              </View>

              <View
                style={[
                  styles.progressTrack,
                  {
                    backgroundColor: theme.background,
                    borderColor: `${theme.border}30`,
                  },
                ]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: theme.green,
                      width: `${course.progress}%`,
                    },
                  ]}
                />
              </View>
            </Pressable>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 14,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  syncBadge: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  syncBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  list: {
    gap: 10,
  },
  emptyBox: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 36,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 13,
    textAlign: 'center',
  },
  courseCard: {
    backgroundColor: colors.panel,
    borderColor: '#243B5325',
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
    padding: 12,
  },
  pressed: {
    opacity: 0.84,
    transform: [{ translateY: 1 }],
  },
  courseTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  courseMeta: {
    flex: 1,
    gap: 3,
  },
  courseName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  courseSubject: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
  },
  openButton: {
    alignItems: 'center',
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  progressTrack: {
    borderRadius: 999,
    borderWidth: 1,
    height: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});
