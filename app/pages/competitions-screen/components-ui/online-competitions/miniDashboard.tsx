import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { VStack } from '@/components/ui/vstack';
interface MiniDashboardProps{
  questionAnswered: number;
  score: number;
  manager: string;
  winnerPrice: number;
}
export default function MiniDashboard({questionAnswered, score, manager, winnerPrice}: MiniDashboardProps) {
  return (
    <Card size="lg"  className="w-[90%] h-[130px] mt-20 mb-2 bg-primary-defaultBlue shadow-xl">
        <Box>
          <HStack className='px-2 justify-between'>
                <VStack className="items-center mt-[7%] pb-2 sm:flex-1 sm:pb-0 sm:border-r sm:border-outline-300">
                <Heading size="xl" className='text-typography-white'>{questionAnswered} </Heading>
                <Text size="xs" className='text-typography-white'>Question Answered</Text>
                </VStack>
                <Divider
                orientation="vertical"
                className="mx-2 h-[60px] bg-emerald-500"
                />
                <VStack className="items-center py-2 sm:flex-1 sm:py-0 sm:border-r sm:border-outline-300">
                <Heading size="xl" className='text-typography-white'>{score}</Heading>
                <Text size="xs" className='text-typography-white'>Your Score</Text>
                </VStack>
                <Divider
                orientation="vertical"
                className="mx-2 h-[60px] bg-emerald-500"
                />
                <VStack className="items-center mt-[7%] pt-2 sm:flex-1 sm:pt-0">
                <Heading size="xl" className='text-typography-white'>{manager}</Heading>
                <Text size="xs" className='text-typography-white'>Questions manager</Text>
                </VStack>
          </HStack>
         
          
          <View className='mt-2 mb-0 items-center justify-center'>
            <Text className="text-sm font-normal mb-2 text-typography-white text-center">
            {'\n'}
              Gain:  <Text size='xl' className='text-primary-defaultOrange'> {winnerPrice} 💰 </Text>
            </Text>
          </View>


      </Box>
    </Card>
  );
}