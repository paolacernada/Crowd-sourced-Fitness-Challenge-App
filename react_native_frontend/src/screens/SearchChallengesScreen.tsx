import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import TagFilter from "../components/TagFilter";
import ChallengeList from "../components/challenges/ChallengeList";
import { getChallenges } from "../services/challengeService";
import { useTheme } from "../context/ThemeContext";
import ScreenContainer from "../components/ScreenContainer";
import { useRouter } from "expo-router";
import styles from "../components/ScreenStyles";

const SearchChallengesScreen: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
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

  return (
    <ScreenContainer>
      {/* Title */}
      <Text
        style={[
          styles.title,
          theme === "dark" ? styles.darkAppName : styles.lightAppName,
        ]}
      >
        FitTogether Challenges
      </Text>

      {/* Content Container */}
      <View
        style={[
          styles.formContainer,
          theme === "dark" ? styles.darkForm : styles.lightForm,
        ]}
      >
        {/* Tag Filter */}
        <TagFilter
          selectedTags={selectedTags}
          onSelectedTagsChange={setSelectedTags}
        />

        {/* Loading Indicator or Challenge List */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme === "dark" ? "#fff" : "#f48c42"}
            style={{ marginTop: 20 }}
          />
        ) : (
          <ChallengeList
            challenges={challenges}
            onChallengeSelect={(challengeId) =>
              router.push({
                pathname: "/challengeDetails",
                params: { challengeId },
              })
            }
          />
        )}
      </View>
    </ScreenContainer>
  );
};

export default SearchChallengesScreen;
