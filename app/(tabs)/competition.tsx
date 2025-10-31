import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { VStack } from '@/components/ui/vstack';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text } from 'react-native';

import { useAppDispatch, useAppSelector } from '../hooks/redux/redux.hooks';
import { fetchRoomCreate } from '../hooks/redux/rooms/rooms.thunks';
import { EmitEvent, initializeRoomsGateway } from '../hooks/services/socket/rooms.gateway';
import { UsersTest } from '../services/entities/users.test';

export default function Competition(){
  const [anError, setError] = useState(false);

  const dispatch = useAppDispatch();
  const { loading, error, room} = useAppSelector((state) => state.rooms);
  
  const router = useRouter();

  const [launcDone, setLaunchAsDone] = useState(false);
  const user : UsersTest = {
      id: 10,
      username: 'Current User',
      surname: 'Test',
      email: "test@gmail.com",
      imgUrl: "",
      score: 0,
    }
  

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

        dispatch(fetchRoomCreate({name: 'room test', topic: 'General Knowledge', userID: 1, competitionID: 1, isManagedByIA: true})).unwrap().then((res) => {
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

      initializeRoomsGateway(dispatch, room);
      const eventManager = EmitEvent(dispatch, room);
      if(room){
      eventManager.joinRoom({roomId: room.roomId, userID: user.id, username: 'Host User', imgUrl: 'https://i.ibb.co/7R4DyhQ/Avatar-1.jpg', surname: 'UserSurname'});
        if(room.creatorID == user.id){
          navigate('/pages/competitions-screen/owner.online')
        }else{
          navigate('/pages/competitions-screen/online.users')
        }
      }
    }
    
  }

  function joiroomTest(){
    // join the room

      const eventManager = EmitEvent(dispatch, room);
      eventManager.joinRoom({roomId: "room_1761172286513_r3856cxt5", userID: user.id, username: user.username, imgUrl: 'https://example.com/avatar2.png', surname: user.surname});
      navigate('/pages/competitions-screen/online.users')
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
