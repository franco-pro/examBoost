import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { View } from "@/components/ui/view";
import { Alert, Dimensions } from "react-native";
import { FlatList, Modal, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/hooks/redux/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  updateBalanceUser,
  userDatas,
} from "@/app/hooks/redux/users/users.slice";
import { router, useFocusEffect, useRouter } from "expo-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";

import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { ArrowRightIcon, Icon } from "@/components/ui/icon";
import * as pdfImage from "../helper/images/image";
import { useTranslation } from "react-i18next";

import { handleOpenDocument, subjectDocumentype } from "../downloadFiles";
import { initializeNotificationsGateway } from "../hooks/services/socket/notifications.gateway";

import {
  getRecentDocuments,
  RecentDocument,
} from "../hooks/files/recentDocuments/recentDocument";
import { buildFileUrl } from "../hooks/files/buildRouteFiles";
import { usePacksQuery } from "../features/packs/hooks.rq";

import LottieView from "lottie-react-native";
import { setSelectedCompetitionNull } from "../hooks/redux/competitions/competitions.slice";
import { PlusCircle, RefreshCcwIcon } from "lucide-react-native";
import { useUserQuery } from "../features/user/hooks.rq";

interface subjectType {
  id: number;
  content: string;
  url: string;
  subject: string;
  description: string;
}
interface packType {
  id: number;
  name: string;
  price: number;
  duration: string;
  description: string;
  durationDays: string;
}

