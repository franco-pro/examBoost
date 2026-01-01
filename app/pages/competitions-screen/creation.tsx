import { clearData, setCompetitioErrorNull, setSelectedCompetition } from "@/app/hooks/redux/competitions/competitions.slice";
import { getMyCompetitions } from "@/app/hooks/redux/competitions/competitions.thunks";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import Competition from "@/app/hooks/services/competitions/competition.entity";
import { useSoundAud } from "@/app/hooks/useSound.hook";
import { filterByCompetitionName } from "@/app/services/compeititonService/search_filter";
import { Image } from '@/components/ui/image';
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import {
  FontAwesome5,
  Ionicons
} from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { JSX, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RefreshControl, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

export default function Creation() {
  const router = useRouter();
  const {myCompetitionList, loading, error, homeBaseData} = useAppSelector((state)=> state.competitions);
  const [hasSearchFocus, setSerachFocus]= useState(false);
  const [searchList, setSearchList] = useState<Competition[]>([]);
  const [searchValue, setSearchValue]= useState("");
  const { t } = useTranslation("competition");
  
  const userId = 1;
  const username = "Franz";
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();
  const {stop} = useSoundAud()
  
  type RoutePath =
    | "../pages/competitions-screen/creation"
    | "../pages/competitions-screen/participant";
  const statistique: {
    nom: string;
    chiffre: number;
    icone: JSX.Element;
    bgColor: string;
    textColor: string;
  }[] = [
    {
      nom: t(`mycompetition.competition.creations_screen.total_ended`),
      chiffre: homeBaseData?.competitionEnded ? homeBaseData?.competitionEnded : 0,
      icone: <Ionicons name="trophy-outline" size={28} color="#f97316" />,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
    },
    {
      nom: t('mycompetition.competition.creations_screen.total_participant'),
      chiffre: homeBaseData?.totalParticipants ? homeBaseData.totalParticipants: 0,
      icone: <FontAwesome5 name="users" size={25} color="#3b82f6" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
  ];

  useFocusEffect(
    useCallback(()=>{
        if(error){
          showToast(error, "Error", "error")
        }
      return ()=>{
          if(error){
            dispatch(setCompetitioErrorNull())
          }
      }
    }, [error])
  )
  useFocusEffect(
    useCallback(()=>{
        stop()
    }, [])
  )
  useEffect(()=> {
    if(myCompetitionList.length == 0 && !refreshing){
        dispatch(getMyCompetitions(userId))
    }
  }, [])

  function goToCompetitionInfoScreen(id: number){
        const competitionSelected = myCompetitionList.find((comp) => comp.id == id);
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

   function showToast(message: string, title: string, type: "success"|"error"){
          Toast.show({
            type: type,
            text2: message,
            text1: title,
            position: 'top',
            visibilityTime: 3500,
          }) 
      }

  function timePassed(deadline: string, date: string): string {
    const date1 = new Date(deadline);
    const date2 = new Date(date);

    if (date1 < date2) {
      return "Time passed to register";
    } else {
      // Calcul de la différence
      const diffMs = date2.getTime() - date1.getTime(); // .getTime() renvoie un number
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHrs = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      return `${diffDays} days ${diffHrs} hr to register`;
    }
  }

    const onRefresh = () => {
      dispatch(clearData())
      setRefreshing(true);
  
        dispatch(getMyCompetitions(userId))
  
        setRefreshing(false);
    };

    function onfocus(){
      setSerachFocus(true)
    }

    //on focus loss
    function onLoss(){
      setSerachFocus(false)
    }

    function doSearch(val: string){
      const searchResponse = filterByCompetitionName(val, myCompetitionList);
      if(searchResponse.found){
        setSearchValue(val);
        setSearchList(searchResponse.finalList)
      }
      
    }

  return (
    
    <View className="flex-1 bg-gray-50 pt-[40px] pb-[50px] px-4">
      {/* Back Button */}
      <TouchableOpacity
        className="flex-row items-center mb-4"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#181c5c" />
        <Text className="ml-2 text-lg font-semibold text-gray-800">{t(`mycompetition.back`)}</Text>
      </TouchableOpacity>
      <View className="bg-white p-4 rounded-2xl mb-4 ">
        <Text className="text-lg font-semibold">{t('mycompetition.competition.greeting',{name: username})} </Text>
        <Text className="text-gray-500 mt-1">
          {t(`mycompetition.competition.subtitle`)}
        </Text>
      </View>

      {/* Barre de recherche */}
      <View className="my-4 flex-row items-center bg-gray-100 rounded-full px-4 py-2">
        <Ionicons name="search" size={20} color="#9ca3af" className="mr-2" />
        <TextInput
          placeholder="Rechercher une compétition"
          className="flex-1 text-gray-700 p-2 border-0"
          underlineColorAndroid="transparent"
          style={{
            outlineWidth: 0, // supprime le contour au focus
          }}
          onFocus={onfocus}
          onEndEditing={onLoss}
          onChangeText={(val: string)=> doSearch(val)}
        />
      </View>

      {
        !hasSearchFocus && (
          <View className="flex-row flex-wrap justify-between">
          {statistique.map((stat, index) => (
            <TouchableOpacity
              key={index}
              className={`w-[48%] ${stat.bgColor} p-4 rounded-xl mb-3 items-center shadow-sm`}
            >
              <View className="mb-2">{stat.icone}</View>
              <Text className={`font-semibold text-center ${stat.textColor}`}>
                {stat.nom}
              </Text>
              <Text className={`text-xl font-bold mt-1 ${stat.textColor}`}>
                {stat.chiffre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        )
      }

      {
        !hasSearchFocus && (
              <View>
                 <Text className="text-lg font-semibold my-4">{t(`mycompetition.competition.actions_title`)}</Text>
                <TouchableOpacity className="flex-row items-center bg-success-400 ml-auto px-4 py-2 rounded-full mb-4" onPress={()=>{router.push("./createCompetition")}}>
                  <Text className="text-white font-semibold mr-2">
                    {t(`mycompetition.competition.creations_screen.create_competitions`)}
                  </Text>
                  <Ionicons name="chevron-forward" size={22} color="#ffffff" />
                </TouchableOpacity>
              </View>
        )
      }
    
      <ScrollView className="mt-2"
        contentContainerStyle={{ flexGrow: 1 }}
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
           searchList && searchList.length != 0 && searchValue.length != 0 && searchList.map((comp, index) => {
            return (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-2xl flex-row p-4 mb-3 shadow-sm items-center"
                // onPress={() => router.push(act.link)}
                 onPress={() =>
                  goToCompetitionInfoScreen(comp.id)
                }
              >
                <View className="ml-3 pr-2 flex-1">
                  {/* Nom de la compétition et deadline */}
                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-semibold">{comp.name}</Text>
                    <Text className="text-xs text-gray-400">
                      {/* {timePassed(comp.registration_deadline, comp.date)} */}
                      Deadline:  {new Date(comp.registration_deadline).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
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
                        {comp.suscribers.length} participants
                      </Text>
                    </View>
                    <View
                      className={`rounded-full px-3 py-1 ${
                        comp.statut === "UPCOMING"
                          ? "bg-green-200"
                          : comp.statut === "ONGOING"
                          ? "bg-yellow-200"
                          : "bg-gray-300"
                      }`}
                    >
                      <Text className="text-xs font-semibold text-black">
                        {comp.statut}
                      </Text>
                    </View>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={22} color="#9ca3af" />
              </TouchableOpacity>
            );
          })
        }
        
        {(myCompetitionList && Array.isArray(myCompetitionList)) && myCompetitionList.length != 0 && searchValue.length == 0 && myCompetitionList.map((comp, index) => {
          return (
            <TouchableOpacity
              key={index}
              className="bg-white rounded-2xl flex-row p-4 mb-3 shadow-sm items-center"
              // onPress={() => router.push(act.link)}
               onPress={() =>
                goToCompetitionInfoScreen(comp.id)
              }
            >
              <View className="ml-3 pr-2 flex-1">
                {/* Nom de la compétition et deadline */}
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-semibold">{comp.name}</Text>
                  <Text className="text-xs text-gray-400">
                    {/* {timePassed(comp.registration_deadline, comp.date)} */}
                    Deadline:  {new Date(comp.registration_deadline).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
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
                      {comp.suscribers.length} participants
                    </Text>
                  </View>
                  <View
                    className={`rounded-full px-3 py-1 ${
                      comp.statut === "UPCOMING"
                        ? "bg-green-200"
                        : comp.statut === "ONGOING"
                        ? "bg-yellow-200"
                        : "bg-gray-300"
                    }`}
                  >
                    <Text className="text-xs font-semibold text-black">
                      {comp.statut}
                    </Text>
                  </View>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={22} color="#9ca3af" />
            </TouchableOpacity>
          );
        })}

        {
          myCompetitionList.length == 0 && loading && !refreshing &&
           <VStack className="justify-center items-center">
            <Spinner  size="large" color="blue"/> 
            <Text>Loading...</Text>

          </VStack>
        }

        {
          myCompetitionList.length == 0 && !loading && !refreshing &&
          <View className="justify-center items-center">
            <VStack className="justify-center items-center">
              <Image
                size="2xl"
                source={require('../../../assets/images/no_404.jpg')}
                alt="image"
              />
              <Text>{t(`mycompetition.competition.creations_screen.creation_null`)}</Text>

              </VStack>
        </View>
        }
      </ScrollView>
    </View>
  );
}
