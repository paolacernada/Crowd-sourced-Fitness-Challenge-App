import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Challenge } from "@/src/types/Challenge";
import styles from "@/src/components/ScreenStyles";
import FavoriteButton from "../FavoriteButton";
import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

interface UserChallengeItemProps {
  challenge: Challenge;
  onRemove: (id: number) => void;
}

const UserChallengeItem: React.FC<UserChallengeItemProps> = ({ challenge, onRemove }) => {
  const { theme } = useTheme();

  // Border color based on difficulty
  const getBorderColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return theme === "dark" ? "#306b33" : "#4caf50";
      case "Medium":
        return theme === "dark" ? "#b05600" : "#f48c42";
      case "Hard":
        return theme === "dark" ? "#a1423b" : "#f44336";
      default:
        return theme === "dark" ? "#b05600" : "#f48c42";
    }
  };

  return (
    <View
      style={[
        styles.challengeItem,
        theme === "dark" ? styles.darkForm : styles.lightForm,
        {
          borderColor: getBorderColor(challenge.difficulty),
        },
      ]}
    >
      <View style={styles.infoContainer}>
        <Text
          style={[
            styles.challengeText,
            theme === "dark" ? styles.darkText : styles.lightText,
            { fontWeight: "bold", fontSize: 18, marginBottom: 8 },
          ]}
        >
          {challenge.name}
        </Text>
        <Text
          style={[
            styles.challengeText,
            theme === "dark" ? styles.darkText : styles.lightText,
            { fontSize: 14, marginBottom: 6 },
          ]}
        >
          Difficulty: {challenge.difficulty}
        </Text>
        <Text
          style={[
            styles.challengeText,
            theme === "dark" ? styles.darkText : styles.lightText,
            { fontSize: 14, marginBottom: 16 },
          ]}
        >
          {challenge.description}
        </Text>
      </View>
      <FavoriteButton challengeId={challenge.id} />
    </View>
  );
};

export default UserChallengeItem;
