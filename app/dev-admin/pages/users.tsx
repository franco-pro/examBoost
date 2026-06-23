// screens/UsersScreen.tsx
import { FlatList, ActivityIndicator, View , Text, TouchableOpacity, TextInput, ScrollView, Alert, RefreshControl} from 'react-native';
import { useEffect, useRef } from 'react';
import { useUsers } from '@/app/hooks/users.hook';
import { UserCard } from '@/app/helper/card/UserCard';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/app/hooks/redux/redux.hooks';
import { setSelectedUser } from '@/app/hooks/redux/dev-admin/dev-admin.slice';


export default function Users() {
  const { users, loading, total, hasMore, fetchUsers, searchUsers } = useUsers();
  const {accountWallet} = useAppSelector((state)=> state.devadmin);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Chargement initial
  useEffect(() => { fetchUsers(); }, []);
  const dispatch = useAppDispatch();

  function goToUserDetails(userId: number) {
    const user = users.find(u => u.id === userId);
    if(user){
      dispatch(setSelectedUser(user));
      router.push({
        pathname: './usersDetails',
        params: { id: userId },
      });
    }// when the user is set in the store, the details page will read it and display it
  }

  useEffect(()=>{
      return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
      };
  }, [])

  function doSearch(query: string){
      if(query.length < 3) return;
      // debounce search to avoid too many requests
      if(debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        searchUsers(query);
      }, 500);
  }

  function onFocusLoss(){
    if(debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = null;
    fetchUsers();
  }

  return (
    <View className='flex-1 bg-gray-50 pt-[40px] pb-[50px] px-4'>
      
      <TouchableOpacity
        className="flex-row items-center mb-4"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#181c5c" />
        <Text className="ml-2 text-lg font-semibold text-gray-800">Retour</Text>
      </TouchableOpacity>

       <View className="my-4 flex-row items-center bg-gray-100 rounded-full px-4 py-2">
              <Ionicons name="search" size={20} color="#9ca3af" className="mr-2" />
              <TextInput
                placeholder="Rechercher un user"
                className="flex-1 text-gray-700 p-2 border-0"
                underlineColorAndroid="transparent"
                style={{
                  outlineWidth: 0, // supprime le contour au focus
                }}
                // onFocus={onfocus}
                onEndEditing={onFocusLoss}
                onChangeText={(val: string)=> doSearch(val)}
              />
        </View>
      
      <View className="bg-white p-4 rounded-2xl mb-4 ">
        <Text className="text-lg font-semibold">Total Chargé</Text>
        <Text className="text-gray-500 mt-1">
           {users.length} / {total} utilisateurs 
        </Text>
      </View>
      <View className="bg-white p-4 rounded-2xl mb-4 ">
        <Text className="text-lg font-semibold">Total Solde</Text>
        <Text className="text-gray-500 mt-1">
           {
              users.reduce((acc, user) => acc + Number(user.wallet), 0).toLocaleString("fr-FR") + " FCFA"
           }
        </Text>
      </View>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <UserCard user={item} onPress={() => goToUserDetails(item.id)} />}
          className='w-full'
          refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchUsers() } />}
          onEndReachedThreshold={0.2}
          onEndReached={() => {
            if (!loading && hasMore) fetchUsers();
          }}

          // Spinner en bas de liste
          ListFooterComponent={
            loading ? (
              <View className="py-6 items-center">
                <ActivityIndicator size="small" />
              </View>
            ) : null
          }

          // Message si liste vide
          ListEmptyComponent={
            !loading ? (
              <Text className="text-center text-gray-400 mt-20">
                Aucun utilisateur
              </Text>
            ) : null
          }
        />

     
    </View>
  );
}