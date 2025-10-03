import { useState } from "react";
import { ScrollView, View } from "react-native";
import CompetitionInfos from "./components-ui/online-competitions/competitionInfos";
import FormQuestion from "./components-ui/online-competitions/formQuestion";
import OnlineUsers from "./components-ui/online-competitions/onlineusers";
import SwitchQuestionAnswer from "./components-ui/online-competitions/questionAnswerSwitch";
import UsersAnswers from "./components-ui/online-competitions/userAnswer";

export default function OwnerCompetitionsScreen() {
    const user = [
        {name: 'John Doe', avatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png', score: 1500, isConnected: true, isWinner: true},
        {name: 'Jane Smith', avatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png', score: 1450, isConnected: true, isWinner: false},
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
        isAI: false,
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
      

    return (
            <ScrollView   style={{ flex: 1, backgroundColor: "#E8F5FA" }}
            contentContainerStyle={{ flexGrow: 1 }}>
        
            <View>
             <OnlineUsers user={user}/>
             <CompetitionInfos/>
        
             
             <View className="mt-[300px] mb-[10px] justify-center items-center"> 
            
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
    );


}