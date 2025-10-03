import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { EyeIcon, Icon } from '@/components/ui/icon';
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default function CompetitionInfos() {
    return (
        <VStack className="absolute top-0 left-0 w-[48%] max-w-[50%]"  space="xs">
            <Card className="bg-primary-defaultBlue p-5 shadow-xl  rounded-lg h-24 m-3 flex items-center justify-center">
                <Text className="text-1xl  font-bold text-typography-white">
                    Temps de Jeu
                </Text>
                <Heading size="lg" className="text-primary-defaultOrange">
                    00:15:23
                </Heading>
                <Box>
                    <HStack>
                         <Icon className="text-primary-defaultOrange" as={EyeIcon} />
                        <Text className="text-sm font-normal mb-2 ml-2 text-primary-defaultOrange">
                                300
                        </Text>
                    </HStack>
                </Box>
            </Card>

            <Card className="bg-primary-defaultBlue p-5 rounded-lg ml-3 mr-3">
                <Text className="text-sm font-normal mb-2 text-typography-white">
                   Sport World Competition
                </Text>
                <Box className="flex-row">
                    <Avatar size="sm" className="mr-3">
                    <AvatarFallbackText>RR</AvatarFallbackText>
                    <AvatarImage
                        source={{
                        uri: 'https://gluestack.github.io/public-blog-video-assets/john.png',
                        }}
                        alt="image"
                    />
                    </Avatar>
                    <VStack>
                    <Heading size="sm" className="mb-1 text-typography-white">
                        John Smith
                    </Heading>
                    <Text size="xs" className="text-primary-defaultOrange">Owner</Text>
                    </VStack>
                </Box>
            </Card>
       </VStack>
    );
}