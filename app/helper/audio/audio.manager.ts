import { Audio, AVPlaybackStatus } from 'expo-av';

let currentSound: Audio.Sound | null = null;
let initialSound: Audio.Sound | null = null;
let lastPosition = 0;

export const soundLibrary = {
  UserJoin: require('../../../assets/audio/joined.mp3'),
  WrongAnswer: require('../../../assets/audio/wrong_answer.mp3'),
  CorrectAnswer: require('../../../assets/audio/correct_answer.mp3'),
  waitingQuestion: require('../../../assets/audio/home_viewer.mp3'),
  beforeSendingQuestion: require('../../../assets/audio/waiting_answer.mp3'),
  QuestionIncoming: require('../../../assets/audio/question_incoming.mp3'),
  TopUpSuccess: require('../../../assets/audio/success_pay.wav'),
  WithdrawSuccess: require('../../../assets/audio/withdraw_success.wav'),
};

async function actionInitialSound(action: 'STOP' | 'PLAY') {
  if (action === 'PLAY') {
    if (initialSound) {
      await initialSound.stopAsync();
      await initialSound.unloadAsync();
      initialSound = null;
    }

    const options: any = { isLooping: true, shouldPlay: true };
    if (lastPosition > 0) options.positionMillis = lastPosition;

    const { sound } = await Audio.Sound.createAsync(soundLibrary.waitingQuestion, options);
    initialSound = sound;
    lastPosition = 0;
  }

  if (action === 'STOP' && initialSound) {
    const status = (await initialSound.getStatusAsync()) as AVPlaybackStatus;
    if (status.isLoaded) lastPosition = status.positionMillis ?? 0;
    await initialSound.stopAsync();
  }
}

export async function playSound(
  sound_type:
    | 'UserJoin'
    | 'WrongAnswer'
    | 'CorrectAnswer'
    | 'waitingQuestion'
    | 'QuestionIncoming'
    | 'beforeSendingQuestion'
    | 'TopUpSuccess'
    | 'WithdrawSuccess'
) {
  try {
    if (sound_type === 'waitingQuestion') {
      await actionInitialSound('PLAY');
      return;
    } else {
      await actionInitialSound('STOP');
    }

    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      currentSound = null;
    }

    const { sound } = await Audio.Sound.createAsync(soundLibrary[sound_type], {
      shouldPlay: true,
      isLooping: false,
    });

    currentSound = sound;

    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (status.isLoaded && status.didJustFinish) {
        if (['UserJoin', 'WrongAnswer', 'CorrectAnswer'].includes(sound_type)) {
          actionInitialSound('PLAY');
        } else if (['beforeSendingQuestion', 'QuestionIncoming'].includes(sound_type)) {
          playSound('beforeSendingQuestion');
        }
      }
    });
  } catch (error) {
    console.log('Erreur lors de la lecture du son:', error);
  }
}

export async function stopSound() {
  if (currentSound) {
    await currentSound.stopAsync();
    await currentSound.unloadAsync();
    currentSound = null;
  }

  if (initialSound) {
    await initialSound.stopAsync();
    await initialSound.unloadAsync();
    initialSound = null;
  }
}
