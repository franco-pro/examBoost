import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { View } from "@/components/ui/view";
import { FlatList, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/hooks/redux/store";
import { useEffect } from "react";
import { logout, userDatas } from "@/app/hooks/redux/users/users.slice";
import { useRouter } from "expo-router";

import { FontAwesome } from "@expo/vector-icons";
import { ArrowRightIcon, Icon } from "@/components/ui/icon";

export default function Index() {
  const dispatch = useDispatch<any>();
  const { user, token, others } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (token) {
      dispatch(userDatas()); //to work
    }
  }, [token]);

  console.log("infos: ", user, "token:", token, "others:", others);

  const navigator = useRouter();
  const logoutHandle = () => {
    dispatch(logout());
    navigator.replace("/pages/auth/login");
  };

  //flatlist
  const DatasSubjects = [
    {
      id: "1",
      content: "bloc 1",
    },
    {
      id: "2",
      content: "bloc 2",
    },
    {
      id: "3",
      content: "bloc 3",
    },
  ];
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-[#E8F5FA]/50"
    >
      <View className="p-5 bg-[#E8F5FA]/50 flex-1">
        <Text className="text-2xl font-bold">
          Bienvenue, {user?.username || "Unknown"} 👋
        </Text>
        <Card
          size={"lg"}
          variant={"filled"}
          className="my-3 bg-primary-custom-400 rounded-l-full rounded-r-2xl   flex-row justify-start gap-10 items-center "
        >
          <View className="image rounded-2xl gap-3">
            <Image
              size={"xl"}
              source={require("../assets/images/axel.jpg")}
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
          <Button
            variant={"solid"}
            action={"negative"}
            onPress={() => logoutHandle()}
          >
            <ButtonText>Logout</ButtonText>
          </Button>
        </View>

        {/* Ton contenu */}
        <View className="flex-row justify-between items-center mt-10">
          <Text className="font-bold text-xl">Explorer les sujets</Text>
          <Button className="bg-transparent">
            <ButtonText className="flex-row items-center text-primary-custom-300">
              Tout voir{" "}
            </ButtonText>{" "}
            <Text className="text-primary-custom-300">
              <Icon
                as={ArrowRightIcon}
                color="blue"
                className="text-primary-custom-400"
              />
            </Text>
          </Button>
        </View>
        <SafeAreaProvider>
          <SafeAreaView className="flex-1">
            <FlatList
              data={DatasSubjects}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              renderItem={({ item }) => (
                <View className=" h-64 w-64 bg-gray-200 rounded-lg justify-center items-center border m-2">
                  <Text>{item.content}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </SafeAreaView>
        </SafeAreaProvider>
        <View className="title2 flex-row justify-between items-center mt-10 ">
          <Text className="font-bold text-xl">Autres sujets</Text>
          <Button className="bg-transparent">
            <ButtonText className="flex-row items-center text-primary-custom-300">
              Tout voir{" "}
            </ButtonText>{" "}
            <Text className="text-primary-custom-300">
              <Icon
                as={ArrowRightIcon}
                color="blue"
                className="text-primary-custom-400"
              />
            </Text>
          </Button>
        </View>
        <SafeAreaProvider>
          <SafeAreaView className="flex-1">
            <FlatList
              data={DatasSubjects}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              renderItem={({ item }) => (
                <View className=" h-64 w-64 bg-gray-200 rounded-lg justify-center items-center border m-2">
                  <Text>{item.content}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </SafeAreaView>
        </SafeAreaProvider>
      </View>
    </ScrollView>
  );
}
