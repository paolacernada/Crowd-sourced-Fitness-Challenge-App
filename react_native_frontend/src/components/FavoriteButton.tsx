import React, { useState, useEffect, useContext } from "react";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../config/supabaseClient";
import { useTheme } from "../context/ThemeContext";
import { RefreshContext } from "../context/RefreshContext";
import styles from "../components/ScreenStyles";

interface FavoriteButtonProps {
  challengeId: number;
  userUuid: string;
  userChallengeId: number;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  challengeId,
  userUuid,
  userChallengeId,
}) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { theme } = useTheme();
  const { toggleRefresh } = useContext(RefreshContext);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("users_challenges")
          .select("favorites")
          .eq("id", userChallengeId)
          .single();

        if (error) {
          console.error("Error fetching favorite status:", error);
        } else {
          setIsFavorite(data.favorites);
        }
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [userChallengeId]);

  const handlePress = async () => {
    try {
      const newFavoriteStatus = !isFavorite;

      const { error } = await supabase
        .from("users_challenges")
        .update({ favorites: newFavoriteStatus })
        .eq("id", userChallengeId);

      if (error) {
        console.error("Error updating favorite status:", error);
        return;
      }

      // Update the local state
      setIsFavorite(newFavoriteStatus);

      // Trigger refresh for other screens
      toggleRefresh();
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const heartColor = () => {
    if (isFavorite) {
      return theme === "dark" ? "#a1423b" : "red";
    } else {
      return "gray";
    }
  };

  const buttonBackgroundColor = theme === "dark" ? "#605F5E" : "#ECECEC";

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.button,
        {
          backgroundColor: buttonBackgroundColor,
          paddingHorizontal: 20,
          marginBottom: 8,
          width: 200,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
        },
      ]}
      testID="favorite-button"
    >
      <Ionicons
        name={isFavorite ? "heart" : "heart-outline"}
        size={20}
        color={heartColor()}
        style={{ marginRight: 8 }}
      />
      <Text
        style={[
          styles.buttonText,
          { color: theme === "dark" ? "#fff" : "#000", fontSize: 14 },
        ]}
      >
        {isFavorite ? "Remove Favorite" : "Add to Favorites"}
      </Text>
    </TouchableOpacity>
  );
};

export default FavoriteButton;
