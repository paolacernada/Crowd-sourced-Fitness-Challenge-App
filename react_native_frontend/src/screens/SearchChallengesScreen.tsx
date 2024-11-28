import React, { useState, useEffect, useContext } from "react";
import { ActivityIndicator, View, Text, FlatList, Alert } from "react-native";
import TagFilter from "../components/TagFilter";
import { getChallenges } from "../services/challengeService";
import { useTheme } from "../context/ThemeContext";
import ScreenContainer from "../components/ScreenContainer";
import { Challenge } from "@/src/types/Challenge";
import { RefreshContext } from "../context/RefreshContext";
import styles from "../components/ScreenStyles";

const SearchChallengesScreen: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { refresh } = useContext(RefreshContext);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const data = await getChallenges(selectedTags);
      setChallenges(data.sort((a, b) => a.id - b.id));
    } catch (error) {
      Alert.alert("Error", "Could not fetch challenges. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [selectedTags, refresh]);

  const getBorderColorStyle = (difficulty: string) => {
    if (theme === "dark") {
      return difficulty === "Easy"
        ? styles.darkEasyBorder
        : difficulty === "Medium"
          ? styles.darkMediumBorder
          : styles.darkHardBorder;
    }
    return difficulty === "Easy"
      ? { borderColor: "#4caf50" }
      : difficulty === "Medium"
        ? { borderColor: "#f48c42" }
        : { borderColor: "#f44336" };
  };

  const renderChallenge = ({ item }: { item: Challenge }) => (
    <View
      style={[
        styles.challengeItem,
        theme === "dark" ? styles.darkForm : styles.lightForm,
        getBorderColorStyle(item.difficulty),
      ]}
    >
      <Text
        style={[
          styles.challengeText,
          theme === "dark" ? styles.darkText : styles.lightText,
          { fontWeight: "bold", fontSize: 18, marginBottom: 8 },
        ]}
      >
        {item.name}
      </Text>
      <Text
        style={[
          styles.challengeText,
          theme === "dark" ? styles.darkText : styles.lightText,
          { fontSize: 14, marginBottom: 6 },
        ]}
      >
        Difficulty: {item.difficulty}
      </Text>
      <Text
        style={[
          styles.challengeText,
          theme === "dark" ? styles.darkText : styles.lightText,
          { fontSize: 14, marginBottom: 16 },
        ]}
      >
        {item.description}
      </Text>
    </View>
  );

  return (
    <ScreenContainer>
      {/* App Name */}
      <Text
        style={[
          styles.appName,
          theme === "dark" ? styles.darkAppName : styles.lightAppName,
        ]}
      >
        FitTogether Challenges
      </Text>

      {/* Title */}
      <Text
        style={[
          styles.title,
          theme === "dark" ? styles.darkText : styles.lightText,
        ]}
      >
        Search Challenges by Tags
      </Text>

      {/* Tag Filter */}
      <View style={{ marginBottom: 10, paddingHorizontal: 16 }}>
        <TagFilter
          selectedTags={selectedTags}
          onSelectedTagsChange={setSelectedTags}
        />
      </View>

      {/* Challenge List */}
      {loading ? (
        <ActivityIndicator size="large" color="#f48c42" />
      ) : (
        <FlatList
          data={challenges}
          renderItem={renderChallenge}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.challengeListContainer}
          ListEmptyComponent={
            <Text
              style={[
                styles.noDataText,
                theme === "dark" ? styles.darkText : styles.lightText,
              ]}
            >
              No challenges found.
            </Text>
          }
        />
      )}
    </ScreenContainer>
  );
};

export default SearchChallengesScreen;
