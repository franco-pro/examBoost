import CompetitionEndedAlert from '@/app/helper/Dialogs/endCompetition';
import StopCompetition from '@/app/helper/Dialogs/stopCompetition';
import { Question } from '@/app/hooks/entities/question';
import { useAppDispatch, useAppSelector } from '@/app/hooks/redux/redux.hooks';
import { setEndOfCompetition } from '@/app/hooks/redux/rooms/rooms.slice';
import { EmitEvent } from '@/app/hooks/services/socket/rooms.gateway';
import { useSoundAud } from '@/app/hooks/useSound.hook';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormControl, FormControlError, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

interface ComepetitionInfo {
  competitionName: string;
  createdAt: any;
  creatorName: string;
  creatorAvatarUrl: string;
  isAI: boolean;
  type: string | null;
  totalQuestions: number;
}

type FormFields = {
  timeToAnswer: string;
  points: string;
  corretAnswer: string;
  firsChoice: string;
  secondChoice: string;
  thirdChoice: string;
  text: string;
};

const emptyErrors: FormFields = {
  timeToAnswer: "",
  points: "",
  corretAnswer: "",
  firsChoice: "",
  secondChoice: "",
  thirdChoice: "",
  text: "",
};

const emptyTouched: Record<keyof FormFields, boolean> = {
  timeToAnswer: false,
  points: false,
  corretAnswer: false,
  firsChoice: false,
  secondChoice: false,
  thirdChoice: false,
  text: false,
};

