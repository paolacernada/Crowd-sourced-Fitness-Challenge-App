import React, { useState, useEffect } from "react";
import { FlatList, Text, ActivityIndicator, Alert } from "react-native";
import { getUserChallenges } from "@/src/services/userChallengeService";
import UserChallengeItem from "./UserChallengeItem";
import styles from "../ScreenStyles";
import { UserChallenge } from "@/src/types/UserChallenge";

interface UserChallengesListProps {
  userUuid: string;
  onRemove: (userChallengeId: number) => void; // Pass the remove handler as a prop
}

const UserChallengesList: React.FC<UserChallengesListProps> = ({
  userUuid,
  onRemove,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [challenges, setChallenges] = useState<UserChallenge[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching challenges for user:", userUuid);
        const userChallenges = await getUserChallenges(userUuid);
        console.log("Fetched challenges:", userChallenges);
        setChallenges(userChallenges);
      } catch (error) {
        console.error("Error fetching challenges:", error);
        setError("Failed to load challenges.");
        Alert.alert(
          "Error",
          "Could not fetch your challenges. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (userUuid) {
      fetchChallenges();
    }
  }, [userUuid]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#f48c42"
        style={{ marginTop: 20 }}
      />
    );
  }

  if (error) {
    return (
      <Text style={[styles.errorText, { textAlign: "center" }]}>{error}</Text>
    );
  }

  if (challenges.length === 0) {
    return (
      <Text style={[styles.errorText, { textAlign: "center" }]}>
        You are not part of any challenges yet.
      </Text>
    );
  }

  return (
    <FlatList
      data={challenges}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <UserChallengeItem
          userChallenge={item} // This gets flagged, but is working. The underlying error is a non-fatal one we should fix eventually (but not prioritize for now)
          challenge={item.challenges}
          onRemove={onRemove} // To pass the remove handler function // note: this is where I'm having trouble
        />
      )}
      contentContainerStyle={{
        paddingBottom: 20,
        paddingHorizontal: 16,
      }}
    />
  );
};

export default UserChallengesList;
