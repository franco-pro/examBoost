import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { View } from "@/components/ui/view";
import { Dimensions } from "react-native";
import { FlatList, Modal, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/hooks/redux/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { logout, userDatas } from "@/app/hooks/redux/users/users.slice";
import { router, useFocusEffect, useRouter } from "expo-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";

import { FontAwesome } from "@expo/vector-icons";
import { ArrowRightIcon, Icon } from "@/components/ui/icon";
import * as pdfImage from "../helper/images/image";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleOpenDocument, subjectDocumentype } from "../downloadFiles";
import { initializeNotificationsGateway } from "../hooks/services/socket/notifications.gateway";

import i18n from "@/lang/i18n";
import Pdf from "react-native-pdf";
import { useUserQuery } from "../features/user/hooks.rq";
import {
  getRecentDocuments,
  RecentDocument,
} from "../hooks/files/recentDocuments/recentDocument";
import { buildFileUrl } from "../hooks/files/buildRouteFiles";
import { usePacksQuery } from "../features/packs/hooks.rq";
import { packProps } from "../api/packService";

interface subjectType {
  id: number;
  content: string;
  url: string;
  subject: string;
}

dayjs.extend(relativeTime);
dayjs.locale("fr");
export default function Index() {


  const [recentDocument, setRecentDocument] = useState<RecentDocument[]>([]);
  
  const navigation = useRouter();
  if (!AsyncStorage.getItem("accessToken")) {
    navigation.replace("/(auth)/login");
  }
  const { t } = useTranslation("home");
  const { width } = Dimensions.get("window");
  // console.log("LANG:", i18n.language);
  // console.log("WELCOME:", t("accueil.welcome"));
  const dispatch = useDispatch<any>();
  const { user, others, accessToken } = useSelector(
    (state: RootState) => state.user,
  );

  //Gestion des proprietes de pack
  const currentUserId = user?.id
  const packsQuery = usePacksQuery(currentUserId ?? 0);
  const [packs, setPacks] = useState<packProps[]>([]);
  // console.log("packs dans index: ", packs)
    useEffect(() => {
      setPacks(packsQuery.data??[]);
    }, [packsQuery.data]);
  
  const loadRecent = async () => {
    const data = await getRecentDocuments();
    setRecentDocument(data);
  };

  useFocusEffect(
    useCallback(() => {
       loadRecent()
    }, []),
  );
  useEffect(() => {
    if (accessToken) {
      dispatch(userDatas()); //to work
      
      loadRecent();
    }
  }, [accessToken, dispatch]);

  console.log("useFocus after:", recentDocument)
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
  const images = Object.values(pdfImage);
  const colors = ["#E8F0FE", "#E8FFF3", "#FDECEF", "#FFF4E5", "#F3E8FF"];
  const bgColors = ["#8FB0FF", "#7EE2A8", "#F29AAD", "#FFB86B", "#B784F7"];
  const sombreColors = [
    "#8FB0FFCC",
    "#7EE2A8CC",
    "#F29AADCC",
    "#FFB86BCC",
    "#B784F7CC",
  ];

  //datas subjects of users
  const DataSubjectsTab = useMemo(() => {
    try {
      if (!others?.subject) return [];
      console.log("colors: ", colors[0]);

      const mapped = others.subject.map((item: subjectType, index: number) => {
        return {
          id: `${item.id}`,
          content: item.subject || "Unknown",
          image: images[index % images.length],
          url: item.url,
          color: colors[index % colors.length],
          sombreColor: sombreColors[index % sombreColors.length],
          bgColor: bgColors[index % bgColors.length],
        };
      });

      const sliceMapped = mapped.slice(0, 5);
      // console.log("type de mapped:", mapped.slice(0, 2));
      return sliceMapped;
    } catch (error) {
      console.log("others datas:", others, "user datas", user);
      console.log("error:", error);
    }
  }, [others]);
  const recentDataSubjectsTab = useMemo(() => {
    try {
      if (!others?.subject) return [];
      console.log("colors: ", colors[0]);

      const mapped = others.subject.map((item: subjectType, index: number) => {
        const recent = recentDocument.find((d) => d.documentId === item.id);
        // console.log("openedAt: ", recentDocument)

        return {
          id: `${item.id}`,
          content: item.subject || "Unknown",
          image: images[index % images.length],
          url: item.url,
          color: colors[index % colors.length],
          sombreColor: sombreColors[index % sombreColors.length],
          bgColor: bgColors[index % bgColors.length],
          progress: recent?.progress ?? 0,
          currentPage: recent?.currentPage ?? 1,
          totalPages: recent?.totalPages ?? 1,
          lastOpened: recent?.openedAt ?? null,
        };
      });

      //trier le tableau
      mapped.sort((a: any, b: any) => {
        if (!a.lastOpened) return 1;
        if (!b.lastOpened) return -1;

        return (
          new Date(b.lastOpened).getTime() - new Date(a.lastOpened).getTime()
        );
      });

      return mapped;
    } catch (error) {
      console.log("others datas:", others, "user datas", user);
      console.log("error:", error);
    }
  }, [others]);
  // console.log("images: ", others.subject[0])
  // console.log("datas subjects:", DataSubjectsTab);

  const logoutHandle = async () => {
    dispatch(logout());
    // await persistor.purge();
    navigation.replace("/(auth)/login");
  };



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
        console.log("result data: ", result);
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
  // console.log("wallet dans undex:", user?.wallet)
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
              {user?.imgUrl ? (
                <Image
                  size={"xl"}
                  source={{
                    uri: buildFileUrl(user.imgUrl),
                  }}
                  alt="axel profil"
                  className="rounded-full"
                />
              ) : (
                <Image
                  size={"xl"}
                  source={require("../assets/images/profile_bl.png")}
                  alt="axel profil"
                  className="rounded-full"
                />
              )}
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
          {/* <View>
            <Button
              variant={"solid"}
              action={"negative"}
              onPress={() => logoutHandle()}
            >
              <ButtonText>Logout</ButtonText>
            </Button>
          </View> */}

          {/* Ton contenu */}
          <View className="flex-row justify-between items-center mt-10">
            <Text className="font-bold text-typography-default text-xl">
              {" "}
              {t("accueil.explore_subjets")}
            </Text>
            <Button
              className="bg-transparent"
              onPress={() => navigation.navigate("/(tabs)/pack")}
            >
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
              {!DataSubjectsTab ? (
                <Text>Aucun sujet n`a ete trouve</Text>
              ) : (
                <FlatList
                  data={DataSubjectsTab}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() =>packs.find((p)=> p.isSubscribed=== true)? handlePressDocument(item): (router.push("/pack"))}>
                      <View
                        className={` h-80 w-[98%] rounded-3xl  border-[0.2px] gap-5 px-5`}
                        style={{ backgroundColor: item.color }}
                      >
                        <View className=" justify-start items-start gap-3 pt-5">
                          <View className="bg-white rounded-2xl">
                            <Image
                              size={"md"}
                              source={item.image}
                              alt="image pdf"
                              className=""
                            />
                          </View>
                        </View>
                        <Text
                          className="font-semibold text-typography-default text-xl max-w-36"
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {item.content}
                        </Text>
                        <View className="h-2 bg-gray-400 rounded-full overflow-hidden">
                          {/* <View
                            className="h-full bg-primary-defaultOrange"
                            style={{
                              width: `${item.progress}%`,
                            }}
                          /> */}
                        </View>
                        <View>
                          {/* <Text>
                          Page {item.currentPage}/{item.totalPages}
                        </Text>
                        <Text>
                          Dernière lecture :{dayjs(item.lastOpened).fromNow()}
                        </Text> */}
                          <View
                            className="h-12 w-48 rounded-3xl border-[0.5px]"
                            style={{
                              backgroundColor: `${item.sombreColor}`,
                              opacity: 0.8,
                            }}
                          >
                            <View className="justify-between flex-row  items-center">
                              <View className="rounded-3xl bg-white p-3">
                                <Text
                                  className="font-semibold"
                                  style={{
                                    color: `${item.bgColor}`,
                                    // opacity: 0.8,
                                  }}
                                >
                                  {t("accueil.open")}{" "}
                                </Text>
                              </View>
                              <View className="mr-2">
                                <Text className="border-[0.5px] p-1 rounded-full border-white">
                                  <Icon
                                    as={ArrowRightIcon}
                                    color={item.color}
                                    className="text-primary-custom-400"
                                  />
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id}
                />
              )}
            </SafeAreaView>
          </SafeAreaProvider>
          {packs.find((p) => p.isSubscribed === true) && (
            <View>
              <View className="title2 flex-row justify-between items-center mt-10 mb-3">
                <Text className="font-bold text-typography-default text-xl">
                  {" "}
                  {t("accueil.recent_documents")}
                </Text>
                {/* <Button
              className="bg-transparent"
              onPress={() => navigation.navigate("/(tabs)/pack")}
            >
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
            </Button> */}
              </View>
              <SafeAreaProvider>
                <SafeAreaView className="flex-1">
                  {!DataSubjectsTab ? (
                    <Text>Aucun sujet n`a ete trouve</Text>
                  ) : (
                    <FlatList
                      data={recentDataSubjectsTab}
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      // pagingEnabled={true}
                      decelerationRate={"fast"}
                      snapToInterval={width * 0.8 + 20}
                      ItemSeparatorComponent={() => (
                        <View style={{ width: 20 }} />
                      )}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => handlePressDocument(item)}
                        >
                          <View
                            className={`w-full h-48 rounded-3xl border-[0.4px] gap-5 px-5`}
                            style={{
                              backgroundColor: item.color,
                              width: width * 0.8,
                            }}
                          >
                            <View className=" justify-start items-start gap-3"></View>
                            <Text
                              className="font-semibold text-typography-default text-xl"
                              numberOfLines={2}
                              ellipsizeMode="tail"
                            >
                              {item.content}
                            </Text>
                            <View className="h-2 bg-gray-400 rounded-full overflow-hidden">
                              <View
                                className="h-full bg-primary-defaultOrange"
                                style={{
                                  width: `${item.progress}%`,
                                }}
                              />
                            </View>
                            <View>
                              <Text>
                                Progression :{" "}
                                {(item.currentPage / item.totalPages) * 100} %
                              </Text>
                              <Text>
                                Dernière lecture :
                                {dayjs(item.lastOpened).fromNow()}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item) => item.id}
                    />
                  )}
                </SafeAreaView>
              </SafeAreaProvider>
            </View>
          )}
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
            ) : (
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
              <Text style={{ padding: 20 }}>Aucun document chargé</Text>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
