import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { setTimeOff } from "@/app/hooks/redux/rooms/rooms.slice";
import Countdown from "@/app/services/compeititonService/count.timer";
import PopoverInstructions from "@/app/services/compeititonService/popover";
import Timer from "@/app/services/compeititonService/timer.function";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { EyeIcon, Icon } from '@/components/ui/icon';
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface CompetitionInfosProps{
    data : {viewers: number, roomName: string, creatorName: string, creatorSurname: string, imgUrl: string}
    competitionInfo: {questionNbr: number, CreatorName: string, CreatorSurname: string, instrunctions: string|null, isIA: boolean, totalMinutes: number|null, endTime: any|null}
}

export default function CompetitionInfos({data, competitionInfo}: CompetitionInfosProps) {
    const {room} = useAppSelector(state => state.rooms);
    const dispatch = useAppDispatch();

    function onFinish(){
        dispatch(setTimeOff(true))
    }
    return (
        <VStack className="absolute top-0 left-0 w-[48%] max-w-[50%]"  space="xs">
            <Card className="bg-primary-defaultBlue p-5 shadow-xl  rounded-lg h-24 m-3 flex items-center justify-center">
                <Text className="text-1xl  font-bold text-typography-white">
                   {
                        competitionInfo.isIA ? 'Temps Restant':'Temps de Jeu'
                   } 
                </Text>
                <Heading size="lg" className="text-primary-defaultOrange">
                    {/* {heure}:{minute}:{seconde} */}
                    {
                        !competitionInfo.isIA ? (<Timer />):(<Countdown targetDateUTC={competitionInfo.endTime ? competitionInfo.endTime : null } onFinish={onFinish}/>)
                    } 
                </Heading>
                <Box>
                    <HStack>
                         <Icon className="text-primary-defaultOrange" as={EyeIcon} />
                        <Text className="text-xl font-normal mb-2 ml-2 text-primary-defaultOrange">
                                {data.viewers}
                        </Text>
                    </HStack>
                </Box>
            </Card>

            <Card className="bg-primary-defaultBlue p-5 rounded-lg ml-3 mr-3">
                <Text className="text- font-normal mb-2 text-typography-white">
                   {data.roomName} 🏆
                </Text>
                <Box className="flex-row">
                    <Avatar size="sm" className="mr-3">
                    <AvatarFallbackText>
                    {data.creatorName ? data.creatorName.split(" ").map((n) => n[0]).join(""): 'O'}
                    </AvatarFallbackText>
                    <AvatarImage
                        source={{
                        uri: 'https://gluestack.github.io/public-blog-video-assets/john.png',
                        }}
                        alt="image"
                    />
                    </Avatar>
                    <VStack>
                    <Heading size="sm" className="mb-1 text-typography-white">
                        {data.creatorName} {data.creatorSurname}
                    </Heading>
                    <Text size="xs" className="text-primary-defaultOrange">Owner</Text>
                    </VStack>
                </Box>
                <Box className="flex-row">
                    <PopoverInstructions data={
                                                {
                                                    competitionName: data.roomName, 
                                                    creator: data.creatorName + ' ' + data.creatorSurname, 
                                                    totalQuestions: competitionInfo.questionNbr,
                                                    instructions: competitionInfo.instrunctions ? competitionInfo.instrunctions : null
                                                    }}/>
                   
                </Box>


            </Card>
       </VStack>
    );
}