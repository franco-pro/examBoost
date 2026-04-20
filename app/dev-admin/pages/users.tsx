// screens/UsersScreen.tsx
import { FlatList, ActivityIndicator, View , Text} from 'react-native';
import { useEffect } from 'react';
import { useUsers } from '@/app/hooks/users.hook';
import { UserCard } from '@/app/helper/card/UserCard';

export function UsersScreen() {
  const { users, loading, hasMore, fetchUsers } = useUsers();

  // Chargement initial
  useEffect(() => { fetchUsers(); }, []);

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <UserCard user={item} />}

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
  );
}