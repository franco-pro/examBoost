import { useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { ScrollView, StatusBar, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import CompetitionInfos from "./components-ui/online-competitions/competitionInfos";
import OnlineUsers from "./components-ui/online-competitions/onlineusers";
import UsersAnswers from "./components-ui/online-competitions/userAnswer";

export default function ViewerScreen() {
      const {room, socketWaiting, error} = useAppSelector(state => state.rooms);

         useFocusEffect(
            React.useCallback(() => {
                  //ecran actif
            
                  return () => {
                   //ecran quitté diminué le nbr vues sur le socket.
                    
        
                  };
              }, [])
          );

      

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={true} />
            <ScrollView   style={{ flex: 1, backgroundColor: "#E8F5FA" }}
            contentContainerStyle={{ flexGrow: 1 }}>
        
            <View>
             <OnlineUsers user={room ? (room.users ?? []):[]} max={room ? (room.competitionInfo ? room.competitionInfo.maxUsers: 0):0} />
             <CompetitionInfos data={{
                                      creatorName: room ? (room.creatorInfo ? room.creatorInfo.username: ''):'',
                                      creatorSurname: room ? (room.creatorInfo ? room.creatorInfo.surname: ''):'',
                                      imgUrl : room ? (room.creatorInfo ? room.creatorInfo.imgUrl: ''):'',
                                      roomName: room ? (room.roomName ? room.roomName : ''):'',
                                      viewers: room ? (room.viewers ? room.viewers : 0):0
                                      }}
                              competitionInfo={{
                                        questionNbr: room ? (room.competitionInfo ? room.competitionInfo.questionsNbr : 0):0,
                                        CreatorName: room ? (room.creatorInfo ? room.creatorInfo.username: ''):'',
                                        CreatorSurname: room ? (room.creatorInfo ? room.creatorInfo.surname: ''):'',
                                        instrunctions: room && room.instructions ? room.instructions.participant:null,
                                        isIA: room ? room.isManagedByIA: false,
                                        totalMinutes: room ? room.totalTimes: null,
                                        endTime: room ? room.finalHour : null

                             }} 
              />
        
             
             <View className="mt-[65%] mb-[10px] justify-center items-center"> 
   
                  <UsersAnswers competitionName={room ? room.roomName: ''} />

                
              </View>
            </View>
        
            </ScrollView>
          </SafeAreaView>
    );


}