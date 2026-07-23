import React, { useCallback, useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";

import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { Box } from "@/components/ui/box";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { setSelectedOther } from "@/app/hooks/redux/others/others.slice";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { createOther, updateOther } from "@/app/hooks/redux/others/others.thunks";



export default function MajForm() {
  const { selectedOther } = useAppSelector(
    (state) => state.others
  );
  const dispatch = useAppDispatch();
  
  const [form, setForm] = useState({
    text: "",
    version_available: "",
    features: "",
    update_link_ios: "",
    update_link_android: "",
    updateDeadline: "",
    newUpdate: true,
  });

  useEffect(() => {
    if (selectedOther) {
      setForm({
        text: selectedOther.text ?? "",
        version_available:
          selectedOther.version_available ?? "",
        features: selectedOther.features ?? "",
        update_link_ios:
          selectedOther.update_link_ios ?? "",
        update_link_android:
          selectedOther.update_link_android ?? "",
        updateDeadline: selectedOther.updateDeadline
          ? new Date(selectedOther.updateDeadline)
              .toISOString()
              .split("T")[0]
          : "",
        newUpdate: selectedOther.newUpdate,
      });
    }
  }, [selectedOther]);

  useFocusEffect(
    useCallback(() => {
        return () => {
            dispatch(setSelectedOther(null))
        }
    }, [])
  )

  const handleChange = (
    field: string,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (selectedOther) {
      const newForm = {
        ...form,
        updateDeadline: new Date(form.updateDeadline).toISOString(), 
      }
      console.log("UPDATE", newForm);
      dispatch(updateOther({...newForm, updateDeadline: newForm.updateDeadline as any, id: selectedOther.id, createAt: selectedOther.createAt, updateAt: selectedOther.updateAt}))
        .then(()=> {
         Alert.alert(
          "Mise à jour",
          "Mise à jour de l'annonce effectuée.",
         )
          router.back()
        })
        .catch((error: any)=> {
            Alert.alert(
              "Error",
              "Une érreur est survenue lors de la MAJ de l'annonce. " + error,
          )
          router.back()
          console.log('error on update ', error);
        });


    } else {
      const newForm = {
        ...form,
        updateDeadline: new Date(form.updateDeadline).toISOString(), 
      }
      dispatch(createOther(newForm as any)).then(()=>{
        Alert.alert(
          "Creation de l'annonce",
          "La creation s'est éffectué avec succès.",
         )
          router.back()
      })
      .catch((error)=>{
        Alert.alert(
          "Error",
          "Une érreur est survenue lors de la creation de l'annonce. " + error,
         )
          router.back()
        console.log('error on creation ', error);
      })
    }
  };

  return (
    <View className="flex-1 bg-gray-50 pt-[40px] pb-[10px] px-4">
      {/* Bouton Retour */}
      <TouchableOpacity
        className="flex-row items-center mb-6"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={'gray'} />
        <Text className="ml-2 text-lg font-semibold text-gray-800">Retour</Text>
      </TouchableOpacity>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
        >
    <Box className="flex-1 bg-slate-50">
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 50,
        }}
      >
        {/* Header */}
        <Box className="mb-6">
          <Text className="text-3xl font-bold text-blue-700">
            {selectedOther
              ? "Modifier la mise à jour"
              : "Nouvelle mise à jour"}
          </Text>

          <Text className="mt-1 text-slate-500">
            Renseignez les informations de la version.
          </Text>
        </Box>

        {/* Carte formulaire */}
        <Box className="rounded-3xl bg-white p-5 shadow-sm">

          {/* Version */}
          <Box className="mb-4">
            <Text className="mb-2 font-medium text-slate-700">
              Version disponible
            </Text>

            <Input className="rounded-xl border-blue-100">
              <InputField
                placeholder="Ex : 2.4.0"
                value={form.version_available}
                onChangeText={(v) =>
                  handleChange(
                    "version_available",
                    v
                  )
                }
              />
            </Input>
          </Box>

          {/* Description */}
          <Box className="mb-4">
            <Text className="mb-2 font-medium text-slate-700">
              Description
            </Text>

            <Textarea
              size="md"
              className="rounded-xl border-blue-100"
            >
              <TextareaInput
                placeholder="Description de la mise à jour..."
                value={form.text}
                onChangeText={(v) =>
                  handleChange("text", v)
                }
              />
            </Textarea>
          </Box>

          {/* Features */}
          <Box className="mb-4">
            <Text className="mb-2 font-medium text-slate-700">
              Nouvelles fonctionnalités
            </Text>

            <Textarea
              size="md"
              className="rounded-xl border-blue-100"
            >
              <TextareaInput
                placeholder="Liste des nouveautés..."
                value={form.features}
                onChangeText={(v) =>
                  handleChange("features", v)
                }
              />
            </Textarea>
          </Box>

          {/* Date limite */}
          <Box className="mb-4">
            <Text className="mb-2 font-medium text-slate-700">
              Date limite
            </Text>

            <Input className="rounded-xl border-blue-100">
              <InputField
                placeholder="2026-12-31"
                value={form.updateDeadline}
                onChangeText={(v) =>
                  handleChange(
                    "updateDeadline",
                    v
                  )
                }
              />
            </Input>
          </Box>

          {/* Android */}
          <Box className="mb-4">
            <Text className="mb-2 font-medium text-slate-700">
              Lien Android
            </Text>

            <Input className="rounded-xl border-blue-100">
              <InputField
                placeholder="https://play.google.com/..."
                value={form.update_link_android}
                onChangeText={(v) =>
                  handleChange(
                    "update_link_android",
                    v
                  )
                }
              />
            </Input>
          </Box>

          {/* IOS */}
          <Box className="mb-5">
            <Text className="mb-2 font-medium text-slate-700">
              Lien iOS
            </Text>

            <Input className="rounded-xl border-blue-100">
              <InputField
                placeholder="https://apps.apple.com/..."
                value={form.update_link_ios}
                onChangeText={(v) =>
                  handleChange(
                    "update_link_ios",
                    v
                  )
                }
              />
            </Input>
          </Box>

          {/* Switch */}
          <Box className="mb-6 flex-row items-center justify-between rounded-2xl bg-blue-50 p-4">
            <Box>
              <Text className="font-semibold text-blue-700">
                Nouvelle mise à jour
              </Text>

              <Text className="text-sm text-slate-500">
                Annonce faite aux users, si activé.
              </Text>
            </Box>

            <Switch
              value={form.newUpdate}
              onValueChange={(v) =>
                handleChange("newUpdate", v)
              }
            />
          </Box>

          {/* Submit */}
          <Button
            className="rounded-2xl bg-orange-500"
            onPress={handleSubmit}
          >
            <ButtonText>
              {selectedOther
                ? "Mettre à jour"
                : "Créer la mise à jour"}
            </ButtonText>
          </Button>
        </Box>
      </ScrollView>
      </Box>
      </KeyboardAvoidingView>
    </View>
    
  );
}