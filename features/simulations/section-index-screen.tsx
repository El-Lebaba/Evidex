import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, Link } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FloatingMathSymbols } from '@/features/simulations/core/floating-math-symbols';
import {
  SIMULATION_CATALOG,
  SimulationEntry,
  SimulationSection,
} from '@/features/simulations/simulation-catalog';

type SectionIndexScreenProps = {
  section: SimulationSection;
  title: string;
};

type MathFilter = 'all' | 'ready' | 'soon' | 'calcul' | 'analyse' | 'algebre';

const MATH_THEME = {
  background: '#EEF5ED',
  card: '#F3F1E7',
  cardAlt: '#E3E5D2',
  cardSoft: '#DDE4D5',
  chip: 'rgba(168, 181, 154, 0.34)',
  chipActive: 'rgba(168, 181, 154, 0.72)',
  coral: '#AAB18E',
  coralSoft: 'rgba(217, 123, 108, 0.24)',
  gold: '#8D9771',
  mint: '#C0D6C2',
  blue: '#A8B59A',
  ink: '#243B53',
  mutedInk: '#6E7F73',
  line: '#B7C7B0',
  sage: '#A8B59A',
};

const MATH_FILTERS: Array<{ label: string; value: MathFilter }> = [
  { label: 'Tous', value: 'all' },
  { label: 'Actifs', value: 'ready' },
  { label: 'Calcul', value: 'calcul' },
  { label: 'Analyse', value: 'analyse' },
  { label: 'Algebre', value: 'algebre' },
  { label: 'A venir', value: 'soon' },
];

function getMathCardLayout(screenWidth: number) {
  const containerWidth = Math.min(screenWidth, 980);
  const innerWidth = containerWidth - 40;
  const isTwoColumns = innerWidth >= 760;
  const gridGap = 22;

  return {
    containerWidth,
    gridGap,
    isTwoColumns,
  };
}

function chunkEntries<T>(items: T[], chunkSize: number) {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    rows.push(items.slice(index, index + chunkSize));
  }

  return rows;
}

function matchesMathFilter(entry: SimulationEntry, filter: MathFilter) {
  if (filter === 'all') {
    return true;
  }

  if (filter === 'ready' || filter === 'soon') {
    return entry.status === filter;
  }

  return entry.category === filter;
}