dayjs.extend(relativeTime);
dayjs.locale("fr");
export default function Index() {
  const [recentDocument, setRecentDocument] = useState<RecentDocument[]>([]);
  //open file
  const [loading, setLoading] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [packs, setPacks] = useState<any[]>([]);
  const navigation = useRouter();

  const { t } = useTranslation("home");
  const { width } = Dimensions.get("window");
  // console.log("LANG:", i18n.language);
  // console.log("WELCOME:", t("accueil.welcome"));
  const dispatch = useDispatch<any>();
  const { user, others, accessToken, isAuthenticated, depositActionStatut } =
    useSelector((state: RootState) => state.user);
  const wallet = Number(user?.wallet).toLocaleString("fr-FR");
  // useEffect(() => {
  // console.log("isauth: ", isAuthenticated)
  // if (!isAuthenticated) {
  //   navigation.replace("/(auth)/login");
  // }
  // }, [navigation, isAuthenticated]);
  // console.log("accestoken: ", accessToken);
  //Gestion des proprietes de pack
  const currentUserId = user?.id;
  const packsQuery = usePacksQuery(currentUserId ?? 0);
  const userQuery = useUserQuery(currentUserId ?? 0);
  const { data: usersData, refetch } = userQuery;
  // console.log("userquery:", usersData?.wallet);
  useEffect(() => {
    setPacks(packsQuery.data ?? []);
  }, [packsQuery.data]);

  const loadRecent = async () => {
    const data = await getRecentDocuments();
    setRecentDocument(data);
  };

  useFocusEffect(
    useCallback(() => {
      // packsQuery.refetch();
      loadRecent();
      return () => {
        dispatch(setSelectedCompetitionNull());
      };
    }, []),
  );
  useEffect(() => {
    if (isAuthenticated) {
      console.log("userDatas dispatch");
      dispatch(userDatas()); //to work
      setTimeout(() => {
        initializeNotificationsGateway(dispatch, currentUserId ?? 0);
      }, 1000);

      loadRecent();
    }
  }, [isAuthenticated, dispatch, currentUserId]);

  // console.log("useFocus after:", recentDocument);
  // console.log("user:", user);
  // useEffect(() => {
  //   if (accessToken) {
  //     dispatch(userDatas()); //to work
  //     setTimeout(() => {
  //       initializeNotificationsGateway(dispatch, currentUserId ?? 1);
  //     }, 1000);
  //   }
  // }, [accessToken, dispatch,currentUserId]);

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
  const colors = useMemo(
    () => ["#E8F0FE", "#E8FFF3", "#FDECEF", "#FFF4E5", "#F3E8FF"],
    [],
  );
  const bgColors = useMemo(
    () => ["#8FB0FF", "#7EE2A8", "#F29AAD", "#FFB86B", "#B784F7"],
    [],
  );
  const sombreColors = useMemo(
    () => ["#8FB0FFCC", "#7EE2A8CC", "#F29AADCC", "#FFB86BCC", "#B784F7CC"],
    [],
  );

  //docunments accessible apres achats
  const accessibleDocument = useMemo(() => {
    if (!others?.subject || !packs?.length) return [];

    return others.subject.filter((doc: any) =>
      packs.some((pack) => pack.type === doc.type && pack.isSubscribed),
    );
  }, [others?.subject, packs]);
  // console.log("accessible doc:", accessibleDocument)

  const accessibleDocuments = accessibleDocument?.map(
    (item: subjectType, index: number) => {
      return {
        id: `${item.id}`,
        content: item.subject || "Unknown",
        image: images[index % images.length],
        url: item.url,
        color: colors[index % colors.length],
        sombreColor: sombreColors[index % sombreColors.length],
        bgColor: bgColors[index % bgColors.length],
      };
    },
  );
  // console.log(
  //   "accessible Document:",
  //   accessibleDocuments.some((doc: any) => doc.subject),
  // );

  //datas subjects of users
  // const DataSubjectsTab:any[]=[]
  const DataSubjectsTab = useMemo(() => {
    try {
      if (!others?.subject) return [];
      // console.log("colors: ", colors[0]);
      // console.log("subjects: ", others.subject);
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
  }, [others, bgColors, colors, images, sombreColors, user]);

  const recentDataSubjectsTab = useMemo(() => {
    try {
      if (!others?.subject) return [];

      const mapped = accessibleDocument.map(
        (item: subjectType, index: number) => {
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
        },
      );

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
  }, [
    others,
    accessibleDocument,
    recentDocument,
    bgColors,
    colors,
    images,
    sombreColors,
    user,
  ]);
  // console.log("images: ", others.subject[0])
  // console.log("datas subjects:", DataSubjectsTab);
  // console.log("recents subjects:", recentDataSubjectsTab);

  // console.log("doc:", others?.otherSujects);
  const othersSubjects = others?.otherSujects?.map(
    (item: subjectType, index: number) => {
      return {
        id: `${item.id}`,
        content: item.subject || "Unknown",
        color: colors[index % colors.length],
        sombreColor: sombreColors[index % sombreColors.length],
        bgColor: bgColors[index % bgColors.length],
        desc: item.description,
      };
    },
  );

  //  console.log("packs dans index: ", packs);
  packs?.map((pack: any, index: number) => {
    return {
      id: `${pack.id}`,
      desc: pack.description,
      name: pack.name,
      durationDays: pack.durationDays,
    };
  });
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

  const refreshWalletHandle = async () => {
    try {
      const { data: freshQueryData } = await refetch();
      if (freshQueryData?.wallet !== undefined) {
        dispatch(updateBalanceUser(freshQueryData.wallet));
        console.log(
          "Le solde réel du serveur est maintenant :",
          freshQueryData?.wallet,
        );
      }
    } catch (error) {
      console.error("Impossible de rafraîchir le solde :", error);
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
          <View className="flex-row items-center justify-between">
            <Text className="flex-1 text-2xl font-bold mr-4">
              {t("accueil.welcome")},{" "}
              {user?.username || user?.surname || "Unknown"} 👋
            </Text>

              <TouchableOpacity
                onPress={() => navigation.push({ pathname: "/payment-transactions/deposit", params: {type: "DEPOSIT"}})}
                className="bg-orange-500 px-4 h-12 rounded-lg flex-row items-center justify-center"
              >
                <Icon as={PlusCircle} className="text-white mr-2" />
                <Text className="text-white font-semibold">
                  {t("accueil.load")}
                </Text>
              </TouchableOpacity>
            </View>
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
                    uri: user.imgUrl,
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
                <View className="flex-row items-center gap-4">
                  <Text className="text-white text-2xl ">
                    {user ? wallet : "----"} credits
                  </Text>
                  <TouchableOpacity
                    onPress={() => refreshWalletHandle()}
                    className="  text-2xl "
                  >
                    <Icon
                      as={RefreshCcwIcon}
                      className="text-secondary-custom-400"
                    />
                  </TouchableOpacity>
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
          {/* Bloc d'introduction avec bouton de réinitialisation/rafraîchissement */}
            {others && Array.isArray(others.other) && others.other[0].time_of_exam_result && <View 
              className="p-5 rounded-2xl shadow-sm border border-blue-100"
              style={{ backgroundColor: '#2E5DA6' }}
            >
              <Text className="text-xl font-bold text-white mb-2">
              {t("accueil.exam_info.title")}
              </Text>
              <Text className="text-blue-50 text-sm leading-5 mb-4">
              {t("accueil.exam_info.text.main")}{' '}
                <Text className="font-bold text-white">{t("accueil.exam_info.text.subtext1")}</Text> {t("accueil.exam_info.text.text_link")}
                <Text className="font-bold text-white">{t("accueil.exam_info.text.subtext2")}</Text>{' '}
              </Text>

              {/* Bouton pour réinitialiser / recharger la page actuelle */}
              <TouchableOpacity
                className="flex-row items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-white/30 active:opacity-80 align-self-start"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                onPress={()=> navigation.push("/settings/examen") }
              >
                <Text className="text-white text-xs font-semibold">
                  {t("accueil.exam_info.btnText")}
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#ffffff" />

              </TouchableOpacity>
            </View>}

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
              {DataSubjectsTab.length === 0 ? (
                <View className="items-center flex-1 justify-center mt-4">
                  <LottieView
                    autoPlay
                    loop
                    source={require("../assets/animation/documents_not_found.json")}
                    style={{
                      width: 500,
                      height: 250,
                    }}
                  />
                  <Text className="-mt-5 text-typography-300">
                    Aucun document trouvé
                  </Text>
                </View>
              ) : accessibleDocuments.length === 0 ? (
                <FlatList
                  data={DataSubjectsTab}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        if (
                          accessibleDocuments.some(
                            (doc: any) => doc.subject === item.content,
                          )
                        ) {
                          handlePressDocument(item);
                        } else {
                          Alert.alert(
                            "Erreur",
                            "Ce document ne fait pas partie de votre pack !",
                          );
                          router.push("/pack"); // S'exécutera juste après l'apparition de l'alerte
                        }
                      }}
                    >
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
              ) : (
                <FlatList
                  data={accessibleDocuments}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handlePressDocument(item)}>
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
          {accessibleDocuments && accessibleDocuments.length !== 0 ? (
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
                  {
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
                  }
                </SafeAreaView>
              </SafeAreaProvider>
            </View>
          ) : (
            <View>
              <View className="title2 flex-row justify-between items-center mt-10 mb-3">
                <Text className="font-bold text-typography-default text-xl">
                  {" "}
                  {t("accueil.other_subjets")}
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
                  {
                    <FlatList
                      data={packs}
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
                          onPress={() => navigation.navigate("/(tabs)/pack")}
                        >
                          <View
                            className={`w-full h-56 rounded-3xl border-[0.4px] gap-5 px-5 pb-5`}
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
                              {item.name}
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
                              <Text>{item.description}</Text>
                              <Text>Durée : {item.durationDays} Jours.</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item) => item.id}
                    />
                  }
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
              <View className="items-center flex-1 justify-center ">
                <LottieView
                  autoPlay
                  loop
                  source={require("../assets/animation/empty.json")}
                  style={{
                    width: 500,
                    height: 250,
                  }}
                />
                <Text className="-mt-5 text-typography-300">
                  Aucun document trouvé
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
