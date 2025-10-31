import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import {
  ArrowRightIcon,
  ChevronRightIcon
} from '@/components/ui/icon';
import {
  Popover,
  PopoverArrow,
  PopoverBackdrop,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
} from '@/components/ui/popover';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { useState } from 'react';

interface PopoverInstructionsProps {
    data: {competitionName: string, totalQuestions: number, creator: string, instructions: string|null};
}

export default function PopoverInstructions({data}: PopoverInstructionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <Popover
      isOpen={isOpen}
      onClose={handleClose}
      onOpen={handleOpen}
      offset={8}
      trigger={(triggerProps) => {
        return (
          <Button {...triggerProps} className="py-2 bg-primary-defaultOrange px-4 mt-4 border-0 w-[90%] max-w-[500px] self-center gap-2">
            <ButtonText>Instructions</ButtonText>
            <ButtonIcon as={ChevronRightIcon} />
          </Button>
        );
      }}
    >
      <PopoverBackdrop />
      <PopoverContent className="w-[90%] max-w-[90%] p-5 gap-6 pl-4 shadow-hard-5" style={{backgroundColor: "#E8F5FA"}}>
        <PopoverArrow />
        <PopoverBody>
          <Heading className="pl-1">
            Instrunctions :
          </Heading>
          <Text className="pt-2 pb-6 pl-1" size="sm">
             Cher(e) , participant(e), bienvenue dans cette compétition palpitante ({data.competitionName}) !
             {'\n'}
              Questions restantes : {data.totalQuestions}
             {'\n'}
              Voici quelques instructions pour vous guider tout au long de votre parcours :
                {'\n'}
                1. Restez concentrer et attentif aux questions posées.
                {'\n'}
                2. Gérez votre temps judicieusement pour maximiser votre score, et vos chances de gagner car le gagnant est déterminé en fonction du temps de réponses à chaque question.
                {'\n'}
                3. Ne quittez surtout pas l'application durant la competition avant de l'avoir terminée, sinon votre progression sera perdue et vous serez exlu.
                {'\n'}
                4. Évitez toute forme de tricherie pour garantir une compétition équitable pour tous les participants.
                {'\n'}
                5. Si vous etes exclu, vous pourrez toujours rejoindre en mode spectacteur pour suivre la fin de la compétition.
                {'\n'}
                6. Amusez-vous et donnez le meilleur de vous-même !
                {'\n'}
                Bonne chance, et que le meilleur gagne !
                {'\n'}
                Créateur de la compétition : {data.creator}
                {'\n'}

                ExamBoost
          </Text>
        </PopoverBody>
        <PopoverFooter>
          <Pressable
            className="px-4 bg-primary-500 rounded w-full"
            onPress={handleClose}
          >
            <Button onPress={handleClose} size="sm" className="gap-2">
              <ButtonText>Ok, compris !</ButtonText>
              <ButtonIcon as={ArrowRightIcon} />
            </Button>
          </Pressable>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}