function MathSectionScreen({ entries, title }: { entries: SimulationEntry[]; title: string }) {
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<MathFilter>('all');

  const normalizedQuery = query.trim().toLowerCase();
  const featuredEntry = entries.find((entry) => entry.featured) ?? entries[0];
  const { containerWidth, gridGap, isTwoColumns } = getMathCardLayout(width);

  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) => {
        const searchable = `${entry.title} ${entry.description ?? ''}`.toLowerCase();

        return matchesMathFilter(entry, activeFilter) && searchable.includes(normalizedQuery);
      }),
    [activeFilter, entries, normalizedQuery]
  );
  const cardRows = useMemo(
    () => chunkEntries(filteredEntries, isTwoColumns ? 2 : 1),
    [filteredEntries, isTwoColumns]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView lightColor={MATH_THEME.background} style={styles.mathSafeArea}>
        <FloatingMathSymbols showGlow={false} style={styles.pageBackground} />

        <ScrollView contentContainerStyle={styles.mathScrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.mathContainer}>
            <View style={styles.mathHero}>
              <View style={styles.heroBadge}>
                <MaterialCommunityIcons color="#243B53" name="school-outline" size={16} />
                <ThemedText darkColor="#243B53" lightColor="#243B53" style={styles.heroBadgeText}>
                  Espace d etude
                </ThemedText>
              </View>

              <ThemedText lightColor={MATH_THEME.ink} style={styles.heroTitle}>
                {title}
              </ThemedText>

              <ThemedText lightColor={MATH_THEME.mutedInk} style={styles.heroSubtitle}>
                Explore tes simulations dans une interface plus claire, plus douce et pensee pour reviser efficacement.
              </ThemedText>

              <View style={styles.searchShell}>
                <MaterialCommunityIcons color={MATH_THEME.mutedInk} name="magnify" size={18} />
                <TextInput
                  onChangeText={setQuery}
                  placeholder="Rechercher une simulation"
                  placeholderTextColor={MATH_THEME.mutedInk}
                  selectionColor={MATH_THEME.coral}
                  style={styles.searchInput}
                  value={query}
                />
              </View>

              <ScrollView contentContainerStyle={styles.filterRow} horizontal showsHorizontalScrollIndicator={false}>
                {MATH_FILTERS.map((filter) => {
                  const isActive = activeFilter === filter.value;

                  return (
                    <Pressable
                      key={filter.value}
                      onPress={() => setActiveFilter(filter.value)}
                      style={({ pressed, hovered }) => [
                        styles.filterChip,
                        isActive ? styles.filterChipActive : null,
                        pressed || hovered ? styles.filterChipPressed : null,
                      ]}>
                      <ThemedText
                        lightColor={isActive ? '#243B53' : '#5A6A58'}
                        style={[styles.filterChipText, isActive ? styles.filterChipTextActive : null]}>
                        {filter.label}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            <View style={[styles.contentColumn, { width: containerWidth - 40 }]}>
              {featuredEntry ? (
                <Link href={featuredEntry.href as Href} asChild>
                  <Pressable style={({ pressed, hovered }) => [styles.featuredCard, pressed || hovered ? styles.featuredCardPressed : null]}>
                    <View style={styles.featuredContent}>
                      <View style={styles.featuredHeader}>
                        <View style={styles.featuredPill}>
                          <ThemedText lightColor={MATH_THEME.ink} style={styles.featuredPillText}>
                            Simulation mise en avant
                          </ThemedText>
                        </View>

                        <MaterialCommunityIcons
                          color={MATH_THEME.coral}
                          name={(featuredEntry.icon ?? 'function') as keyof typeof MaterialCommunityIcons.glyphMap}
                          size={24}
                        />
                      </View>

                      <ThemedText lightColor={MATH_THEME.ink} style={styles.featuredTitle}>
                        {featuredEntry.title}
                      </ThemedText>

                      <ThemedText lightColor={MATH_THEME.mutedInk} style={styles.featuredDescription}>
                        {featuredEntry.description ?? 'Simulation principale pour commencer rapidement.'}
                      </ThemedText>

                      <View style={[styles.featuredFooter, !isTwoColumns ? styles.featuredFooterStack : null]}>
                        <View style={styles.featuredMeta}>
                          <MaterialCommunityIcons color={MATH_THEME.mint} name="star-four-points-outline" size={16} />
                          <ThemedText lightColor={MATH_THEME.ink} style={styles.featuredMetaText}>
                            Ideal pour lancer la session
                          </ThemedText>
                        </View>

                        <View style={styles.primaryAction}>
                          <ThemedText lightColor={MATH_THEME.card} style={styles.primaryActionText}>
                            Ouvrir
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                </Link>
              ) : null}

              <View style={styles.sectionHeader}>
                <View>
                  <ThemedText lightColor={MATH_THEME.card} style={styles.sectionTitle}>
                    Bibliotheque de simulations
                  </ThemedText>
                  <ThemedText lightColor={MATH_THEME.cardSoft} style={styles.sectionSubtitle}>
                    {filteredEntries.length} simulation{filteredEntries.length > 1 ? 's' : ''} visible{filteredEntries.length > 1 ? 's' : ''}
                  </ThemedText>
                </View>
              </View>

              {filteredEntries.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons color={MATH_THEME.blue} name="file-search-outline" size={28} />
                  <ThemedText lightColor={MATH_THEME.card} style={styles.emptyTitle}>
                    Aucun resultat
                  </ThemedText>
                  <ThemedText lightColor={MATH_THEME.cardSoft} style={styles.emptyDescription}>
                    Essaie un autre mot-cle ou change le filtre.
                  </ThemedText>
                </View>
              ) : (
                <View style={[styles.cardGrid, { rowGap: gridGap }]}>
                  {cardRows.map((row, rowIndex) => (
                    <View
                      key={`row-${rowIndex}`}
                      style={[
                        styles.cardRow,
                        { columnGap: gridGap },
                        !isTwoColumns ? styles.cardRowSingle : null,
                      ]}>
                      {row.map((entry) => (
                        <View key={entry.href} style={styles.cardSlot}>
                          <Link href={entry.href as Href} asChild>
                            <Pressable
                              style={({ pressed, hovered }) => [
                                styles.mathCard,
                                pressed || hovered ? styles.mathCardPressed : null,
                              ]}>
                              <View style={styles.mathCardTop}>
                                <View style={styles.iconShell}>
                                  <MaterialCommunityIcons
                                    color={MATH_THEME.coral}
                                    name={(entry.icon ?? 'book-open-variant') as keyof typeof MaterialCommunityIcons.glyphMap}
                                    size={22}
                                  />
                                </View>

                                <View style={styles.cardStatusRow}>
                                  <View
                                    style={[
                                      styles.statusBadge,
                                      entry.status === 'ready' ? styles.statusReady : styles.statusSoon,
                                    ]}>
                                    <ThemedText
                                      lightColor="#243B53"
                                      style={styles.statusText}>
                                      {entry.status === 'ready' ? 'Disponible' : 'Bientot'}
                                    </ThemedText>
                                  </View>
                                </View>
                              </View>

                              <ThemedText lightColor={MATH_THEME.ink} style={styles.cardTitle}>
                                {entry.title}
                              </ThemedText>

                              <ThemedText lightColor={MATH_THEME.mutedInk} numberOfLines={3} style={styles.cardDescription}>
                                {entry.description ?? 'Simulation interactive a ouvrir depuis cette fiche.'}
                              </ThemedText>

                              <View style={styles.cardFooter}>
                                <View style={styles.categoryBadge}>
                                  <ThemedText lightColor={MATH_THEME.ink} style={styles.categoryText}>
                                    {entry.category === 'calcul'
                                      ? 'Calcul'
                                      : entry.category === 'analyse'
                                        ? 'Analyse'
                                        : entry.category === 'algebre'
                                          ? 'Algebre'
                                          : 'A venir'}
                                  </ThemedText>
                                </View>

                                <MaterialCommunityIcons color={MATH_THEME.coral} name="arrow-right" size={20} />
                              </View>
                            </Pressable>
                          </Link>
                        </View>
                      ))}

                      {isTwoColumns && row.length === 1 ? <View style={styles.cardSlot} /> : null}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

function renderDefaultScreen(title: string, entries: SimulationEntry[]) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">{title}</ThemedText>
        <ThemedText style={styles.description}>Choisis une simulation.</ThemedText>

        <ScrollView contentContainerStyle={styles.listContent} style={styles.list}>
          {entries.length === 0 ? (
            <ThemedText style={styles.description}>Aucune simulation pour l'instant.</ThemedText>
          ) : (
            entries.map((entry) => (
              <Link href={entry.href as Href} key={entry.href} asChild>
                <Pressable style={styles.card}>
                  <ThemedText type="defaultSemiBold">{entry.title}</ThemedText>
                </Pressable>
              </Link>
            ))
          )}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

export function SectionIndexScreen({ section, title }: SectionIndexScreenProps) {
  const entries = SIMULATION_CATALOG[section];

  if (section === 'math') {
    return <MathSectionScreen entries={entries} title="Math Simulations" />;
  }

  return renderDefaultScreen(title, entries);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 16,
    paddingBottom: 12,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  description: {
    maxWidth: 460,
  },
  list: {
    flex: 1,
    width: '100%',
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderColor: 'rgba(188, 133, 89, 0.28)',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  mathSafeArea: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  pageBackground: {
    backgroundColor: '#EEF5ED',
    opacity: 1,
  },
  mathScrollContent: {
    paddingBottom: 36,
  },
  mathContainer: {
    alignSelf: 'center',
    gap: 22,
    maxWidth: 980,
    paddingHorizontal: 20,
    paddingTop: 14,
    width: '100%',
  },
  contentColumn: {
    gap: 18,
    width: '100%',
  },
  mathHero: {
    backgroundColor: '#F3F1E7',
    borderColor: '#A8B59A',
    borderRadius: 26,
    borderWidth: 2,
    gap: 14,
    overflow: 'hidden',
    paddingHorizontal: 22,
    paddingVertical: 24,
    position: 'relative',
    shadowColor: '#243B53',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    zIndex: 0,
  },
  heroBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#DDE4D5',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#A8B59A',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heroBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  heroTitle: {
    color: '#243B53',
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
  },
  heroSubtitle: {
    color: '#4E6254',
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 760,
  },
  searchShell: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#AAB18E',
    borderRadius: 18,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 10,
    minHeight: 54,
    paddingHorizontal: 16,
  },
  searchInput: {
    color: '#243B53',
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  filterRow: {
    gap: 10,
    paddingRight: 4,
  },
  filterChip: {
    backgroundColor: '#F3F1E7',
    borderColor: '#A8B59A',
    borderRadius: 999,
    borderWidth: 1.5,
    minHeight: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  filterChipActive: {
    backgroundColor: '#AAB18E',
    borderColor: '#8D9771',
  },
  filterChipPressed: {
    opacity: 0.82,
    transform: [{ translateY: 1 }],
  },
  filterChipText: {
    color: '#5A6A58',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  filterChipTextActive: {
    color: '#243B53',
    fontWeight: '800',
  },
  featuredCard: {
    backgroundColor: '#E3E5D2',
    borderColor: '#A8B59A',
    borderRadius: 26,
    borderWidth: 1.5,
    overflow: 'hidden',
    paddingHorizontal: 22,
    paddingVertical: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    width: '100%',
  },
  featuredCardPressed: {
    opacity: 0.96,
    transform: [{ translateY: 2 }],
  },
  featuredContent: {
    gap: 14,
  },
  featuredHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featuredPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#DDE4D5',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#A8B59A',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  featuredPillText: {
    color: '#243B53',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  featuredTitle: {
    color: '#243B53',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  featuredDescription: {
    color: '#4E6254',
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 720,
  },
  featuredFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  featuredFooterStack: {
    alignItems: 'flex-start',
  },
  featuredMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  featuredMetaText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  primaryAction: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#AAB18E',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#8D9771',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 96,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryActionText: {
    color: '#243B53',
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 18,
  },
  sectionHeader: {
    alignItems: 'flex-start',
    gap: 6,
  },
  sectionTitle: {
    color: '#243B53',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  sectionSubtitle: {
    color: '#5C6F5E',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 22,
    borderWidth: 1,
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  emptyDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  cardGrid: {
    gap: 0,
    width: '100%',
  },
  cardRow: {
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  cardRowSingle: {
    justifyContent: 'center',
  },
  cardSlot: {
    flex: 1,
  },
  mathCard: {
    backgroundColor: '#F3F1E7',
    borderColor: '#A8B59A',
    borderRadius: 22,
    borderWidth: 1.5,
    gap: 14,
    height: 246,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: '#243B53',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
  },
  mathCardPressed: {
    borderColor: '#8D9771',
    transform: [{ translateY: 2 }],
  },
  mathCardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconShell: {
    alignItems: 'center',
    backgroundColor: '#DDE4D5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A8B59A',
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  cardStatusRow: {
    alignItems: 'flex-end',
    flex: 1,
    marginLeft: 10,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusReady: {
    backgroundColor: '#C0D6C2',
  },
  statusSoon: {
    backgroundColor: '#E3E5D2',
  },
  statusText: {
    color: '#243B53',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
  },
  cardTitle: {
    color: '#243B53',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  cardDescription: {
    color: '#4E6254',
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
  cardFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  categoryBadge: {
    backgroundColor: '#DDE4D5',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#A8B59A',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryText: {
    color: '#243B53',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
});
