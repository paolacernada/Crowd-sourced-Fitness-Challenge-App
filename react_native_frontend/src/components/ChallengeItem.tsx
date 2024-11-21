import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FavoriteButton from "./FavoriteButton";

interface ChallengeItemProps {
  id: number;
  name: string;
  description: string;
}

const ChallengeItem: React.FC<ChallengeItemProps> = ({
  id,
  name,
  description,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <FavoriteButton challengeId={id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});

export default ChallengeItem;
