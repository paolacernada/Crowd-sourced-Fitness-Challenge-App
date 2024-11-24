import React from "react";
import { FlatList, Text } from "react-native";
import { CompletedChallenge } from "@/src/types/CompletedChallenge";
import WallOfFameItem from "./WallOfFameItem";
import styles from "../ScreenStyles";

interface CompletedChallengesListProps {
  challenges: CompletedChallenge[]; // Define challenges as array of CompletedChallenge objects
}

const CompletedChallengesList: React.FC<CompletedChallengesListProps> = ({
  challenges,
}) => {
  // Debug: Log challenges array (to check that it's passed correctly)
  // console.log("CompletedChallengesList challenges:", challenges);

  return (
    <>
      {challenges.length === 0 ? (
        <Text style={styles.errorText}>
          There are no completed challenges yet.
        </Text>
      ) : (
        <FlatList
          data={challenges}
          keyExtractor={(item) => item.user_challenge_id.toString()} // Use user_challenge_id is the unique key
          renderItem={({ item }) => <WallOfFameItem challenge={item} />} // Render each completed challenge item
          contentContainerStyle={{
            paddingBottom: 20,
            paddingHorizontal: 16,
          }}
        />
      )}
    </>
  );
};

export default CompletedChallengesList;
