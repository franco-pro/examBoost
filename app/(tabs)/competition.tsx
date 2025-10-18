import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { VStack } from '@/components/ui/vstack';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';
import OnlineCompetitionRedux from '../hooks/online-competition.redux';

export default function Competition(){
  const loading = useSelector((state : any) => state.room.loading)
  const error = useSelector((state: any) => state.room.error)
  const [anError, setError] = useState(false);

  const [launcDone, setLaunchAsDone] = useState(false);

  if(loading) {
      <Spinner size="large" color="blue" />
      {
        console.log('done')
      }
 };
  
  if(launcDone) {
    // ToastManager({message: error ?? 'Errro type', type: 'error'})
  }

  
  function navigate(route: string){
    const router = useRouter();
    router.push(route as any);
  }

  function createRoomOrJoinRoom(){

    if(!launcDone){
       let response : any;
    const {store, fetchRoomCreate} = OnlineCompetitionRedux()

        store.dispatch(fetchRoomCreate({name: 'room test', topic: 'General Knowledge', userID: 1, competitionID: 1, isManagedByIA: false})).unwrap().then((res) => {
        response = res;
        setLaunchAsDone(true)
        // navigate('/pages/competitions-screen/owner.online')
        console.log("Room created with ID:", response);
      }).catch((error) => {
        setError(true);
        console.log("Error creating room:", error);
      }
      );
    }else{
      // join the room
    }
   

    
  }

    return(
       <VStack>
        <Button className="bg-primary-defaultOrange mt-4"
      onPress={() => navigate('/pages/competitions-screen/online.users')}  
      >
        <Text className="text-white">Rejoindre...</Text>
      </Button>
      <Button className="bg-primary-defaultBlue mt-4"
      onPress={() => createRoomOrJoinRoom()}  
      >
        <Text className="text-white">Demarrer la competition...</Text>
      </Button>
       </VStack>
      
    )
}
