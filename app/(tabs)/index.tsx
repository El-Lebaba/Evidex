import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const palette = {
  cream: '#F5F1E6',
  creamDeep: '#E8E0C9',
  sage: '#B8C7B1',
  sageDeep: '#8FA37E',
  copper: '#BC8559',
  copperSoft: '#D9B796',
  charcoal: '#19191F',
  slate: '#536165',
  white: '#FFFFFF',
};

const missions = [
  {
    badge: '01',
    title: 'Rassembler',
    text: 'Vos idees, notes et dossiers se retrouvent dans un seul espace net.',
    tone: 'sage',
  },
  {
    badge: '02',
    title: 'Organiser',
    text: 'Chaque point important garde sa place, sans friction et sans bruit.',
    tone: 'cream',
  },
  {
    badge: '03',
    title: 'Avancer',
    text: 'L equipe sait quoi faire, ou cliquer et quoi retenir en quelques secondes.',
    tone: 'copper',
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.topRow}>
            <View style={styles.logoBadge}>
              <Image
                source={require('@/assets/images/evidexe-logo.png')}
                contentFit="contain"
                style={styles.logo}
              />
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>Pret a lancer</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Une page d&apos;accueil plus forte, plus claire, plus mobile.</Text>
          <Text style={styles.heroSubtitle}>
            Evidex met votre marque au premier plan et transforme l entree dans l application en
            experience immediate, lisible et memorisable.
          </Text>

          <View style={styles.progressCard}>
            <Text style={styles.progressLabel}>Identite visuelle</Text>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
            <View style={styles.progressFooter}>
              <Text style={styles.progressValue}>Theme Evidex</Text>
              <Text style={styles.progressPercent}>100%</Text>
            </View>
          </View>

          <Link href="/(tabs)/explore" style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Commencer l&apos;exploration</Text>
          </Link>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>Logo</Text>
              <Text style={styles.statLabel}>visible des l&apos;ouverture</Text>
            </View>
            <View style={[styles.statCard, styles.statCardAccent]}>
              <Text style={styles.statValue}>Mobile</Text>
              <Text style={styles.statLabel}>structure plus dynamique</Text>
            </View>
          </View>
        </View>

        <View style={styles.showcaseCard}>
          <View style={styles.showcaseHeader}>
            <Text style={styles.sectionKicker}>Apercu</Text>
            <Text style={styles.sectionTitle}>Une interface qui va droit au but.</Text>
          </View>
          <View style={styles.showcasePanel}>
            <View style={styles.showcaseOrb} />
            <View style={styles.showcaseStack}>
              <View style={[styles.showcaseTile, styles.showcaseTileLarge]}>
                <Text style={styles.showcaseTileTitle}>Identite forte</Text>
                <Text style={styles.showcaseTileText}>Le logo et le message restent visibles des la premiere seconde.</Text>
              </View>
              <View style={styles.showcaseRow}>
                <View style={[styles.showcaseTile, styles.showcaseTileSage]}>
                  <Text style={styles.showcaseMiniLabel}>Calme</Text>
                </View>
                <View style={[styles.showcaseTile, styles.showcaseTileCopper]}>
                  <Text style={styles.showcaseMiniLabel}>Impact</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.missionsBlock}>
          <Text style={styles.sectionKicker}>Parcours</Text>
          <Text style={styles.sectionTitle}>Trois actions, une sensation de progression.</Text>

          {missions.map((mission) => (
            <View
              key={mission.badge}
              style={[
                styles.missionCard,
                mission.tone === 'sage' && styles.missionCardSage,
                mission.tone === 'cream' && styles.missionCardCream,
                mission.tone === 'copper' && styles.missionCardCopper,
              ]}>
              <View style={styles.missionBadge}>
                <Text style={styles.missionBadgeText}>{mission.badge}</Text>
              </View>
              <View style={styles.missionCopy}>
                <Text style={styles.missionTitle}>{mission.title}</Text>
                <Text style={styles.missionText}>{mission.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.cream,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 36,
    gap: 18,
  },
  heroCard: {
    borderRadius: 34,
    padding: 20,
    backgroundColor: palette.sage,
    borderWidth: 1,
    borderColor: 'rgba(25,25,31,0.08)',
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  logoBadge: {
    flex: 1,
    minHeight: 92,
    borderRadius: 26,
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: palette.white,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  logo: {
    width: '100%',
    height: 58,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: palette.charcoal,
  },
  statusPillText: {
    color: palette.white,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: palette.charcoal,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: palette.slate,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 330,
  },
  progressCard: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.68)',
    gap: 10,
  },
  progressLabel: {
    color: palette.sageDeep,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  progressTrack: {
    height: 16,
    borderRadius: 999,
    backgroundColor: 'rgba(25,25,31,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: palette.copper,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressValue: {
    color: palette.charcoal,
    fontSize: 15,
    fontWeight: '700',
  },
  progressPercent: {
    color: palette.copper,
    fontSize: 18,
    fontWeight: '800',
  },
  primaryButton: {
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: palette.charcoal,
  },
  primaryButtonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 16,
    backgroundColor: palette.white,
  },
  statCardAccent: {
    backgroundColor: palette.creamDeep,
  },
  statValue: {
    color: palette.charcoal,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: palette.slate,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  showcaseCard: {
    borderRadius: 30,
    padding: 16,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: 'rgba(25,25,31,0.06)',
    gap: 14,
  },
  showcaseHeader: {
    gap: 6,
  },
  sectionKicker: {
    color: palette.copper,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  sectionTitle: {
    color: palette.charcoal,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
  },
  showcasePanel: {
    overflow: 'hidden',
    borderRadius: 24,
    padding: 16,
    backgroundColor: palette.creamDeep,
    minHeight: 220,
  },
  showcaseOrb: {
    position: 'absolute',
    top: -32,
    right: -22,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(184, 199, 177, 0.75)',
  },
  showcaseStack: {
    gap: 12,
  },
  showcaseRow: {
    flexDirection: 'row',
    gap: 12,
  },
  showcaseTile: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: palette.white,
  },
  showcaseTileLarge: {
    minHeight: 118,
    justifyContent: 'flex-end',
  },
  showcaseTileSage: {
    flex: 1,
    backgroundColor: palette.sage,
    minHeight: 72,
    justifyContent: 'center',
  },
  showcaseTileCopper: {
    flex: 1,
    backgroundColor: palette.copperSoft,
    minHeight: 72,
    justifyContent: 'center',
  },
  showcaseTileTitle: {
    color: palette.charcoal,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    marginBottom: 8,
  },
  showcaseTileText: {
    color: palette.slate,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  showcaseMiniLabel: {
    color: palette.charcoal,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  missionsBlock: {
    gap: 12,
  },
  missionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 28,
    padding: 16,
  },
  missionCardSage: {
    backgroundColor: palette.sage,
  },
  missionCardCream: {
    backgroundColor: palette.creamDeep,
  },
  missionCardCopper: {
    backgroundColor: palette.copperSoft,
  },
  missionBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.charcoal,
  },
  missionBadgeText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: '800',
  },
  missionCopy: {
    flex: 1,
    gap: 4,
  },
  missionTitle: {
    color: palette.charcoal,
    fontSize: 19,
    fontWeight: '800',
  },
  missionText: {
    color: palette.slate,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
});
