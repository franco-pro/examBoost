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
    const user = [
        {name: 'John Doe', avatarUrl: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png', score: 1500, isConnected: true, isWinner: true},
        {name: 'Jane Smith', avatarUrl: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png', score: 1450, isConnected: true, isWinner: false},
        {name: 'Alice Johnson', avatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png', score: 1400, isConnected: false, isWinner: false},
        {name: 'Connor Sarah', avatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png', score: 1450, isConnected: true, isWinner: false},
        {name: 'Steph Greps', avatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png', score: 1400,  isConnected: false, isWinner: false},
        {name: 'Hit Karl', avatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png', score: 1450, isConnected: true, isWinner: false},
        {name: 'Doobit', avatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png', score: 1400, isConnected: false, isWinner: false},
      ]

      const competitionInfo = {
        competitionName: 'General Knowledge Quiz',
        createdAt: 'October 01, 2025',
        creatorName: 'Admin',
        creatorAvatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png',
        description: 'Test your general knowledge with this fun and engaging quiz!',
        totalQuestions: 10,
        isAI: true,
      };

      const question = [
        {
          id: 1,
          text: 'What is the capital of France',
          choices: ['Berlin', 'Madrid', 'Paris'],
          correctAnswer: 'Paris',
          timeToAnswer: 30,
          points: 10,
          explanation: 'Paris is the capital and most populous city of France.',
          answers: [],
        }
      ]

      const [switchQA, setSwitchQA] =  useState(false);
      const {room, loading, error} = useAppSelector(state => state.rooms);
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
              />
        
             
             <View className="mt-[65%] mb-[10px] justify-center items-center"> 
            
             <SwitchQuestionAnswer value={switchQA} onValueChange={setSwitchQA}/>
             {
                !switchQA ? (
                 <FormQuestion competitionInfo={competitionInfo}/>

                ): (
                  // <VStack className="justify-center items-center">

                  // <Spinner size="large" color="blue" />
                  // <Text>En attente de reponse.</Text>
                  // </VStack>
                  <UsersAnswers isIA={competitionInfo.isAI} questions={question} question={''} competitionName="General Knowledge Quiz"/>

                )
              } 
                
              </View>
            </View>
        
            </ScrollView>
          </SafeAreaView>
    );


}