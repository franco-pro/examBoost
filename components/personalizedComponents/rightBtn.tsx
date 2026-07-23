import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Button, ButtonIcon } from '../ui/button';
import { BellIcon, Icon, SearchIcon, SettingsIcon } from '../ui/icon';
import { HStack } from '../ui/hstack';
import { useRouter } from 'expo-router';

const RightBtn = () => {
  const navigation = useRouter()
  const handleClick = () => {
    navigation.navigate("/settings")
  }
  return (
    <View className="mr-5 flex-row  justify-center items-center gap-4">
      {/* <TouchableOpacity
        className=" bg-transparent  "
        activeOpacity={0.3}
      >
        <Icon as={BellIcon} className="" />
      </TouchableOpacity> */}
      {/* <TouchableOpacity
        className=" bg-transparent "
        activeOpacity={0.8}
      >
        <Icon as={SearchIcon} />
      </TouchableOpacity> */}
      <TouchableOpacity
        className=" bg-transparent "
        activeOpacity={0.8}
        onPress={() => handleClick()}
      >
        <Icon as={SettingsIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default RightBtn