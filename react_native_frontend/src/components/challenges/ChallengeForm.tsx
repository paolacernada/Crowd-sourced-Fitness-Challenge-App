import React from "react";
import { TextInput, View } from "react-native";
import styles from "../../components/ScreenStyles";

interface ChallengeFormProps {
  challengeData: { name: string; description: string; difficulty: string };
  setChallengeData: React.Dispatch<React.SetStateAction<any>>;
  theme: string;
}

export const ChallengeForm: React.FC<ChallengeFormProps> = ({
  challengeData,
  setChallengeData,
  theme,
}) => (
  <View>
    <TextInput
      placeholder="Challenge Name"
      value={challengeData.name}
      onChangeText={(text) => setChallengeData({ ...challengeData, name: text })}
      style={[styles.input, theme === "dark" ? styles.darkInput : styles.lightInput]}
    />
    <TextInput
      placeholder="Challenge Description"
      value={challengeData.description}
      onChangeText={(text) => setChallengeData({ ...challengeData, description: text })}
      style={[styles.input, theme === "dark" ? styles.darkInput : styles.lightInput]}
    />
    <TextInput
      placeholder="Difficulty"
      value={challengeData.difficulty}
      onChangeText={(text) => setChallengeData({ ...challengeData, difficulty: text })}
      style={[styles.input, theme === "dark" ? styles.darkInput : styles.lightInput]}
    />
  </View>
);