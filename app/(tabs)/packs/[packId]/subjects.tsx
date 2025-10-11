import { MOCK_DOCUMENTS, groupByName } from '@/src/features/documents/utils';
import PackHeader from '@/src/features/packs/PackHeader';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function SubjectsPage() {
  const router = useRouter();
  const { packId, niveauID } = useLocalSearchParams<{ packId: string; niveauID?: string }>();
  const [search, setSearch] = useState('');

  const docs = useMemo(() => {
    const nid = Number(niveauID);
    if (!isNaN(nid)) {
      return MOCK_DOCUMENTS.filter((d) => d.niveauID === nid);
    }
    return MOCK_DOCUMENTS;
  }, [niveauID]);

  const groups = useMemo(() => {
    const base = groupByName(docs);
    const q = search.trim().toLowerCase();
    if (!q) return base;
    return base.filter((g) => g.name.toLowerCase().includes(q));
  }, [docs, search]);

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

      <ScrollView className="flex-1">
        <View className="p-4 pt-2 gap-3">
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
