import React, { forwardRef, useCallback, useMemo } from "react";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { TouchableOpacity, Text, View } from "react-native";

interface Level {
  id: number;
  name: string;
}

interface Props {
  data: Level[];
  selected?: number;
  onSelect: (item: Level) => void;
}

const LevelBottomSheet = forwardRef<BottomSheet, Props>(
  ({ data, selected, onSelect }, ref) => {
    const snapPoints = useMemo(() => ["55%"], []);

    const renderItem = useCallback(
      ({ item }: { item: Level }) => (
        <TouchableOpacity
          className="px-6 py-5 border-b border-gray-100 flex-row justify-between items-center"
          onPress={() => onSelect(item)}
        >
          <Text className="text-lg font-semibold">{item.name}</Text>

          {selected === item.id && (
            <Text className="text-blue-600 font-bold">✓</Text>
          )}
        </TouchableOpacity>
      ),
      [selected, onSelect],
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        {/* <View className="px-6 pb-3">
          <Text className="text-xl font-bold">Choisir un niveau</Text>
        </View> */}

        <BottomSheetFlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </BottomSheet>
    );
  },
);

LevelBottomSheet.displayName = "LevelBottomSheet";

export default LevelBottomSheet;
