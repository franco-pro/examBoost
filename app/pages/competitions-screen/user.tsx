import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#E8F5FA" }}
    contentContainerStyle={{ flexGrow: 1 }}>

    <View>
     <OnlineUsers user={user}/>
     <CompetitionInfos/>

     <View className="mt-[230px] mb-[10px] justify-center items-center">
         <MiniDashboard />
        <QuestionAnswer competitionInfo={competitionInfo} question={question} />
      </View>
    </View>

    </ScrollView>
    
  );
}