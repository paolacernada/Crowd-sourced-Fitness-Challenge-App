import React, { useEffect, useState } from "react";
import { FlatList, Text, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import UserChallengeItem from "../components/userChallenges/UserChallengeItem";
import { supabase } from "../config/supabaseClient";
import ScreenContainer from "../components/ScreenContainer";
import styles from "../components/ScreenStyles";
import { useTheme } from "../context/ThemeContext";

interface Challenge {
  id: number;
  name: string;
  description: string;
  difficulty: string;
}

const FavoritesScreen: React.FC = () => {
  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );
  const [favoriteChallenges, setFavoriteChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { theme } = useTheme();

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
      <ScreenContainer>
        <ActivityIndicator
          size="large"
          color={theme === "dark" ? "#fff" : "#000"}
        />
      </ScreenContainer>
    );
  }

  if (favorites.length === 0) {
    return (
      <ScreenContainer>
        <Text
          style={[
            theme === "dark" ? styles.darkText : styles.lightText,
            { textAlign: "center", fontSize: 16 },
          ]}
        >
          You don't have any favorite challenges yet.
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text
        style={[
          styles.appName,
          theme === "dark" ? styles.darkAppName : styles.lightAppName,
        ]}
      >
        FitTogether Challenges
      </Text>

      <Text
        style={[
          styles.title,
          theme === "dark" ? styles.darkText : styles.lightText,
          { marginBottom: 20 },
        ]}
      >
        My Favorite Challenges
      </Text>

      <FlatList
        data={favoriteChallenges}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <UserChallengeItem challenge={item} />}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={true}
      />
    </ScreenContainer>
  );
};

export default FavoritesScreen;
