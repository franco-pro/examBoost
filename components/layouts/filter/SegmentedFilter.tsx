// app/components/SegmentedFilter.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface SegmentedFilterProps<T extends string> {
  options: T[]; // Liste des filtres, ex: ["all", "withdraw", "deposit"]
  defaultValue?: T;
  onChange: (value: T) => void;
}

export default function SegmentedFilter<T extends string>({
  options,
  defaultValue,
  onChange,
}: SegmentedFilterProps<T>) {
  const [active, setActive] = useState<T>(defaultValue || options[0]);

  const handlePress = (value: T) => {
    setActive(value);
    onChange(value);
  };

  return (
    <View >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          className="px-4 p-3 bg-blue-200 mr-2 rounded-full" 
          style={[styles.button, active === option && styles.activeButton]}
          onPress={() => handlePress(option)}
        >
          <Text style={[styles.buttonText, active === option && styles.activeButtonText]}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    alignSelf: "center",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
  },
  activeButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#333",
    fontWeight: "500",
  },
  activeButtonText: {
    color: "#fff",
  },
});
