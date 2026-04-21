import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {Href, router} from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
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

type DashboardFilter = string;
const PAGE_SIZE = 10;

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

const DASHBOARD_CONFIG: Record<
  'math' | 'physics' | 'java-programming',
  {
    categoryLabels: Record<string, string>;
    filters: { label: string; value: DashboardFilter }[];
    subtitle: string;
    title: string;
  }
  >={
  math: {
    categoryLabels: {
      'a-venir': 'A venir',
      analyse: 'Analyse',
      calcul: 'Calcul',
      'equations diff': 'Eq diff',
      fonctions: 'Fonctions',
      geometrie: 'Geometrie',
      approximations: 'Approximations',
      riemann: 'Riemann',
      signaux: 'Signaux',
      series: 'Series',
      trigonometrie: 'Trigonometrie',
      visualisation: 'Visualisation',
      vecteurs: 'Vecteurs',
      aires: 'Aires',
      derivees: 'Derivees',
      comportement: 'Comportement',
      convergence: 'Convergence',
    },
    filters: [
      { label: 'Actifs', value: 'ready' },
      { label: 'Calcul', value: 'calcul' },
      { label: 'Analyse', value: 'analyse' },
      { label: 'Fonctions', value: 'fonctions' },
      { label: 'Series', value: 'series' },
      { label: 'Signaux', value: 'signaux' },
      { label: 'Eq diff', value: 'equations diff' },
      { label: 'Geometrie', value: 'geometrie' },
      { label: 'Vecteurs', value: 'vecteurs' },
      { label: 'Visualisation', value: 'visualisation' },
      { label: 'A venir', value: 'soon' },
    ],
    subtitle: 'Explore tes simulations dans une interface plus claire, plus douce et pensée pour reviser efficacement.',
    title: 'Simulation de Math',
  },
  physics: {
    categoryLabels: {
      'a-venir': 'A venir',
      electricite: 'Electricite',
      energie: 'Energie',
      mecanique: 'Mecanique',
      ondes: 'Ondes',
    },
    filters: [
      { label: 'Actifs', value: 'ready' },
      { label: 'Mecanique', value: 'mecanique' },
      { label: 'Ondes', value: 'ondes' },
      { label: 'Electricite', value: 'electricite' },
      { label: 'Energie', value: 'energie' },
      { label: 'A venir', value: 'soon' },
    ],
    subtitle: 'Retrouve tes simulations de physique dans le même espace organisé, lisible et facile a parcourir.',
    title: 'Simulation de Physique',
  },
  'java-programming': {
    categoryLabels: {
      'a-venir': 'A venir',
    },
    filters: [
      { label: 'Actifs', value: 'ready' },
      { label: 'A venir', value: 'soon' },
    ],
    subtitle: 'Retrouve tes simulations Java dans le meme espace organise, lisible et facile a parcourir.',
    title: 'Simulation Java',
  },
};

function getMathCardLayout(screenWidth: number) {
  const containerWidth = Math.min(screenWidth, 980);
  const innerWidth = containerWidth - 40;
  const isTwoColumns = innerWidth >= 760;
  const gridGap = 22;
  const rowGap = 34;

  return {
    containerWidth,
    gridGap,
    isTwoColumns,
    rowGap,
  };
}

function chunkEntries<T>(items: T[], chunkSize: number) {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    rows.push(items.slice(index, index + chunkSize));
  }

  return rows;
}

function matchesDashboardFilter(entry: SimulationEntry, filter: DashboardFilter) {
  if (filter === 'ready' || filter === 'soon') {
    return entry.status === filter;
  }

  return entry.tags?.includes(filter) ?? false;
}

