import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { VStack } from '@/components/ui/vstack';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text } from 'react-native';

import { useAppDispatch, useAppSelector } from '../hooks/redux/redux.hooks';
import { fetchRoomCreate } from '../hooks/redux/rooms/rooms.thunks';
import { EmitEvent, initializeRoomsGateway } from '../hooks/services/socket/rooms.gateway';

export default function Competition(){
  const [anError, setError] = useState(false);

  const dispatch = useAppDispatch();
  const { loading, error, room} = useAppSelector((state) => state.rooms);
  
  const router = useRouter();

  const [launcDone, setLaunchAsDone] = useState(false);

  if(loading) {
      <Spinner size="large" color="blue" />
      {
        console.log('done')
        console.log('room:', room)

      }
 };
  
  if(launcDone) {
    // ToastManager({message: error ?? 'Errro type', type: 'error'})
  }

  
  function navigate(route: string){
    router.push(route as any);
  }
  

  function createRoomOrJoinRoom(){

    if(!launcDone || !room){
       let response : any;

        dispatch(fetchRoomCreate({name: 'room test', topic: 'General Knowledge', userID: 1, competitionID: 1, isManagedByIA: false})).unwrap().then((res) => {
        response = res;
        setLaunchAsDone(true)
        // navigate('/pages/competitions-screen/owner.online')
        console.log("Room created with ID:", response);
      }).catch((error: any) => {
        setError(true);
        console.log("Error creating room:", error);
      }
      );
    }else{
      // join the room

      initializeRoomsGateway();
      const eventManager = EmitEvent();
      if(room){
      eventManager.joinRoom({roomId: room.roomId, userID: 1, username: 'Host User', imgUrl: 'https://example.com/avatar.png', surname: 'UserSurname'});
        if(room.creatorID == 1){
          navigate('/pages/competitions-screen/owner.online')
        }else{
          navigate('/pages/competitions-screen/online.users')
        }
      }
    }
    
  }

    return(
       <VStack>
        <Button className="bg-primary-defaultOrange mt-4"
      onPress={() => createRoomOrJoinRoom()}  
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
