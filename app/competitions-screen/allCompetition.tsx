import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Animated,
  StatusBar,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useAppDispatch, useAppSelector } from "../hooks/redux/redux.hooks";
import { getCompetitionList, searchCompetitions } from "../hooks/redux/competitions/competitions.thunks";
import { clearData, setSelectedCompetition } from "../hooks/redux/competitions/competitions.slice";
import Competition from "../hooks/services/competitions/competition.entity";
import { C, CompetitionCard } from "../helper/card/listcompetitionCard";

const PAGE_SIZE = 20;

const TYPES: Competition["type"][] = [
  "PAID_REGISTRATION_AS_WINNER_PRICE",
  "FREE_REGISTRATION_WITH_WINNER_PRICE",
  "PAID_REGISTRATION_WITH_WINNER_PRICE",
  "TOTAL_FREE_NO_PRICE_TO_WIN",
];

const STATUTS: Competition["statut"][] = [
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
];

const TYPE_LABELS: Record<Competition["type"], string> = {
  PAID_REGISTRATION_AS_WINNER_PRICE: "Paye = Prix",
  FREE_REGISTRATION_WITH_WINNER_PRICE: "Gratuit + Prix",
  PAID_REGISTRATION_WITH_WINNER_PRICE: "Payant + Prix",
  TOTAL_FREE_NO_PRICE_TO_WIN: "100% Gratuit",
};


const STATUT_LABELS: Record<Competition["statut"], string> = {
  UPCOMING: "À venir",
  ONGOING: "En cours",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};


function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


function matchesSearch(c: Competition, q: string): boolean {
  const lq = q.toLowerCase();
  return (
    c.name.toLowerCase().includes(lq) ||
    c.description.toLowerCase().includes(lq) ||
    STATUT_LABELS[c.statut].toLowerCase().includes(lq) ||
    TYPE_LABELS[c.type].toLowerCase().includes(lq) ||
    formatDate(c.date).toLowerCase().includes(lq)
  );
}

