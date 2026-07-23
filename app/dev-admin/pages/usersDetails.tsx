// app/dev-admin/pages/usersDetails.tsx

import { router, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/app/hooks/redux/redux.hooks";
import { deleteUser, updateRole } from "@/app/hooks/redux/users/users.slice";
import Toast from "react-native-toast-message";
import { useUsers } from "@/app/hooks/users.hook";
import { Box } from "@/components/ui/box";
import { Switch } from "@/components/ui/switch";
import apiClient from "@/app/api/apiClient";
import { updateUser } from "@/app/hooks/redux/dev-admin/dev-admin.slice";
import { User } from "@/app/features/user/types";
import { useCallback } from "react";
import { getAllNiveaux } from "@/app/hooks/redux/niveaux/niveaux.thunks";

// Données simulées — remplace par ton fetch API avec l'id
const mockUser = {
  email: "franzdeussom111@gmail.com",
  id: 2,
  imgUrl: null,
  phone: "698403201",
  role: "SUPERADMIN",
  surname: "Franz",
  username: "Deussom",
  wallet: 39000,
  niveauID: 1,
  canSubmitDoc: true
};

// function StarRating({ count = 3, total = 5 }: { count?: number; total?: number }) {
//   return (
//     <View style={styles.starsRow}>
//       {Array.from({ length: total }).map((_, i) => (
//         <Ionicons
//           key={i}
//           name={i < count ? "star" : "star-outline"}
//           size={18}
//           color={i < count ? "#F59E0B" : "#D1D5DB"}
//         />
//       ))}
//     </View>
//   );
// }

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      {typeof value === "string" || typeof value === "number" ? (
        <Text style={styles.infoValue}>{value}</Text>
      ) : (
        value
      )}
    </View>
  );
}


