import { useAppSelector } from '@/app/hooks/redux/redux.hooks';
import { EmitEvent } from '@/app/hooks/services/socket/rooms.gateway';
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
  const user = [
    {name: 'John Doe', avatarUrl: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png', score: 1500, isConnected: true, isWinner: true},
    {name: 'Jane Smith', avatarUrl: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png', score: 1450, isConnected: true, isWinner: false},
    {name: 'Alice Johnson', avatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png', score: 1400, isConnected: false, isWinner: false},
    {name: 'Connor Sarah', avatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png', score: 1450, isConnected: true, isWinner: false},
    {name: 'Steph Greps', avatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png', score: 1400,  isConnected: false, isWinner: false},
    {name: 'Hit Karl', avatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png', score: 1450, isConnected: true, isWinner: false},
    {name: 'Doobit', avatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png', score: 1400, isConnected: false, isWinner: false},
  ]

  const question = {
    id: 1,
    text: 'What is the capital of France',
    choices: ['Berlin', 'Madrid', 'Paris'],
    correctAnswer: 'Paris',
    timeToAnswer: 30,
    points: 10,
    explanation: 'Paris is the capital and most populous city of France.',
    answers: [],
  };

  const competitionInfo = {
    competitionName: 'General Knowledge Quiz',
    createdAt: 'October 01, 2025',
    creatorName: 'Admin',
    creatorAvatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png',
    description: 'Test your general knowledge with this fun and engaging quiz!',
    totalQuestions: 10,
    isAI: true,
  };

  const [appState, setAppState] = useState(AppState.currentState);
  const {room, loading, error} = useAppSelector(state => state.rooms);

  const Events = EmitEvent()


  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('Changement d’état de l’application :', nextAppState);

      if (nextAppState === 'background') {
        Events.leaveCompetition();
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
              Events.leaveCompetition();
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
      />

     <View className="mt-[50%] mb-[10px] justify-center items-center">
         <MiniDashboard />
        <QuestionAnswer competitionInfo={competitionInfo} question={question} />
      </View>
    </View>

    </ScrollView>
    </SafeAreaView>
    
  );
}