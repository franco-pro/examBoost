import { Room } from "@/app/hooks/entities/rooms.entity";
import { Accordion, AccordionContent, AccordionHeader, AccordionIcon, AccordionItem, AccordionTitleText, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { AddIcon, RemoveIcon } from "@/components/ui/icon";
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { ScrollView } from "react-native";

interface UsersAnswersProps{
    // isIA: boolean;
    // questions: Question[];
    // question: any;
    room: Room | null
}


export default function UsersResult({ room }: UsersAnswersProps) {

    return (
        <>
        <Card size="lg" className="p-5  shadow-xl rounded-lg w-[100%] mt-1">
            <Heading size="md" className="mb-5">
                Questions et réponses :
            </Heading>
            
            {
               room ? (
                    room.questions && room.questions.length > 0 ? (

                        
                    <Accordion className="w-[100%] bg-transparent" >
                    {

                     room.questions.map((q, index) => (

                        <AccordionItem key={q.id ?? index}
                        value={"item-" + index} className="m-[5px] w-full rounded-lg">
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

                                    {  q.answers.length && q.answers.length > 0 ? 
                                    (
                                       q.answers.map((u, index) => (
                                    <Box key={u.id} className="flex-row mb-4 items-center">
                                      <Avatar className="mr-3">
                                        <AvatarFallbackText>
                                          {u.username.split(" ").map((n) => n[0]).join("")}
                                        </AvatarFallbackText>
                                        {u.userID ? (
                                          <AvatarImage source={{ uri: room.users.find(user => user.userID === u.userID)?.imgUrl }} alt="image" />
                                        ) : null}
                                        
                                      </Avatar>
                                      
                                      <VStack>
                                        <Heading size="sm" className="mb-1">
                                          {u.username}
                                        </Heading>
                                        <Text size="sm">Answer: 
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
                                        <VStack className="justify-center items-center">
                                        <Image
                                        size="xl"
                                        source={require('../../../../../assets/others/nodata.png')}
                                        alt="image"
                                        />
                                        <Text>Aucune Questions générées.</Text>
                
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
                        <VStack>
                        <Image
                          size="xl"
                          source={require('../../../../../assets/others/nodata.png')}
                          alt="image"
                        />
                        <Text>Aucune Questions générées.</Text>

                        </VStack>
                    </View>
                    ) 
                ) : (
                    <View className="justify-center items-center">
                        <VStack>
                        <Image
                          size="xl"
                          source={require('../../../../../assets/others/nodata.png')}
                          alt="image"
                        />
                        <Text>Aucune Questions générées.</Text>

                        </VStack>
                    </View>
               
                )
            }

        </Card>
        </>
    );
}