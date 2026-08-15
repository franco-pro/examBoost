import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { useSoundAud } from "@/app/hooks/useSound.hook";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import CompetitionInfos from "./components-ui/online-competitions/competitionInfos";
import FormQuestion from "./components-ui/online-competitions/formQuestion";
import OnlineUsers from "./components-ui/online-competitions/onlineusers";
import SwitchQuestionAnswer from "./components-ui/online-competitions/questionAnswerSwitch";
import UsersAnswers from "./components-ui/online-competitions/userAnswer";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function OwnerCompetitionsScreen() {

      const [switchQA, setSwitchQA] =  useState(false);
      const {room, socketWaiting, error} = useAppSelector(state => state.rooms);
      const competitionName = room?.roomName ?? "";
      const text = room?.instructions?.owner
            .replaceAll("{data.competitionName}", competitionName);

      const dispatch = useAppDispatch();
      const {play} = useSoundAud()

  useFocusEffect(
    useCallback(() => {
        play("waitingQuestion")
        
    },[])
  )
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={true} />
            <KeyboardAwareScrollView
               style={{ flex: 1 }}
               contentContainerStyle={{ flexGrow: 1 }}
               enableOnAndroid={true}
               extraScrollHeight={Platform.OS === "android" ? 30 : 20}
               keyboardShouldPersistTaps="handled"
            >

           <View style={{ flexDirection: "row" }} className="w-full">
                <View style={{ flex: 1 }}>
                  <CompetitionInfos data={{
                                                                creatorName: room ? (room.creatorInfo ? room.creatorInfo.username: ''):'',
                                                                creatorSurname: room ? (room.creatorInfo ? room.creatorInfo.surname: ''):'',
                                                                imgUrl : room ? (room.creatorInfo ? room.creatorInfo.imgUrl: ''):'',
                                                                roomName: room ? (room.roomName ? room.roomName : ''):'',
                                                                viewers: room ? (room.spectators ? room.spectators : 0):0,
                                                                isExamBoostCompetition : room ? (room.competitionInfo && room.competitionInfo.isExamBoostCompetition ? room.competitionInfo.isExamBoostCompetition : false):false
                                                                }}
                                              competitionInfo={{
                                                                  questionNbr: room ? (room.competitionInfo ? room.competitionInfo.questionsNbr : 0):0,
                                                                  CreatorName: room ? (room.creatorInfo ? room.creatorInfo.username: ''):'',
                                                                  CreatorSurname: room ? (room.creatorInfo ? room.creatorInfo.surname: ''):'',
                                                                  instrunctions: text as any,
                                                                  isIA: room ? room.isManagedByIA: false,
                                                                  totalMinutes: room ? room.totalTimes: null,
                                                                  endTime: room ? room.finalHour : null,
                                                                  serverNow: room ? room.serverNow : null
                                                      }}                    
                            />
                </View>

                <View style={{ flex: 1 }}>
                  <OnlineUsers user={room ? (room.users ?? []) : []} max={room ? (room.competitionInfo ? room.competitionInfo.maxUsers: 0):0} />
                </View>

           </View>
            
             <View>
             
              <View className="mt-[15px] mb-[10px] justify-center items-center" style={{ zIndex: 10, elevation: 10 }}> 
                                                      
                <SwitchQuestionAnswer value={switchQA} onValueChange={setSwitchQA}/>
                  <View className="w-[90%]" style={{ display: !switchQA ? 'flex' : 'none' }}>
                    <FormQuestion competitionInfo={
                              {
                                creatorAvatarUrl: room ? (room.creatorInfo ? room.creatorInfo.imgUrl: ''):'',
                                creatorName: room ? (room.creatorInfo ? room.creatorInfo.username: ''):'',
                                competitionName: room ? (room.roomName ? room.roomName : ''):'',
                                createdAt: room && room.createdAt ? new Date(room.createdAt).toLocaleString("fr-FR", {
                                  weekday: "long",  
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }) : null,
                                type: room && room.competitionInfo ? room.competitionInfo.type: null,
                                isAI: room ? room.isManagedByIA: false,
                                totalQuestions: room && room.competitionInfo ? room.competitionInfo.questionsNbr: 0,
                              }
                           }
                 />
                </View>

                 <View className="w-full justify-center items-center" style={{ display: switchQA ? 'flex' : 'none' }}>
                     <UsersAnswers  competitionName={room ? room.roomName: ''} />
                  </View>
                
              </View>
            </View>
        
            </KeyboardAwareScrollView>
          </SafeAreaView>
    );


}