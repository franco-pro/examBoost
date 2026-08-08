import { useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { Accordion, AccordionContent, AccordionHeader, AccordionIcon, AccordionItem, AccordionTitleText, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { AddIcon, RemoveIcon } from "@/components/ui/icon";
import { Image } from '@/components/ui/image';
import { Spinner } from "@/components/ui/spinner";
import { Text } from '@/components/ui/text';
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";

interface UsersAnswersProps{
    // isIA: boolean;
    // questions: Question[];
    // question: any;
    competitionName: string;
}


export default function UsersAnswers({competitionName }: UsersAnswersProps) {
    const {room, socketWaiting, error} = useAppSelector(state => state.rooms);
    const {t}= useTranslation("competition");
    return (
        <>
        <Card size="lg" variant="outline" className="p-5  shadow-xl rounded-lg w-[90%] mt-1">
            <Heading size="md" className="mb-1">
                {competitionName}
            </Heading>
            
            {
               room ? (
                    room.questions && room.questions.length > 0 ? (

                        
                    <Accordion className="w-[100%] bg-transparent" >
                    {

                     room.questions.map((q, index) => (

                        <AccordionItem key={q.id ?? index}
                        value={"item-" + index} className="m-[7px] w-full rounded-lg">
                          <AccordionHeader className="bg-primary-defaultBlue">
                            <AccordionTrigger className="focus:web:rounded-lg">
                            {({ isExpanded }: { isExpanded: boolean }) => {
                                return (
                                  <>
                                   
                                    <AccordionTitleText className="text-typography-white">
                                      {q.text + ' ?'}
                                    </AccordionTitleText>
                                    {isExpanded ? (
                                      <AccordionIcon color="#ff894f" as={RemoveIcon} className="mr-3" />
                                    ) : (
                                      <AccordionIcon color="#FFFFFF" as={AddIcon} className="mr-3" />
                                    )}
                                  </>
                                );
                              }}
                            </AccordionTrigger>
                          </AccordionHeader>
                          <AccordionContent className="text-center mt-4 max-h-[200px] h-[200px]">
                            <ScrollView>
                                    {/* {
                                      <View className="mb-[10px]">
                                          <SegmentedFilter
                                              options={q.choices}
                                              defaultValue={q.correctAnswer}
                                              onChange={(value) => {
                                                console.log("Selected value:", value);
                                              }}
                                            />
                                      </View>
                                      
                                    } */}

                                    {  q.answers.length && q.answers.length > 0 ? 
                                    (
                                       q.answers.map((u, index) => (
                                    <Box key={u.id+index} className="flex-row mb-4 items-center">
                                      <Avatar className="mr-3">
                                       
                                        {u.userID && room.users.find(user => user.userID === u.userID)?.imgUrl ? (
                                          <AvatarImage source={{ uri: room.users.find(user => user.userID === u.userID)?.imgUrl }} alt="image" />
                                        ) : 
                                        <AvatarFallbackText>
                                         {u.username.split(" ").map((n) => n[0]).join("")}
                                        </AvatarFallbackText>
                                        }
                                        
                                      </Avatar>
                                      
                                      <VStack>
                                        <Heading size="sm" className="mb-1">
                                          {u.username}
                                        </Heading>
                                        <Text size="sm">{t("mycompetition.competition.result_screen.answer")}: 
                                        <Text size="sm" className="text-primary-defaultBlue"> {u.text} </Text> 
                                          {
                                              u.isCorrect ? (
                                                  <Text className="text-xs font-medium">  🟢 </Text>
                                              ): (
                                                <Text className="text-xs font-medium">  🔴 </Text>
                                              )
                                          }
                                        </Text>
                                      </VStack>
                                    </Box>
                                  )) ) : (

                                    <View className="justify-center items-center">
                                    <VStack>

                                        <Spinner size="large" color="blue" />
                                        <Text>{t("mycompetition.competition.result_screen.waiting_answer")}.</Text>
                                    </VStack>

                                </View>
                                  )
                                
                                }
                                

                            </ScrollView>

                          </AccordionContent>
                        </AccordionItem>
                    ))}

                      </Accordion>

                    ): (
                     <View className="justify-center items-center">
                        <VStack className="justify-center items-center">
                        <Image
                          size="xl"
                          source={require('../../../../assets/others/nodata.png')}
                          alt="image"
                        />
                        <Text>{t("mycompetition.competition.result_screen.no_qts_generated_wait")}</Text>

                        </VStack>
                    </View>
                    ) 
                ) : (
                  null
               
                )
            }

        </Card>
        </>
    );
}