import StopCompetition from '@/app/helper/Dialogs/stopCompetition';
import { useAppDispatch } from '@/app/hooks/redux/redux.hooks';
import { clearRoom } from '@/app/hooks/redux/rooms/rooms.slice';
import { EmitEvent } from '@/app/hooks/services/socket/rooms.gateway';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormControl, FormControlError, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

// interface Question {
//     id: number;
//     text: string;
//     choices: string[];
//     correctAnswer: string;
//     timeToAnswer: number;
//     points: number;
//     explanation?: string;
//     answers: any[]; // Adjust type as needed
// }
interface ComepetitionInfo{
  competitionName: string;
  createdAt: string;
  creatorName: string;
  creatorAvatarUrl: string;
  description: string;
  isAI: boolean,
  totalQuestions?: number; 
}
export default function FormQuestion({competitionInfo}: { competitionInfo: ComepetitionInfo}) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] =  useState(false);

  const [isInvalid, setIsInvalid] = useState(false);
  const [inputValue, setInputValue] = useState('12345');

  const handleSubmit = () => {
    if (inputValue.length < 6) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
  };

  const handleLeavingCompetition = () => {
    onLeavingCompetition();
    setIsOpen(false);
    
  }

  const [form, setForm] = useState({
    timeToAnswer: "0",
    points: "0",
    corretAnswer: "",
    firsChoice: "",
    secondChoice: "",
    thirdChoice: "",
    text: "",
  });

  const [errors, setErrors] = useState({
    timeToAnswer: "",
    points: "",
    corretAnswer: "",
    firsChoice: "",
    secondChoice: "",
    thirdChoice: "",
    text: "",
  });

  const validate = () => {
    let valid = true;
    let newErrors: typeof errors = { timeToAnswer: "", points: "", corretAnswer: "", firsChoice: "", secondChoice: "", thirdChoice: "", text: "" };

    if (Number.parseInt(form.timeToAnswer) <= 5 || form.timeToAnswer.length == 0) {
      newErrors.timeToAnswer = "Temps trop court";
      valid = false;
    }

    if (!form.points || Number.parseInt(form.points) <= 0 || form.points.length == 0) {
      newErrors.points = "Points invalides";
      valid = false;
    }

    if (form.corretAnswer.length == 0 || (form.corretAnswer.toLowerCase() != form.firsChoice.toLowerCase() || form.corretAnswer.toLowerCase() != form.secondChoice.toLowerCase() || form.corretAnswer.toLowerCase() != form.thirdChoice.toLowerCase())) {
      console.log('exected', form.corretAnswer.toLowerCase(), form.firsChoice.toLowerCase(), form.secondChoice.toLowerCase(), form.thirdChoice.toLowerCase());
      newErrors.corretAnswer = "Réponse correcte invalide";
      valid = false;
    }

    if (form.firsChoice.length == 0) {
      newErrors.firsChoice = "Choix invalide";
      valid = false;
    }

    if (form.secondChoice.length == 0) {
      newErrors.secondChoice = "Choix invalide";
      valid = false;
    }

    if (form.thirdChoice.length == 0) {
      newErrors.thirdChoice = "Choix invalide";
      valid = false;
    }

    if (form.text.length == 0) {
      newErrors.text = "Question invalide";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmitForm = () => {
    if (validate()) {
      console.log("Formulaire valide :", form);
    } else {
      console.log("Formulaire invalide", form);
    }
  };

  const updateField = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
    validate();
  };

  function onLeavingCompetition() {
    // Logic to handle leaving the competition
    const event = EmitEvent();

    event.closeCompetition();
    dispatch(clearRoom())

    console.log("User has chosen to leave the competition.");

    router.back()
  }

    return (
      <Card size="lg" variant="elevated" className="p-5 shadow-xl rounded-lg w-[90%]">
        <Text className="text-sm font-normal mb-2 text-typography-700">
          Created At: {competitionInfo.createdAt}
        </Text>

        <VStack className='mb-6 max-h-[400px]'>
        <ScrollView>

          <Heading size="md" className="mb-4 flex items-center justify-center">
            {competitionInfo.competitionName}
          </Heading>

          <FormControl isInvalid={!!errors.timeToAnswer} isRequired className='pt-2'>
            <FormControlLabel>
              <FormControlLabelText> Temps de Réponse(en s): </FormControlLabelText>
            </FormControlLabel>
            <Input> 
              <InputField
                value={form.timeToAnswer}
                onChangeText=
                {(text) => {
                  const numericValue = text.replace(/[^0-9]/g, "");
                  updateField("timeToAnswer", numericValue)
                }}
                keyboardType="numeric"
              />
            </Input>
            {errors.timeToAnswer.length != 0 ? (
              <FormControlError>
                <FormControlErrorText>{errors.timeToAnswer}</FormControlErrorText>
              </FormControlError>
            ) : (
              <FormControlHelper>
                <FormControlHelperText>Le temps doit etre suppérieur à 5 secondes.</FormControlHelperText>
              </FormControlHelper>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.points} isRequired className='mt-3'>
            <FormControlLabel>
              <FormControlLabelText>Points</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder=""
                value={form.points}
                onChangeText=
                {(text) => {
                  const numericValue = text.replace(/[^0-9]/g, "");
                  updateField("points", numericValue)
                }}
                keyboardType="numeric"
              />
            </Input>
            {errors.points.length != 0 ? (
              <FormControlError>
                <FormControlErrorText>{errors.points ?? String(errors.points)}</FormControlErrorText>
              </FormControlError>
            ): null }
          </FormControl>

          <FormControl isInvalid={!!errors.firsChoice} isRequired className='mt-3'>
            <FormControlLabel>
              <FormControlLabelText>Premier Choix</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                placeholder="First Choice"
                value={form.firsChoice}
                onChangeText={(text) => updateField("firsChoice", text)}
              />
            </Input>
            {errors.firsChoice.length == 0 ? (
              <FormControlError>
                <FormControlErrorText>
                  {String(errors.firsChoice)} 
                  </FormControlErrorText>
              </FormControlError>
            ): null }
          </FormControl>

          <FormControl isInvalid={!!errors.secondChoice} isRequired className='mt-3'>
            <FormControlLabel>
              <FormControlLabelText>Second Choix</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                placeholder="Second Choice"
                value={form.secondChoice}
                onChangeText={(text) => updateField("secondChoice", text)}
              />
            </Input>
            {errors.secondChoice.length != 0 ? (
              <FormControlError>
                <FormControlErrorText>{errors.secondChoice ?? String(errors.secondChoice)}</FormControlErrorText>
              </FormControlError>
            ): null}
          </FormControl>

          <FormControl isInvalid={!!errors.thirdChoice} isRequired className='mt-3'>
            <FormControlLabel>
              <FormControlLabelText>Troisième Choix</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type='text'
                placeholder="Third Choice"
                value={form.thirdChoice}
                onChangeText={(text) => updateField("thirdChoice", text)}
              />
            </Input>
            {errors.thirdChoice.length != 0 ? (
              <FormControlError>
                <FormControlErrorText>{errors.thirdChoice ?? String(errors.thirdChoice)}</FormControlErrorText>
              </FormControlError>
            ): null}
          </FormControl>

        <FormControl isInvalid={!!errors.corretAnswer} isRequired className='mt-3'>
          <FormControlLabel>
            <FormControlLabelText>Reponse correct</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              type='text'
              placeholder="The Correct Answer"
              value={form.corretAnswer}
              onChangeText={(text) => updateField("corretAnswer", text)}
            />
          </Input>
          {errors.corretAnswer.length != 0 ? (
            <FormControlError>
              <FormControlErrorText>{errors.corretAnswer ?? String(errors.corretAnswer)}</FormControlErrorText>
            </FormControlError>
          ): null}
        </FormControl>

          <FormControl isInvalid={!!errors.text} isRequired size="sm" className=" mt-3 max-w-[100%] w-full">
          <FormControlLabel>
            <FormControlLabelText>
              Question
            </FormControlLabelText>
          </FormControlLabel>
          <Textarea>
            <TextareaInput className='w-[100%]' placeholder="Enter the question..."
            
                value={form.text}
                onChangeText={(text) => updateField("text", text)}/>
          </Textarea>
          {errors.text.length != 0 ? (
              <FormControlError>
                <FormControlErrorText>
                  {String(errors.text)} 
                </FormControlErrorText>
              </FormControlError>
            ) : (
                <FormControlHelper>
                  <FormControlHelperText>Soyez bref...</FormControlHelperText>
                </FormControlHelper>
            )}

        </FormControl>

      <Button disabled={competitionInfo.isAI} className="mt-4 bg-primary-defaultBlue" onPress={handleSubmitForm}>
        <ButtonText>Envoyer</ButtonText>
      </Button>
        </ScrollView>

    </VStack>


        <Button onPress={() => setIsOpen(true)} action="negative" className="py-2 px-4 mt-4 border-0 w-[90%] max-w-[500px] self-center" >
         <ButtonText size="sm" className='text-typography-white'>Arreter la competition</ButtonText>
       </Button>
       <StopCompetition isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={handleLeavingCompetition} isAI={competitionInfo.isAI} />
      </Card>
    );
  }  