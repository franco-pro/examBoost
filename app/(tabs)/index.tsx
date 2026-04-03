import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { View } from "@/components/ui/view";
import { FlatList, Modal, ScrollView, TouchableOpacity } from "react-native";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleOpenDocument, subjectDocumentype } from "../downloadFiles";
import { initializeNotificationsGateway } from "../hooks/services/socket/notifications.gateway";

import Pdf from "react-native-pdf";

export default function Index() {
  const navigation = useRouter();
  if (!AsyncStorage.getItem("accessToken")) {
    navigation.replace("/(auth)/login")
  }
  const { t } = useTranslation("home");
  console.log("LANG:", i18n.language);
  console.log("WELCOME:", t("accueil.welcome"));
  const dispatch = useDispatch<any>();
  const { user, others , accessToken} = useSelector(
    (state: RootState) => state.user,
  );
  initializeNotificationsGateway(dispatch, user?.id || 0);
  useEffect(() => {
    if (accessToken) {
      dispatch(userDatas()); //to work
    }
  }, [accessToken,dispatch]);

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
// console.log("others datas:", others, "user datas", user)
  const DataSubjectsTab = useMemo(() => {
    if (!others?.subject) return [];
    return others.subject.map((item: any, index: number) => ({
      id: `${index + 1}`,
      content: item.subject || "unknown",
      image: pdfImage,
      url: item.url
    }));
  }, [others]);

  // console.log("datas subjects:", DataSubjectsTab);

  const logoutHandle = async () => {
    dispatch(logout());
    await persistor.purge();
    navigation.replace("/(auth)/login");
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

  //open file
  const [loading, setLoading] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");

  const handlePressDocument = async (doc: subjectDocumentype) => {
    try {
      setLoading(true);
      const result = await handleOpenDocument(doc);
      if (!result) {
        console.log("result data: ", result)
        return "";
      }

      setSelectedUri(result.localUri);
      setSelectedTitle(result.title);
      setViewerVisible(true);
    } catch (err) {
      console.log("erreur lors de l'ouverture du fichier dans tabs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-gray-50"
      >
        <View className="p-5 bg-[#E8F5A80] flex-1">
          <Text className="text-2xl font-bold">
            {t("accueil.welcome")},{" "}
            {user?.username || user?.surname || "Unknown"} 👋
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
                <Button
                  className=" bg-transparent"
                  onPress={() => navigation.navigate("/(tabs)/transaction")}
                >
                  <ButtonText className=" text-primary-defaultOrange">
                    {t("accueil.transactions")}
                  </ButtonText>
                  <FontAwesome name="chevron-right" size={15} color="orange" />
                </Button>
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
            <Text className="font-bold text-xl">
              {" "}
              {t("accueil.explore_subjets")}
            </Text>
            <Button className="bg-transparent" onPress={()=> navigation.navigate("/(tabs)/pack")}>
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
                  <TouchableOpacity onPress={() => handlePressDocument(item)}>
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
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
              />
            </SafeAreaView>
          </SafeAreaProvider>
          <View className="title2 flex-row justify-between items-center mt-10 ">
            <Text className="font-bold text-xl">
              {" "}
              {t("accueil.other_subjets")}
            </Text>
            <Button className="bg-transparent" onPress={() => navigation.navigate("/(tabs)/pack")}>
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
      <Modal
        visible={viewerVisible}
        animationType="slide"
        onRequestClose={() => setViewerVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <View
            style={{
              paddingTop: 50,
              paddingHorizontal: 16,
              paddingBottom: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", flex: 1 }}>
              {selectedTitle}
            </Text>

            <TouchableOpacity onPress={() => setViewerVisible(false)}>
              <Text style={{ fontWeight: "bold" }}>Fermer</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            {selectedUri ? (
              <Text style={{ padding: 20 }}>{selectedUri}</Text>
              // <Pdf
              //   source={{ uri: selectedUri }}
              //   style={{ flex: 1, width: "100%" }}
              //   onLoadComplete={(numberOfPages) => {
              //     console.log("Nombre de pages:", numberOfPages);
              //   }}
              //   onError={(error) => {
              //     console.log("Erreur affichage PDF:", error);
              //   }}
              // />
            ) : (
              <Text style={{ padding: 20 }}>Aucun document chargé</Text>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
