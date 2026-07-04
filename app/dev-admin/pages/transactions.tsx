import apiClient from '@/app/api/apiClient';
import { toastConfig } from '@/app/config/toast.config';
import { router } from 'expo-router';
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Toast from 'react-native-toast-message';

// --- Types ---
interface User {
  surname: string;
  username: string;
  imgUrl: string | null;
}

interface Transaction {
  id: number;
  PID: string;
  amount: number;
  method: string | null;
  isMasked: boolean;
  type: string;
  userID: number;
  status: 'COMPLETED' | 'FAILED' | 'PENDING' | 'REFUNDED' | 'CANCELLED' | null;
  created_at: string;
  updated_at: string;
  user: User;
}

const STATUSES = ['ALL', 'COMPLETED', 'FAILED', 'PENDING', 'REFUNDED', 'CANCELLED'];
const TYPES = [
  'ALL',
  'DEPOSIT',
  'WITHDRAWAL',
  'PURCHASE_PACK',
  'CREATE_COMPETITION',
  'COMPETITION_FEES',
  'PLATFORM_COMISSION',
  'COMPETITION_FEES_RECEIVED',
];

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filtres
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // --- Fetch API ---
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // Remplacez cette URL par votre véritable endpoint API
      const {data} = await apiClient.get("/transactions"); 
      
      setTransactions(data);
    } catch (error) {
      showToast("Impossible de charger les transactions. Veuillez réessayer plus tard.", "Erreur", "error");
      console.error('Erreur lors du chargement des transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  function showToast(message: string, title: string, type: "success"|"error"){
        Toast.show({
          type: type,
          text2: message,
          text1: title,
          position: 'top',
          visibilityTime: 3500,
        }) 
    }

  // --- Logique de filtrage ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // 1. Filtre par statut
      if (statusFilter !== 'ALL' && tx.status !== statusFilter) return false;
      
      // 2. Filtre par type
      if (typeFilter !== 'ALL' && tx.type !== typeFilter) return false;
      
      // 3. Recherche texte (PID, username, surname)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchPID = tx.PID.toLowerCase().includes(query);
        const matchUsername = tx.user.username?.toLowerCase().includes(query);
        const matchSurname = tx.user.surname?.toLowerCase().includes(query);
        if (!matchPID && !matchUsername && !matchSurname) return false;
      }
      
      return true;
    });
  }, [transactions, searchQuery, statusFilter, typeFilter]);

  // --- Helper pour la couleur du statut ---
  const getStatusStyle = (status: Transaction['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'FAILED':
        return 'bg-red-100 text-red-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-700';
      case 'CANCELLED':
        return 'bg-gray-200 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  // --- Rendu d'une carte transaction ---
  const renderItem = ({ item }: { item: Transaction }) => {
    const statusClasses = getStatusStyle(item.status);
    const date = new Date(item.created_at).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
      <TouchableOpacity
        className="bg-white p-4 rounded-2xl mb-4 shadow-sm border border-gray-100"
        activeOpacity={0.7}
        onPress={() => console.log('Transaction cliquée:', item)}
      >
        {/* Ligne 1: Utilisateur et Date */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            {item.user.imgUrl ? (
              <Image 
                source={{ uri: item.user.imgUrl }} 
                className="w-10 h-10 rounded-full bg-gray-200"
              />
            ) : (
              <View className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Text className="text-blue-600 font-bold text-lg">
                  {item.user.surname?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
            <View className="ml-3">
              <Text className="text-gray-900 font-semibold text-base">
                {item.user.username} {item.user.surname}
              </Text>
              <Text className="text-gray-400 text-xs">{date}</Text>
            </View>
          </View>
          <Text className="text-lg font-bold text-gray-900">
            {item.amount.toLocaleString('fr-FR')} FCFA
          </Text>
        </View>

        {/* Ligne 2: Infos techniques */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-500 text-xs">PID: {item.PID}</Text>
          <Text className="text-gray-500 text-xs">
            Méthode: {item.method || 'N/A'}
          </Text>
        </View>

        {/* Ligne 3: Badges Type & Statut */}
        <View className="flex-row justify-between items-center mt-2">
          <View className="bg-blue-50 px-3 py-1 rounded-full">
            <Text className="text-blue-600 text-xs font-medium">
              {item.type.replace(/_/g, ' ')}
            </Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${statusClasses.split(' ')[0]}`}>
            <Text className={`text-xs font-bold ${statusClasses.split(' ')[1]}`}>
              {item.status || 'INCONNU'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 pt-12">
      <View className="p-4">
            <View className="flex-row">
                <TouchableOpacity 
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                    className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-200 shadow-sm mr-3 mb-2"
                >
                    {/* Vous pouvez remplacer ce texte par une icône Lucide/Expo Vector Icons si vous en utilisez */}
                    <Text className="text-gray-800 text-xl font-bold leading-none -mt-1">←</Text>
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-gray-800">Transactions</Text>
            </View>
        {/* Barre de recherche */}
        <View className="bg-white px-4 py-3 rounded-xl border border-gray-200 mb-4 flex-row items-center">
          <TextInput
            className="flex-1 text-gray-800"
            placeholder="Rechercher par PID, Nom, prenom..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filtres horizontaux (Statut) */}
        <View className="mb-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {STATUSES.map((status) => (
              <TouchableOpacity
                key={`status-${status}`}
                onPress={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full mr-2 border ${
                  statusFilter === status 
                    ? 'bg-gray-900 border-gray-900' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <Text className={`${statusFilter === status ? 'text-white' : 'text-gray-600'} text-sm font-medium`}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Filtres horizontaux (Type) */}
        <View className="mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {TYPES.map((type) => (
              <TouchableOpacity
                key={`type-${type}`}
                onPress={() => setTypeFilter(type)}
                className={`px-4 py-2 rounded-full mr-2 border ${
                  typeFilter === type 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <Text className={`${typeFilter === type ? 'text-white' : 'text-gray-600'} text-xs font-medium`}>
                  {type.replace(/_/g, ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Liste des transactions */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-10">
              <Text className="text-gray-500 text-base">Aucune transaction trouvée.</Text>
            </View>
          }
        />
      )}
      
      <Toast config={toastConfig} />  
      
    </View>
  );
}