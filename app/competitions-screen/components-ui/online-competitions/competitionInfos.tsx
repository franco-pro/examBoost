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
    competitionInfo: {questionNbr: number, CreatorName: string, CreatorSurname: string, instrunctions: string|null, isIA: boolean, totalMinutes: number|null, serverNow: any, endTime: any|null}
}

export default function CompetitionInfos({data, competitionInfo}: CompetitionInfosProps) {
    const {room} = useAppSelector(state => state.rooms);
    const dispatch = useAppDispatch();
    const {t} = useTranslation("competition")
    function onFinish(){
        // dispatch(setTimeOff())
    }

    function truncateWord(word: string, maxLength = 8): string {
        if (!word) return "";
        return word.length <= maxLength ? word : word.slice(0, maxLength).trimEnd() + "…";
      }
      
      function formatCreatorName(surname: string, name: string): string {
        return `${truncateWord(surname)} ${truncateWord(name)}`.trim();
      }
    return (
        <VStack className="w-full max-w-[400px]"  space="xs">
            <Card className="bg-primary-defaultBlue p-5 shadow-xl  rounded-lg h-24 m-3 flex items-center justify-center">
                <Text className="text-1xl  font-bold text-typography-white">
                   {
                        competitionInfo.isIA ? t("mycompetition.competition.online_game.remainig_time") :t("mycompetition.competition.online_game.game_time")
                   } 
                </Text>
                <Heading size="lg" className="text-primary-defaultOrange">
                    {/* {heure}:{minute}:{seconde} */}
                    {
                        !competitionInfo.isIA ? (<Timer />):(<Countdown serverNowUTC={competitionInfo.serverNow ? competitionInfo.serverNow:null} targetDateUTC={competitionInfo.endTime ? competitionInfo.endTime : null } onFinish={onFinish}/>)
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
                <Box className="flex-row" style={{ width: "100%" }}>
                    <Avatar size="sm" className="mr-3">

                    {data.imgUrl ? (
                       <AvatarImage 
                       source={
                         data.isExamBoostCompetition 
                           ? require("@/assets/images/app.png") 
                           : { uri: data.imgUrl }               
                       } 
                       style={{ width: 60, height: 60, borderRadius: 30 }} 
                       resizeMode="contain"
                       alt="image" 
                     />
                    ) : 
                        <AvatarFallbackText>
                                {data.creatorName ? data.creatorName.split(" ").map((n) => n[0]).join(""): 'O'}
                        </AvatarFallbackText>
                    }
                
                    </Avatar>
                    <VStack style={{ flex: 1, minWidth: 0 }}>
                    <HStack style={{ flexDirection: "row", alignItems: "center", minWidth: 0 }}>
                    <Text 
                        style={{ flexShrink: 1, minWidth: 0, color: "white", fontWeight: "bold" }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {data.isExamBoostCompetition ? "ExamBoost" : formatCreatorName(data.creatorSurname, data.creatorName)}
                    </Text>
                    {
                        data.isExamBoostCompetition && (
                            <Ionicons name="checkmark-circle" size={16} color="blue" style={{ marginLeft: 4 }} />
                        )
                    }
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