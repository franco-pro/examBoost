import { useAppDispatch, useAppSelector } from '@/app/hooks/redux/redux.hooks';
import { setEndOfCompetition } from '@/app/hooks/redux/rooms/rooms.slice';
import { EmitEvent } from '@/app/hooks/services/socket/rooms.gateway';
import Question from '@/app/services/entities/question.entity';
import { UsersTest } from '@/app/services/entities/users.test';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { AppState, ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CompetitionInfos from './components-ui/online-competitions/competitionInfos';
import MiniDashboard from './components-ui/online-competitions/miniDashboard';
import OnlineUsers from './components-ui/online-competitions/onlineusers';
import QuestionAnswer from './components-ui/online-competitions/questionAnswer';

export default function User() {
  const router = useRouter();
  const dispatch = useAppDispatch()

  const [appState, setAppState] = useState(AppState.currentState);
  const {room, socketWaiting, error, nextQuestion} = useAppSelector(state => state.rooms);
  

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>();
  // secondes avant de passer à la question suivante
  let currentUserId = 10;
  //find the current user  score by id 
  const score = room && room.users ? (room.users.find(u => u.userID === currentUserId)?.score ?? 0) : 0;

  let questionAnswered = 0;

  if(room && room.questions){
    if(room.questions.length > 0){
      room.questions.forEach(q => {
        const answered = q.answers.find(a => a.userID === currentUserId);
        if(answered){
          questionAnswered += 1;
          if(questionAnswered == room.competitionInfo.questionsNbr){
              setTimeout(() => {
                dispatch(setEndOfCompetition())
              }, room.isManagedByIA ? 0 : 2500);
          }
        }
      }
      )  
    }
  }

  useEffect(() => {
    // ⏱️ Définir un timer pour passer à la question suivante
    if(room && room.questions){
      if (currentIndex < room.questions.length - 1) {
        let delay = room.questions[currentIndex+1].timeToAnswer; 

        // const timer = setTimeout(() => {
        //   console.log('execute')
        //   setCurrentIndex(prev => prev + 1);
        // }, delay * 1000);

        // return () => clearTimeout(timer);
     }
    }

  }, [currentIndex]);

  useEffect(()=>{
    if(room && room.questions){
      setCurrentQuestion(room.questions[0])

    }
  }, [room?.questions])

  useEffect(()=>{
      if(nextQuestion){
          setCurrentIndex((currentIndex+1));
      }
  }, [nextQuestion])

  // Met à jour la question affichée
  useEffect(() => {
    if(room && room.questions){
      setCurrentQuestion(room.questions[currentIndex]);
    }
  }, [currentIndex]);



  const Events = EmitEvent(dispatch, room);
  const user : UsersTest = {
    id: currentUserId,
    username: 'Current User',
    surname: 'Test',
    email: "test@gmail.com",
    imgUrl: "",
    score: score,
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('Changement d’état de l’application :', nextAppState);

      if (nextAppState === 'background') {
        Events.leaveCompetition(user.id);
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
              Events.leaveCompetition(user.id);
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

     <View className="mt-[50%] mb-[10px] justify-center items-center">
         <MiniDashboard 
              questionAnswered={questionAnswered} 
              score={score}
              manager={room ? (room.isManagedByIA ? " Genesys-in IA" : "Owner"): ''}
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
                userData={user}   
          />
      </View>
    </View>

    </ScrollView>
    </SafeAreaView>
    
  );
}