import { View, Text } from 'react-native'
import React from 'react'
import { Button, ButtonIcon } from '../ui/button';
import { BellIcon, Icon, SearchIcon, SettingsIcon } from '../ui/icon';
import { HStack } from '../ui/hstack';

const RightBtn = () => {
  return (
    <HStack className="mr-5 ">
      <Button className=" bg-transparent w-10 h-10">
        <Icon as={BellIcon} className="" />
      </Button>
      <Button className=" bg-transparent w-10 h-10">
        <Icon as={SearchIcon} />
      </Button>
      <Button className=" bg-transparent w-10 h-10">
        <Icon as={SettingsIcon} />
      </Button>
    </HStack>
  );
};

export default RightBtn