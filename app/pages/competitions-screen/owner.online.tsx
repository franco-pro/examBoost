import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import React, { useState } from "react";
import { ScrollView, StatusBar, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import CompetitionInfos from "./components-ui/online-competitions/competitionInfos";
import FormQuestion from "./components-ui/online-competitions/formQuestion";
import OnlineUsers from "./components-ui/online-competitions/onlineusers";
import SwitchQuestionAnswer from "./components-ui/online-competitions/questionAnswerSwitch";
import UsersAnswers from "./components-ui/online-competitions/userAnswer";

export default function OwnerCompetitionsScreen() {

      const [switchQA, setSwitchQA] =  useState(false);
      const {room, socketWaiting, error} = useAppSelector(state => state.rooms);
      const dispatch = useAppDispatch();


    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar hidden={true} />
            <ScrollView   style={{ flex: 1, backgroundColor: "#E8F5FA" }}
            contentContainerStyle={{ flexGrow: 1 }}>
        
            <View>
             <OnlineUsers user={room ? (room.users ?? []) : []} max={room ? (room.competitionInfo ? room.competitionInfo.maxUsers: 0):0} />
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
            
             <SwitchQuestionAnswer value={switchQA} onValueChange={setSwitchQA}/>
              <View className="w-full justify-center items-center" style={{ display: !switchQA ? 'flex' : 'none' }}>
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
        
            </ScrollView>
          </SafeAreaView>
    );


}