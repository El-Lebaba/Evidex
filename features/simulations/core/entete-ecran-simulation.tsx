import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Href, router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { TexteTheme } from '@/components/texte-theme';

type ProprietesEnteteEcranSimulation = {
  title: string;
  type: string;
};

export const HAUTEUR_OMBRE_HAUT_ENTETE_SIMULATION = 58;
export const HAUTEUR_BARRE_ENTETE_SIMULATION = 74;
export const HAUTEUR_TOTALE_ENTETE_SIMULATION =
  HAUTEUR_OMBRE_HAUT_ENTETE_SIMULATION + HAUTEUR_BARRE_ENTETE_SIMULATION;
export const ESPACE_CONTENU_ENTETE_SIMULATION = 44;

function obtenirHrefSection(type: string): Href {
  return (type === 'mathematiques'
    ? '/(tabs)/mathematiques'
    : type === 'physique'
      ? '/(tabs)/physique'
      : '/(tabs)/programmation-java') as Href;
}

export function EnteteEcranSimulation({ title, type }: ProprietesEnteteEcranSimulation) {
  const closeSimulation = () => {
    router.replace(obtenirHrefSection(type));
  };

  return (
    <View style={styles.headerShell}>
      <View style={styles.topShade} />
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.leftGroup}>
          <Pressable onPress={closeSimulation} style={styles.backButton}>
            <MaterialCommunityIcons color="#243B53" name="arrow-left" size={20} />
          </Pressable>
          <View style={styles.titleGroup}>
            <Pressable onPress={() => router.replace('/(tabs)/accueil' as Href)} style={styles.logoButton}>
              <Image
                contentFit="contain"
                source={require('@/assets/images/evidexe-logo.png')}
                style={styles.logo}
              />
            </Pressable>
            <TexteTheme darkColor="#243B53" lightColor="#243B53" style={styles.title}>
              {title}
            </TexteTheme>
          </View>
          </View>
          <Pressable onPress={() => router.replace('/(tabs)/profil' as Href)} style={styles.profileButton}>
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
    minHeight: HAUTEUR_OMBRE_HAUT_ENTETE_SIMULATION,
    width: '100%',
  },
  header: {
    alignItems: 'flex-start',
    backgroundColor: '#EAE3D2',
    borderBottomColor: '#243B53',
    borderBottomWidth: 1.5,
    justifyContent: 'flex-start',
    minHeight: HAUTEUR_BARRE_ENTETE_SIMULATION,
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

