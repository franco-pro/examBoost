import { Dimensions, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Onboarding from 'react-native-onboarding-swiper';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import {setItem } from '@/app/utils/asyncStorage';
import LottieView from "lottie-react-native";
import { ArrowRightIcon, Icon } from '@/components/ui/icon';

export default function Index() {
  const handleDone = async () => {
    await setItem("onboarded", true);
    navigation.replace("/(auth)/login");
  };
  const {width, height} = Dimensions.get("window");
  const navigation = useRouter();
  const SkipButtonComponent = ({...props})=>{
    return (
      <View className='rounded-full border border-primary-custom-300 flex py-2 px-10 bg-primary-custom-100 ml-5 mb-5'>
        <Text className='text-primary-custom-300 font-semibold text-lg' {...props}>Skip</Text>
      </View>
    )
  }

  const NextButtonComponent = ({...props})=>{
    return (
        <View className='rounded-full border bg-primary-custom-300 flex py-2 px-8 gap-2 flex-row justify-center  items-center border-primary-custom-100 mr-5 mb-5'>
          <Text className='text-white font-semibold text-lg' {...props}>Next</Text>
          <Icon as={ArrowRightIcon} size={"xl"} color='#fff'/>
        </View>
      )
    }
  
    const DoneButtonComponent = ({...props})=>{
      return(
        <View className='rounded-full border bg-primary-custom-300 flex py-2 px-8 gap-2 flex-row justify-center  items-center border-primary-custom-100 mr-5 mb-5 w-full'>
          <Text className='text-white font-semibold text-lg' {...props}>Continue</Text>
        </View>
      )
    }

  const Dotcomponent = ({selected}:any)=>{
        let backgroundColor;
        backgroundColor = selected ? '#3f51b5' : '#ccc';
        return(
          <View className='mx-1 mb-40' style={{width:10, height:10, borderRadius:5, backgroundColor}}/>
        )
      }
  
  return (
    <SafeAreaView className="flex-1 relative justify-between ">
      <Onboarding
        containerStyles={{ paddingBottom: 140 }}
        titleStyles={{
          fontSize: 32,
          fontWeight: "700",
          color: "#3f51b5",
          marginBottom: 10,
          fontFamily: "Montserrat",
        }}
        subTitleStyles={{
          fontSize: 16,
          fontWeight: "200",
          color: "#333",
          paddingHorizontal: 20,
          textAlign: "justify",
          fontFamily: "Poppins",
        }}
        bottomBarHighlight={false}
        SkipButtonComponent={SkipButtonComponent}
        NextButtonComponent={NextButtonComponent}
        DotComponent={Dotcomponent}
        DoneButtonComponent={DoneButtonComponent}
        onDone={handleDone}
        onSkip={handleDone}
        pages={[
          {
            backgroundColor: "#FFF",
            image: (
              <View className="rounded-tl-3xl rounded-br-3xl overflow-hidden   border-[#e8eaf6]">
                <LottieView
                  autoPlay
                  // ref={animation}
                  style={{
                    width: width,
                    height: height * 0.4,
                    backgroundColor: "#e8eaf6",
                    borderTopLeftRadius: 100,
                    borderBottomRightRadius: 100,
                  }}
                  source={require("../assets/animation/Student.json")}
                />
              </View>
            ),
            title: "Votre succès commence ici !",
            subtitle:
              "La plateforme qui transforme vos révisions en véritable expérience d'apprentissage. Préparez-vous à exceller dans tous vos examens officiels !",
          },
          {
            backgroundColor: "#FFF",
            image: (
              <View className="rounded-tl-3xl rounded-br-3xl overflow-hidden  border-[#e8eaf6]">
                <LottieView
                  autoPlay
                  // ref={animation}
                  style={{
                    width: width,
                    height: height * 0.5,
                    backgroundColor: "#e8eaf6",
                    borderTopLeftRadius: 100,
                    borderBottomRightRadius: 100,
                  }}
                  source={require("../assets/animation/Student with books.json")}
                />
              </View>
            ),
            title: "Maîtrisez tous les types d'épreuves",
            subtitle:
              "Accédez à des centaines d'examens blancs, évaluations et exercices types avec corrections détaillées. Entraînez-vous comme jamais !",
          },
          {
            backgroundColor: "#FFF",
            image: (
              <View className="rounded-tl-3xl rounded-br-3xl overflow-hidden  border-[#e8eaf6]">
                <LottieView
                  autoPlay
                  // ref={animation}
                  style={{
                    width: width,
                    height: height * 0.5,
                    backgroundColor: "#e8eaf6",
                    borderTopLeftRadius: 100,
                    borderBottomRightRadius: 100,
                  }}
                  source={require("../assets/animation/Toper Student Animated.json")}
                />
              </View>
            ),
            title: "Défie et progresse",
            subtitle:
              "articipe à des compétitions contre d'autres élèves, crée tes propres défis et mesure ton niveau en temps réel. L'apprentissage n'a jamais été aussi stimulant !",
          },
          {
            backgroundColor: "#FFF",
            image: (
              <View className="rounded-tl-3xl rounded-br-3xl overflow-hidden  border-[#e8eaf6]">
                <LottieView
                  autoPlay
                  // ref={animation}
                  style={{
                    width: width,
                    height: height * 0.5,
                    backgroundColor: "#e8eaf6",
                    borderTopLeftRadius: 100,
                    borderBottomRightRadius: 100,
                  }}
                  source={require("../assets/animation/Teacher Discussion.json")}
                />
              </View>
            ),
            title: "Apprendre ensemble",
            subtitle:
              "Propose des épreuves, obtiens des corrections personnalisées des professeurs et évolue dans une communauté qui te motive à donner le meilleur de toi-même !",
          },
        ]}
      />
    </SafeAreaView>
  );
}