import { filterDocuments, getDistinct } from '@/app/features/documents/utils';
import { usePackDocumentsQuery } from '@/app/features/packs/hooks.rq';
import PackHeader from '@/app/features/packs/PackHeader';
import type { RootState } from '@/app/hooks/redux/store';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function SubjectDocumentsInTabs() {
  const router = useRouter();
  const { packId, name, niveauID, subject } = useLocalSearchParams<{
    packId: string;
    name: string;
    niveauID?: string;
    subject?: string;
  }>();

  const currentUserId = useSelector((s: RootState) => s.session.currentUserId);
  const packID = useMemo(() => Number(packId), [packId]);
  const docsQuery = usePackDocumentsQuery(currentUserId ?? undefined, Number.isNaN(packID) ? undefined : packID);
  const allDocsForPack = docsQuery.data ?? [];
  const loading = docsQuery.isLoading;

  const [search, setSearch] = useState('');
  const nid = Number(niveauID);

  const allForName = useMemo(() => allDocsForPack.filter((d) => d.name === name), [allDocsForPack, name]);
  const subjects = useMemo(() => getDistinct(allForName, 'subject') as string[], [allForName]);
  const niveaux = useMemo(() => getDistinct(allForName, 'niveauID') as number[], [allForName]);

  const docs = useMemo(() => {
    const base = filterDocuments(allDocsForPack, {
      name: String(name),
      subject: subject ? String(subject) : undefined,
      niveauID: !isNaN(nid) ? nid : undefined,
    });
    const q = search.trim().toLowerCase();
    if (!q) return base;
    return base.filter((d) =>
      [d.subject, d.format ?? '', String(d.niveauID)].some((s) => s.toLowerCase().includes(q))
    );
  }, [allDocsForPack, name, subject, nid, search]);

 

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      {/* */}
      <PackHeader
        value={search}
        onChangeSearch={setSearch}
        onOpenFilters={() => {}}
        onOpenSort={() => {}}
        onBack={() =>
          router.replace({
            pathname: '/(tabs)/packs/[packId]/subjects',
            params: {
              packId: String(packId),
              ...(niveauID ? { niveauID: String(niveauID) } : {}),
            },
          } as any)
        }
        backLabel="Retour"
        title="Liste des sujets"
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
          <Text className="text-lg font-extrabold text-typography-default dark:text-typography-white">{name}</Text>

          {/*  */}

          {/* Liste des documents */}
          <View className="mt-2 gap-3">
            {docs.length === 0 ? (
              <Text className="text-typography-gray">Aucun document pour ces filtres.</Text>
            ) : (
              docs.map((d) => (
                <Pressable
                  key={d.id}
                  onPress={() => {
                    const href = {
                      pathname: '/(tabs)/packs/[packId]/subjects/[name]/[docId]' as const,
                      params: {
                        packId: String(packId),
                        name: String(name),
                        docId: String(d.id),
                        ...(isNaN(nid) ? {} : { niveauID: String(nid) }),
                        ...(subject ? { subject: String(subject) } : {}),
                      },
                    };
                    router.push(href as any);
                  }}
                  className="rounded-2xl border border-outline-100 dark:border-outline-800 bg-white dark:bg-outline-900 overflow-hidden active:opacity-90"
                >
                  {/* Bandeau visuel */}
                  <View className="relative h-14 justify-end border-b border-outline-100 dark:border-outline-800" style={{ backgroundColor: 'rgba(25,28,92,0.06)' }}>
                    <View className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[rgba(24,28,92,0.18)] to-transparent" />
                    <View className="px-4 pb-2 flex-row items-center gap-2">
                      <View className="w-7 h-7 rounded-full bg-primary-defaultOrange items-center justify-center ring-1 ring-primary-defaultOrange/30">
                        <Ionicons name={d.format === 'pdf' ? 'document-text' : 'document-outline'} size={14} color="#181c5c" />
                      </View>
                      <Text className="flex-1 text-sm font-extrabold text-typography-default dark:text-typography-white" numberOfLines={1}>
                        {d.subject}
                      </Text>
                      <Ionicons name="chevron-forward" size={16} color="#6B7280" />
                    </View>
                  </View>

                  {/* Infos */}
                  <View className="px-4 py-3 gap-2">
                    <View className="flex-row flex-wrap items-center gap-2">
                      <View className="px-2 py-1 rounded-full bg-outline-100 dark:bg-outline-800">
                        <Text className="text-[10px] text-typography-gray uppercase tracking-wide">{d.name}</Text>
                      </View>
                      {/* Badge */}
                      <View className="px-2 py-1 rounded-full bg-outline-100 dark:bg-outline-800">
                        <Text className="text-[10px] text-typography-gray uppercase tracking-wide">Niveau {d.niveauID}</Text>
                      </View>
                      {d.created_at ? (
                        <View className="px-2 py-1 rounded-full bg-outline-100 dark:bg-outline-800">
                          <Text className="text-[10px] text-typography-gray uppercase tracking-wide">{new Date(d.created_at).toLocaleDateString()}</Text>
                        </View>
                      ) : null}
                    </View>
                    {/* Indicateur*/}
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
