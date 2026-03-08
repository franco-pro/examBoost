import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { View } from "@/components/ui/view";
import { FlatList, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { useDispatch, useSelector } from "react-redux";
import { persistor, RootState } from "@/app/hooks/redux/store";
import { useEffect, useMemo, useState } from "react";
import { logout, userDatas } from "@/app/hooks/redux/users/users.slice";
import { useRouter } from "expo-router";

import { FontAwesome } from "@expo/vector-icons";
import { ArrowRightIcon, Icon } from "@/components/ui/icon";
import pdfImage from "../assets/images/pdf.png";
import { useTranslation } from "react-i18next";
import i18n from "@/lang/i18n";

export default function Index() {
  const { t } = useTranslation("home");
  console.log("LANG:", i18n.language);
  console.log("WELCOME:", t("accueil.welcome"));
  const dispatch = useDispatch<any>();
  const { user, accessToken, refreshToken, others } = useSelector(
    (state: RootState) => state.user,
  );

  // useEffect(() => {
  //   if (accessToken) {
  //     dispatch(userDatas()); //to work
  //   }
  // }, [accessToken]);

  // console.log(
  //   "infos: ",
  //   user,
  //   "token:",
  //   "AccessToken",
  //   accessToken,
  //   "refreshToken",
  //   refreshToken,
  //   "others:",
  //   others,
  // );
  // console.log("subjects:", others.subject || "subject is null");
  const navigator = useRouter();

  const DataSubjectsTab = useMemo(() => {
    if (!others.subject) return [];

    return others.subject.map((item: any, index: number) => ({
      id: `${index + 1}`,
      content: item.subject || "unknown",
      image: pdfImage,
    }));
  }, [others]);

  console.log("datas:", DataSubjectsTab);

  const logoutHandle = async () => {
    dispatch(logout());
    await persistor.purge();
    navigator.replace("/(auth)/login");
  };

  //flatlist
  const DatasSubjects = [
    {
      id: "1",
      content: "bloc 1",
      image: pdfImage,
    },
    {
      id: "2",
      content: "bloc 2",
      image: pdfImage,
    },
    {
      id: "3",
      content: "bloc 3",
      image: pdfImage,
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-gray-50"
    >
      <View className="p-5 bg-[#E8F5A80] flex-1">
        <Text className="text-2xl font-bold">
          {t("accueil.welcome")}, {user?.username || user?.surname || "Unknown"}{" "}
          👋
        </Text>
        <Card
          size={"lg"}
          variant={"filled"}
          className="my-3 bg-primary-custom-400 rounded-l-full rounded-[30px] flex-row justify-center  gap-10 items-center "
        >
          <View className="image rounded-2xl gap-3">
            <Image
              size={"xl"}
              source={require("../assets/images/profile_bl.png")}
              alt="axel profil"
              className="rounded-full"
            />
          </View>
          <View className="soldes_transactions gap-2">
            <View className="soldes ">
              <View className=" gap-3 flex-row items-center">
                <FontAwesome name="exchange" size={15} color="orange" />
                <Text className="text-white font-montserrat font-bold">
                  {t("accueil.principal_amount")}
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
                {t("accueil.transactions")}
              </Text>
              <FontAwesome name="chevron-right" size={15} color="orange" />
            </View>
          </View>
        </Card>
        <View>
          {/* <Button
            variant={"solid"}
            action={"negative"}
            onPress={() => logoutHandle()}
          >
            <ButtonText>Logout</ButtonText>
          </Button> */}
        </View>

        {/* Ton contenu */}
        <View className="flex-row justify-between items-center mt-10">
          <Text className="font-bold text-xl">
            {" "}
            {t("accueil.explore_subjets")}
          </Text>
          <Button className="bg-transparent">
            <ButtonText className="flex-row items-center text-primary-custom-300">
               {t("accueil.view_all")}{" "}
            </ButtonText>
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
              data={DataSubjectsTab}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              renderItem={({ item }) => (
                <View className=" h-44 w-44 bg-gray-200 rounded-lg justify-center items-center border m-2">
                  <View className="flex-1 justify-center items-center gap-3">
                    <Image
                      size={"md"}
                      source={item.image}
                      alt="image pdf"
                      className=" "
                    />
                    <Text
                      className="text-center font-semibold text-normal px-2"
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.content}
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </SafeAreaView>
        </SafeAreaProvider>
        <View className="title2 flex-row justify-between items-center mt-10 ">
          <Text className="font-bold text-xl"> {t("accueil.other_subjets")}</Text>
          <Button className="bg-transparent">
            <ButtonText className="flex-row items-center text-primary-custom-300">
               {t("accueil.view_all")}
            </ButtonText>
            <Text className="text-primary-custom-300">
              <Icon
                as={ArrowRightIcon}
                color="blue"
                className="text-primary-custom-h-440"
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
                <View className=" h-44 w-44 bg-gray-200 rounded-lg justify-center items-center border m-2">
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
