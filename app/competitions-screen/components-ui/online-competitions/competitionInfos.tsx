import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
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
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

interface CompetitionInfosProps{
    data : {viewers: number, roomName: string, creatorName: string, creatorSurname: string, imgUrl: string, isExamBoostCompetition: boolean}
    competitionInfo: {questionNbr: number, CreatorName: string, CreatorSurname: string, instrunctions: string|null, isIA: boolean, totalMinutes: number|null, endTime: any|null}
}

export default function CompetitionInfos({data, competitionInfo}: CompetitionInfosProps) {
    const {room} = useAppSelector(state => state.rooms);
    const dispatch = useAppDispatch();
    const {t} = useTranslation("competition")
    function onFinish(){
        // dispatch(setTimeOff())
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

                    {data.imgUrl ? (
                        <AvatarImage source={{ uri: (data.isExamBoostCompetition ? "/assets/images/axel.jpg": data.imgUrl)  }} alt="image" />
                    ) : 
                        <AvatarFallbackText>
                                {data.creatorName ? data.creatorName.split(" ").map((n) => n[0]).join(""): 'O'}
                        </AvatarFallbackText>
                    }
                
                    </Avatar>
                    <VStack>
                        <HStack>
                            <Heading size="sm" className="mb-1 text-typography-white">
                            { 
                                data.isExamBoostCompetition ? "ExamBoost":
                                data.creatorSurname + " " + data.creatorName
                            } 
                            </Heading>
                            <Text><Ionicons name="checkmark-circle" size={16} color="blue" /> </Text>
                        </HStack>

                    <Text size="xs" className="text-primary-defaultOrange">{t("mycompetition.competition.online_game.owner")} </Text>
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