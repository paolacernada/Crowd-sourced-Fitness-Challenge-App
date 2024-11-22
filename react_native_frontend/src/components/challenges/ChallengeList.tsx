import React from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import styles from "../ScreenStyles";
import { Challenge } from "../../types/Challenge"; // Adjust the import path based on your folder structure

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
      // keyExtractor={(item) => item.id.toString()}
      keyExtractor={(item) =>
        item.id ? item.id.toString() : item.name || "unknown-id"
      } // Handles cases where the id does or does not exist
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

export default ChallengeList;
