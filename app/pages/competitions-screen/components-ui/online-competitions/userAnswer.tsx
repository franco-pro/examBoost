import Question from "@/app/services/entities/question.entity";
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
import { ScrollView } from "react-native";

interface UsersAnswersProps{
    isIA: boolean;
    questions: Question[];
    question: any;
    competitionName: string;
}


export default function UsersAnswers({isIA, questions, question, competitionName }: UsersAnswersProps) {
    let waitingResponse = false;
    const ownerQuestion = question;
    const IAquestions = questions;

    const user = [
      {name: 'John Doe', answer: 'Paris', isCorrect: true, avatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png' },
      {name: 'Jane Smith', answer: 'London', isCorrect: false, avatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png' },
      {name: 'Alice Johnson', answer: 'Berlin', isCorrect: false, avatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png' },
      {name: 'Connor Sarah', answer: 'Madrid', isCorrect: false, avatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png' },
      {name: 'Steph Greps', answer: 'Rome', isCorrect: false, avatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png' },
      {name: 'Hit Karl', answer: 'Lisbon', isCorrect: false, avatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png' },
      {name: 'Doobit', answer: 'Vienna', isCorrect: false, avatarUrl: 'https://gluestack.github.io/public-blog-video-assets/john.png' },
    ]

    return (
        <>
        <Card size="lg" variant="ghost" className="p-5  shadow-xl rounded-lg w-[90%] mt-1">
            <Heading size="md" className="mb-1">
                {competitionName}
            </Heading>
            
            {
             waitingResponse ? (
                <VStack className="justify-center items-center">

                    <Spinner size="large" color="blue" />
                    <Text>En attente de reponse.</Text>
                </VStack>
                ) : isIA ? (
                    IAquestions.length > 0 ? (

                    IAquestions.map((q, index) => (
                        
                    <Accordion className="w-[100%] bg-transparent">
                        <AccordionItem value="item-1" className="rounded-lg">
                          <AccordionHeader className="bg-primary-defaultBlue">
                            <AccordionTrigger className="focus:web:rounded-lg">
                            {({ isExpanded }: { isExpanded: boolean }) => {
                                return (
                                  <>
                                   
                                    <AccordionTitleText className="text-typography-white">
                                      {q.text + ' ?'}
                                    </AccordionTitleText>
                                    {isExpanded ? (
                                      <AccordionIcon classNameColor="#ff894f" as={RemoveIcon} className="mr-3" />
                                    ) : (
                                      <AccordionIcon classNameColor="#FFFFFF" as={AddIcon} className="mr-3" />
                                    )}
                                  </>
                                );
                              }}
                            </AccordionTrigger>
                          </AccordionHeader>
                          <AccordionContent className="text-center mt-4 max-h-[300px]">
                            <ScrollView>

                                    {  user.map((u, index) => (
                                    <Box key={index} className="flex-row mb-4 items-center">
                                      <Avatar className="mr-3">
                                        <AvatarFallbackText>
                                          {u.name.split(" ").map((n) => n[0]).join("")}
                                        </AvatarFallbackText>
                                        {u.avatarUrl ? (
                                          <AvatarImage source={{ uri: u.avatarUrl }} alt="image" />
                                        ) : null}
                                        
                                      </Avatar>
                                      
                                      <VStack>
                                        <Heading size="sm" className="mb-1">
                                          {u.name}
                                        </Heading>
                                        <Text size="sm">Answer: 
                                        <Text size="sm" className="text-primary-defaultBlue"> {u.answer} </Text> 
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
                                  ))}

                            </ScrollView>

                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))

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
                     <Accordion className="w-[100%] bg-transparent">
                        <AccordionItem value="item-1" className="rounded-lg">
                          <AccordionHeader className="bg-primary-defaultBlue">
                            <AccordionTrigger className="focus:web:rounded-lg">
                            {({ isExpanded }: { isExpanded: boolean }) => {
                                return (
                                  <>
                                   
                                    <AccordionTitleText className="text-typography-white">
                                      {
                                        ownerQuestion ? (
                                          ownerQuestion.text + ' ?'
                                        ) : (
                                          'Aucune question posée.'
                                        )
                                      }
                                    </AccordionTitleText>
                                    {isExpanded ? (
                                      <AccordionIcon classNameColor="#ff894f" as={RemoveIcon} className="mr-3" />
                                    ) : (
                                      <AccordionIcon classNameColor="#FFFFFF" as={AddIcon} className="mr-3" />
                                    )}
                                  </>
                                );
                              }}
                            </AccordionTrigger>
                          </AccordionHeader>
                          <AccordionContent className="text-center mt-4 max-h-[300px]">
                            {
                              (ownerQuestion && ownerQuestion.answers.length > 0) ? (
                                <ScrollView>

                                    {  user.map((u, index) => (
                                    <Box key={index} className="flex-row mb-4 items-center">
                                      <Avatar className="mr-3">
                                        <AvatarFallbackText>
                                          {u.name.split(" ").map((n) => n[0]).join("")}
                                        </AvatarFallbackText>
                                        {u.avatarUrl ? (
                                          <AvatarImage source={{ uri: u.avatarUrl }} alt="image" />
                                        ) : null}
                                        
                                      </Avatar>
                                      
                                      <VStack>
                                        <Heading size="sm" className="mb-1">
                                          {u.name}
                                        </Heading>
                                        <Text size="sm">Answer: 
                                        <Text size="sm" className="text-primary-defaultBlue"> {u.answer} </Text> 
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
                                  ))}
                            </ScrollView>
                              ): (
                                  <View className="justify-center items-center">
                                    <VStack>
                                    <Image
                                      size="xl"
                                      source={require('../../../../../assets/others/nodata.png')}
                                      alt="image"
                                    />

                                    </VStack>
                                    <Text>Aucune reponses pour le moment.</Text>

                                </View>
                              )
                            }
                          </AccordionContent>
                          </AccordionItem>
                      </Accordion>
                )
            }

        </Card>
        </>
    );
}