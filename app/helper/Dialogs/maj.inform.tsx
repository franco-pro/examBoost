import { Others } from "@/app/hooks/services/others/others.entitie";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import React, { useMemo } from "react";
import {
  Linking,
  Modal,
  Platform,
  BackHandler,
  Text,
} from "react-native";


interface Props {
  visible: boolean;
  data: Others;
  onClose: () => void;
}

export default function UpdateRequiredModal({
  visible,
  data,
  onClose,
}: Props) {
  const remainingDays = useMemo(() => {
    const now = new Date();

    const deadline = new Date(data.updateDeadline);

    const diff =
      deadline.getTime() - now.getTime();

    return Math.ceil(
      diff / (1000 * 60 * 60 * 24)
    );
  }, [data]);

  const isExpired = remainingDays <= 0;

  const handleUpdate = async () => {
    const url =
      Platform.OS === "ios"
        ? data.update_link_ios
        : data.update_link_android;

    await Linking.openURL(url);
  };

  const handleQuit = () => {
    BackHandler.exitApp();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!isExpired) {
          onClose();
        }
      }}
    >
      <Box className="flex-1 items-center justify-center bg-black/60 px-6">
        <Box className="w-full rounded-3xl bg-white p-6">

          {/* Header */}
          <Box className="mb-4 items-center">

            <Box
              className={`mb-3 h-16 w-16 items-center justify-center rounded-full ${
                isExpired
                  ? "bg-red-100"
                  : "bg-orange-100"
              }`}
            >
              <Text className="text-3xl">
                🚀
              </Text>
            </Box>

            <Text className="text-center text-2xl font-bold text-blue-700">
              Mise à jour disponible
            </Text>

            <Text className="mt-1 text-center text-slate-500">
              Version {data.version_available}
            </Text>
          </Box>

          {/* Message */}
          <Box className="mb-5 rounded-2xl bg-blue-50 p-4">
            <Text className="text-center leading-6 text-slate-700">
              {data.text}
            </Text>
          </Box>

          {/* Deadline */}
          <Box
            className={`mb-6 rounded-2xl p-4 ${
              isExpired
                ? "bg-red-50"
                : "bg-orange-50"
            }`}
          >
            {isExpired ? (
              <>
                <Text className="text-center font-semibold text-red-600">
                  La période de grâce est expirée
                </Text>

                <Text className="mt-2 text-center text-red-500">
                  Une mise à jour est maintenant
                  obligatoire pour continuer à
                  utiliser l'application.
                </Text>
              </>
            ) : (
              <>
                <Text className="text-center font-semibold text-orange-600">
                  Mise à jour recommandée
                </Text>

                <Text className="mt-2 text-center text-orange-500">
                  Il vous reste{" "}
                  <Text className="font-bold">
                    {remainingDays} jour
                    {remainingDays > 1 ? "s" : ""}
                  </Text>{" "}
                  avant que la mise à jour
                  devienne obligatoire.
                </Text>
              </>
            )}
          </Box>

          {/* Actions */}
          <Button
            className="mb-3 rounded-2xl bg-orange-500"
            onPress={handleUpdate}
          >
            <ButtonText>
              Mettre à jour maintenant
            </ButtonText>
          </Button>

          {isExpired ? (
            <Button
              className="rounded-2xl bg-red-600"
              onPress={handleQuit}
            >
              <ButtonText>
                Quitter l'application
              </ButtonText>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="rounded-2xl border-slate-300"
              onPress={onClose}
            >
              <ButtonText>
                Plus tard
              </ButtonText>
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
}