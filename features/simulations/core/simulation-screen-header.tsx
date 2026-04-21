import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type SimulationScreenHeaderProps = {
  title: string;
  type: string;
};

export const SIMULATION_HEADER_TOP_SHADE_HEIGHT = 58;
export const SIMULATION_HEADER_BAR_HEIGHT = 74;
export const SIMULATION_HEADER_TOTAL_HEIGHT =
  SIMULATION_HEADER_TOP_SHADE_HEIGHT + SIMULATION_HEADER_BAR_HEIGHT;
export const SIMULATION_HEADER_CONTENT_GAP = 44;

export function SimulationScreenHeader({ title, type }: SimulationScreenHeaderProps) {
  return (
    <View style={styles.headerShell}>
      <View style={styles.topShade} />
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.leftGroup}>
          <Pressable onPress={() => router.push(
              type === 'math' ? '/(tabs)/math' : type === 'physics' ? '/(tabs)/physics' :'/(tabs)/java-programming'
          )} style={styles.backButton}>
            <MaterialCommunityIcons color="#243B53" name="arrow-left" size={20} />
          </Pressable>
          <View style={styles.titleGroup}>
            <Pressable onPress={() => router.push('/(tabs)/home')} style={styles.logoButton}>
              <Image
                contentFit="contain"
                source={require('@/assets/images/evidexe-logo.png')}
                style={styles.logo}
              />
            </Pressable>
            <ThemedText darkColor="#243B53" lightColor="#243B53" style={styles.title}>
              {title}
            </ThemedText>
          </View>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/profile')} style={styles.profileButton}>
            <MaterialCommunityIcons color="#243B53" name="account-circle-outline" size={20} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerShell: {
    width: '100%',
  },
  topShade: {
    backgroundColor: '#DDD7C8',
    borderBottomColor: '#243B53',
    borderBottomWidth: 1.5,
    minHeight: SIMULATION_HEADER_TOP_SHADE_HEIGHT,
    width: '100%',
  },
  header: {
    alignItems: 'flex-start',
    backgroundColor: '#EAE3D2',
    borderBottomColor: '#243B53',
    borderBottomWidth: 1.5,
    justifyContent: 'flex-start',
    minHeight: SIMULATION_HEADER_BAR_HEIGHT,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  leftGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'flex-start',
  },
  titleGroup: {
    alignItems: 'flex-start',
    gap: 8,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: '#F5F1E6',
    borderColor: '#243B53',
    borderRadius: 10,
    borderWidth: 1.5,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  profileButton: {
    alignItems: 'center',
    backgroundColor: '#F5F1E6',
    borderColor: '#243B53',
    borderRadius: 10,
    borderWidth: 1.5,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  logo: {
    height: 44,
    width: 120,
  },
  logoButton: {
    alignSelf: 'flex-start',
  },
});
