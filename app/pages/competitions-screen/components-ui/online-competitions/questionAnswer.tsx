import DialogConfirm from '@/app/helper/Dialogs/confirm';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useRouter } from 'expo-router';
import { useState } from 'react';

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
  createdAt: string;
  creatorName: string;
  creatorAvatarUrl: string;
  description: string;
  totalQuestions?: number; 
}
export default function QuestionAnswer({question, competitionInfo}: {question: Question, competitionInfo: ComepetitionInfo}) {
  const router = useRouter();

  const [isOpen, setIsOpen] =  useState(false);

  const handleLeavingCompetition = () => {
    onLeavingCompetition();
    setIsOpen(false);
  }

  function onLeavingCompetition() {
    // Logic to handle leaving the competition


    console.log("User has chosen to leave the competition.");

    router.back()
  }
    return (
      <Card size="lg" variant="elevated" className="p-5  shadow-xl rounded-lg w-[90%] mt-1">
        <Text className="text-sm font-normal mb-2 text-typography-700">
          Created At: {competitionInfo.createdAt}
        </Text>
        <VStack className="mb-6 flex items-center justify-center">
          <Heading size="md" className="mb-4">
            {competitionInfo.competitionName}
          </Heading>
          <Text size="lg" className='text-fontFamily-jakarta text-center'>
            {question.text + " ?"} &nbsp; - &nbsp; | {question.points + ' pts'}
          </Text>
          <Text size="sm" className="mt-4 text-error-500">
             {'\n'}
              Time to answer: {question.timeToAnswer} seconds
         </Text>
        </VStack>
        <Box className="flex-row">
          {question.choices.map((choice, index) => (
            <Button key={index} variant="outline" size="sm" className="ml-2 mr-2 mb-2 py-2 px-4 flex-1">
              <ButtonText size="sm">{choice}</ButtonText>
            </Button>
          ))}
        </Box>
        <Button onPress={() => setIsOpen(true)} action="negative" className="py-2 px-4 mt-4 border-0 w-[90%] max-w-[500px] self-center" >
         <ButtonText size="sm" className='text-typography-white'>Abandonner la Competition</ButtonText>
       </Button>
       <DialogConfirm isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={handleLeavingCompetition} />
      </Card>
    );
  }  

