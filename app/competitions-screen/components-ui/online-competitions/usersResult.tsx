import { Room } from "@/app/hooks/entities/rooms.entity";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { AddIcon, RemoveIcon } from "@/components/ui/icon";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";

interface UsersAnswersProps {
  room: Room | null;
}

function EmptyState({ label }: { label: string }) {
  return (
    <View className="justify-center items-center py-8">
      <VStack className="items-center" space="sm">
        <Image size="md" source={require("../../../../assets/others/nodata.png")} alt="image" />
        <Text className="text-white/60 text-sm text-center">{label}</Text>
      </VStack>
    </View>
  );
}

export default function UsersResult({ room }: UsersAnswersProps) {
  const { t } = useTranslation("competition");
  const hasQuestions = !!room?.questions && room.questions.length > 0;

  return (
    <View className="w-full flex-1">
      <HStack className="items-center mb-4 px-1" space="sm">
        <Ionicons name="help-circle-outline" size={20} color="#38BDF8" />
        <Heading size="sm" className="text-white">
          {t("mycompetition.competition.result_screen.question&answer")}
        </Heading>
      </HStack>

      {!room || !hasQuestions ? (
        <EmptyState label={t("mycompetition.competition.result_screen.no_qts_generated")} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} className="w-full">
          <Accordion className="w-full bg-transparent">
            {room.questions.map((q, index) => (
              <AccordionItem
                key={`${q.id ?? "no-id"}-${index}`}
                value={"item-" + index}
                className="mb-3 w-full rounded-xl overflow-hidden bg-[#1A2F52] border border-white/10"
              >
                <AccordionHeader>
                  <AccordionTrigger className="px-4 py-3 focus:web:rounded-xl">
                    {({ isExpanded }: { isExpanded: boolean }) => (
                      <>
                        <HStack className="flex-1 items-center mr-2" space="sm">
                          <View className="w-6 h-6 rounded-full bg-[#2E5DA6] items-center justify-center">
                            <Text className="text-white text-xs font-bold">{index + 1}</Text>
                          </View>
                          <AccordionTitleText className="text-white flex-1 shrink break-words">
                            {q.text} ?
                          </AccordionTitleText>
                        </HStack>
                        <AccordionIcon
                          color={isExpanded ? "#E8720C" : "#94A3B8"}
                          as={isExpanded ? RemoveIcon : AddIcon}
                        />
                      </>
                    )}
                  </AccordionTrigger>
                </AccordionHeader>

                <AccordionContent className="px-4 pb-4 pt-0 bg-[#16264A]">
                  <View className="max-h-[240px]">
                    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                      {q.answers && q.answers.length > 0 ? (
                        <VStack space="sm" className="mt-2">
                          {q.answers.map((u, aIndex) => (
                            <HStack
                              key={`${q.id ?? "no-answer_id"}-${aIndex}`}
                              className="items-center bg-white/5 rounded-lg p-2.5 border border-white/5"
                              space="sm"
                            >
                              <Avatar size="sm">
                                {u.userID &&
                                room.users.find((user) => user.userID === u.userID)?.imgUrl ? (
                                  <AvatarImage
                                    source={{
                                      uri: room.users.find((user) => user.userID === u.userID)?.imgUrl,
                                    }}
                                    alt="image"
                                  />
                                ) : (
                                  <AvatarFallbackText>
                                    {u.username.split(" ").map((n) => n[0]).join("")}
                                  </AvatarFallbackText>
                                )}
                              </Avatar>

                              <VStack className="flex-1">
                                <Text className="text-white text-sm font-semibold" numberOfLines={1}>
                                  {u.username}
                                </Text>
                                <HStack className="items-center flex-wrap" space="xs">
                                  <Text className="text-white/60 text-xs">
                                    {t("mycompetition.competition.result_screen.answer")}:
                                  </Text>
                                  <Text className="text-cyan-300 text-xs font-medium">{u.text}</Text>
                                </HStack>
                              </VStack>

                              <VStack className="items-end">
                                <Ionicons
                                  name={u.isCorrect ? "checkmark-circle" : "close-circle"}
                                  size={18}
                                  color={u.isCorrect ? "#22C55E" : "#EF4444"}
                                />
                                {u.timeTaken ? (
                                  <Text className="text-white/40 text-[10px] mt-0.5">{u.timeTaken}s</Text>
                                ) : null}
                              </VStack>
                            </HStack>
                          ))}
                        </VStack>
                      ) : (
                        <EmptyState label={t("mycompetition.competition.result_screen.no_answer")} />
                      )}

                      {q.correctAnswer ? (
                        <VStack
                          className="mt-3 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-lg p-3"
                          space="xs"
                        >
                          <HStack className="items-center" space="xs">
                            <Ionicons name="checkmark-done-circle" size={16} color="#22C55E" />
                            <Text className="text-white text-xs font-semibold">
                              {t("mycompetition.competition.result_screen.correct_answer")}:
                            </Text>
                            <Text className="text-green-300 text-xs font-bold">{q.correctAnswer}</Text>
                          </HStack>
                          <Text className="text-[#E8720C] text-xs font-bold">{q.points} pts</Text>
                          {room.isManagedByIA && q.explanation ? (
                            <Text className="text-white/70 text-xs mt-1">
                              {t("mycompetition.competition.result_screen.explanation")}: {q.explanation}
                            </Text>
                          ) : null}
                        </VStack>
                      ) : null}
                    </ScrollView>
                  </View>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollView>
      )}
    </View>
  );
}