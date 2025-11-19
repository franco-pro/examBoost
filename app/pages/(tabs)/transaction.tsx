import { Button, ButtonText } from '@/components/ui/button';
import { Text, View } from 'react-native';

export default function Transaction(){
    return (
      <View className="bg-[#E8F5FA] flex-1">
        <Text>Transaction screen</Text>

        <Button variant="solid" size="md" action="primary">
          <ButtonText>Click me</ButtonText>
        </Button>
      </View>
    );
}
