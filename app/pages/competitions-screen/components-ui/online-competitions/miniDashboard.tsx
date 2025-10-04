import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { VStack } from '@/components/ui/vstack';

export default function MiniDashboard() {
  return (
    <Card size="lg"  className="w-[90%] mt-20 mb-2 bg-primary-defaultBlue shadow-xl">
        <Box>
          <HStack className='px-2 justify-between'>
                <VStack className="items-center pb-2 sm:flex-1 sm:pb-0 sm:border-r sm:border-outline-300">
                <Heading size="xs" className='text-typography-white'>3</Heading>
                <Text size="xs" className='text-typography-white'>Question Answer</Text>
                </VStack>
                <Divider
                orientation="vertical"
                className="mx-2 h-[60px] bg-emerald-500"
                />
                <VStack className="items-center py-2 sm:flex-1 sm:py-0 sm:border-r sm:border-outline-300">
                <Heading size="xl" className='text-typography-white'>13</Heading>
                <Text size="xs" className='text-typography-white'>Your Score</Text>
                </VStack>
                <Divider
                orientation="vertical"
                className="mx-2 h-[60px] bg-emerald-500"
                />
                <VStack className="items-center pt-2 sm:flex-1 sm:pt-0">
                <Heading size="xs" className='text-typography-white'>IA</Heading>
                <Text size="xs" className='text-typography-white'>Questions manager</Text>
                </VStack>
          </HStack>
          {'\n'}
          <View className='mt-2 mb-0 items-center justify-center'>
            <Text className="text-sm font-normal mb-2 text-typography-white text-center">
              Gain:  <Text size='xl' className='text-primary-defaultOrange'> + 45 000 💰 </Text>
            </Text>
          </View>


      </Box>
    </Card>
  );
}