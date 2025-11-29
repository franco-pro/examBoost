import CompetitionStopedAlert from '@/app/helper/Dialogs/competitionStoped';
import DialogConfirm from '@/app/helper/Dialogs/confirm';
import CompetitionEndedAlert from '@/app/helper/Dialogs/endCompetition';
import { updateHomeBase } from '@/app/hooks/redux/competitions/competitions.slice';
import { useAppDispatch, useAppSelector } from '@/app/hooks/redux/redux.hooks';
import { userLeaveRoom } from '@/app/hooks/redux/rooms/rooms.slice';
import { EmitEvent } from '@/app/hooks/services/socket/rooms.gateway';
import { useSoundAud } from '@/app/hooks/useSound.hook';
import { UsersTest } from '@/app/services/entities/users.test';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface Question {
    id: number;
    text: string;
    choices: string[];
    correctAnswer: string;
    timeToAnswer: number;
    points: number;
    explanation?: string;
    answers: any[]; // Adjust type as needed
}
interface ComepetitionInfo{
  competitionName: string;
  createdAt: any;
  creatorName: string;
  creatorAvatarUrl: string;
  totalQuestions: number; 
}
export default function QuestionAnswer({question, competitionInfo, loading, userData, onAnswer}: {question: Question | null, competitionInfo: ComepetitionInfo, loading: boolean, userData: UsersTest, onAnswer: any}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { room, roomResult, competitionFinished, competitionStop, message, timerOff} = useAppSelector(state => state.rooms);
  const {homeBaseData} = useAppSelector((state)=> state.competitions);

  const [timeToAnswer, setTimeToAnswer] = useState(question ? question.timeToAnswer : 0);
  const [isOpen, setIsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isAlertCompetOpen, setIsAlertCompEndOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const {play, stop} = useSoundAud();

  // eviter les effets pendant le render
  const Envets = useMemo(() => EmitEvent(dispatch, {isManagedByIA: room?.isManagedByIA as any, roomId: room?.roomId as any}), [dispatch, room]);
  const max = question ? question.timeToAnswer : 0;

  const datecreation = new Date(competitionInfo.createdAt);
  const formatted = datecreation.toLocaleString("fr-FR", {
    weekday: "long",  
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  
 useEffect(() => {
    setTimeToAnswer(question ? question.timeToAnswer : 0);
  }, [question?.id]);

  useEffect(() => {
    if(timerOff){
      Envets.setLocalCompetitionEnded()
    }
  }, [timerOff]);

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

  // useEffect(() => {
  //   if (!question?.id) return;

  //   // reset le timer à chaque nouvelle question
  //   setTimeToAnswer(max);

  //   intervalRef.current = setInterval(() => {
  //     setTimeToAnswer((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(intervalRef.current!);
  //         sendChoice("???????", question.id);
  //         // if(room && room.isManagedByIA){
  //         //     dispatch(passToNextQuestion())
  //         // }
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);

  //   // nettoyage quand la question change ou le composant se démonte
  //   return () => clearInterval(intervalRef.current!);
  // }, [question?.id]);

  useFocusEffect(
    useCallback(() => {
      // quand la page devient active
    if (!question?.id) return;

      setTimeToAnswer(max);

      intervalRef.current = setInterval(() => {
        setTimeToAnswer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
             play("WrongAnswer").then(() => {
              sendChoice("???????", question?.id);
              // onAnswer()
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // nettoyage quand on quitte la page
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, [question?.id, question?.timeToAnswer])
  );

  async function sendChoice(value: string, questionID: number) {
    // Stopper le timer dès qu’on envoie une réponse
    if (intervalRef.current) {
      console.log('timer stop')
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const answer = {
      id: 1,
      userID: userData.id,
      questionID,
      username: userData.username,
      text: value,
      isCorrect:
        value.toLowerCase() === String(question?.correctAnswer).toLowerCase(),
      timeTaken: (max - timeToAnswer),
    };

    if(answer.isCorrect){
      await play('CorrectAnswer');
    }else{
      await play('WrongAnswer');
    }
    console.log('send as')

    Envets.sendAnswer(answer);
    // onAnswer()
  }

 async function handleLeavingCompetition() {
    Envets.leaveCompetition(userData.id, room?.roomId as any);
    dispatch(userLeaveRoom());
    dispatch(updateHomeBase(
      {
        ...homeBaseData,
        competitionLeaved: homeBaseData ? (homeBaseData.competitionLeaved+1):0
      }

    ));
    router.back();
  }

async function onClosingConfirm() {
    setIsAlertOpen(false);

    router.back();
  }

  function onCompetitionEndAlertConfirm(){

      let am_winner = roomResult && roomResult.users ? roomResult.users.find((user)=>user.userID == userData.id)?.isWinner: null;
      
      if(am_winner){
        dispatch(updateHomeBase(
            {
              ...homeBaseData,
              competitionFinished: (homeBaseData ? homeBaseData.competitionFinished+1: 0),
              competitionWin: (homeBaseData ? homeBaseData.competitionWin+1: 0),
              totalPriceWin: (homeBaseData && roomResult ? (homeBaseData.totalPriceWin+roomResult.competitionInfo.winnerPrice): 0)
            }

        ));
        router.replace("/pages/competitions-screen/components-ui/online-competitions/trophySection");

      }else{
        dispatch(updateHomeBase(
          {
            ...homeBaseData,
            competitionFinished: (homeBaseData ? homeBaseData.competitionFinished+1: 0),
          }

      ));
        router.replace("/pages/competitions-screen/components-ui/online-competitions/competitionResult");
      }
    setIsAlertCompEndOpen(false);

  }
    return (
      <Card size="lg" variant="elevated" className="p-5  shadow-xl rounded-lg w-[90%] mt-1">
        <Text className="text-sm font-normal mb-2 text-typography-700">
          Created At: {formatted}
        </Text>
        {
           question === null && loading ? (
           <VStack className="justify-center items-center">

                    <Spinner size="large" color="blue" />
                    <Text size="xl">En attente de question...</Text>
            </VStack>
          ) : (question !== null && !loading) ? (

            <>
                <VStack className="mb-6 flex items-center justify-center">
                <Heading size="md" className="mb-4">
                  {competitionInfo.competitionName}
                </Heading>

            
                    <Text size="lg" className='text-fontFamily-jakarta text-center'>
                      {question.text + "?"} &nbsp; - &nbsp; | {question.points + ' pts'}
                    </Text>
                   
                    <VStack space="lg" className="max-w-[410px] w-full">
                      <Text size="sm" className="mt-4 text-error-500">
                        {'\n'}
                        Time left to answer: {'-'}{timeToAnswer} seconds
                      </Text>
                        <Progress value={timeToAnswer} max={max} className={"w-full h-2 bg-lime-100"}>
                          <ProgressFilledTrack className="h-2 bg-lime-500" />
                        </Progress>
                        <Text size="sm" className='italic'>*en cas de non reponse, une reponse null sera envoyée automatiquement et + {max}s comme temps de reponses.</Text>
                      </VStack>
              
              </VStack> 

              <Box className="flex-row flex-wrap justify-center">
                {question.choices.map((choice, index) => (
                  <Button key={index} variant="outline" action="positive" onPress={() => sendChoice(choice, question.id)} size="sm" className="min-w-[90px] m-2 px-4 py-1 flex-shrink w-auto">
                    <ButtonText size="lg">{choice}</ButtonText>
                  </Button>
                ))}
              </Box>
            </>) : competitionStop ? (
              <CompetitionStopedAlert
              isOpen={isAlertOpen}
              message={message ?? null }
              onClose={() => onClosingConfirm()}
              
            />
            ) : (

                (timeToAnswer == 0 && competitionInfo?.totalQuestions == 0) ? (
                 <CompetitionEndedAlert isOpen={isAlertCompetOpen} onClose={onCompetitionEndAlertConfirm} />

                ):  <VStack className="justify-center items-center">

                      <Spinner size="large" color="blue" />
                      <Text size="xl">Fin de competition...</Text>
                    </VStack>


             )
            }

        <Button onPress={() => setIsOpen(true)} action="negative" className="py-2 px-4 mt-4 border-0 w-[90%] max-w-[500px] self-center" >
         <ButtonText size="xl" className='text-typography-white'>Abandonner la Competition</ButtonText>
       </Button>
       <DialogConfirm isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={handleLeavingCompetition} />
      </Card>
    );
  }  

