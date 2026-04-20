import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { db } from '@/db/mainData';

const colors = {
  background: '#E9ECE4',
  panel: '#DDE4D5',
  border: '#243B53',
  text: '#243B53',
  muted: '#6E7F73',
  blue: '#7EA6E0',
  yellow: '#D8A94A',
  grid: '#B7C7B0',
  hero: '#243B53',
};

const darkColors = {
  background: '#151C22',
  panel: '#2A3741',
  border: '#9DB2C0',
  text: '#F3F1E7',
  muted: '#B7C7B0',
  blue: '#8FB7EE',
  yellow: '#E0B95A',
  grid: '#6E7F73',
  hero: '#10161B',
};

export type UserInfo = {
  xp: number;
  level: number;
};

type Achievement = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

type XPPanelProps = {
  darkMode?: boolean;
  user: UserInfo;
  onUserUpdate: (user?: UserInfo) => void;
};

const xpPerLevel = 100;

export default function XPPanel({ darkMode = false, user, onUserUpdate }: XPPanelProps) {
  const theme = darkMode ? darkColors : colors;
  const achievements: Achievement[] = db.getAchievements();
  const completedAchievements = achievements.filter((item) => item.completed);
  const xpInLevel = user.xp % xpPerLevel;
  const progress = `${xpInLevel}%` as `${number}%`;

  function addXP(amount: number) {
    const updatedUser = db.addXP(amount);
    onUserUpdate(updatedUser);
  }

  function openAchievements() {
    router.push('/achievements' as never);
  }

  return (
    <View style={styles.container}>
      {/* Main XP title */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>XP et niveau</Text>
        <MaterialIcons name="bolt" size={21} color={theme.yellow} />
      </View>

      {/* Big level card */}
      <View style={[styles.levelCard, { backgroundColor: theme.hero }]}>
        <Text style={styles.levelLabel}>Niveau actuel</Text>
        <View style={styles.levelRow}>
          <Text style={styles.levelNumber}>{user.level}</Text>
          <MaterialIcons name="star" size={28} color={theme.yellow} />
        </View>
        <Text style={styles.totalXp}>{user.xp} XP total</Text>
      </View>

      {/* Progress toward the next level */}
      <View style={styles.progressBlock}>
        <View style={styles.progressTop}>
          <Text style={[styles.smallText, { color: theme.muted }]}>Progression niveau {user.level + 1}</Text>
          <Text style={[styles.smallText, { color: theme.muted }]}>
            {xpInLevel}/{xpPerLevel} XP
          </Text>
        </View>

        <View
          style={[
            styles.sliderTrack,
            { backgroundColor: theme.panel, borderColor: theme.border },
          ]}
        >
          <View style={[styles.sliderFill, { backgroundColor: theme.grid, width: progress }]} />
          <View
            style={[
              styles.sliderThumb,
              {
                backgroundColor: theme.text,
                borderColor: theme.panel,
                left: progress,
              },
            ]}
          />
        </View>

        <Text style={[styles.remainingText, { color: theme.muted }]}>
          encore {xpPerLevel - xpInLevel} XP pour le niveau {user.level + 1}
        </Text>
      </View>

      {/* Buttons used during tests/presentations to simulate progress */}
      <View style={styles.xpButtons}>
        {[10, 25, 50].map((amount) => (
          <Pressable
            key={amount}
            onPress={() => addXP(amount)}
            style={[styles.xpButton, { borderColor: `${theme.yellow}80` }]}
          >
            <Text style={[styles.xpButtonText, { color: theme.yellow }]}>+{amount} XP</Text>
          </Pressable>
        ))}
      </View>

      {/* Achievement preview */}
      <View style={styles.achievements}>
        <View style={styles.achievementHeader}>
          <Text style={[styles.sectionTitle, { color: theme.muted }]}>Achievements</Text>
          <Text style={[styles.smallText, { color: theme.muted }]}>
            {completedAchievements.length}/{achievements.length}
          </Text>
        </View>

        {achievements.slice(0, 4).map((achievement) => (
          <View
            key={achievement.id}
            style={[
              styles.achievementRow,
              {
                backgroundColor: theme.panel,
                borderColor: `${theme.border}20`,
              },
              achievement.completed && styles.achievementDone,
              achievement.completed && {
                backgroundColor: `${theme.yellow}22`,
                borderColor: `${theme.yellow}70`,
              },
            ]}
          >
            <MaterialIcons
              name="emoji-events"
              size={18}
              color={achievement.completed ? theme.yellow : theme.muted}
            />
            <Text
              style={[
                styles.achievementText,
                { color: theme.muted },
                achievement.completed && styles.achievementTextDone,
                achievement.completed && { color: theme.text },
              ]}
            >
              {achievement.title}
            </Text>
            {achievement.completed && (
              <MaterialIcons name="check" size={18} color={theme.yellow} />
            )}
          </View>
        ))}

        <Pressable
          onPress={openAchievements}
          style={[
            styles.moreButton,
            {
              backgroundColor: `${theme.blue}22`,
              borderColor: `${theme.blue}70`,
            },
          ]}
        >
          <MaterialIcons name="trending-up" size={18} color={theme.blue} />
          <Text style={[styles.moreText, { color: theme.blue }]}>Voir tous les achievements</Text>
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
  levelCard: {
    backgroundColor: colors.text,
    borderRadius: 10,
    padding: 18,
  },
  levelLabel: {
    color: '#FFFFFFAA',
    fontSize: 12,
    fontWeight: '700',
  },
  levelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  levelNumber: {
    color: 'white',
    fontSize: 42,
    fontWeight: '900',
  },
  totalXp: {
    color: '#FFFFFFAA',
    fontSize: 12,
  },
  progressBlock: {
    gap: 7,
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  sliderTrack: {
    backgroundColor: colors.panel,
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
  remainingText: {
    color: colors.muted,
    fontSize: 11,
    textAlign: 'right',
  },
  xpButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  xpButton: {
    alignItems: 'center',
    borderColor: '#D8A94A80',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 8,
  },
  xpButtonText: {
    color: colors.yellow,
    fontSize: 12,
    fontWeight: '900',
  },
  achievements: {
    gap: 8,
  },
  achievementHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  achievementRow: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderColor: '#243B5320',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    opacity: 0.65,
    padding: 10,
  },
  achievementDone: {
    backgroundColor: '#D8A94A22',
    borderColor: '#D8A94A70',
    opacity: 1,
  },
  achievementText: {
    color: colors.muted,
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
  },
  achievementTextDone: {
    color: colors.text,
  },
  moreButton: {
    alignItems: 'center',
    backgroundColor: '#7EA6E022',
    borderColor: '#7EA6E070',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    padding: 11,
  },
  moreText: {
    color: colors.blue,
    fontSize: 12,
    fontWeight: '900',
  },
});
