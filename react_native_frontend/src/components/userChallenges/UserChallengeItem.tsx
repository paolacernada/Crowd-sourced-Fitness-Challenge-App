// src/components/UserChallengeItem.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Challenge } from "@/src/types/Challenge"; // Ensure you have imported the Challenge type
import styles from "@/src/components/ScreenStyles"; // Import your existing styles

interface UserChallengeItemProps {
  challenge: Challenge; // Expecting a Challenge type here
}

const UserChallengeItem: React.FC<UserChallengeItemProps> = ({ challenge }) => {
  return (
    <View style={styles.challengeItem}>
      <Text style={[styles.challengeText, styles.usernameText]}>
        {challenge.name}
      </Text>
      <Text style={styles.challengeText}>{challenge.description}</Text>
      <Text style={styles.challengeText}>
        Difficulty: {challenge.difficulty}
      </Text>
    </View>
  );
};

export default UserChallengeItem;
