import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Challenge } from "@/src/types/Challenge";
import styles from "@/src/components/ScreenStyles";
import FavoriteButton from "../FavoriteButton";
import { useTheme } from "@/src/context/ThemeContext";

// The user UUID is later used to return that user's challenges (db user_id is needed)
interface UserChallengeItemProps {
  challenge: Challenge;
  userChallengeId: number;
  userUuid: string;
  onRemove: (userChallengeId: number) => void;
  showUnjoinButton?: boolean;
}

const UserChallengeItem: React.FC<UserChallengeItemProps> = ({
  challenge,
  userChallengeId,
  userUuid,
  onRemove,
  showUnjoinButton = true,
}) => {
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
          padding: 16,
          marginBottom: 20,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: getBorderColor(challenge.difficulty),
        },
      ]}
    >
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

      <FavoriteButton
        challengeId={challenge.id}
        userUuid={userUuid}
        userChallengeId={userChallengeId}
      />

      {/* Unjoin Button */}
      {showUnjoinButton && (
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={[
              styles.button,
              theme === "dark" ? styles.darkButton : styles.lightButton,
              {
                width: "70%",
                marginTop: 8,
                marginBottom: -2,
                paddingHorizontal: 20,
              },
            ]}
            onPress={() => onRemove(userChallengeId)}
          >
            <Text style={[styles.buttonText, { color: "#fff" }]}>
              Unjoin Challenge
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default UserChallengeItem;