export default function UserDetailsPage() {
    const {removeUser, updateUser: localUserUpdate} = useUsers()

    const {selectedUser} = useAppSelector((state)=> state.devadmin);
    const {niveauxList} = useAppSelector((state) => state.niveaux);
  // TODO: remplace mockUser par un fetch réel avec l'id
  const user = selectedUser || mockUser;

  const initials = `${user.username[0]}${user.surname[0]}`.toUpperCase();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const roleLabel =
    user.role === "ADMIN"
      ? "Administrateur"
      : user.role === "SUPERADMIN"
      ? "Super Admin"
      : user.role === "PARTNER" ? "PARTENAIRE" 
      : "Utilisateur";


  useFocusEffect(
    useCallback(() => {
      if(niveauxList.length === 0){
        dispatch(getAllNiveaux());
      }
    }, [])
  )
  
const handleDelete = () => {
    Alert.alert(
      "Supprimer l'utilisateur",
      `Voulez-vous vraiment supprimer ${user.username} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await dispatch(deleteUser(user.id)).finally(() => {
              removeUser(user.id);
              showToast("Utilisateur supprimé avec succès", "Succès", "success");
              router.back();
            });
          },
        },
      ]
    );
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

  const DoUpdate = (role: string) => {
      if(user.role.toUpperCase() === role.toUpperCase()) return;

      dispatch(updateRole({id: user.id, role: role})).finally(() => {
        showToast(`Rôle mis à jour en ${roleLabel}`, "Succès", "success");
        router.back();
      })
  }

  const setSendingStatut =async ()=>{
    try {
      const response = await apiClient.get(user.canSubmitDoc ? "document/suspension/"+user.id : "/document/activation/"+user.id);
    

      dispatch(updateUser({ ...user, canSubmitDoc: !user.canSubmitDoc }));
  
      localUserUpdate({
        ...user,
        canSubmitDoc: !user.canSubmitDoc,
      } as User);
  
      showToast(
        user.canSubmitDoc
          ? "L'utilisateur ne peut plus soumettre de documents"
          : "L'utilisateur peut désormais soumettre des documents",
        "Succès",
        "success"
      );
  
    } catch (error: any) {
      console.log('error on updating statut:', error.message);
      showToast(error.message || "Une erreur est survenue", "Erreur", "error");
    }
  }
  
  const handleChangeRole = () => {
    Alert.alert(
      "Modifier le rôle",
      `Rôle actuel : ${user.role}`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "USER",
          onPress: () => DoUpdate("USER"), // await updateRole(user.id, "USER")
        },
        {
          text: "ADMIN",
          onPress: () => DoUpdate("ADMIN"), // await updateRole(user.id, "ADMIN")
        },
        {
          text: "PARTNER",
          onPress: () => DoUpdate("PARTNER"), // await updateRole(user.id, "ADMIN")
        },
        {
          text: "SUPERADMIN",
          onPress: () => DoUpdate("SUPERADMIN"), // await updateRole(user.id, "ADMIN")
        },
      ]
    );
  };
  return (
    <View className="flex-1 bg-gray-50 pt-[40px] pb-[50px] px-4">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Avatar + Nom */}
        <View style={styles.avatarSection}>
          <Avatar size="xl" style={styles.avatar}>
            {user.imgUrl ? (
              <AvatarImage source={{ uri: user.imgUrl }} />
            ) : 
            <AvatarFallbackText style={styles.avatarText}>{initials}</AvatarFallbackText>
            
            }
          </Avatar>

          <Text style={styles.name}>{user.username} {user.surname}</Text>
          <Text style={styles.role}>{roleLabel}</Text>
        </View>

        {/* Boutons d'action */}
        <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.btnDanger} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={16} color="#fff" />
                <Text style={styles.btnDangerText}>Supprimer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnOutline} onPress={handleChangeRole}>
                <Ionicons name="shield-outline" size={16} color="#16A34A" />
                <Text style={styles.btnOutlineText}>Modifier le rôle</Text>
            </TouchableOpacity>
        </View>

        {/* Wallet highlight */}
        <View style={styles.walletCard}>
          <Ionicons name="wallet-outline" size={22} color="#16A34A" />
          <View style={styles.walletInfo}>
            <Text style={styles.walletLabel}>Solde du portefeuille</Text>
            <Text style={styles.walletAmount}>
              {user.wallet.toLocaleString("fr-FR")} FCFA
            </Text>
          </View>
        </View>

        {/* User Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Informations</Text>

          <InfoRow label="Username" value={`@${user.username}`} />
          <View style={styles.divider} />

          <InfoRow label="Email" value={user.email} />
          <View style={styles.divider} />

          <InfoRow label="Téléphone" value={user.phone} />
          <View style={styles.divider} />

          <InfoRow label="Rôle" value={roleLabel} />

          <View style={styles.divider} />
          <InfoRow label="Niveau" value={Array.isArray(niveauxList) && niveauxList.length!=0 ? niveauxList.find(niveau => niveau.id == user.niveauID)?.name : ""} />

          <View style={styles.divider} />
          <InfoRow label="ID" value={`#${user.id}`} />
          <View style={styles.divider} />
          {/* <InfoRow
            label="Avis"
            value={<StarRating count={3} total={5} />}
          /> */}
        </View>
    <Box className="mb-4 mt-[15px]">
      <Text className="mb-2 text-base font-medium text-typography-900">
        Statut de validation
      </Text>

      <Box className="flex-row items-center justify-between rounded-xl border border-outline-200 bg-background-50 p-4">
        <Box className="flex-1 mr-4">
          <Text className="text-base font-semibold text-typography-900">
            {user.canSubmitDoc ? "Envoi activé" : "Envoi suspendu"}
          </Text>

          <Text className="mt-1 text-sm text-typography-500">
            {user.canSubmitDoc
              ? "Peux soumettre des documents"
              : "Ne peut pas soumettre de documents"}
          </Text>
        </Box>

        <Switch
          value={user.canSubmitDoc}
          onValueChange={setSendingStatut}
          size="md"
        />
      </Box>
    </Box>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 28,
  },

  // Avatar section
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#DCFCE7",
    marginBottom: 14,
    borderWidth: 3,
    borderColor: "#16A34A",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#16A34A",
  },
  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },

  // Boutons
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  btnOutline: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#16A34A",
    backgroundColor: "#F0FDF4",
  },
  btnOutlineText: {
    color: "#16A34A",
    fontWeight: "600",
    fontSize: 14,
  },
  btnDanger: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: "#EF4444",
  },
  btnDangerText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  // Wallet
  walletCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 16,
    padding: 16,
    gap: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  walletInfo: {
    flex: 1,
  },
  walletLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  walletAmount: {
    fontSize: 20,
    fontWeight: "800",
    color: "#16A34A",
  },

  // Info card
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    maxWidth: "60%",
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  starsRow: {
    flexDirection: "row",
    gap: 2,
  },
});