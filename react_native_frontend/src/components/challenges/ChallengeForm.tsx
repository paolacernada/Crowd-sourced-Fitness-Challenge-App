import React from "react";
import { TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from "../../components/ScreenStyles";

interface ChallengeFormProps {
  challengeData: { name: string; description: string; difficulty: string };
  setChallengeData: React.Dispatch<React.SetStateAction<any>>;
  theme: string;
}

export const ChallengeForm: React.FC<ChallengeFormProps> = ({
  challengeData,
  setChallengeData,
  theme,
}) => (
  <View>
    <TextInput
      placeholder="Challenge Name"
      value={challengeData.name}
      onChangeText={(text) =>
        setChallengeData({ ...challengeData, name: text })
      }
      style={[
        styles.input,
        theme === "dark" ? styles.darkInput : styles.lightInput,
      ]}
      placeholderTextColor={theme === "dark" ? "#999" : "#666"}
    />
    <TextInput
      placeholder="Challenge Description"
      value={challengeData.description}
      onChangeText={(text) =>
        setChallengeData({ ...challengeData, description: text })
      }
      style={[
        styles.input,
        theme === "dark" ? styles.darkInput : styles.lightInput,
      ]}
      placeholderTextColor={theme === "dark" ? "#999" : "#666"}
    />
    <Picker
      selectedValue={challengeData.difficulty}
      onValueChange={(value: string) =>
        setChallengeData({ ...challengeData, difficulty: value })
      }
      style={[
        styles.input,
        theme === "dark" ? styles.darkPicker : styles.lightPicker,
      ]}
      dropdownIconColor={theme === "dark" ? "#fff" : "#000"}
    >
      <Picker.Item label="Select Difficulty" value="" />
      <Picker.Item label="Easy" value="Easy" />
      <Picker.Item label="Medium" value="Medium" />
      <Picker.Item label="Hard" value="Hard" />
    </Picker>
  </View>
);
