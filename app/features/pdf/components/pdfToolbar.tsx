import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PdfToolbarProps {
  title: string;
  activeTab: "document" | "correction";
  progress: number;
  currentPage: number;
  totalPages: number;
  disabled?: boolean
  onBack: () => void;
  onChangeTab: (tab: "document" | "correction") => void;
  onDownload?: () => void;
  onMore?: () => void;
}

export default function PdfToolbar({
  title,
  activeTab,
  disabled,
  progress,
  currentPage,
  totalPages,
  onBack,
  onChangeTab,
  onDownload,
  onMore,
}: PdfToolbarProps) {
  // console.log("valeur de disable:", disabled);
  return (
    <View
      className="bg-white border-b border-gray-200"
      style={{
        paddingTop: 10,
      }}
    >
      {/* HEADER */}

      <View className="flex-row items-center justify-between px-4 pb-3">
        <TouchableOpacity
          onPress={onBack}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={22} color="#181C5C" />
        </TouchableOpacity>

        <View className="flex-1 mx-4">
          <Text numberOfLines={1} className="text-lg font-bold text-center">
            {title}
          </Text>

          <Text className="text-center text-gray-500 mt-1">
            Page {currentPage}/{totalPages}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onMore}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
        >
          <Ionicons name="ellipsis-vertical" size={22} color="#181C5C" />
        </TouchableOpacity>
      </View>

      {/* PROGRESS BAR */}

      <View
        style={{
          height: 5,
          backgroundColor: "#ECECEC",
        }}
      >
        <View
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "#F59E0B",
          }}
        />
      </View>

      {/* DOCUMENT / CORRECTION */}

      <View className="flex-row justify-center py-3 px-4 gap-3">
        <TouchableOpacity
          // disabled={disabled}
          onPress={() => onChangeTab("document")}
          className={`flex-1 h-12 rounded-full justify-center items-center ${
            activeTab === "document" ? "bg-[#181C5C]" : "bg-gray-100"
          }`}
        >
          <Text
            className={`font-bold ${
              activeTab === "document" ? "text-white" : "text-gray-600"
            }`}
          >
            Document
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          // disabled={disabled}
          onPress={() => onChangeTab("correction")}
          className={`flex-1 h-12 rounded-full justify-center items-center ${
            activeTab === "correction" ? "bg-[#181C5C]" : "bg-gray-100"
          }`}
        >
          <Text
            className={`font-bold ${
              activeTab === "correction" ? "text-white" : "text-gray-600"
            }`}
          >
            Correction
          </Text>
        </TouchableOpacity>
      </View>

      {/* ACTIONS */}

      <View className="flex-row justify-around pb-4">
        {/* <TouchableOpacity
          disabled={!onDownload}
          onPress={onDownload}
          className="items-center"
        >
          <Ionicons name="download-outline" size={24} color="#181C5C" />

          <Text className="text-xs mt-1">Offline</Text>
        </TouchableOpacity> */}

        {/* <TouchableOpacity className="items-center">
          <Ionicons name="bookmark-outline" size={24} color="#181C5C" />

          <Text className="text-xs mt-1">Favori</Text>
        </TouchableOpacity> */}

        {/* <TouchableOpacity className="items-center">
          <Ionicons name="share-social-outline" size={24} color="#181C5C" />

          <Text className="text-xs mt-1">Partager</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}
