import { HStack } from '@/components/ui/hstack';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';

interface SwitchQuestionAnswerProps {
    onValueChange: (value: boolean) => void;
    value: boolean;
    //disable: boolean;
}
export default function SwitchQuestionAnswer({onValueChange, value}: SwitchQuestionAnswerProps) {
  return (
    <HStack space="md" className='mb-4'>
      <Text size="xl">Form. Questions</Text>

      <Switch
        defaultValue={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#181c5c', true: '#ff894f' }}
        thumbColor="#181c5c"
        ios_backgroundColor="#ff894f"
      />
      <Text size="xl">User. Answers</Text>

    </HStack>
  );
}
