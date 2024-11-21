import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import ChallengeItem from "../components/ChallengeItem";
import { supabase } from "../config/supabaseClient";

interface Challenge {
  id: number;
  name: string;
  description: string;
}

const FavoritesScreen: React.FC = () => {
  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );
  const [favoriteChallenges, setFavoriteChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from("challenges")
          .select("*")
          .in("id", favorites);
        if (error) throw error;
        setFavoriteChallenges(data);
      } catch (error) {
        console.error("Error fetching favorite challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    if (favorites.length > 0) {
      fetchFavorites();
    } else {
      setFavoriteChallenges([]);
      setLoading(false);
    }
  }, [favorites]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.empty}>
        <Text>No favorite challenges yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favoriteChallenges}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ChallengeItem
          id={item.id}
          name={item.name}
          description={item.description}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FavoritesScreen;