export default function FormQuestion({ competitionInfo }: { competitionInfo: ComepetitionInfo }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation("competition");
  const { room, competitionFinished } = useAppSelector(state => state.rooms);
  const Events = EmitEvent(dispatch, { isManagedByIA: room?.isManagedByIA as any, roomId: room?.roomId as any });
  const [isAlertCompetOpen, setIsAlertCompEndOpen] = useState(false);
  const { play, stop } = useSoundAud();

  const [isWaiting, setIsWaiting] = useState(false);
  const questionsNbr = competitionInfo.totalQuestions ?? null;

  const [isOpen, setIsOpen] = useState(false);
  const [sendingBtnText, setBtnText] = useState(t("mycompetition.competition.form_question.send"));

  const [form, setForm] = useState<FormFields>({
    timeToAnswer: "0",
    points: "0",
    corretAnswer: "",
    firsChoice: "",
    secondChoice: "",
    thirdChoice: "",
    text: "",
  });

  const [errors, setErrors] = useState<FormFields>(emptyErrors);
  const [touched, setTouched] = useState(emptyTouched);

  const questionSended = room && room.questions ? room.questions.length : 0;
  const allQuestionsSent = questionsNbr != null && questionSended >= questionsNbr;

  // ---- Validation ----
  // markAllTouched=true -> utilisé au submit pour révéler toutes les erreurs d'un coup
  const validate = (markAllTouched = false) => {
    let valid = true;
    const newErrors: FormFields = { ...emptyErrors };

    if (Number.parseInt(form.timeToAnswer) <= 5 || form.timeToAnswer.length === 0) {
      newErrors.timeToAnswer = t("mycompetition.competition.form_question.model.timeToAnswer.error");
      valid = false;
    }

    if (!form.points || Number.parseInt(form.points) <= 0 || form.points.length === 0) {
      newErrors.points = t("mycompetition.competition.form_question.model.points.nb");
      valid = false;
    }

    if (form.firsChoice.length === 0) {
      newErrors.firsChoice = t("mycompetition.competition.form_question.model.first_choice.nb");
      valid = false;
    }

    if (form.secondChoice.length === 0) {
      newErrors.secondChoice = t("mycompetition.competition.form_question.model.second_choice.nb");
      valid = false;
    }

    if (form.thirdChoice.length === 0) {
      newErrors.thirdChoice = t("mycompetition.competition.form_question.model.third_choice.nb");
      valid = false;
    }

    if (form.text.length === 0) {
      newErrors.text = t("mycompetition.competition.form_question.model.invalid.question");
      valid = false;
    }

    if (
      form.corretAnswer.length === 0 ||
      (form.corretAnswer.toLowerCase() !== form.firsChoice.toLowerCase() &&
        form.corretAnswer.toLowerCase() !== form.secondChoice.toLowerCase() &&
        form.corretAnswer.toLowerCase() !== form.thirdChoice.toLowerCase())
    ) {
      newErrors.corretAnswer = t("mycompetition.competition.form_question.choice_mistake_error");
      valid = false;
    }

    setErrors(newErrors);

    if (markAllTouched) {
      setTouched({
        timeToAnswer: true,
        points: true,
        corretAnswer: true,
        firsChoice: true,
        secondChoice: true,
        thirdChoice: true,
        text: true,
      });
    }

    return valid;
  };

  const updateField = (key: keyof FormFields, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // Ne revalide que si le champ a déjà été "touché" (quitté une première fois),
  // pour effacer l'erreur en direct une fois corrigée sans la faire apparaître trop tôt.
  useEffect(() => {
    if (Object.values(touched).some(Boolean)) {
      validate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const handleBlur = (key: keyof FormFields) => {
    setTouched(prev => ({ ...prev, [key]: true }));
    validate();
  };

  // ---- Fin de compétition : déclenchement unique et sécurisé ----
  const hasTriggeredEndRef = useRef(false);

  useEffect(() => {
    if (!room || competitionFinished) return;
    if (questionsNbr == null) return;
    if (questionSended !== questionsNbr) return;
    if (hasTriggeredEndRef.current) return;

    hasTriggeredEndRef.current = true;
    console.log('execute before TO');
    if((questionSended === questionsNbr) && allQuestionsSent){
      console.log('competiiton end');

    const waitSeconds = Number.parseInt(form.timeToAnswer || "0") + 3;
     setTimeout(() => {
      console.log('execute time out')
      Events.end();
      setIsAlertCompEndOpen(true);
    }, waitSeconds * 1000);
  }

    // On ne dépend pas de form.timeToAnswer volontairement :
    // ce délai correspond au temps de réponse de la DERNIÈRE question envoyée,
    // pas à la valeur courante (potentiellement déjà réinitialisée) du champ.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, competitionFinished, questionSended, questionsNbr]);

  function onCompetitionEndAlertConfirm() {
    setIsAlertCompEndOpen(false);
    router.replace("/competitions-screen/components-ui/online-competitions/competitionResult");
  }

  const handleSubmitForm = () => {
    if (isWaiting || allQuestionsSent) return;

    if (!validate(true)) {
      return;
    }

    const question = {
      id: 0,
      text: String(form.text),
      choices: [String(form.firsChoice), String(form.secondChoice), String(form.thirdChoice)],
      correctAnswer: String(form.corretAnswer),
      timeToAnswer: Number.parseInt(form.timeToAnswer),
      points: Number.parseInt(form.points),
      explanation: "",
      answers: [],
    } as Question;

    Events.sendQuestion(question);

    setBtnText(t("mycompetition.competition.online_game.waiting_ans"));
    setIsWaiting(true);

    setTimeout(async () => {
      setBtnText(t("mycompetition.competition.form_question.send"));
       stop();
       play("waitingQuestion");
      setIsWaiting(false);
    }, (Number(form.timeToAnswer) + 3) * 1000);
  };

  function onLeavingCompetition() {
    const event = EmitEvent(dispatch, { isManagedByIA: room?.isManagedByIA as any, roomId: room?.roomId as any });
    event.closeCompetition();
    router.back();
  }

  const handleLeavingCompetition = () => {
    onLeavingCompetition();
    setIsOpen(false);
  };

  return (
    <Card size="lg" variant="elevated" className="p-5 shadow-xl rounded-lg max-w-[400px] w-full self-center">
      <Text className="text-sm font-normal mb-2 text-typography-700">
        {t("mycompetition.competition.online_game.created_at")}: {competitionInfo.createdAt}
      </Text>
  
      <Heading size="md" className="mb-4 text-center">
        {competitionInfo.competitionName}
      </Heading>
  
      {allQuestionsSent ? (
        <VStack className="items-center py-6" space="sm">
          <Text className="text-typography-700 text-center font-semibold">
            {t("mycompetition.competition.form_question.all_questions_sent") ??
              "Toutes les questions ont été envoyées."}
          </Text>
          <Text className="text-typography-500 text-center text-sm">
            {t("mycompetition.competition.form_question.pleas_wait") ??
              "En attente de la fin de la compétition..."}
          </Text>
        </VStack>
      ) : (
        <VStack space="md">
          <FormControl isInvalid={touched.timeToAnswer && !!errors.timeToAnswer} isRequired className="pt-2">
            <FormControlLabel>
              <FormControlLabelText>
                {t("mycompetition.competition.form_question.model.timeToAnswer.label")}:
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={form.timeToAnswer}
                onChangeText={(text) => updateField("timeToAnswer", text.replace(/[^0-9]/g, ""))}
                onBlur={() => handleBlur("timeToAnswer")}
                keyboardType="numeric"
              />
            </Input>
            {touched.timeToAnswer && errors.timeToAnswer.length !== 0 ? (
              <FormControlError>
                <FormControlErrorText>{errors.timeToAnswer}</FormControlErrorText>
              </FormControlError>
            ) : (
              <FormControlHelper>
                <FormControlHelperText>
                  {t("mycompetition.competition.form_question.model.timeToAnswer.nb")}
                </FormControlHelperText>
              </FormControlHelper>
            )}
          </FormControl>
  
          <FormControl isInvalid={touched.points && !!errors.points} isRequired>
            <FormControlLabel>
              <FormControlLabelText>Points</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={form.points}
                onChangeText={(text) => updateField("points", text.replace(/[^0-9]/g, ""))}
                onBlur={() => handleBlur("points")}
                keyboardType="numeric"
              />
            </Input>
            {touched.points && errors.points.length !== 0 && (
              <FormControlError>
                <FormControlErrorText>{errors.points}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
  
          <FormControl isInvalid={touched.firsChoice && !!errors.firsChoice} isRequired>
            <FormControlLabel>
              <FormControlLabelText>
                {t("mycompetition.competition.form_question.model.first_choice.label")}
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                placeholder="First Choice"
                value={form.firsChoice}
                onChangeText={(text) => updateField("firsChoice", text)}
                onBlur={() => handleBlur("firsChoice")}
              />
            </Input>
            {touched.firsChoice && errors.firsChoice.length !== 0 && (
              <FormControlError>
                <FormControlErrorText>{errors.firsChoice}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
  
          <FormControl isInvalid={touched.secondChoice && !!errors.secondChoice} isRequired>
            <FormControlLabel>
              <FormControlLabelText>
                {t("mycompetition.competition.form_question.model.second_choice.label")}
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                placeholder="Second Choice"
                value={form.secondChoice}
                onChangeText={(text) => updateField("secondChoice", text)}
                onBlur={() => handleBlur("secondChoice")}
              />
            </Input>
            {touched.secondChoice && errors.secondChoice.length !== 0 && (
              <FormControlError>
                <FormControlErrorText>{errors.secondChoice}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
  
          <FormControl isInvalid={touched.thirdChoice && !!errors.thirdChoice} isRequired>
            <FormControlLabel>
              <FormControlLabelText>
                {t("mycompetition.competition.form_question.model.third_choice.label")}
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                placeholder="Third Choice"
                value={form.thirdChoice}
                onChangeText={(text) => updateField("thirdChoice", text)}
                onBlur={() => handleBlur("thirdChoice")}
              />
            </Input>
            {touched.thirdChoice && errors.thirdChoice.length !== 0 && (
              <FormControlError>
                <FormControlErrorText>{errors.thirdChoice}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
  
          <FormControl isInvalid={touched.corretAnswer && !!errors.corretAnswer} isRequired>
            <FormControlLabel>
              <FormControlLabelText>
                {t("mycompetition.competition.form_question.model.correctAnswwer.label")}
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                placeholder="The Correct Answer"
                value={form.corretAnswer}
                onChangeText={(text) => updateField("corretAnswer", text)}
                onBlur={() => handleBlur("corretAnswer")}
              />
            </Input>
            {touched.corretAnswer && errors.corretAnswer.length !== 0 && (
              <FormControlError>
                <FormControlErrorText>{errors.corretAnswer}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
  
          <FormControl isInvalid={touched.text && !!errors.text} isRequired size="sm" className="w-full">
            <FormControlLabel>
              <FormControlLabelText>Question</FormControlLabelText>
            </FormControlLabel>
            <Textarea>
              <TextareaInput
                className="w-full"
                placeholder="Enter the question..."
                value={form.text}
                onChangeText={(text) => updateField("text", text)}
                onBlur={() => handleBlur("text")}
              />
            </Textarea>
            {touched.text && errors.text.length !== 0 ? (
              <FormControlError>
                <FormControlErrorText>{errors.text}</FormControlErrorText>
              </FormControlError>
            ) : (
              <FormControlHelper>
                <FormControlHelperText>
                  {t("mycompetition.competition.form_question.model.inf")}
                  {"\n"}
                  {t("mycompetition.competition.form_question.model.questionLeft")}: {questionsNbr - questionSended}
                </FormControlHelperText>
              </FormControlHelper>
            )}
          </FormControl>
  
          <Button
            disabled={competitionInfo.isAI || isWaiting}
            className={`mt-4 ${isWaiting ? "bg-gray-700" : "bg-primary-defaultBlue"}`}
            variant="outline"
            size="md"
            action="secondary"
            onPress={handleSubmitForm}
          >
            <ButtonText className="text-typography-white" size="xl">
              {sendingBtnText}
            </ButtonText>
          </Button>
        </VStack>
      )}
  
      <CompetitionEndedAlert isOpen={isAlertCompetOpen} onClose={onCompetitionEndAlertConfirm} />
  
      {competitionInfo.type &&
        (competitionInfo.type === "FREE_REGISTRATION_WITH_WINNER_PRICE" ||
          competitionInfo.type === "TOTAL_FREE_NO_PRICE_TO_WIN") && (
          <Button
            onPress={() => setIsOpen(true)}
            action="negative"
            className="py-2 px-4 mt-4 border-0 w-[90%] max-w-[500px] self-center"
          >
            <ButtonText size="sm" className="text-typography-white">
              {t("mycompetition.competition.form_question.model.stop")}
            </ButtonText>
          </Button>
        )}
  
      <StopCompetition
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleLeavingCompetition}
        isAI={competitionInfo.isAI}
      />
    </Card>
  );
}