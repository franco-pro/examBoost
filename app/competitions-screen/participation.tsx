import { clearSuscriptionState } from "@/app/hooks/redux/competitions-suscriptions/subscription.slice";
import { getMyParticipations } from "@/app/hooks/redux/competitions-suscriptions/subscription.thunks";
import { setSelectedCompetition } from "@/app/hooks/redux/competitions/competitions.slice";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import Competition from "@/app/hooks/services/competitions/competition.entity";
import { useSoundAud } from "@/app/hooks/useSound.hook";
import { tempsRestant } from "@/app/services/compeititonService/dayleft";
import Filter from "@/components/layouts/filter/searchBar";
import CardStat from "@/components/layouts/statistique/cardStat";
import { Image } from '@/components/ui/image';
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { JSX, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // <- import i18n
import { RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { RootState } from "../hooks/redux/store";

export default function Participation() {
  const { t } = useTranslation("competition"); // <- hook i18n
  const router = useRouter();
  const { user, accessToken, others } = useSelector(
    (state: RootState) => state.user
  );
  const {mySubscriptionList, searchResults, loading} = useAppSelector((state)=> state.subscriptions);
  const {homeBaseData} = useAppSelector((state)=> state.competitions);
  const userId = user?.id;
  const username = user?.username;
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const {stop} = useSoundAud()
  
    useFocusEffect(
      useCallback(()=>{
        stop();
        // return ()=>{
        //   console.log('competition list leave')
        // }
      }, [])
    )

  const statistique: {
    nom: string;
    chiffre: number;
    icone: JSX.Element;
    bgColor: string;
    textColor: string;
  }[] = [
    {
      nom: t("participation.statistics.completed"), // Nombre terminees
      chiffre: homeBaseData ? homeBaseData.competitionFinished : 0,
      icone: <Ionicons name="trophy-outline" size={28} color="#f97316" />,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
    },
    {
      nom: t("participation.statistics.wins"), // Nombre gagnes
      chiffre: homeBaseData ? homeBaseData.competitionWin : 0,
      icone: <FontAwesome5 name="users" size={25} color="#3b82f6" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
  ];

  useEffect(()=>{
    if(mySubscriptionList.length == 0 && !refreshing){
        dispatch(getMyParticipations(userId ?? 0))
    }
  }, [])

  useEffect(()=>{
    if( searchResults && searchResults.length > 0){
      console.log("Search results updated:", searchResults);
    }
  }, [searchResults])

  function goToCompetitionInfoScreen(id: number){
        const competitionSelected = mySubscriptionList.find((comp) => comp.id == id);
        console.log('Competition selected participation:', competitionSelected);
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
      dispatch(clearSuscriptionState())
      setRefreshing(true);
  
        dispatch(getMyParticipations(userId ?? 0))
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

  function handleFilter(list: Competition[]){
    console.log("Filter by:", list);
  }
  
  return (
    <View className="flex-1 w-full max-w-full  bg-gray-50 pt-[40px] pb-[50px] px-4">
      
      {/* Back Button */}
      <TouchableOpacity
        className="flex-row items-center mb-4 mt-5"
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
      <View 
      //  onTouchStart={() => console.log('press')}
      >
        <Filter list={mySubscriptionList} foundIn={"subscriptions"} />
      </View>
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

      {/* Statistiques */}
      <View className="flex-row flex-wrap justify-between">
        {statistique.map((stat, index) => (
          <CardStat
            bgColor={stat.bgColor}
            textColor={stat.textColor}
            nom={stat.nom}
            chiffre={stat.chiffre}
            key={index}
            icone={stat.icone}
          />
        ))}
      </View>

      {/* Section découverte */}
      <View className="flex-column bg-orange-50 py-4 px-4 rounded-xs">
        <View>
          <Text className="text-sm  font-bold">
            {t("participation.discover.title")}
          </Text>
          <Text className="text-xs text-gray-400 font-semiBold">
            {t("participation.discover.subtitle")}
          </Text>
        </View>
        <TouchableOpacity className="flex-row items-center bg-primary-defaultBlue self-start px-4 py-2 rounded-full mt-4" onPress={()=>{router.push("./allCompetition")}} >
          <Text className="text-white text-xs font-semibold mr-2">
            {t("participation.discover.button")}
          </Text>
          <Ionicons name="chevron-forward" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Mes participations */}
      <Text className="text-lg font-semibold my-4">
        {t("participation.section_title")}
      </Text>

     
        {
            searchResults && searchResults.length != 0 && !loading && searchResults.map((comp, index) => {
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
                onPress={() =>
                  goToCompetitionInfoScreen(comp.id)
                }
              >
                <View className="ml-3 pr-2 flex-1">
                {/* Nom de la compétition et deadline */}
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-semibold mr-2">{comp.name}</Text>
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
                      { comp.suscribers.length} {t("participation.labels.joined")}
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

        {(mySubscriptionList && searchResults && Array.isArray(mySubscriptionList)) && mySubscriptionList.length != 0 && searchResults.length == 0 && mySubscriptionList.map((comp, index) => {
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
              onPress={() =>
                goToCompetitionInfoScreen(comp.id)
              }
            >
              <View className="ml-3 pr-2 flex-1">
                {/* Nom de la compétition et deadline */}
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-semibold mr-2">{comp.name}</Text>
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
                      { comp.suscribers.length} {t("participation.labels.joined")}
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
            mySubscriptionList.length == 0 && loading && !refreshing &&
                        <VStack className="justify-center items-center">
                        <Spinner  size="large" color="blue"/> 
                        <Text>Loading...</Text>

                        </VStack>
          }

          {
            mySubscriptionList.length == 0 && !loading && !refreshing && 
            <View className="justify-center items-center">
            <VStack className="justify-center items-center">
              <Image
                size="2xl"
                source={require('../../assets/images/no_404.jpg')}
                alt="image"
              />
              <Text>Aucune participation...</Text>

              </VStack>
          </View>
          }
      </ScrollView>
    </View>
  );
}
