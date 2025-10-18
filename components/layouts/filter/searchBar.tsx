import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Filter() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <View className="relative my-4">
      {/* Barre de recherche */}
      <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          placeholder="Rechercher une compétition..."
          className="flex-1 text-gray-700 p-2"
          underlineColorAndroid="transparent"
          style={{ outlineWidth: 0 }}
        />

        {/* Bouton filtre */}
        <TouchableOpacity onPress={() => setShowFilters(true)}>
          <Ionicons name="filter" size={22} color="#4b5563" />
        </TouchableOpacity>
      </View>

      {/* Menu de filtres en z-index (Modal) */}
      <Modal
        visible={showFilters}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilters(false)}
      >
        <Pressable
          className="flex-1 bg-black/30"
          onPress={() => setShowFilters(false)}
        >
          <View
            className="absolute right-4 top-16 bg-white rounded-2xl p-4 shadow-lg w-60"
            style={{ elevation: 10 }}
          >
            <Text className="text-gray-900 font-semibold mb-3">Filtres</Text>

            {/* Statut */}
            <Pressable className="py-2 border-b border-gray-200">
              <Text className="text-gray-700">Statut : Actif</Text>
            </Pressable>

            {/* Date */}
            <Pressable className="py-2 border-b border-gray-200">
              <Text className="text-gray-700">Date : Récente</Text>
            </Pressable>

            {/* Autre filtre */}
            <Pressable className="py-2">
              <Text className="text-gray-700">Catégorie : Sport</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
