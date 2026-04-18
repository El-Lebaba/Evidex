import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, Link } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  DimensionValue,
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
  background: '#243B53',
  card: '#F3F1E7',
  cardAlt: '#E9ECE4',
  cardSoft: '#DDE4D5',
  chip: 'rgba(167, 184, 158, 0.35)',
  chipActive: 'rgba(124, 207, 191, 0.26)',
  coral: '#D97B6C',
  coralSoft: 'rgba(217, 123, 108, 0.24)',
  gold: '#D8A94A',
  mint: '#7CCFBF',
  blue: '#7EA6E0',
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
  const gridGap = 16;

  return {
    cardWidth: (isTwoColumns ? (innerWidth - gridGap) / 2 : innerWidth) as DimensionValue,
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
  const { cardWidth, containerWidth, gridGap, isTwoColumns } = getMathCardLayout(width);

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
        <ScrollView contentContainerStyle={styles.mathScrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.mathContainer}>
            <View style={styles.mathHero}>
              <View style={styles.heroBadge}>
                <MaterialCommunityIcons color={MATH_THEME.gold} name="school-outline" size={16} />
                <ThemedText lightColor={MATH_THEME.card} style={styles.heroBadgeText}>
                  Espace d etude
                </ThemedText>
              </View>

              <ThemedText lightColor={MATH_THEME.card} style={styles.heroTitle}>
                {title}
              </ThemedText>

              <ThemedText lightColor={MATH_THEME.cardSoft} style={styles.heroSubtitle}>
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
                        lightColor={isActive ? MATH_THEME.ink : MATH_THEME.card}
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
                        <Link href={entry.href as Href} key={entry.href} asChild>
                          <Pressable
                            style={({ pressed, hovered }) => [
                              styles.mathCard,
                              { width: cardWidth },
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
                                    lightColor={entry.status === 'ready' ? MATH_THEME.ink : MATH_THEME.coral}
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
                      ))}

                      {isTwoColumns && row.length === 1 ? <View style={{ width: cardWidth }} /> : null}
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
    backgroundColor: 'rgba(167, 184, 158, 0.12)',
    borderColor: 'rgba(124, 207, 191, 0.26)',
    borderRadius: 26,
    borderWidth: 1,
    gap: 14,
    overflow: 'hidden',
    paddingHorizontal: 22,
    paddingVertical: 24,
  },
  heroBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(217, 123, 108, 0.24)',
    borderRadius: 999,
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
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 760,
  },
  searchShell: {
    alignItems: 'center',
    backgroundColor: MATH_THEME.card,
    borderColor: MATH_THEME.line,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 54,
    paddingHorizontal: 16,
  },
  searchInput: {
    color: MATH_THEME.ink,
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  filterRow: {
    gap: 10,
    paddingRight: 4,
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  filterChipActive: {
    backgroundColor: MATH_THEME.chipActive,
    borderColor: MATH_THEME.mint,
  },
  filterChipPressed: {
    opacity: 0.82,
    transform: [{ translateY: 1 }],
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  filterChipTextActive: {
    fontWeight: '800',
  },
  featuredCard: {
    backgroundColor: MATH_THEME.cardAlt,
    borderColor: MATH_THEME.line,
    borderRadius: 26,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: 22,
    paddingVertical: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
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
    backgroundColor: MATH_THEME.chip,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  featuredPillText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  featuredTitle: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  featuredDescription: {
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
    backgroundColor: MATH_THEME.coral,
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 96,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  primaryActionText: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 18,
  },
  sectionHeader: {
    alignItems: 'flex-start',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  sectionSubtitle: {
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  cardRowSingle: {
    justifyContent: 'center',
  },
  mathCard: {
    backgroundColor: MATH_THEME.card,
    borderColor: MATH_THEME.line,
    borderRadius: 22,
    borderWidth: 1,
    gap: 14,
    height: 246,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  mathCardPressed: {
    borderColor: MATH_THEME.coral,
    transform: [{ translateY: 2 }],
  },
  mathCardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconShell: {
    alignItems: 'center',
    backgroundColor: MATH_THEME.cardAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MATH_THEME.line,
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
    backgroundColor: MATH_THEME.chipActive,
  },
  statusSoon: {
    backgroundColor: MATH_THEME.coralSoft,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  cardDescription: {
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
    backgroundColor: MATH_THEME.chip,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
});
