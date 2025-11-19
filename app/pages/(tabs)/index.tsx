import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { View } from '@/components/ui/view';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDispatch, useSelector, } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { useEffect } from 'react';
import { logout, userDatas } from '@/app/redux/users/users.slice';
import { useRouter } from 'expo-router';

import { FontAwesome } from '@expo/vector-icons';

export default function Index() {
  const dispatch = useDispatch<any>()
  const { user, token,others } = useSelector((state: RootState) => state.user)
  useEffect(() => {
    if (token) {
      dispatch(userDatas()) //to work
    }
  }, [token]);

  console.log("infos: ", user, "token:", token, "others:", others);
  
  const navigator = useRouter()
  const logoutHandle = () => {
    dispatch(logout())
    navigator.replace("/pages/auth/login")
  }
  return (
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        // className="flex-1 bg-gray-600 items-center justify-center"
      >
        <View className="p-5 bg-[#E8F5FA]">
          <Text className="text-2xl font-bold">
            Bienvenue, {user?.username || "Unknown"} 👋
          </Text>
          <Card
            size={"xl"}
            variant={"filled"}
            className="my-3 bg-primary-custom-400 rounded-l-full rounded-r-2xl   flex-row justify-start gap-10 items-center "
          >
            <View className="image rounded-2xl gap-3">
              <Image
                size={"xl"}
                source={require("../../assets/images/axel.jpg")}
                alt="axel profil"
                className="rounded-full"
              />
            </View>
            <View className="soldes_transactions gap-2">
              <View className="soldes ">
                <View className=" gap-3 flex-row items-center">
                  <FontAwesome name="exchange" size={15} color="orange" />
                  <Text className="text-white font-montserrat font-bold">
                    Solde Principal
                  </Text>
                </View>
                <View>
                  <Text className="text-white text-2xl ">
                    {user ? user?.wallet : "----"} Fcfa
                  </Text>
                </View>
              </View>
              <View className="transaction gap-3 flex-row items-center ">
                <Text className="text-lg text-secondary-custom-300 ">
                  Mes transactions
                </Text>
                <FontAwesome name="chevron-right" size={15} color="orange" />
              </View>
            </View>
          </Card>
          <View>
            <Button variant={"solid"} action={"negative"} onPress={() => logoutHandle()}>
              <ButtonText>Logout</ButtonText>
            </Button>
          </View>

          {/* Ton contenu */}
          <View className="mt-5 h-64 bg-gray-200 rounded-lg justify-center items-center">
            <Text>Bloc 1</Text>
          </View>

          <View className="mt-5 h-64 bg-gray-300 rounded-lg justify-center items-center">
            <Text>Bloc 2</Text>
          </View>

          <View className="mt-5 h-64 bg-gray-400 rounded-lg justify-center items-center">
            <Text>Bloc 3</Text>
          </View>
        </View>
      </ScrollView>
  );
}



