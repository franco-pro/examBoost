import { View, Text } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { Button, ButtonIcon } from '../ui/button'

export default function BtnHeaderComponent() {
    const navigation = useRouter()
    const handleNotification = () => {
        navigation.navigate("/pages/transaction")
    }

  return (
    <View className='flex gap-3'>
      <Button> <ButtonIcon as={"search"}/></Button>
      <Button> <ButtonIcon as={"search"}/></Button>
      <Button> <ButtonIcon as={"search"}/></Button>
    </View>
  )
}