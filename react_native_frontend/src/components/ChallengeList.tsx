import React from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";
import styles from "./ScreenStyles";

interface Challenge {
  id: number;
  name: string;
  description: string;
  difficulty: string;
}

interface ChallengeListProps {
  challenges: Challenge[];
  onChallengeSelect: (challengeId: number) => void;
}

const ChallengeList: React.FC<ChallengeListProps> = ({
  challenges,
  onChallengeSelect,
}) => {
  const { theme } = useTheme();

  const renderItem = ({ item }: { item: Challenge }) => (
    <TouchableOpacity
      onPress={() => onChallengeSelect(item.id)}
      style={[
        styles.formContainer,
        theme === "dark" ? styles.darkForm : styles.lightForm,
      ]}
    >
      <Text
        style={[
          styles.title,
          theme === "dark" ? styles.darkText : styles.lightText,
        ]}
      >
        {item.name}
      </Text>
      <Text style={theme === "dark" ? styles.darkText : styles.lightText}>
        {item.description}
      </Text>
      <Text style={theme === "dark" ? styles.darkText : styles.lightText}>
        Difficulty: {item.difficulty}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={challenges}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

export default ChallengeList;
