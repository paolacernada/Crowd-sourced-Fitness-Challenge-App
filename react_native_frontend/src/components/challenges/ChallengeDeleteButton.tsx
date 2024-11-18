import React from "react";
import { TouchableOpacity, Text, Alert } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { deleteChallenge } from "../../services/challengeService";
import styles from "../ScreenStyles";

interface ChallengeDeleteButtonProps {
  challengeId: number;
  onDeleted: () => void; // This callback will notify the parent component to refresh the list
}

const ChallengeDeleteButton: React.FC<ChallengeDeleteButtonProps> = ({ challengeId, onDeleted }) => {
  const { theme } = useTheme();

  const handleDelete = async () => {
    try {
      await deleteChallenge(challengeId);
      onDeleted(); // Refresh the challenge list after deletion
      Alert.alert("Success", "Challenge deleted!");
    } catch (error) {
      Alert.alert("Error", "Failed to delete challenge");
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, theme === "dark" ? styles.darkButton : styles.lightButton]}
      onPress={handleDelete}
    >
      <Text style={styles.buttonText}>Delete</Text>
    </TouchableOpacity>
  );
};

export default ChallengeDeleteButton;