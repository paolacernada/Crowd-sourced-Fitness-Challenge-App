import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../redux/slices/favoritesSlice";
import { RootState } from "../redux/store";
import { Ionicons } from "@expo/vector-icons";

interface FavoriteButtonProps {
  challengeId: number;
}

/**
 * FavoriteButton Component
 * Allows users to mark/unmark challenges as favorites.
 *
 * Props:
 * - challengeId: The ID of the challenge to favorite.
 */
const FavoriteButton: React.FC<FavoriteButtonProps> = ({ challengeId }) => {
  const dispatch = useDispatch();
  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );
  const isFavorite = favorites.includes(challengeId);

  /**
   * Handles the press event to toggle favorite status.
   */
  const handlePress = () => {
    if (isFavorite) {
      dispatch(removeFavorite(challengeId));
    } else {
      dispatch(addFavorite(challengeId));
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.button}
      testID="favorite-button"
    >
      <Ionicons
        name={isFavorite ? "heart" : "heart-outline"}
        size={24}
        color={isFavorite ? "red" : "gray"}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
});

export default FavoriteButton;
