import { useAppDispatch, useAppSelector } from '@/app/hooks/redux/redux.hooks';
import { resetNexQuestion } from '@/app/hooks/redux/rooms/rooms.slice';
import { EmitEvent } from '@/app/hooks/services/socket/rooms.gateway';
import { useSoundAud } from '@/app/hooks/useSound.hook';
import Question from '@/app/services/entities/question.entity';
import { UsersTest } from '@/app/services/entities/users.test';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { AppState, ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CompetitionInfos from './components-ui/online-competitions/competitionInfos';
import MiniDashboard from './components-ui/online-competitions/miniDashboard';
import OnlineUsers from './components-ui/online-competitions/onlineusers';
import QuestionAnswer from './components-ui/online-competitions/questionAnswer';
import { RootState } from '../hooks/redux/store';
import { useSelector } from 'react-redux';

export default function User() {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const {play} = useSoundAud();
  const [appState, setAppState] = useState(AppState.currentState);
  const {room, socketWaiting, error, nextQuestion} = useAppSelector(state => state.rooms);
  const competitionName = room?.roomName ?? "";
  const { user} = useSelector((state: RootState) => state.user);

  const creator = room?.creatorInfo ? 
                  `${room.creatorInfo.username ?? ""} ${room.creatorInfo.surname ?? ""}`.trim()
                   : "";
  const text = room?.instructions?.participant
        .replaceAll("{data.competitionName}", competitionName)
        .replaceAll("{data.totalQuestions}", (room ? String(room.competitionInfo.questionsNbr): "")) 
        .replaceAll("{data.creator}", creator);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question|null>(null);
  // secondes avant de passer à la question suivante
  let currentUserId = user?.id;
  //find the current user  score by id 
  const score = room && room.users ? (room.users.find(u => u.userID === currentUserId)?.score ?? 0) : 0;

  let [questionAnswered, setQuestionAnswered] = useState(0);

useFocusEffect(
  useCallback(() => {
      play("waitingQuestion")
      
  },[])
)

  useEffect(() => {
    if (room && Array.isArray(room.questions) && room.questions.length > 0) {
      let questionAnsweredCount = 0;
      
      room.questions.forEach(q => {
        if (q.answers) {
          const answered = q.answers.find(a => a.userID === currentUserId);
          if (answered) {
            questionAnsweredCount++;
            setQuestionAnswered((questionAnsweredCount));

          }
        }
      });

      // if (room.isManagedByIA && (questionAnsweredCount === room.competitionInfo.questionsNbr)) {
      //   setTimeout(() => {
          
      //     dispatch(setEndOfCompetition());
      //     Events.localRoomClear();
      //   }, room.isManagedByIA ? 0 : 2500);
      // }
    }
  }, [room?.questions]);

  const handleAnswered = () => {
    // Quand une réponse est envoyée → prochaine question
    // if(room && room.isManagedByIA){
    //   setCurrentIndex((prev) => prev + 1);
    // }
  };

  useEffect(()=>{
    if(room && room.questions && !room.isManagedByIA){
      setCurrentQuestion(room.questions[0])
    }
  }, [room?.questions])

  useEffect(()=>{
      if(nextQuestion){
          setCurrentIndex((currentIndex+1));
          dispatch(resetNexQuestion())
      }

  }, [nextQuestion])

  // Met à jour la question affichée
  useEffect(() => {
    if(room && room.questions && room.isManagedByIA){
      if(!room.questions[currentIndex]){
        setCurrentQuestion(null);     
      }

      setCurrentQuestion(room.questions[currentIndex]);
    }
  }, [currentIndex]);



  const Events = EmitEvent(dispatch, {roomId: room?.roomId as any, isManagedByIA: room?.isManagedByIA as any });

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('Changement d’état de l’application :', nextAppState);

      if (nextAppState === 'background') {
        Events.leaveCompetition((user && user.id ? user.id:0), room?.roomId as any);
        router.back()
      }

      setAppState(nextAppState);
    });

    // Nettoyage à la sortie du composant
    return () => {
      subscription.remove();
    };
  }, []);
  
        useFocusEffect(
          React.useCallback(() => {
            //ecran actif
            return () => {
             //ecran quitté deconnecté de la competition.
              Events.leaveCompetition((user && user.id ? user.id:0), room?.roomId as any);
            };
          }, [])
        );
  return (
  <SafeAreaView style={{ flex: 1 }}>
    <StatusBar hidden={true} />
    
    <ScrollView style={{ flex: 1, backgroundColor: "#E8F5FA" }}
    contentContainerStyle={{ flexGrow: 1 }}>

    <View>
     <OnlineUsers user={room ? (room.users ?? []) : []} max={room ? (room.competitionInfo ? room.competitionInfo.maxUsers: 0):0}/>
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
                                isIA: room ? (room.isManagedByIA ? true: false) : false,
                                totalMinutes: room ? room.totalTimes: null,
                                endTime: room ? room.finalHour : null
                      }}          
      />

     <View className="mt-[50%] mb-[10px] justify-center items-center">
         <MiniDashboard 
              questionAnswered={questionAnswered} 
              score={score}
              manager={room ? (room.isManagedByIA ? " Genesys-In IA" : "Owner"): ''}
              winnerPrice={room ? (room.competitionInfo ? room.competitionInfo.winnerPrice : 0):0}
         />
        <QuestionAnswer 
                competitionInfo={
                  {
                    creatorAvatarUrl: room ? (room.creatorInfo ? room.creatorInfo.imgUrl: ''):'',
                    creatorName: room ? (room.creatorInfo ? room.creatorInfo.username: ''):'',
                    competitionName: room ? (room.roomName ? room.roomName : ''):'',
                    createdAt: room && room.createdAt ? (new Date(room.createdAt)) : null,
                    totalQuestions: room && room.competitionInfo ? room.competitionInfo.questionsNbr: 0,
                  }
                } 
                question={room && room.questions ? 
                                    room.isManagedByIA ?
                                        (currentQuestion ? currentQuestion: null)
                                        : (room.questions.length > 0 ? room.questions[0]: null)
                                    : null 
                                } 
                loading={socketWaiting}   
                userData={{
                    id: user ? user.id: 0, 
                    username: user ? user.username : "",
                    surname: user ? user.surname : "",
                    imgUrl : user ? user.imgUrl : "",
                    email : user ? user.email : "",
                    score: 0
                }}   
                onAnswer={handleAnswered}
          />
      </View>
    </View>

    </ScrollView>
    </SafeAreaView>
    
  );
}