import React, { useEffect, useState, useContext } from "react";
import { FlatList, Text, ActivityIndicator, View } from "react-native";
import UserChallengeItem from "../components/userChallenges/UserChallengeItem";
import ScreenContainer from "../components/ScreenContainer";
import styles from "../components/ScreenStyles";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "../config/supabaseClient";
import { RefreshContext } from "../context/RefreshContext";

interface Challenge {
  id: number;
  name: string;
  description: string;
  difficulty: string;
}

const FavoritesScreen: React.FC = () => {
  const [favoriteChallenges, setFavoriteChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { theme } = useTheme();
  const { refresh } = useContext(RefreshContext);

  useEffect(() => {
    const fetchFavoriteChallenges = async () => {
      try {
        // Get the current user
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError || !userData?.user?.id) {
          throw new Error("User not authenticated");
        }

        const userUuid = userData.user.id;

        // Fetch favorite challenges
        const { data, error } = await supabase
          .from("users_challenges")
          .select(
            "id, challenge_id, challenges(id, name, description, difficulty), favorites, user_uuid"
          )
          .eq("user_uuid", userUuid)
          .eq("favorites", true);

        if (error) {
          throw error;
        }

        setFavoriteChallenges(data);
      } catch (error) {
        console.error("Error fetching favorite challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteChallenges();
  }, [refresh]);

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

  if (favoriteChallenges.length === 0) {
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
      {/* App Name */}
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
        renderItem={({ item }) => (
          <UserChallengeItem
            challenge={item.challenges}
            userChallengeId={item.id}
            userUuid={item.user_uuid}
            onRemove={() => {}}
            showUnjoinButton={false}
          />
        )}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20,
          paddingHorizontal: 10,
        }}
        showsVerticalScrollIndicator={true}
      />
    </ScreenContainer>
  );
};

export default FavoritesScreen;
