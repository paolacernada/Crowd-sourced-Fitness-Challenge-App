import React, { useState, useEffect } from "react";
import { FlatList, Text, ActivityIndicator } from "react-native";
import { getUserChallenges } from "@/src/services/userChallengeService"; // Import your service
import UserChallengeItem from "./UserChallengeItem"; // Import your item component
import styles from "../ScreenStyles"; // Import your styles
import { UserChallenge } from "@/src/types/UserChallenge"; // Import UserChallenge type

interface UserChallengesListProps {
  userUuid: string; // Update prop name to userUuid
}

const UserChallengesList: React.FC<UserChallengesListProps> = ({
  userUuid,
}) => {
  // Use userUuid here
  const [loading, setLoading] = useState<boolean>(false);
  const [challenges, setChallenges] = useState<UserChallenge[]>([]); // Use UserChallenge[] type

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      try {
        const userChallenges = await getUserChallenges(userUuid); // Pass userUuid instead of userId
        setChallenges(userChallenges); // Store UserChallenge[] in state
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userUuid) {
      fetchChallenges();
    }
  }, [userUuid]);

  if (loading) {
    return <ActivityIndicator size="large" color="#f48c42" />;
  }

  if (challenges.length === 0) {
    return (
      <Text style={styles.errorText}>
        You are not part of any challenges yet.
      </Text>
    );
  }

  return (
    <FlatList
      data={challenges}
      keyExtractor={(item) => item.id.toString()} // Extract key from UserChallenge id
      renderItem={({ item }) => (
        // Pass the 'challenges' object to the UserChallengeItem component
        <UserChallengeItem challenge={item.challenges} />
      )}
      contentContainerStyle={styles.challengeListContainer}
    />
  );
};

export default UserChallengesList;
