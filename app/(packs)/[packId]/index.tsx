import { groupByName } from '@/app/features/documents/utils';
import { usePackDocumentsQuery } from '@/app/features/packs/hooks.rq';
import PackHeader from '@/app/features/packs/PackHeader';
import type { RootState } from '@/app/hooks/redux/store';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function SubjectsPage() {
  const router = useRouter();
  const { packId, niveauID } = useLocalSearchParams<{ packId: string; niveauID?: string }>();
  const [search, setSearch] = useState('');

  const currentUserId = useSelector((s: RootState) => s.session.currentUserId);
  console.log("current user id: ", currentUserId)
  const packID = useMemo(() => Number(packId), [packId]);

  const docsQuery = usePackDocumentsQuery(currentUserId ?? undefined, Number.isNaN(packID) ? undefined : packID);
  const docs = docsQuery.data ?? [];
  const loading = docsQuery.isLoading;

  const filteredDocs = useMemo(() => {
    const nid = Number(niveauID);
    if (!isNaN(nid)) {
      return docs.filter((d) => d.niveauID === nid);
    }
    return docs;
  }, [niveauID, docs]);

  const groups = useMemo(() => {
    const base = groupByName(filteredDocs);
    const q = search.trim().toLowerCase();
    if (!q) return base;
    return base.filter((g) => g.name.toLowerCase().includes(q));
  }, [filteredDocs, search]);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Conserver l'entête Packs + Trier + Filtres + Recherche */}
      <PackHeader
        value={search}
        onChangeSearch={setSearch}
        onOpenFilters={() => {}}
        onOpenSort={() => {}}
        onBack={() => router.replace('/(tabs)/pack')}
        backLabel="Retour"
        title="Liste des matières"
      />

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={docsQuery.isRefetching} onRefresh={() => void docsQuery.refetch()} />
        }
      >
        <View className="p-4 pt-2 gap-3">
          {loading ? (
            <Text className="text-typography-gray">Chargement…</Text>
          ) : null}
          {groups.length === 0 ? (
            <Text className="text-typographie-gray">Aucune matière disponible.</Text>
          ) : null}

          <View className="gap-3">
            {groups.map((g) => (
              <Pressable
                key={g.name}
                onPress={() => {
                  const href = {
                    pathname: '/(tabs)/packs/[packId]/subjects/[name]' as const,
                    params: { packId: String(packId), name: g.name, ...(niveauID ? { niveauID: String(niveauID) } : {}) },
                  };
                  router.push(href as any);
                }}
                className="rounded-2xl border border-outline-100 dark:border-outline-800 bg-white dark:bg-outline-900 overflow-hidden active:opacity-90"
              >
                {/*  */}
                <View className="relative h-16 items-start justify-end border-b border-outline-100 dark:border-outline-800" style={{ backgroundColor: 'rgba(25, 28, 92, 0.09)' }}>
                  <View className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[rgba(24,28,92,0.30)] to-transparent" />
                  <View className="px-4 pb-2">
                    <View className="flex-row items-center gap-2">
                      <View className="w-8 h-8 rounded-full bg-primary-defaultOrange items-center justify-center ring-1 ring-primary-defaultOrange/30">
                        <Ionicons name="book" size={16} color="#181c5c" />
                      </View>
                      <Text className="text-base font-extrabold text-typographie-default dark:text-typography-white">{g.name}</Text>
                    </View>
                  </View>
                </View>

                {/*  */}
                <View className="px-4 py-3 flex-row items-center justify-between">
                  <Text className="text-xs text-typography-gray">
                    {g.count} document{g.count > 1 ? 's' : ''} · {g.subjects.length} sujet{g.subjects.length > 1 ? 's' : ''}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#6B7280" />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
