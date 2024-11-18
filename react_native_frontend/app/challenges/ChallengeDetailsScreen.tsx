import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { getChallengeById } from "../../src/services/challengeService";

const ChallengeDetailsScreen = ({ route }: any) => {
  const { challengeId } = route.params;
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchChallengeDetails = async () => {
    setLoading(true);
    try {
      const data = await getChallengeById(challengeId);
      setChallenge(data);
    } catch (error) {
      console.error("Error fetching challenge details:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChallengeDetails();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!challenge) {
    return <Text>Challenge not found</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{challenge.name}</Text>
      <Text>{challenge.description}</Text>
      <Text>Difficulty: {challenge.difficulty}</Text>
      {/* Possibly add more details such as goals, tags, etc. */}
    </View>
  );
};

export default ChallengeDetailsScreen;