function DashboardSectionScreen({
  config,
  entries,
}: {
  config: (typeof DASHBOARD_CONFIG)['math'] | (typeof DASHBOARD_CONFIG)['physics'];
  entries: SimulationEntry[];
}) {
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<DashboardFilter[]>([]);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState(0);

  const normalizedQuery = query.trim().toLowerCase();
  const { containerWidth, gridGap, isTwoColumns, rowGap } = getMathCardLayout(width);

  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) => {
        const searchable = `${entry.title} ${entry.description ?? ''}`.toLowerCase();

        const matchesSelectedFilters =
          activeFilters.length === 0 || activeFilters.some((filter) => matchesDashboardFilter(entry, filter));

        return matchesSelectedFilters && searchable.includes(normalizedQuery);
      }),
    [activeFilters, entries, normalizedQuery]
  );
  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));
  const pagedEntries = useMemo(
    () => filteredEntries.slice(activePage * PAGE_SIZE, (activePage + 1) * PAGE_SIZE),
    [activePage, filteredEntries]
  );
  const cardRows = useMemo(
    () => chunkEntries(pagedEntries, isTwoColumns ? 2 : 1),
    [isTwoColumns, pagedEntries]
  );

  useEffect(() => {
    setActivePage(0);
  }, [activeFilters, normalizedQuery]);

  useEffect(() => {
    if (activePage >= totalPages) {
      setActivePage(Math.max(0, totalPages - 1));
    }
  }, [activePage, totalPages]);

  const toggleFilter = (filter: DashboardFilter) => {
    setActiveFilters((currentFilters) =>
      currentFilters.includes(filter)
        ? currentFilters.filter((currentFilter) => currentFilter !== filter)
        : [...currentFilters, filter]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView lightColor={MATH_THEME.background} style={styles.mathSafeArea}>
        <FloatingMathSymbols showGlow={false} style={styles.pageBackground} />

        <ScrollView contentContainerStyle={styles.mathScrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.mathContainer}>
            <View style={styles.mathHero}>
              <Pressable onPress={() => router.push('/(tabs)/home')} style={styles.heroLogoButton}>
                <Image
                  contentFit="contain"
                  source={require('@/assets/images/evidexe-logo.png')}
                  style={styles.heroLogo}
                />
              </Pressable>

              <Pressable onPress={() => router.push('/(tabs)/profile')} style={styles.heroProfileButton}>
                <MaterialCommunityIcons color="#243B53" name="account-circle-outline" size={18} />
                <ThemedText darkColor="#243B53" lightColor="#243B53" style={styles.heroProfileText}>
                  Profil
                </ThemedText>
              </Pressable>

              <ThemedText lightColor={MATH_THEME.ink} style={styles.heroTitle}>
                {config.title}
              </ThemedText>

              <ThemedText lightColor={MATH_THEME.mutedInk} style={styles.heroSubtitle}>
                {config.subtitle}
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

              <View style={styles.filterWrap}>
                <Pressable
                  onPress={() => setIsFilterMenuOpen((currentValue) => !currentValue)}
                  style={({ pressed, hovered }) => [
                    styles.filterButton,
                    isFilterMenuOpen ? styles.filterButtonOpen : null,
                    pressed || hovered ? styles.filterChipPressed : null,
                  ]}>
                  <View style={styles.filterButtonContent}>
                    <MaterialCommunityIcons color="#243B53" name="filter-variant" size={18} />
                    <ThemedText darkColor="#243B53" lightColor="#243B53" style={styles.filterButtonText}>
                      Filtre
                    </ThemedText>
                    {activeFilters.length > 0 ? (
                      <View style={styles.filterCountBadge}>
                        <ThemedText darkColor="#243B53" lightColor="#243B53" style={styles.filterCountText}>
                          {activeFilters.length}
                        </ThemedText>
                      </View>
                    ) : null}
                  </View>
                  <MaterialCommunityIcons
                    color="#243B53"
                    name={isFilterMenuOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                  />
                </Pressable>

                {isFilterMenuOpen ? (
                  <View style={styles.filterDropdown}>
                    <View style={styles.filterOptionGrid}>
                      {config.filters.map((filter) => {
                        const isActive = activeFilters.includes(filter.value);

                        return (
                          <Pressable
                            key={filter.value}
                            onPress={() => toggleFilter(filter.value)}
                            style={({ pressed, hovered }) => [
                              styles.filterOption,
                              isActive ? styles.filterOptionActive : null,
                              pressed || hovered ? styles.filterChipPressed : null,
                            ]}>
                            <View style={[styles.filterCheck, isActive ? styles.filterCheckActive : null]}>
                              {isActive ? <MaterialCommunityIcons color="#243B53" name="check" size={14} /> : null}
                            </View>
                            <ThemedText
                              darkColor={isActive ? '#243B53' : '#5A6A58'}
                              lightColor={isActive ? '#243B53' : '#5A6A58'}
                              style={[styles.filterOptionText, isActive ? styles.filterOptionTextActive : null]}>
                              {filter.label}
                            </ThemedText>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                ) : null}
              </View>
            </View>

            <View style={[styles.contentColumn, { width: containerWidth - 40 }]}>
              <View style={styles.sectionHeader}>
                <View>
                  <ThemedText lightColor={MATH_THEME.card} style={styles.sectionTitle}>
                    Bibliotheque de simulations
                  </ThemedText>
                  <ThemedText lightColor={MATH_THEME.cardSoft} style={styles.sectionSubtitle}>
                    {filteredEntries.length} simulation{filteredEntries.length > 1 ? 's' : ''} visible{filteredEntries.length > 1 ? 's' : ''}
                  </ThemedText>
                </View>

                {totalPages > 1 ? (
                  <View style={styles.paginationRow}>
                    {Array.from({ length: totalPages }, (_, index) => {
                      const isActive = index === activePage;

                      return (
                        <Pressable
                          key={`page-${index + 1}`}
                          onPress={() => setActivePage(index)}
                          style={({ pressed, hovered }) => [
                            styles.paginationChip,
                            isActive ? styles.paginationChipActive : null,
                            pressed || hovered ? styles.filterChipPressed : null,
                          ]}>
                          <ThemedText
                            darkColor={isActive ? '#243B53' : '#5A6A58'}
                            lightColor={isActive ? '#243B53' : '#5A6A58'}
                            style={styles.paginationChipText}>
                            Page {index + 1}
                          </ThemedText>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}
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
                <View style={[styles.cardGrid, { rowGap }]}>
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
                            <Pressable
                                onPress={()=>router.push(entry.href as Href)}
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
                                <View style={styles.categoryRow}>
                                  {(entry.tags?.length ? entry.tags : ['a-venir']).slice(0, 3).map((tag) => (
                                    <View key={`${entry.href}-${tag}`} style={styles.categoryBadge}>
                                      <ThemedText lightColor={MATH_THEME.ink} style={styles.categoryText}>
                                        {config.categoryLabels[tag] ?? tag}
                                      </ThemedText>
                                    </View>
                                  ))}
                                </View>

                                <MaterialCommunityIcons color={MATH_THEME.coral} name="arrow-right" size={20} />
                              </View>
                            </Pressable>
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
            <ThemedText style={styles.description}>Aucune simulation pour l&#39;instant.</ThemedText>
          ) : (
            entries.map((entry) => (
              <Pressable onPress={()=>router.push(entry.href as Href)} key={entry.href} style={styles.card}>
                <ThemedText type="defaultSemiBold">{entry.title}</ThemedText>
              </Pressable>
            ))
          )}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

export function SectionIndexScreen({ section, title }: SectionIndexScreenProps) {
  const entries = SIMULATION_CATALOG[section];

  if (section === 'math' || section === 'physics' || section === 'java-programming') {
    return <DashboardSectionScreen config={DASHBOARD_CONFIG[section]} entries={entries} />;
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
  heroLogoButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  heroLogo: {
    height: 42,
    width: 132,
  },
  heroProfileButton: {
    alignItems: 'center',
    backgroundColor: '#DDE4D5',
    borderColor: '#A8B59A',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    paddingHorizontal: 12,
    paddingVertical: 8,
    right: 22,
    top: 24,
    zIndex: 2,
  },
  heroProfileText: {
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
  filterWrap: {
    alignSelf: 'flex-start',
    gap: 10,
    width: '100%',
  },
  filterButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F3F1E7',
    borderColor: '#A8B59A',
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 46,
    minWidth: 136,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterButtonOpen: {
    borderColor: '#243B53',
  },
  filterButtonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  filterButtonText: {
    color: '#243B53',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
  filterCountBadge: {
    alignItems: 'center',
    backgroundColor: '#DDE4D5',
    borderColor: '#A8B59A',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minWidth: 22,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  filterCountText: {
    color: '#243B53',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
  },
  filterDropdown: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F1E7',
    borderColor: '#A8B59A',
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 12,
    shadowColor: '#243B53',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    width: '100%',
  },
  filterOptionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOption: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#B7C7B0',
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 10,
    minHeight: 44,
    minWidth: 140,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterOptionActive: {
    backgroundColor: '#DDE4D5',
    borderColor: '#243B53',
  },
  filterCheck: {
    alignItems: 'center',
    backgroundColor: '#F3F1E7',
    borderColor: '#A8B59A',
    borderRadius: 6,
    borderWidth: 1.5,
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  filterCheckActive: {
    backgroundColor: '#AAB18E',
    borderColor: '#243B53',
  },
  filterOptionText: {
    color: '#5A6A58',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  filterOptionTextActive: {
    color: '#243B53',
    fontWeight: '800',
  },
  filterChipPressed: {
    opacity: 0.82,
    transform: [{ translateY: 1 }],
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
  paginationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-end',
  },
  paginationChip: {
    alignItems: 'center',
    backgroundColor: MATH_THEME.chip,
    borderColor: 'rgba(36,59,83,0.08)',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  paginationChipActive: {
    backgroundColor: MATH_THEME.chipActive,
    borderColor: '#243B53',
  },
  paginationChipText: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
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
  categoryRow: {
    flexDirection: 'row',
    flexShrink: 1,
    flexWrap: 'wrap',
    gap: 6,
    marginRight: 10,
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
