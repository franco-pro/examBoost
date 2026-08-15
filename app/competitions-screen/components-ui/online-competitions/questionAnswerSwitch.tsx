import { HStack } from '@/components/ui/hstack';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';

interface SwitchQuestionAnswerProps {
    onValueChange: (value: boolean) => void;
    value: boolean;
    //disable: boolean;
}
export default function SwitchQuestionAnswer({onValueChange, value}: SwitchQuestionAnswerProps) {
  const {t} = useTranslation("competition");
  return (
    <HStack space="md" className='mb-4 mt-10'>
      <Text size="xl">Questions</Text>

      <Switch
        defaultValue={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#181c5c', true: '#ff894f' }}
        thumbColor="#181c5c"
        ios_backgroundColor="#ff894f"
      />
      <Text size="xl">{t("mycompetition.competition.result_screen.answer")}s </Text>

    </HStack>
  );
}