function FilterPill({
  label,
  active,
  onPress,
  count,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  count?: number;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: active ? C.orange : "rgba(255,255,255,0.08)",
        borderWidth: 1,
        borderColor: active ? C.orange : C.border,
      }}
    >
      <Text
        style={{
          color: active ? C.white : C.mutedHeader,
          fontSize: 12,
          fontWeight: active ? "700" : "500",
        }}
      >
        {label}
      </Text>
      {count !== undefined && (
        <View
          style={{
            backgroundColor: active
              ? "rgba(255,255,255,0.25)"
              : "rgba(255,255,255,0.1)",
            borderRadius: 10,
            minWidth: 18,
            height: 18,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 6,
            paddingHorizontal: 4,
          }}
        >
          <Text
            style={{
              color: active ? C.white : C.mutedHeader,
              fontSize: 10,
              fontWeight: "700",
            }}
          >
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function SearchBar({
  value,
  onChange,
  onClear,
  searching,
}: {
  value: string;
  onChange: (text: string) => void;
  onClear: () => void;
  searching: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: value.length > 0 ? C.orange : C.border,
        marginHorizontal: 16,
        marginBottom: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
      }}
    >
      {searching ? (
        <ActivityIndicator size="small" color={C.orange} />
      ) : (
        <Ionicons
          name="search-outline"
          size={18}
          color={value.length > 0 ? C.orange : C.mutedHeader}
        />
      )}

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Rechercher une compétition…"
        placeholderTextColor={C.mutedHeader}
        style={{
          flex: 1,
          color: C.white,
          fontSize: 13,
          paddingVertical: 0,
        }}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />

      {value.length > 0 && (
        <TouchableOpacity
          onPress={onClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close-circle" size={18} color={C.mutedHeader} />
        </TouchableOpacity>
      )}
    </View>
  );
}


function SkeletonCard() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.9],
  });

  return (
    <Animated.View
      style={{
        opacity,
        backgroundColor: C.cardBg,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: C.cardBorder,
        padding: 14,
        paddingLeft: 18,
        marginBottom: 12,
      }}
    >
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          backgroundColor: C.divider,
          borderRadius: 4,
        }}
      />
      <View
        style={{
          height: 14,
          width: "65%",
          backgroundColor: C.divider,
          borderRadius: 6,
          marginBottom: 8,
        }}
      />
      <View
        style={{
          height: 10,
          width: "40%",
          backgroundColor: C.divider,
          borderRadius: 6,
          marginBottom: 14,
        }}
      />
      <View
        style={{
          height: 10,
          width: "90%",
          backgroundColor: C.divider,
          borderRadius: 6,
          marginBottom: 6,
        }}
      />
      <View
        style={{
          height: 10,
          width: "70%",
          backgroundColor: C.divider,
          borderRadius: 6,
          marginBottom: 14,
        }}
      />
      <View
        style={{
          height: 1,
          backgroundColor: C.divider,
          marginBottom: 14,
        }}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {[1, 2, 3].map((k) => (
          <View key={k} style={{ alignItems: "center", flex: 1 }}>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: C.divider,
                marginBottom: 4,
              }}
            />
            <View
              style={{
                width: 40,
                height: 8,
                backgroundColor: C.divider,
                borderRadius: 4,
              }}
            />
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

export default function CompetitionListScreen() {
  const { competitionList, searchResults, loading, error, pagination } = useAppSelector(
    (state) => state.competitions
  );
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [selectedType, setSelectedType] = useState<Competition["type"] | "ALL">("ALL");
  const [selectedStatut, setSelectedStatut] = useState<Competition["statut"] | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [displayedItems, setDisplayedItems] = useState<Competition[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const baseFiltered = competitionList.filter((c) => {
    const typeOk = selectedType === "ALL" || c.type === selectedType;
    const statutOk = selectedStatut === "ALL" || c.statut === selectedStatut;
    return typeOk && statutOk;
  });

  const hasMore = !isSearchMode && page < pagination.totalPages;


  useEffect(() => {
    if (competitionList.length === 0 && !refreshing) {
      dispatch(getCompetitionList({page, limit: PAGE_SIZE})).finally(() => setPage(prev => prev + 1));
    }
  }, []);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: error,
        position: "top",
        visibilityTime: 3500,
      });
    }
  }, [error]);

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);


  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = searchQuery.trim();

    if (!trimmed) {
      setIsSearchMode(false);
      setSearchLoading(false);
      setDisplayedItems(baseFiltered.slice(0, page * PAGE_SIZE));
      return;
    }

    setIsSearchMode(true);

    debounceRef.current = setTimeout(() => {
      const local = competitionList.filter((c) => matchesSearch(c, trimmed));

      if (local.length > 0) {
        setDisplayedItems(local);
        setSearchLoading(false);
      } else {

        if (trimmed.length < 2) return; // avoids spam API

        setSearchLoading(true);
        dispatch(searchCompetitions({query: trimmed, isAdmin: false})).finally(() => {
          setSearchLoading(false);
        });
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, competitionList]);

  useEffect(() => {
    if (!isSearchMode) return;
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    const local = competitionList.filter((c) => matchesSearch(c, trimmed));
    if (local.length === 0 && searchResults && searchResults.length > 0) {
      setDisplayedItems(searchResults);
      setSearchLoading(false);
    }
  }, [searchResults]);

  useEffect(() => {
    if (isSearchMode) return;
    setDisplayedItems(baseFiltered.slice(0, page * PAGE_SIZE));
  }, [page, selectedType, selectedStatut, competitionList]);

  const handleTypeChange = (type: Competition["type"] | "ALL") => {
    setSelectedType(type);
    setSelectedStatut("ALL");
    setPage(1);
  };

  // const handleStatutChange = (statut: Competition["statut"] | "ALL") => {
  //   setSelectedStatut(statut);
  //   setPage(1);
  // };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearchMode(false);
    setSearchLoading(false);
    setPage(1);
  };

  const loadMore = useCallback(() => {
    if (paginationLoading || !hasMore) return;
    setPaginationLoading(true);
    dispatch(getCompetitionList({page, limit: PAGE_SIZE})).finally(() =>{ 
      setPage((p) => p + 1);
      setPaginationLoading(false);
    });

  }, [paginationLoading, hasMore]);

  const onRefresh = () => {
    dispatch(clearData());
    setRefreshing(true);
    setPage(1);
    setSearchQuery("");
    setIsSearchMode(false);
    dispatch(getCompetitionList({page, limit: PAGE_SIZE})).finally(() => setRefreshing(false));
  };

  const goToCompetitionInfoScreen = (id: number) => {
    const navigate = (competition: any) => {
      dispatch(setSelectedCompetition(competition));
      router.push({
        pathname: "./information",
        params: { id },
      });
    }
    if(isSearchMode){
      const competitionSelected = searchResults.find((comp) => comp.id === id);
      if (competitionSelected) {
        navigate(competitionSelected);
      }
    }else{
      const competitionSelected = competitionList.find((comp) => comp.id === id);
      if (competitionSelected) {
        navigate(competitionSelected);
      }
    }

  };

  const countForType = (type: Competition["type"] | "ALL") =>
    type === "ALL"
      ? competitionList.length
      : competitionList.filter((c) => c.type === type).length;

  const countForStatut = (
    statut: Competition["statut"] | "ALL",
    type: Competition["type"] | "ALL"
  ) => {
    const base =
      type === "ALL"
        ? competitionList
        : competitionList.filter((c) => c.type === type);
    return statut === "ALL"
      ? base.length
      : base.filter((c) => c.statut === statut).length;
  };

  const resultCount = isSearchMode ? displayedItems.length : baseFiltered.length;

  const StickyHeader = (
    <Animated.View
      style={{
        opacity: headerAnim,
        transform: [
          {
            translateY: headerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          },
        ],
        backgroundColor: C.blueDark,
        width: "100%",
        zIndex: 10,
      }}
    >
      <View style={{ paddingHorizontal: 16, paddingTop: 5, paddingBottom: 14 }}>
        <Text
          style={{
            color: C.mutedHeader,
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: 2.5,
            textTransform: "uppercase",
          }}
        >
          Découvrez
        </Text>
        <Text
          style={{
            color: C.white,
            fontSize: 26,
            fontWeight: "900",
            letterSpacing: -0.5,
            lineHeight: 30,
            marginTop: 2,
          }}
        >
          Compétitions
        </Text>
        <Text style={{ color: C.orange, fontSize: 12, marginTop: 4 }}>
          {searchLoading
            ? "Recherche en cours…"
            : `${resultCount} résultat${resultCount > 1 ? "s" : ""}`}
        </Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onClear={handleClearSearch}
        searching={searchLoading}
      />

      {!isSearchMode && (
        <>
          <View style={{ paddingBottom: 4 }}>
            <Text
              style={{
                color: C.mutedHeader,
                fontSize: 10,
                fontWeight: "700",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                paddingHorizontal: 16,
                marginBottom: 8,
              }}
            >
              Type
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 4 }}
            >
              <FilterPill
                label="Tous"
                active={selectedType === "ALL"}
                onPress={() => handleTypeChange("ALL")}
                count={countForType("ALL")}
              />
              {TYPES.map((t) => (
                <FilterPill
                  key={t}
                  label={TYPE_LABELS[t]}
                  active={selectedType === t}
                  onPress={() => handleTypeChange(t)}
                  count={countForType(t)}
                />
              ))}
            </ScrollView>
          </View>

          {/* <View style={{ paddingBottom: 4, paddingTop: 10 }}>
            <Text
              style={{
                color: C.mutedHeader,
                fontSize: 10,
                fontWeight: "700",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                paddingHorizontal: 16,
                marginBottom: 8,
              }}
            >
              Statut
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              <FilterPill
                label="Tous"
                active={selectedStatut === "ALL"}
                onPress={() => handleStatutChange("ALL")}
                count={countForStatut("ALL", selectedType)}
              />
              {STATUTS.map((s) => (
                <FilterPill
                  key={s}
                  label={STATUT_LABELS[s]}
                  active={selectedStatut === s}
                  onPress={() => handleStatutChange(s)}
                  count={countForStatut(s, selectedType)}
                />
              ))}
            </ScrollView>
          </View> */}
        </>
      )}

      <View
        style={{
          backgroundColor: C.bodyBg,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 20,
          marginTop: 14,
        }}
      />
    </Animated.View>
  );

  const ListFooter = (
    <View style={{ paddingVertical: 24, alignItems: "center" }}>
      {paginationLoading && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <ActivityIndicator color={C.orange} />
          <Text style={{ color: C.textSecondary, fontSize: 13 }}>
            Chargement…
          </Text>
        </View>
      )}
      {!hasMore && displayedItems.length > 0 && !isSearchMode && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons
            name="checkmark-circle-outline"
            size={16}
            color={C.textMuted}
          />
          <Text style={{ color: C.textMuted, fontSize: 12 }}>
            Toutes les compétitions sont affichées
          </Text>
        </View>
      )}
      {displayedItems.length === 0 && !loading && !searchLoading && !paginationLoading && (
        <View style={{ alignItems: "center", paddingVertical: 32 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "#eef0f8",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <Ionicons name="trophy-outline" size={28} color={C.textMuted} />
          </View>
          <Text
            style={{
              color: C.textPrimary,
              fontSize: 15,
              fontWeight: "700",
              marginBottom: 6,
            }}
          >
            Aucune compétition
          </Text>
          <Text
            style={{
              color: C.textSecondary,
              fontSize: 13,
              textAlign: "center",
            }}
          >
            {isSearchMode
              ? "Aucun résultat pour cette recherche."
              : "Aucun résultat pour ces filtres."}
          </Text>
        </View>
      )}
    </View>
  );

  const isInitialLoading = loading && competitionList.length === 0;

  return (
    <View className='flex-1 bg-gray-50 pt-[40px]' style={{ flex: 1, backgroundColor: C.blueDark }}>
      <StatusBar barStyle="light-content" backgroundColor={C.blueDark} />
        <TouchableOpacity
             className="flex-row items-center mb-4"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#ff894f" />
            <Text className="ml-2 text-lg font-semibold text-white">Retour</Text>
        </TouchableOpacity>

      {StickyHeader}

      {isInitialLoading ? (
        <View
          style={{
            flex: 1,
            backgroundColor: C.bodyBg,
            paddingHorizontal: 16,
            paddingTop: 4,
          }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : (
        <FlatList<Competition>
          data={displayedItems}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <CompetitionCard item={item} onPress={goToCompetitionInfoScreen} />
          )}
          ListFooterComponent={ListFooter}
          contentContainerStyle={{
            backgroundColor: C.bodyBg,
            paddingHorizontal: 16,
            paddingBottom: 32,
          }}
          style={{ flex: 1, backgroundColor: C.bodyBg }}
          onEndReachedThreshold={0.3}
          onEndReached={loadMore}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={C.orange}
              colors={[C.orange]}
            />
          }
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          maxToRenderPerBatch={PAGE_SIZE}
          initialNumToRender={PAGE_SIZE}
          windowSize={5}
        />
      )}
    </View>
  );
}