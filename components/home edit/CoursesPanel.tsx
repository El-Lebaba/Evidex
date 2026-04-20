import { useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  GestureResponderEvent,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { db } from '@/db/mainData';

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

const webSliderStyle =
  Platform.OS === 'web'
    ? ({
        cursor: 'ew-resize',
        touchAction: 'none',
        userSelect: 'none',
      } as any)
    : undefined;

export type Course = {
  id: number;
  name: string;
  progress: number;
  completed: boolean;
};

type CoursesPanelProps = {
  courses: Course[];
  darkMode?: boolean;
  onCourseUpdate: () => void;
};

export default function CoursesPanel({
  courses,
  darkMode = false,
  onCourseUpdate,
}: CoursesPanelProps) {
  const theme = darkMode ? darkColors : colors;
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');

  const activeCourses = courses.filter((course) => !course.completed);
  const completedCourses = courses.filter((course) => course.completed);

  function addCourse() {
    if (!newName.trim()) {
      return;
    }

    db.addCourse(newName.trim());
    setNewName('');
    setShowAdd(false);
    onCourseUpdate();
  }

  function saveProgress(course: Course, nextProgress: number) {
    db.updateCourse(course.id, {
      progress: nextProgress,
      completed: nextProgress >= 100,
    });
    onCourseUpdate();
  }

  function deleteCourse(id: number) {
    db.deleteCourse(id);
    onCourseUpdate();
  }

  return (
    <View style={styles.container}>
      {/* Header and add button */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Cours recents</Text>
        <Pressable
          onPress={() => setShowAdd(!showAdd)}
          style={[styles.addButton, { backgroundColor: theme.green }]}
        >
          <MaterialIcons name="add" size={17} color="white" />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </Pressable>
      </View>

      {/* Small form for adding a course */}
      {showAdd && (
        <View style={styles.addBox}>
          <TextInput
            autoFocus
            placeholder="Nom du cours"
            placeholderTextColor={theme.muted}
            value={newName}
            onChangeText={setNewName}
            onSubmitEditing={addCourse}
            style={[
              styles.input,
              {
                backgroundColor: theme.panel,
                borderColor: `${theme.border}30`,
                color: theme.text,
              },
            ]}
          />
          <Pressable onPress={addCourse} style={[styles.okButton, { backgroundColor: theme.green }]}>
            <Text style={styles.okText}>OK</Text>
          </Pressable>
        </View>
      )}

      {/* Active courses */}
      <View style={styles.list}>
        {activeCourses.length === 0 ? (
          <View style={styles.emptyBox}>
            <MaterialIcons name="menu-book" size={34} color={theme.muted} />
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              Tous les cours sont termines.
            </Text>
          </View>
        ) : (
          activeCourses.map((course) => (
            <View
              key={course.id}
              style={[
                styles.courseCard,
                {
                  backgroundColor: theme.panel,
                  borderColor: `${theme.border}25`,
                },
              ]}
            >
              <View style={styles.courseTop}>
                <Text style={[styles.courseName, { color: theme.text }]}>{course.name}</Text>
                <Pressable onPress={() => deleteCourse(course.id)}>
                  <MaterialIcons name="delete-outline" size={20} color={theme.red} />
                </Pressable>
              </View>

              <ProgressSlider
                label="Progression"
                theme={theme}
                value={course.progress}
                onChange={(nextProgress) => saveProgress(course, nextProgress)}
              />
            </View>
          ))
        )}
      </View>

      {/* Completed courses stay visible but less important */}
      {completedCourses.length > 0 && (
        <View style={styles.completedBox}>
          <Text style={[styles.completedTitle, { color: theme.muted }]}>
            Termines ({completedCourses.length})
          </Text>

          {completedCourses.map((course) => (
            <View
              key={course.id}
              style={[
                styles.completedCourse,
                {
                  backgroundColor: theme.background,
                  borderColor: `${theme.green}70`,
                },
              ]}
            >
              <MaterialIcons name="check-circle" size={18} color={theme.green} />
              <Text style={[styles.completedText, { color: theme.muted }]}>{course.name}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

type ProgressSliderProps = {
  label: string;
  theme: typeof colors;
  value: number;
  onChange: (value: number) => void;
};

function ProgressSlider({ label, theme, value, onChange }: ProgressSliderProps) {
  const [typedValue, setTypedValue] = useState(String(value));

  function commitTypedValue() {
    const nextValue = Number(typedValue.replace('%', '').trim());

    if (!Number.isFinite(nextValue)) {
      setTypedValue(String(value));
      return;
    }

    const clampedValue = clamp(Math.round(nextValue), 0, 100);
    onChange(clampedValue);
    setTypedValue(String(clampedValue));
  }

  function setFromEvent(event: GestureResponderEvent) {
    event.currentTarget.measure((_x, _y, measuredWidth, _height, pageX) => {
      const position = clamp(event.nativeEvent.pageX - pageX, 0, measuredWidth);
      const nextValue = Math.round((position / measuredWidth) * 100);
      onChange(nextValue);
      setTypedValue(String(nextValue));
    });
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: setFromEvent,
    onPanResponderMove: setFromEvent,
    onPanResponderTerminationRequest: () => false,
    onShouldBlockNativeResponder: () => true,
  });

  return (
    <View style={styles.sliderBlock}>
      <View style={styles.sliderHeader}>
        <Text style={[styles.sliderLabel, { color: theme.muted }]}>{label}</Text>
        <TextInput
          inputMode="numeric"
          keyboardType="numeric"
          onBlur={commitTypedValue}
          onChangeText={setTypedValue}
          onSubmitEditing={commitTypedValue}
          selectTextOnFocus
          style={[styles.sliderValueInput, { color: theme.text }]}
          value={typedValue}
        />
      </View>

      <View
        {...panResponder.panHandlers}
        style={[
          styles.sliderTrack,
          {
            backgroundColor: theme.background,
            borderColor: theme.border,
          },
          webSliderStyle,
        ]}
      >
        <View
          style={[
            styles.sliderFill,
            { backgroundColor: theme.grid, width: `${value}%` },
          ]}
        />
        <View
          style={[
            styles.sliderThumb,
            {
              backgroundColor: theme.text,
              borderColor: theme.panel,
              left: `${value}%`,
            },
            webSliderStyle,
          ]}
        />
      </View>

      <View style={styles.stepperRow}>
        <Pressable
          onPress={() => {
            const nextValue = clamp(value - 10, 0, 100);
            onChange(nextValue);
            setTypedValue(String(nextValue));
          }}
          style={[
            styles.stepButton,
            { backgroundColor: theme.background, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.stepText, { color: theme.text }]}>-10</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            const nextValue = clamp(value + 10, 0, 100);
            onChange(nextValue);
            setTypedValue(String(nextValue));
          }}
          style={[
            styles.stepButton,
            { backgroundColor: theme.background, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.stepText, { color: theme.text }]}>+10</Text>
        </Pressable>
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
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
  },
  addBox: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    backgroundColor: colors.panel,
    borderColor: '#243B5330',
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  okButton: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  okText: {
    color: 'white',
    fontWeight: '900',
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
  },
  courseCard: {
    backgroundColor: colors.panel,
    borderColor: '#243B5325',
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
    padding: 12,
  },
  courseTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  courseName: {
    color: colors.text,
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  sliderBlock: {
    gap: 13,
  },
  sliderHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  sliderValueInput: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    minWidth: 48,
    padding: 0,
    textAlign: 'right',
  },
  sliderTrack: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1.5,
    height: 30,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sliderFill: {
    backgroundColor: colors.grid,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
  },
  sliderThumb: {
    backgroundColor: colors.text,
    borderColor: colors.panel,
    borderRadius: 9,
    borderWidth: 2,
    height: 18,
    marginLeft: -9,
    position: 'absolute',
    width: 18,
  },
  stepperRow: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  stepButton: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1.5,
    height: 34,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  stepText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  completedBox: {
    gap: 7,
    paddingTop: 4,
  },
  completedTitle: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  completedCourse: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: '#7CCFBF70',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 10,
  },
  completedText: {
    color: colors.muted,
    flex: 1,
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
});
