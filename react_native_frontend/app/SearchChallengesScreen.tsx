import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import ChallengeList from "../src/components/ChallengeList";
import TagFilter from "../src/components/TagFilter";
import { getChallenges } from "../src/services/challengeService";

const SearchChallengesScreen = ({ navigation }: any) => {
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const data = await getChallenges(selectedTags);
      setChallenges(data);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchChallenges();
  }, [selectedTags]);

  const handleChallengeSelect = (challengeId: number) => {
    navigation.navigate("ChallengeDetails", { challengeId });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TagFilter
        selectedTags={selectedTags}
        onSelectedTagsChange={setSelectedTags}
      />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <ChallengeList
          challenges={challenges}
          onChallengeSelect={handleChallengeSelect}
        />
      )}
    </View>
  );
};

export default SearchChallengesScreen;
