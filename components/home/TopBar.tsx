import React, { useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const lightColors = {
  background: '#F3F1E7',
  panel: '#DDE4D5',
  border: '#243B53',
  text: '#243B53',
  muted: '#6E7F73',
  green: '#7CCFBF',
  blue: '#7EA6E0',
  yellow: '#D8A94A',
};

const darkColors = {
  background: '#1F2A32',
  panel: '#2A3741',
  border: '#9DB2C0',
  text: '#F3F1E7',
  muted: '#B7C7B0',
  green: '#7CCFBF',
  blue: '#8FB7EE',
  yellow: '#E0B95A',
};

const colors = lightColors;

type UserInfo = {
  xp?: number;
  level?: number;
};

type TopBarProps = {
  darkMode?: boolean;
  onSettingsClick: () => void;
  user?: UserInfo;
};
7
export default function TopBar({ darkMode = false, onSettingsClick, user }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const colors = darkMode ? darkColors : lightColors;

  function openSettings() {
    setMenuOpen(false);
    onSettingsClick();
  }

  function goToAchievements() {
    setMenuOpen(false);
    router.push('/achievements' as never);
  }

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.background,
          borderBottomColor: `${colors.border}40`,
        },
      ]}
    >
      <View style={styles.content}>
        <Pressable onPress={openSettings} style={styles.iconButton}>
          <MaterialIcons name="settings" size={23} color={colors.muted} />
        </Pressable>

        <View style={styles.nav}>
          <Link href="/(tabs)/math" asChild>
            <Pressable style={styles.navButton}>
              <MaterialIcons name="bolt" size={18} color={colors.yellow} />
              <Text style={[styles.navText, { color: colors.muted }]}>Simulation</Text>
            </Pressable>
          </Link>

          <Link href="/(tabs)/home" asChild>
            <Pressable style={styles.logoButton}>
              <Image
                resizeMode="contain"
                source={require('@/assets/images/evidexe-logo.png')}
                style={styles.logoImage}
              />
            </Pressable>
          </Link>

          <Link href="/(tabs)/math" asChild>
            <Pressable style={styles.navButton}>
              <MaterialIcons name="menu-book" size={18} color={colors.green} />
              <Text style={[styles.navText, { color: colors.muted }]}>Cours</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.profileArea}>
          <Pressable
            onPress={() => setMenuOpen(!menuOpen)}
            style={styles.profileButton}
          >
            <View style={[styles.avatar, { backgroundColor: colors.blue }]}>
              <MaterialIcons name="person" size={20} color="white" />
            </View>
            <MaterialIcons
              name={menuOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={18}
              color={colors.muted}
            />
          </Pressable>

          {menuOpen && (
            <View
              style={[
                styles.menu,
                {
                  backgroundColor: colors.background,
                  borderColor: `${colors.border}40`,
                },
              ]}
            >
              <Text style={[styles.smallText, { color: colors.muted }]}>Connecte en tant que</Text>
              <Text style={[styles.name, { color: colors.text }]}>User</Text>
              <Text style={[styles.level, { color: colors.blue }]}>
                Niveau {user?.level ?? 1} - {user?.xp ?? 0} XP
              </Text>

              <View style={[styles.line, { backgroundColor: `${colors.border}20` }]} />

              <Pressable onPress={openSettings} style={styles.menuItem}>
                <MaterialIcons name="settings" size={18} color={colors.text} />
                <Text style={[styles.menuText, { color: colors.text }]}>Parametres</Text>
              </Pressable>

              <Pressable onPress={goToAchievements} style={styles.menuItem}>
                <MaterialIcons name="emoji-events" size={18} color={colors.text} />
                <Text style={[styles.menuText, { color: colors.text }]}>Achievements</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.background,
    borderBottomColor: '#243B5340',
    borderBottomWidth: 1,
    elevation: 2,
    zIndex: 10,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    minHeight: 100,
    paddingHorizontal: 16,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  nav: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    flexShrink: 1,
  },
  navButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  navText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  logo: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  logoAccent: {
    color: colors.blue,
  },
  logoButton: {
    alignItems: 'center',
    height: 66,
    justifyContent: 'center',
    maxWidth: 190,
    width: 190,
  },
  logoImage: {
    height: 60,
    width: '100%',
  },
  profileArea: {
    position: 'relative',
  },
  profileButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.blue,
    borderRadius: 20,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  menu: {
    backgroundColor: colors.background,
    borderColor: '#243B5340',
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    position: 'absolute',
    right: 0,
    top: 50,
    width: 210,
    zIndex: 20,
  },
  smallText: {
    color: colors.muted,
    fontSize: 12,
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  level: {
    color: colors.blue,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  line: {
    backgroundColor: '#243B5320',
    height: 1,
    marginVertical: 10,
  },
  menuItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
  },
  menuText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
