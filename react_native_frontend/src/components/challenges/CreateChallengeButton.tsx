import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "../../components/ScreenStyles";

interface CreateChallengeButtonProps {
  loading: boolean;
  onPress: () => void;
  theme: string;
}

export const CreateChallengeButton: React.FC<CreateChallengeButtonProps> = ({
  loading,
  onPress,
  theme,
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      theme === "dark" ? styles.darkButton : styles.lightButton,
    ]}
    onPress={onPress}
    disabled={loading}
  >
    <Text style={styles.buttonText}>
      {loading ? "Creating..." : "Create Challenge"}
    </Text>
  </TouchableOpacity>
);
