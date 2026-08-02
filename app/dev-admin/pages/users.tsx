// screens/UsersScreen.tsx
import { FlatList, ActivityIndicator, View, Text, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useUsers } from '@/app/hooks/users.hook';
import { UserCard } from '@/app/helper/card/UserCard';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/app/hooks/redux/redux.hooks';
import { setSelectedUser } from '@/app/hooks/redux/dev-admin/dev-admin.slice';

export default function Users() {
  const { users, loading, total, hasMore, fetchUsers, searchUsers } = useUsers();
  const { accountWallet } = useAppSelector((state) => state.devadmin);
  const dispatch = useAppDispatch();

  // État local pour contrôler l'input de recherche
  const [searchQuery, setSearchQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Chargement initial et nettoyage du timer
  useEffect(() => {
    fetchUsers();
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function goToUserDetails(userId: number) {
    const user = users.find(u => u.id === userId);
    if (user) {
      dispatch(setSelectedUser(user));
      router.push({
        pathname: './usersDetails',
        params: { id: userId },
      });
    }
  }

  function handleSearch(query: string) {
    setSearchQuery(query);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Si le champ est vidé, on recharge la liste initiale
    if (query.trim() === '') {
      debounceRef.current = setTimeout(() => {
        fetchUsers();
      }, 300);
      return;
    }

    // On lance la recherche à partir de 3 caractères
    if (query.trim().length >= 3) {
      debounceRef.current = setTimeout(() => {
        searchUsers(query);
      }, 500);
    }
  }

  // Calcul du solde total sécurisé
  const totalWallet = users
    .reduce((acc, user) => acc + Number(user.wallet || 0), 0)
    .toLocaleString("fr-FR");

  return (
    <View className="flex-1 bg-slate-50 pt-12 px-4">
      
      {/* En-tête */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          className="w-10 h-10 bg-white rounded-full items-center justify-center border border-slate-100 shadow-sm"
          onPress={() => router.back()}
          style={{ elevation: 2 }}
        >
          <Ionicons name="arrow-back" size={20} color="#1e293b" />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold text-slate-800">Utilisateurs</Text>
      </View>

      {/* Barre de recherche */}
      <View 
        className="flex-row items-center bg-white rounded-2xl px-4 py-2 mb-6 border border-slate-200 shadow-sm" 
        style={{ elevation: 1 }}
      >
        <Ionicons name="search" size={20} color="#94a3b8" />
        <TextInput
          placeholder="Rechercher un utilisateur..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={handleSearch}
          className="flex-1 text-slate-700 p-2 ml-2 text-base"
          style={{ outlineWidth: 0 }} // Retrait du contour web
        />
        {/* Bouton pour effacer la recherche */}
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Cartes de statistiques (Affichage en grille) */}
      <View className="flex-row justify-between mb-6">
        <View 
          className="flex-1 bg-white p-4 rounded-2xl mr-2 shadow-sm border border-slate-100" 
          style={{ elevation: 2 }}
        >
          <View className="flex-row items-center mb-2">
            <Ionicons name="people" size={16} color="#3b82f6" />
            <Text className="text-xs font-semibold text-slate-500 ml-2 uppercase">Total Chargé</Text>
          </View>
          <Text className="text-xl font-bold text-slate-800">
            {users.length} <Text className="text-sm font-normal text-slate-400">/ {total}</Text>
          </Text>
        </View>

        <View 
          className="flex-1 bg-white p-4 rounded-2xl ml-2 shadow-sm border border-slate-100" 
          style={{ elevation: 2 }}
        >
          <View className="flex-row items-center mb-2">
            <Ionicons name="wallet" size={16} color="#10b981" />
            <Text className="text-xs font-semibold text-slate-500 ml-2 uppercase">Solde Total</Text>
          </View>
          <Text className="text-xl font-bold text-slate-800">
            {totalWallet} <Text className="text-xs font-normal text-slate-500">U</Text>
          </Text>
        </View>
      </View>

      {/* Liste des utilisateurs */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <UserCard user={item} onPress={() => goToUserDetails(item.id)} />}
        className="w-full flex-1"
        contentContainerStyle={{ paddingBottom: 60 }} // Évite que le dernier item soit collé en bas
        showsVerticalScrollIndicator={false}
        
        refreshControl={
          <RefreshControl 
            refreshing={loading && users.length === 0} 
            onRefresh={() => {
              setSearchQuery(''); // On vide la barre de recherche au pull-to-refresh
              fetchUsers();
            }} 
            colors={["#3b82f6"]}
          />
        }
        
        onEndReachedThreshold={0.2}
        onEndReached={() => {
          // On ne pagine que si aucune recherche n'est en cours
          if (!loading && hasMore && searchQuery.length < 3) {
            fetchUsers();
          }
        }}

        ListFooterComponent={
          loading ? (
            <View className="py-6 items-center">
              <ActivityIndicator size="large" color="#3b82f6" />
            </View>
          ) : null
        }

        ListEmptyComponent={
          !loading ? (
            <View className="items-center justify-center mt-20">
              <Ionicons name="folder-open-outline" size={48} color="#cbd5e1" />
              <Text className="text-center text-slate-400 mt-4 text-base">
                Aucun utilisateur trouvé
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}