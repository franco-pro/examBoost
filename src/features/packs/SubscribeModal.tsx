import { formatPriceXOF } from '@/src/utils/format';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';
import type { Pack } from './types';

export default function SubscribeModal({
  visible,
  pack,
  onCancel,
  onConfirm,
  userWallet,
  onRecharge,
}: {
  visible: boolean;
  pack: Pack | null;
  onCancel: () => void;
  onConfirm: (payload: { accept: boolean }) => void;
  userWallet?: number;
  onRecharge?: () => void;
}) {
  const [accept, setAccept] = useState(false);

  // Reset form when pack changes or when opened
  React.useEffect(() => {
    if (visible) {
      setAccept(false);
    }
  }, [visible, pack]);

  const expiredAt = useMemo(() => {
    if (!pack?.durationDays) return null;
    const d = new Date();
    d.setDate(d.getDate() + pack.durationDays);
    return d.toLocaleDateString();
  }, [pack]);

  const hasFunds = useMemo(() => {
    if (pack?.price == null) return true;
    if (userWallet == null) return true; // si pas d'info, ne bloque pas
    return userWallet >= pack.price;
  }, [pack, userWallet]);

  if (!pack) return null;

  return (
    <Modal
      visible={visible}
      animationType={Platform.select({ web: 'fade', default: 'slide' }) as any}
      transparent
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-4">
        <View className="w-full max-w-md rounded-2xl overflow-hidden bg-background-light dark:bg-background-dark border border-outline-100 dark:border-outline-800 shadow-xl">
          {/* Bandeau visuel */}
          <View className="h-20 bg-gradient-to-r from-[rgba(24,28,92,0.9)] to-[rgba(255,137,79,0.9)]" />

          <View className="p-4">
            {/* En-tête: icône + infos pack + badge prix */}
            <View className="flex-row items-start justify-between -mt-10">
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 rounded-xl bg-primary-defaultOrange items-center justify-center ring-4 ring-white/40 dark:ring-outline-900/60">
                  <Ionicons name="briefcase" size={20} color="#181c5c" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-extrabold text-typography-default dark:text-typography-white" numberOfLines={2}>
                    {pack.title}
                  </Text>
                  {pack.durationDays != null ? (
                    <Text className="text-xxs text-typography-gray">Durée {pack.durationDays} jours{expiredAt ? ` · jusqu'au ${expiredAt}` : ''}</Text>
                  ) : null}
                </View>
              </View>
              {pack.price != null ? (
                <View className="px-2 py-1 rounded-md bg-white dark:bg-outline-900 border border-outline-100 dark:border-outline-800 shadow-sm">
                  <Text className="text-xs font-extrabold text-typography-default dark:text-typography-white">{formatPriceXOF(pack.price)}</Text>
                </View>
              ) : null}
            </View>

            {/* Message d'accroche + avantages */}
            <Text className="mt-3 text-sm text-typography-default dark:text-typography-white">
              {"Confirmez votre achat pour débloquer l'accès immédiat aux matières, sujets et contenus inclus."}
            </Text>
            <View className="mt-3 gap-2">
              <View className="flex-row items-center gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                <Text className="text-xs text-typography-default dark:text-typography-white">Accès instantané après paiement</Text>
              </View>
              {typeof pack.durationDays === 'number' ? (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                  <Text className="text-xs text-typography-default dark:text-typography-white">Valable {pack.durationDays} jours</Text>
                </View>
              ) : null}
              <View className="flex-row items-center gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                <Text className="text-xs text-typography-default dark:text-typography-white">Support prioritaire</Text>
              </View>
            </View>

            {/* Montant prélevé */}
            {pack.price != null ? (
              <View className="mt-4 gap-1">
                <Text className="text-xs text-typography-gray">Montant qui sera prélevé</Text>
                <Text className="text-sm font-extrabold text-typography-default dark:text-typography-white">{formatPriceXOF(pack.price)}</Text>
              </View>
            ) : null}

            {/* Actions */}
            <View className="mt-5 flex-row items-center justify-between gap-2">
              <View className="flex-1 pr-2 gap-2">
                <Pressable
                  onPress={() => setAccept((v) => !v)}
                  className="flex-row items-center gap-2"
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: accept }}
                  accessibilityLabel="J’accepte de payer via mon wallet"
                >
                  <View className={`w-5 h-5 rounded-md items-center justify-center border ${accept ? 'bg-primary-defaultOrange border-primary-defaultOrange' : 'bg-white dark:bg-outline-900 border-outline-300 dark:border-outline-700'}`}>
                    {accept ? <Ionicons name="checkmark" size={14} color="#181c5c" /> : null}
                  </View>
                  <Text className="text-xs text-typography-default dark:text-typography-white">J’accepte de payer via mon wallet</Text>
                </Pressable>

                {!hasFunds && (
                  <>
                    <Text className="text-xxs text-error-500">
                      Solde insuffisant: votre solde est de {userWallet != null ? formatPriceXOF(userWallet) : '—'}, prix du pack {pack.price != null ? formatPriceXOF(pack.price) : '—'}.
                    </Text>
                    {onRecharge && (
                      <Pressable onPress={onRecharge} className="self-start px-3 py-1.5 rounded-md bg-primary-defaultOrange/15 border border-primary-defaultOrange/40 active:opacity-90">
                        <Text className="text-xs font-extrabold text-primary-defaultBlue">Recharger</Text>
                      </Pressable>
                    )}
                  </>
                )}
              </View>
              <Pressable onPress={onCancel} className="px-4 py-2 rounded-md bg-white dark:bg-outline-900 border border-outline-200 dark:border-outline-700 active:opacity-90">
                <Text className="text-sm text-typography-default dark:text-typography-white">Annuler</Text>
              </Pressable>
              <Pressable
                disabled={!accept || !hasFunds}
                onPress={() => onConfirm({ accept })}
                className={`px-4 py-2 rounded-md ${!accept || !hasFunds ? 'bg-primary-defaultOrange/60' : 'bg-primary-defaultOrange active:opacity-90'} `}
                accessibilityLabel="Confirmer l'achat"
              >
                <Text className="text-sm font-extrabold text-primary-defaultBlue">Confirmer</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
