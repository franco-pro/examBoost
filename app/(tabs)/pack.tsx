import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { usePacksQuery, usePurchasePackMutation } from '@/app/features/packs/hooks.rq';
import PackDetailSheet from '@/app/features/packs/PackDetailSheet';
import PackHeader from '@/app/features/packs/PackHeader';
import PackList from '@/app/features/packs/PackList';
import SubscribeModal from '@/app/features/packs/SubscribeModal';
import type { Pack } from '@/app/features/packs/types';
import { useUser } from '@/app/features/user/hooks';
import { setCurrentUserId } from '@/app/hooks/redux/session/session.slice';
import type { RootState } from '@/app/hooks/redux/store';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const CURRENT_USER_ID = 42;

export default function PackScreen() {
  const [search, setSearch] = useState('');
  const toast = useToast();
  const modalRef = useRef<BottomSheetModal>(null);
  const [selected, setSelected] = useState<Pack | null>(null);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUserId = useSelector((s: RootState) => s.session.currentUserId ?? CURRENT_USER_ID);

  useEffect(() => {
    dispatch(setCurrentUserId(CURRENT_USER_ID));
  }, [dispatch]);

  const packsQuery = usePacksQuery(currentUserId ?? undefined);
  const purchasePackMutation = usePurchasePackMutation();
  const userQuery = useUser(currentUserId ?? undefined);
  const currentUserWallet = userQuery.data?.wallet;

  const packs = packsQuery.data ?? [];

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
            refreshing={packsQuery.isRefetching}
            onRefresh={() => {
              void packsQuery.refetch();
            }}
            onPressPack={(p) => {
              void Haptics.selectionAsync();
              if (p.isSubscribed) {
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
              if (p.isSubscribed) {
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
          userWallet={typeof currentUserWallet === 'number' ? currentUserWallet : undefined}
          onCancel={() => setSubscribeOpen(false)}
          onConfirm={async ({ accept }) => {
            if (!accept) return;
            if (!currentUserId) return;
            if (!selected?.id) return;

            const packID = Number(selected.id);
            if (Number.isNaN(packID)) return;

            try {
              await purchasePackMutation.mutateAsync({ userID: currentUserId, packID });
              setSubscribeOpen(false);
              modalRef.current?.dismiss();

              router.push({
                pathname: '/(tabs)/packs/[packId]/subjects',
                params: { packId: String(packID), ...(selected.niveauID != null ? { niveauID: String(selected.niveauID) } : {}) },
              } as any);

              toast.show({
                placement: 'top',
                duration: 1600,
                render: () => (
                  <Toast action="success" variant="solid" className="mx-3">
                    <ToastTitle bold>Achat confirmé</ToastTitle>
                    <ToastDescription>{selected?.title}</ToastDescription>
                  </Toast>
                ),
              });
            } catch (e: any) {
              toast.show({
                placement: 'top',
                duration: 2000,
                render: () => (
                  <Toast action="error" variant="solid" className="mx-3">
                    <ToastTitle bold>Erreur achat</ToastTitle>
                    <ToastDescription>{String(e?.message ?? 'Impossible d\'acheter le pack')}</ToastDescription>
                  </Toast>
                ),
              });
            }
          }}
        />
      </View>
    </BottomSheetModalProvider>
  );
}
