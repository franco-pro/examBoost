import { View, Text } from "react-native";
import React from "react";

const LogoHeaderComponent = () => {
  return (
    <View className="flex-row text-left">
      <Text className=" text-primary-custom-400 text-xl ">Exam</Text>
      <Text className=" text-secondary-custom-400 text-xl font-bold">
        Boost.
      </Text>
    </View>
  );
};

export default LogoHeaderComponent;
