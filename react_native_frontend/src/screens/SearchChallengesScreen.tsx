import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import TagFilter from "../components/TagFilter";
import ChallengeList from "../components/ChallengeList";
import { getChallenges } from "../services/challengeService";
import { useRouter } from "expo-router";

const SearchChallengesScreen: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    router.push({ pathname: "/challengeDetails", params: { challengeId } });
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
