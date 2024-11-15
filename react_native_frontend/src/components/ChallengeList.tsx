import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

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
  const renderItem = ({ item }: { item: Challenge }) => (
    <TouchableOpacity
      onPress={() => onChallengeSelect(item.id)}
      style={styles.item}
    >
      <Text style={styles.title}>{item.name}</Text>
      <Text>{item.description}</Text>
      <Text>Difficulty: {item.difficulty}</Text>
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

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontWeight: "bold",
  },
});

export default ChallengeList;
