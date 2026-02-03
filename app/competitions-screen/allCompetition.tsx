import { clearData, setSelectedCompetition } from "@/app/hooks/redux/competitions/competitions.slice";
import { getCompetitionList } from "@/app/hooks/redux/competitions/competitions.thunks";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { useSoundAud } from "@/app/hooks/useSound.hook";
import { tempsRestant } from "@/app/services/compeititonService/dayleft";
import Filter from "@/components/layouts/filter/searchBar";
import { Image } from '@/components/ui/image';
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // <- import i18n
import { RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { RootState } from "../hooks/redux/store";
import { useSelector } from "react-redux";

export default function AllCompetition() {
  const { t } = useTranslation("competition"); // <- hook i18n
  const {competitionList, searchResults, loading, error} = useAppSelector((state) => state.competitions);
  const { user} = useSelector((state: RootState) => state.user);

  const [refreshing, setRefreshing] = useState(false);
  const {stop} = useSoundAud();
  const username = user?.username;
  const dispatch = useAppDispatch();
  const router = useRouter();

  // useFocusEffect(
  //   useCallback(()=>{
  //     stop();
  //     // return ()=>{
  //     //   console.log('competition list leave')
  //     // }
  //   }, [])
  // )

  useEffect(()=>{
    if(competitionList.length == 0 && !refreshing){
         dispatch(getCompetitionList())
    }
  }, [])

  useEffect(()=>{
    if(error){
        showToast(error, "Error", "error");
    }
  }, [error])

  function showToast(message: string, title: string, type: "success"|"error"){
            Toast.show({
              type: type,
              text2: message,
              text1: title,
              position: 'top',
              visibilityTime: 3500,
            }) 
    }
  
  function goToCompetitionInfoScreen(id: number){
      const competitionSelected = competitionList.find((comp) => comp.id == id);
      if(competitionSelected){
        dispatch(setSelectedCompetition(competitionSelected));

        router.push({
          pathname: "./information",
          params: {
            id: id,
          },
        })

      }
     
  }

  const onRefresh = () => {
    dispatch(clearData())
    setRefreshing(true);

      dispatch(getCompetitionList())
      console.log("Page actualisée !");

      setRefreshing(false);
  };

  function timePassed(date: string): string {
    const date2 = new Date(date);

    if (date2 < new Date()) {
      return "Time passed to register";
    } else {
      // Calcul de la différence
      const diffMs = date2.getTime() - new Date().getTime(); // .getTime() renvoie un number
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHrs = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      return `${diffDays} days ${diffHrs} hr left`;
    }
  }
  return (
    <SafeAreaView
      className="flex-1 w-full max-w-full  bg-gray-50 p-4 relative"
      style={{
        position: "relative",
        zIndex: 1, // 
      }}
    >
      {/* Back Button */}
      <TouchableOpacity
        className="flex-row items-center mb-4"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#181c5c" />
        <Text className="ml-2 text-lg font-semibold text-gray-800">
          {t("participation.back")}
        </Text>
      </TouchableOpacity>

      <View className="bg-white p-4 rounded-2xl  ">
        <Text className="text-lg font-semibold">
          {t("participation.greeting", {name: username})}
        </Text>
        <Text className="text-gray-500 mt-1">
          {t("participation.subtitle")}
        </Text>
      </View>

      {/* Barre de recherche */}
      <Filter list={competitionList} foundIn={"competitions"} />

      {/* Mes participations */}
      <Text className="text-lg font-semibold my-4">
        {t("participation.section_title")}
      </Text>

      <ScrollView
        className="mt-2"
        contentContainerStyle={{ flexGrow: 1 }}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2196F3"]} // couleur Android
            tintColor="#2196F3" // couleur iOS
          />
        }
      >

        {
         searchResults && searchResults.length != 0 && searchResults.map((comp, index) => {
            return (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-2xl flex-row p-4 mb-3  items-center"
                style={{
                  backgroundColor: "white",
                  borderRadius: 16,
                  flexDirection: "row",
                  padding: 16,
                  marginBottom: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
                onPress={() => goToCompetitionInfoScreen(comp.id)}
              >
                <View className="ml-3 pr-2 flex-1">
                  {/* Nom de la compétition et deadline */}
                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-semibold">{comp.name}</Text>
                    <Text className="text-xs text-gray-400">
                      {comp.statut === "UPCOMING" && 
                      tempsRestant(comp.registration_deadline).valid &&
                        t("participation.labels.time_left", {
                          days: tempsRestant(comp.registration_deadline).day,
                          hours: tempsRestant(comp.registration_deadline).hours,
                          min: tempsRestant(comp.registration_deadline).minutes,
                        })
                        }

                      {comp.statut === "UPCOMING" && 
                      !tempsRestant(comp.registration_deadline).valid &&
                        t("participation.labels.time_passed")
                      }

                      {comp.statut !== "UPCOMING" &&
                        t("participation.labels.time_passed")}
                    </Text>
                  </View>

                  {/* Sujet / date */}
                  <Text className="text-gray-500 text-sm mt-1">
                    {new Date(comp.date).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>

                  {/* Participants et statut */}
                  <View className="flex-row justify-between items-center mt-2">
                    <View className="flex-row items-center">
                      <Ionicons
                        name="people"
                        size={16}
                        color="#4B5563"
                        className="mr-1"
                      />
                      <Text className="text-sm text-gray-700">
                        {comp.suscribers.length} {t("participation.labels.joined")}
                      </Text>
                    </View>
                    <View
                      className={`rounded-full px-3 py-1 ${
                        comp.statut === "UPCOMING"
                          ? "bg-green-200"
                          : comp.statut === "ONGOING"
                          ? "bg-yellow-200"
                          : comp.statut === "CANCELLED"
                          ? "bg-error-300"
                          : "bg-gray-300"
                      }`}
                    >
                      <Text className="text-xs font-semibold text-black">
                        {t(`participation.labels.status.${comp.statut}`)}
                      </Text>
                    </View>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#9ca3af" />
              </TouchableOpacity>
            );   
        })
       }
        {/* retourner que des competitions publiques */}
        {searchResults && competitionList && competitionList.length != 0 && searchResults.length == 0 && competitionList
          .filter((comp, index) => {
            return true;
          })
          .map((comp, index) => {
            return (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-2xl flex-row p-4 mb-3  items-center"
                style={{
                  backgroundColor: "white",
                  borderRadius: 16,
                  flexDirection: "row",
                  padding: 16,
                  marginBottom: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
                onPress={() => goToCompetitionInfoScreen(comp.id)}
              >
                <View className="ml-3 pr-2 flex-1">
                  {/* Nom de la compétition et deadline */}
                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-semibold">{comp.name}</Text>
                    <Text className="text-xs text-gray-400">
                      {comp.statut === "UPCOMING" && 
                      tempsRestant(comp.registration_deadline).valid &&
                        t("participation.labels.time_left", {
                          days: tempsRestant(comp.registration_deadline).day,
                          hours: tempsRestant(comp.registration_deadline).hours,
                          min: tempsRestant(comp.registration_deadline).minutes,
                        })
                        }

                      {comp.statut === "UPCOMING" && 
                      !tempsRestant(comp.registration_deadline).valid &&
                        t("participation.labels.time_passed")
                      }

                      {comp.statut !== "UPCOMING" &&
                        t("participation.labels.time_passed")}
                    </Text>
                  </View>

                  {/* Sujet / date */}
                  <Text className="text-gray-500 text-sm mt-1">
                    {new Date(comp.date).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>

                  {/* Participants et statut */}
                  <View className="flex-row justify-between items-center mt-2">
                    <View className="flex-row items-center">
                      <Ionicons
                        name="people"
                        size={16}
                        color="#4B5563"
                        className="mr-1"
                      />
                      <Text className="text-sm text-gray-700">
                        {comp.suscribers.length} {t("participation.labels.joined")}
                      </Text>
                    </View>
                    <View
                      className={`rounded-full px-3 py-1 ${
                        comp.statut === "UPCOMING"
                          ? "bg-green-200"
                          : comp.statut === "ONGOING"
                          ? "bg-yellow-200"
                          : comp.statut === "CANCELLED"
                          ? "bg-error-300"
                          : "bg-gray-300"
                      }`}
                    >
                      <Text className="text-xs font-semibold text-black">
                        {t(`participation.labels.status.${comp.statut}`)}
                      </Text>
                    </View>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={22} color="#9ca3af" />
              </TouchableOpacity>
            );
          })}

          {
            competitionList.length == 0 && loading && !refreshing &&
                        <VStack className="justify-center items-center">
                        <Spinner  size="large" color="blue"/> 
                        <Text>Loading...</Text>

                        </VStack>
          }

{
            competitionList.length == 0 && !loading && !refreshing &&
            <View className="justify-center items-center">
            <VStack className="justify-center items-center">
              <Image
                size="2xl"
                source={require('../../assets/images/no_404.jpg')}
                alt="image"
              />
              <Text>{t("mycompetition.no_competition_available")} </Text>

              </VStack>
          </View>
          }
      </ScrollView>
    </SafeAreaView>
  );
}
