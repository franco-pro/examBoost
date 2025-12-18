import type { DocumentRow } from '@/src/features/documents/utils';
import { usePackDocumentsQuery } from '@/src/features/packs/hooks.rq';
import type { RootState } from '@/src/redux/store';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

const EMPTY_DOCS: DocumentRow[] = [];

// NOTE: Pour empêcher les captures d'écran sur mobile, nous faisons un import dynamique
// afin d'éviter une erreur de typage si le module n'est pas encore installé.

export default function DocumentViewerPage() {
  const { docId, packId } = useLocalSearchParams<{ docId: string; packId: string }>();
  const router = useRouter();
  const id = Number(docId);

  const currentUserId = useSelector<RootState, RootState['session']['currentUserId']>((s) => s.session.currentUserId);
  const packID = useMemo(() => Number(packId), [packId]);
  const docsQuery = usePackDocumentsQuery(currentUserId ?? undefined, Number.isNaN(packID) ? undefined : packID);
  const docsForPack: DocumentRow[] = docsQuery.data ?? EMPTY_DOCS;
  const loading = docsQuery.isLoading;

  const [activeTab, setActiveTab] = useState<'document' | 'corrections'>('document');

  const doc = useMemo(() => docsForPack.find((d: DocumentRow) => d.id === id), [docsForPack, id]);

  const correction = useMemo(() => {
    if (!doc) return undefined;
    const isCorrectionLike = (s?: string) =>
      typeof s === 'string' && /corr(igé|ection)/i.test(s);
    const sameContext = (d: DocumentRow) =>
      d.name === doc.name && (doc.niveauID ? d.niveauID === doc.niveauID : true);
    
    const candidates = docsForPack.filter((d: DocumentRow) => sameContext(d) && isCorrectionLike(d.subject));
    if (candidates.length > 0) return candidates[0];

    const alt = docsForPack.find(
      (d: DocumentRow) =>
        sameContext(d) &&
        (d.subject === `${doc.subject} - Correction` || d.subject === `${doc.subject} Correction`)
    );
    return alt;
  }, [doc, docsForPack]);

  const baseApi = useMemo(
    () => (process.env.EXPO_PUBLIC_API_URL ?? '').trim().replace(/\/$/, ''),
    [],
  );

  const absoluteUrl = useMemo(() => {
    if (!doc) return '';
    const raw = (activeTab === 'corrections' ? (correction?.url ?? doc.url) : doc.url) as string;
    if (/^https?:\/\//i.test(raw)) return raw;
    if (!baseApi) return raw;
    return raw.startsWith('/') ? `${baseApi}${raw}` : `${baseApi}/${raw}`;
  }, [activeTab, baseApi, correction?.url, doc]);

  const [localPdfUri, setLocalPdfUri] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    let cancelled = false;
    const run = async () => {
      setPdfError(null);

      const uri = absoluteUrl;
      if (!uri || typeof uri !== 'string') {
        setLocalPdfUri(null);
        return;
      }

      if (uri.startsWith('file://')) {
        setLocalPdfUri(uri);
        return;
      }

      if (!/^https?:\/\//i.test(uri)) {
        setLocalPdfUri(null);
        return;
      }

      setPdfLoading(true);
      try {
        const safe = encodeURIComponent(uri);
        const cacheDir = (FileSystem as any)['cacheDirectory'] ?? (FileSystem as any)['documentDirectory'] ?? '';
        const dest = `${cacheDir}pdf_${safe}.pdf`;

        const info = await FileSystem.getInfoAsync(dest);
        if (!info.exists) {
          const res = await FileSystem.downloadAsync(uri, dest);
          if (!res?.uri) throw new Error('Téléchargement PDF échoué');
        }

        if (!cancelled) setLocalPdfUri(dest);
      } catch (e: any) {
        if (!cancelled) {
          setLocalPdfUri(null);
          setPdfError(typeof e?.message === 'string' ? e.message : 'Impossible de charger le PDF');
        }
      } finally {
        if (!cancelled) setPdfLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [absoluteUrl]);

  useEffect(() => {
    // Activer l'interdiction de capture uniquement pendant l'écran viewer (mobile)
    const lock = async () => {
      try {
        if (Platform.OS !== 'web') {
          const moduleName = 'expo-screen-capture';
          // @ts-ignore – éviter la résolution statique du module si non installé
          const ScreenCapture: any = await import(moduleName);
          await ScreenCapture?.preventScreenCaptureAsync?.();
        }
      } catch {}
    };
    const unlock = async () => {
      try {
        if (Platform.OS !== 'web') {
          const moduleName = 'expo-screen-capture';
          // @ts-ignore – éviter la résolution statique du module si non installé
          const ScreenCapture: any = await import(moduleName);
          await ScreenCapture?.allowScreenCaptureAsync?.();
        }
      } catch {}
    };
    lock();
    return () => {
      void unlock();
    };
  }, []);

  if (!doc) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
        <Text className="text-typography-gray">Document introuvable.</Text>
      </View>
    );
  }

  const openInBrowser = async () => {
    if (Platform.OS === 'web') {
      window.open(absoluteUrl, '_blank');
    } else {
      await WebBrowser.openBrowserAsync(absoluteUrl);
    }
  };

  const renderNativePdf = () => {
    try {
      // NOTE: On évite volontairement un import/require statique ici.
      // Sinon Metro tente de résoudre les dépendances natives (react-native-blob-util)
      // même sur Web/Expo Go et le bundling échoue.
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const req = (0, eval)('require') as any;
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = req('react-native-' + 'pdf');
      const Pdf = mod?.default ?? mod;
      if (!Pdf) return null;

      if (pdfLoading) {
        return (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-sm text-typography-gray">Chargement du PDF…</Text>
          </View>
        );
      }

      if (pdfError) {
        return (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-sm text-typography-gray text-center">{pdfError}</Text>
            <Pressable onPress={openInBrowser} className="mt-3 px-4 py-2 rounded-full bg-primary-defaultOrange active:opacity-90">
              <View className="flex-row items-center gap-2">
                <Ionicons name="open-outline" size={16} color="#181c5c" />
                <Text className="text-sm font-extrabold text-primary-defaultBlue">Ouvrir le PDF</Text>
              </View>
            </Pressable>
          </View>
        );
      }

      if (!localPdfUri) {
        return (
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-sm text-typography-gray text-center">PDF indisponible.</Text>
            <Pressable onPress={openInBrowser} className="mt-3 px-4 py-2 rounded-full bg-primary-defaultOrange active:opacity-90">
              <View className="flex-row items-center gap-2">
                <Ionicons name="open-outline" size={16} color="#181c5c" />
                <Text className="text-sm font-extrabold text-primary-defaultBlue">Ouvrir le PDF</Text>
              </View>
            </Pressable>
          </View>
        );
      }

      return (
        <Pdf
          source={{ uri: localPdfUri }}
          style={{ flex: 1, width: '100%' }}
          trustAllCerts={false}
        />
      );
    } catch {
      return null;
    }
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">

      {/* Header visuel */}
      <View className="border-b border-outline-100 dark:border-outline-800">
        {/* */}
        {Platform.OS === 'web' ? (
          <View className="px-4 py-2 bg-warning-100 dark:bg-warning-900/30">
            <Text className="text-xs text-typography-default dark:text-typography-white">

            </Text>
          </View>
        ) : null}
        {/*  */}
        <View className="relative">
          <View className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[rgba(24,28,92,0.20)] to-transparent" />
          <View className="px-4 pt-3 pb-3">
            <Pressable onPress={() => router.back()} className="flex-row items-center gap-1 active:opacity-80">
              <Ionicons name="chevron-back" size={18} color="#6B7280" />
              <Text className="text-sm text-typography-gray">Retour</Text>
            </Pressable>
            <View className="mt-2">
              <Text className="text-base font-extrabold text-typography-default dark:text-typography-white">
                {doc?.subject ?? 'Document'}
              </Text>
              <View className="mt-2 flex-row flex-wrap gap-2">
                <View className="px-2 py-1 rounded-full bg-outline-100 dark:bg-outline-800">
                  <Text className="text-[10px] text-typography-gray uppercase tracking-wide">{doc?.name}</Text>
                </View>
                {doc?.format ? (
                  <View className="px-2 py-1 rounded-full bg-outline-100 dark:bg-outline-800">
                    <Text className="text-[10px] text-typography-gray uppercase tracking-wide">{doc.format}</Text>
                  </View>
                ) : null}
                {typeof doc?.niveauID === 'number' ? (
                  <View className="px-2 py-1 rounded-full bg-outline-100 dark:bg-outline-800">
                    <Text className="text-[10px] text-typography-gray uppercase tracking-wide">Niveau {doc.niveauID}</Text>
                  </View>
                ) : null}
                <Pressable onPress={openInBrowser} className="ml-auto px-3 py-1.5 rounded-full bg-primary-defaultOrange active:opacity-90">
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="open-outline" size={14} color="#181c5c" />
                    <Text className="text-xs font-extrabold text-primary-defaultBlue">Ouvrir</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/*  */}
      <View className="px-4 pt-3 flex-row items-center gap-2">
        <Pressable
          onPress={() => setActiveTab('document')}
          className={`px-3 py-1.5 rounded-full ${activeTab === 'document' ? 'bg-primary-defaultOrange' : 'bg-outline-100 dark:bg-outline-800'}`}
        >
          <Text className={`${activeTab === 'document' ? 'text-primary-defaultBlue' : 'text-typography-default dark:text-typography-white'} text-xs font-bold`}>
            Document
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('corrections')}
          className={`px-3 py-1.5 rounded-full ${activeTab === 'corrections' ? 'bg-primary-defaultOrange' : 'bg-outline-100 dark:bg-outline-800'}`}
        >
          <Text className={`${activeTab === 'corrections' ? 'text-primary-defaultBlue' : 'text-typography-default dark:text-typography-white'} text-xs font-bold`}>
            Corrections
          </Text>
        </Pressable>
        <View className="flex-1" />
      </View>

      <View className="mt-3 flex-1">
        {activeTab === 'document' ? (
          <View className="flex-1">
            {Platform.OS === 'web' ? (
              
              <View className="flex-1 px-4 pb-4">
                <View className="rounded-xl overflow-hidden border border-outline-100 dark:border-outline-800 h-[70vh]">
                  <iframe src={doc.url} style={{ width: '100%', height: '100%', border: '0' }} />
                </View>
              </View>
            ) : (
              <View className="flex-1 px-4 pb-4">
                <View className="rounded-xl overflow-hidden border border-outline-100 dark:border-outline-800 flex-1">
                  {renderNativePdf() ?? (
                    <View className="flex-1 items-center justify-center px-4">
                      <Text className="text-sm text-typography-gray text-center">
                        Le viewer PDF natif n’est pas disponible dans Expo Go.
                      </Text>
                      <Pressable onPress={openInBrowser} className="mt-3 px-4 py-2 rounded-full bg-primary-defaultOrange active:opacity-90">
                        <View className="flex-row items-center gap-2">
                          <Ionicons name="open-outline" size={16} color="#181c5c" />
                          <Text className="text-sm font-extrabold text-primary-defaultBlue">Ouvrir le PDF</Text>
                        </View>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        ) : (
          <View className="flex-1">
            {Platform.OS === 'web' ? (
              <View className="flex-1 px-4 pb-4">
                {!correction ? (
                  <View className="mb-2 px-3 py-2 rounded-md bg-warning-100 dark:bg-warning-900/30 border border-outline-100 dark:border-outline-800">
                    <Text className="text-xs text-typography-gray">
                      Aucune correction dédiée trouvée. Affichage du document original.
                    </Text>
                  </View>
                ) : null}
                <View className="rounded-xl overflow-hidden border border-outline-100 dark:border-outline-800 h-[70vh]">
                  <iframe src={(correction?.url ?? doc.url)} style={{ width: '100%', height: '100%', border: '0' }} />
                </View>
              </View>
            ) : (
              <View className="flex-1 px-4 pb-4">
                {!correction ? (
                  <View className="mb-2 px-3 py-2 rounded-md bg-warning-100 dark:bg-warning-900/30 border border-outline-100 dark:border-outline-800">
                    <Text className="text-xs text-typography-gray">
                      Aucune correction dédiée trouvée. Affichage du document original.
                    </Text>
                  </View>
                ) : null}
                <View className="rounded-xl overflow-hidden border border-outline-100 dark:border-outline-800 flex-1">
                  {renderNativePdf() ?? (
                    <View className="flex-1 items-center justify-center px-4">
                      <Text className="text-sm text-typography-gray text-center">
                        Le viewer PDF natif n’est pas disponible dans Expo Go.
                      </Text>
                      <Pressable onPress={openInBrowser} className="mt-3 px-4 py-2 rounded-full bg-primary-defaultOrange active:opacity-90">
                        <View className="flex-row items-center gap-2">
                          <Ionicons name="open-outline" size={16} color="#181c5c" />
                          <Text className="text-sm font-extrabold text-primary-defaultBlue">Ouvrir le PDF</Text>
                        </View>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
