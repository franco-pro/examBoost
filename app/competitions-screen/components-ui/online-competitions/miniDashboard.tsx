import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { VStack } from '@/components/ui/vstack';
import { useTranslation } from 'react-i18next';
interface MiniDashboardProps{
  questionAnswered: number;
  totalQuestion: number;
  score: number;
  manager: string;
  winnerPrice: number;
}
export default function MiniDashboard({questionAnswered, totalQuestion, score, manager, winnerPrice}: MiniDashboardProps) {
  const {t} = useTranslation("competition");
  return (
    <Card size="lg" className="w-[90%] min-h-[130px] h-auto mt-10 mb-2 bg-primary-defaultBlue shadow-xl p-3">
    <Box>
      <HStack className="px-2 justify-between items-center">
        {/* Questions Répondues */}
        <VStack className="items-center flex-1 sm:border-r sm:border-outline-300 px-1">
          <Heading size="xl" className="text-typography-white text-center">
            {questionAnswered + "/" + totalQuestion}
          </Heading>
          <Text size="xs" className="text-typography-white text-center">
            {t("mycompetition.competition.online_game.question_answered")}
          </Text>
        </VStack>
  
        <Divider orientation="vertical" className="mx-2 h-[60px] bg-emerald-500" />
  
        {/* Score */}
        <VStack className="items-center flex-1 sm:border-r sm:border-outline-300 px-1">
          <Heading size="xl" className="text-typography-white text-center">
            {score}
          </Heading>
          <Text size="xs" className="text-typography-white text-center">
            {t("mycompetition.competition.result_screen.yr_score")}
          </Text>
        </VStack>
  
        <Divider orientation="vertical" className="mx-2 h-[60px] bg-emerald-500" />
  
        {/* Manager */}
        <VStack className="items-center flex-1 px-1">
          <Heading 
            size="xl" 
            className="text-typography-white text-center" 
            numberOfLines={1} 
            ellipsizeMode="tail"
          >
            {manager}
          </Heading>
          <Text size="xs" className="text-typography-white text-center">
            {t("mycompetition.competition.online_game.question_manager")}
          </Text>
        </VStack>
      </HStack>
  
      <View className="mt-2 items-center justify-center">
        <Text className="text-sm font-normal text-typography-white text-center">
          {t("mycompetition.competition.result_screen.gain")} :{" "}
          <Text size="xl" className="text-primary-defaultOrange">
            {winnerPrice.toLocaleString("fr-FR") + " U"}
          </Text>
        </Text>
      </View>
    </Box>
  </Card>
  );
}