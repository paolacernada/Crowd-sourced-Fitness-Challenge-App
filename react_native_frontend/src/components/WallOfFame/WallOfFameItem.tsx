import React from "react";
import { View, Text } from "react-native";
import { CompletedChallenge } from "@/src/types/CompletedChallenge";
import styles from "@/src/components/ScreenStyles";
import { useTheme } from "@/src/context/ThemeContext";

interface WallOfFameItemProps {
  challenge: CompletedChallenge; // Expecting a CompletedChallenge type here
}

const WallOfFameItem: React.FC<WallOfFameItemProps> = ({ challenge }) => {
  //  console.log("Rendering WallOfFameItem with challenge:", challenge); // For debugging

  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.challengeItem,
        theme === "dark" ? styles.darkForm : styles.lightForm,
      ]}
    >
      <View style={styles.infoContainer}>
        <Text
          style={[
            styles.challengeText,
            theme === "dark" ? styles.darkText : styles.lightText,
            { fontWeight: "bold", fontSize: 18, marginBottom: 8 },
          ]}
        >
          {challenge.challenge_name} {/* Displays Challenge name */}
        </Text>
        <Text
          style={[
            styles.challengeText,
            theme === "dark" ? styles.darkText : styles.lightText,
            { fontSize: 14, marginBottom: 6 },
          ]}
        >
          Completed by: {challenge.user_name} {/* Displays User name */}
        </Text>
      </View>
    </View>
  );
};

export default WallOfFameItem;
