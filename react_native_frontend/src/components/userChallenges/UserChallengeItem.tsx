import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Challenge } from "@/src/types/Challenge";
import styles from "@/src/components/ScreenStyles";
import FavoriteButton from "../FavoriteButton";
import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

// The user UUID is later used to return that user's challenges (db user_id is needed)
interface UserChallengeItemProps {
  userChallenge: {
    id: number;
    user_uuid: string;
    challenge_id: number;
    completed: boolean;
    favorites: boolean;
    challenges: Challenge;
  };
  challenge: Challenge;
  onRemove: (id: number) => void;
}

const UserChallengeItem: React.FC<UserChallengeItemProps> = ({
  userChallenge,
  challenge,
  onRemove,
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

  // Remove button handler with confirmation prompt
  // TODO: confirmation prompt isn't working at all
  const handleRemove = (id: number) => {
    // console.log("Attempting to remove userChallenge with ID:", id);
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to remove this challenge? It will reset your progress.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            // console.log("Confirm deletion, calling onRemove with ID:", id);
            onRemove(id); // Pass ID parent handler
          },
        },
      ],
      { cancelable: false }
    );
  };

  // debugging:
  // console.log("UserChallenge data:", userChallenge);
  // console.log("Challenge data:", challenge);

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

        {/* Remove Button */}
        <TouchableOpacity
          style={styles.button} // note: I just used the neutral button style
          onPress={() => {
            if (userChallenge.id) {
              // console.log("Attempting to remove userChallenge with ID:", userChallenge.id);
              // console.log("Calling handleRemove() with ID:", userChallenge.id);
              onRemove(userChallenge.id);
            } else {
              console.warn("UserChallenge ID is missing!");
            }
          }}
        >
          <Ionicons
            name="close"
            size={24}
            color={theme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>
      </View>
      <FavoriteButton challengeId={challenge.id} />
    </View>
  );
};

export default UserChallengeItem;
