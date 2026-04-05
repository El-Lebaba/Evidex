import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const palette = {
  cream: '#F5F1E6',
  sage: '#B8C7B1',
  sageDeep: '#97A886',
  copper: '#BC8559',
  charcoal: '#19191F',
  slate: '#536165',
  white: '#FFFFFF',
};

const steps = [
  'Definir le parcours utilisateur principal',
  'Structurer les ecrans et les actions',
  'Ajouter les vraies donnees et les interactions',
];

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.kicker}>Suite</Text>
        <Text style={styles.title}>Base de travail prete pour la suite.</Text>
        <Text style={styles.description}>
          Cet espace peut accueillir votre presentation produit, une connexion ou un tableau de
          bord selon la direction que vous voulez prendre.
        </Text>

        <View style={styles.card}>
          {steps.map((step, index) => (
            <View key={step} style={styles.stepRow}>
              <View style={styles.indexWrap}>
                <Text style={styles.index}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.cream,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
  kicker: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: palette.sage,
    color: palette.charcoal,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: 16,
  },
  title: {
    color: palette.charcoal,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    marginBottom: 12,
  },
  description: {
    color: palette.slate,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  card: {
    borderRadius: 28,
    padding: 20,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: 'rgba(151, 168, 134, 0.18)',
    gap: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  indexWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.copper,
  },
  index: {
    color: palette.white,
    fontSize: 15,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    color: palette.sageDeep,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
});
