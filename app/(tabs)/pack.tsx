import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import PackDetailSheet from '@/src/features/packs/PackDetailSheet';
import PackHeader from '@/src/features/packs/PackHeader';
import PackList from '@/src/features/packs/PackList';
import SubscribeModal from '@/src/features/packs/SubscribeModal';
import type { Pack } from '@/src/features/packs/types';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';

const MOCK_PACKS: Pack[] = [
  {
    id: 'p1',
    title: 'Pack Premium',
    description: 'Accédez à toutes les matières avec des examens corrigés et des tests illimités.',
    price: 5000,
    durationDays: 30,
    isActive: true,
    niveauID: 3,
    createdAt: '2025-09-25T10:00:00Z',
  
  },
  {
    id: 'p2',
    title: 'Pack Standard',
    description: 'L’essentiel pour réviser efficacement selon votre niveau.',
    price: 3000,
    durationDays: 30,
    isActive: true,
    niveauID: 3,
    createdAt: '2025-09-19T13:28:11Z',
  
  },
  {
    id: 'p3',
    title: 'Pack Compétitions',
    description: 'Préparez les compétitions hebdomadaires avec des épreuves types.',
    price: 2500,
    durationDays: 30,
    isActive: false,
    niveauID: 3,
    createdAt: '2025-09-10T08:00:00Z',

  },
  {
    id: 'p4',
    title: 'Pack Spécial',
    description: 'Décrochez votre mention aux examens officiels avec ce pack spécial sur mesures.',
    price: 10000,
    durationDays: 60,
    isActive: false,
    niveauID: 3,
    createdAt: '2025-09-10T08:00:00Z',

  },
];

export default function PackScreen() {
  const [search, setSearch] = useState('');
  const toast = useToast();
  const modalRef = useRef<BottomSheetModal>(null);
  const [selected, setSelected] = useState<Pack | null>(null);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const router = useRouter();
  const [packs, setPacks] = useState<Pack[]>(MOCK_PACKS);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return packs;
    return packs.filter((p) =>
      [p.title, p.description, ...(p.tags ?? [])].some((s) => s?.toLowerCase().includes(q))
    );
  }, [search, packs]);

  return (
    <BottomSheetModalProvider>
      <View className="flex-1 bg-background-light dark:bg-background-dark">
        <PackHeader
        value={search}
        onChangeSearch={setSearch}
        onOpenFilters={() =>
          toast.show({
            placement: 'top',
            duration: 1500,
            render: () => (
              <Toast action="info" variant="solid" className="mx-3">
                <ToastTitle bold>Filtres</ToastTitle>
                <ToastDescription>Bientôt disponible…</ToastDescription>
              </Toast>
            ),
          })
        }
        onOpenSort={() =>
          toast.show({
            placement: 'top',
            duration: 1500,
            render: () => (
              <Toast action="info" variant="solid" className="mx-3">
                <ToastTitle bold>Trier</ToastTitle>
                <ToastDescription>Bientôt disponible…</ToastDescription>
              </Toast>
            ),
          })
        }
        />

        {filtered.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-typography-gray text-center">Aucun pack ne correspond à votre recherche.</Text>
          </View>
        ) : (
          <PackList
            packs={filtered}
            onPressPack={(p) => {
              void Haptics.selectionAsync();
              if (p.isActive) {
                router.push({
                  pathname: '/(tabs)/packs/[packId]/subjects',
                  params: { packId: p.id, ...(p.niveauID != null ? { niveauID: String(p.niveauID) } : {}) },
                } as any);
              } else {
                setSelected(p);
                setSubscribeOpen(true);
              }
            }}
            onPressCTA={(p) => {
              void Haptics.selectionAsync();
              if (p.isActive) {
                router.push({
                  pathname: '/(tabs)/packs/[packId]/subjects',
                  params: { packId: p.id, ...(p.niveauID != null ? { niveauID: String(p.niveauID) } : {}) },
                } as any);
              } else {
                setSelected(p);
                setSubscribeOpen(true);
              }
            }}
          />
        )}

        {/* Bottom Sheet Details */}
        <BottomSheetModal
          ref={modalRef}
          snapPoints={["45%", "85%"]}
          backgroundStyle={{ backgroundColor: 'transparent' }}
          handleIndicatorStyle={{ backgroundColor: '#9CA3AF' }}
        >
          <PackDetailSheet
            pack={selected}
            onClose={() => modalRef.current?.dismiss()}
            onPrimary={(p) => {
              // Ouvrir la modale de souscription pour confirmer l'achat
              setSubscribeOpen(true);
            }}
          />
        </BottomSheetModal>

        {/* Modal de souscription */}
        <SubscribeModal
          visible={subscribeOpen}
          pack={selected}
          onCancel={() => setSubscribeOpen(false)}
          onConfirm={({ email }) => {
            setSubscribeOpen(false);
            modalRef.current?.dismiss();
            // Activer le pack acheté côté UI
            if (selected) {
              const targetId = selected.id;
              const targetNiveau = selected.niveauID;
              setPacks((prev) => prev.map((pk) => (pk.id === targetId ? { ...pk, isActive: true } : pk)));
              setSelected((prev) => (prev ? { ...prev, isActive: true } : prev));
              // Redirection automatique vers la liste des matières du pack
              router.push({
                pathname: '/(tabs)/packs/[packId]/subjects',
                params: { packId: targetId, ...(targetNiveau != null ? { niveauID: String(targetNiveau) } : {}) },
              } as any);
            }
            toast.show({
              placement: 'top',
              duration: 1600,
              render: () => (
                <Toast action="success" variant="solid" className="mx-3">
                  <ToastTitle bold>Achat confirmé</ToastTitle>
                  <ToastDescription>
                    {selected?.title} • Confirmation envoyée à {email}
                  </ToastDescription>
                </Toast>
              ),
            });
          }}
        />
      </View>
    </BottomSheetModalProvider>
  );
}
