import CompetitionStopedAlert from "@/app/helper/Dialogs/competitionStoped";
import CompetitionEndedAlert from "@/app/helper/Dialogs/endCompetition";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { EmitEvent } from "@/app/hooks/services/socket/rooms.gateway";
import { useSoundAud } from "@/app/hooks/useSound.hook";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StatusBar, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import CompetitionInfos from "./components-ui/online-competitions/competitionInfos";
import OnlineUsers from "./components-ui/online-competitions/onlineusers";
import UsersAnswers from "./components-ui/online-competitions/userAnswer";

export default function ViewerScreen() {
      const {room, socketWaiting, error, competitionFinished, competitionStop, message} = useAppSelector(state => state.rooms);
      const competitionName = room?.roomName ?? "";
      const creator = room?.creatorInfo ? 
                      `${room.creatorInfo.username ?? ""} ${room.creatorInfo.surname ?? ""}`.trim()
                       : "";
      const text = room?.instructions?.viewer
            .replaceAll("{data.competitionName}", competitionName)
            .replaceAll("{data.creator}", creator);

      const dispatch = useAppDispatch();
      
      const router = useRouter();
      const [isAlertOpen, setIsAlertOpen] = useState(false);
      const [isAlertCompetOpen, setIsAlertCompEndOpen] = useState(false);

      const {play} = useSoundAud();
      
      const onLeavingPage = useCallback(()=>{
        const events = EmitEvent(dispatch, {isManagedByIA: room?.isManagedByIA as any, roomId: room?.roomId as any});
        events.ViewerLeave(room?.roomId as any);
        events.localRoomClear();
      }, [])

   useFocusEffect(
            React.useCallback(() => {
                  //ecran actif
              play("waitingQuestion")

              return ()=>{
                  onLeavingPage();
              }
              }, [onLeavingPage])
      );

        function onCompetitionEndAlertConfirm(){
    
          router.replace("/competitions-screen/components-ui/online-competitions/competitionResult");
          setIsAlertCompEndOpen(false);
      
        }

 async function onClosingConfirm() {
        setIsAlertOpen(false);
    
        router.back();
  }
  useEffect(() => {
    if (competitionStop) {
      setIsAlertOpen(true);
    }
  }, [competitionStop]);

  useEffect(()=>{
    if(competitionFinished){
        
       setIsAlertCompEndOpen(true);
    }
  }, [competitionFinished])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#E8F5FA" }}>
      <StatusBar hidden={true} />
  
      {!competitionFinished && !competitionStop && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flexDirection: "row" }} className="w-full">
            <View style={{ flex: 1 }}>
              <CompetitionInfos
                data={{
                  creatorName: room?.creatorInfo?.username ?? "",
                  creatorSurname: room?.creatorInfo?.surname ?? "",
                  imgUrl: room?.creatorInfo?.imgUrl ?? "",
                  roomName: room?.roomName ?? "",
                  viewers: room?.spectators ?? 0,
                  isExamBoostCompetition:
                    room?.competitionInfo?.isExamBoostCompetition ?? false,
                }}
                competitionInfo={{
                  questionNbr: room?.competitionInfo?.questionsNbr ?? 0,
                  CreatorName: room?.creatorInfo?.username ?? "",
                  CreatorSurname: room?.creatorInfo?.surname ?? "",
                  instrunctions: text as any,
                  isIA: room?.isManagedByIA ?? false,
                  totalMinutes: room?.totalTimes ?? null,
                  endTime: room?.finalHour ?? null,
                  serverNow: room?.serverNow ?? null,
                }}
              />
            </View>
  
            <View style={{ flex: 1 }}>
              <OnlineUsers
                user={room?.users ?? []}
                max={room?.competitionInfo?.maxUsers ?? 0}
              />
            </View>
          </View>
  
          <View className="mt-6 mb-2 justify-center items-center px-2">
            <UsersAnswers competitionName={room?.roomName ?? ""} />
          </View>
        </ScrollView>
      )}
  
      {!competitionStop && competitionFinished && (
        <CompetitionEndedAlert
          isOpen={isAlertCompetOpen}
          onClose={onCompetitionEndAlertConfirm}
        />
      )}
  
      {competitionStop && (
        <CompetitionStopedAlert
          isOpen={isAlertOpen}
          message={message ?? null}
          onClose={() => onClosingConfirm()}
        />
      )}
    </SafeAreaView>
  );


}