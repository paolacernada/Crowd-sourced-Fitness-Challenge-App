import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, Button } from "react-native";
import styles from "../components/ScreenStyles";
import ScreenContainer from "@/components/ScreenContainer";
import { useTheme } from "../src/context/ThemeContext";

export default function SettingsScreen() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const toggleSwitch = () =>
    setIsNotificationsEnabled((previousState) => !previousState);
  const { theme } = useTheme();

  const handleSave = () => {
    console.log("Saved settings:", { isNotificationsEnabled });
    // Logic to save settings can be implemented here
  };

  return (
    <ScreenContainer>
      <View
        style={[
          styles.container,
          theme === "dark" ? styles.darkContainer : styles.lightContainer,
        ]}
      >
        <Text
          style={[
            styles.appName,
            theme === "dark" ? styles.darkAppName : styles.lightAppName,
          ]}
        >
          FitTogether Challenges
        </Text>

        <View
          style={[
            styles.formContainer,
            theme === "dark" ? styles.darkForm : styles.lightForm,
            { alignItems: "center", paddingVertical: 20 },
          ]}
        >
          <Text
            style={[
              styles.title,
              theme === "dark" ? styles.darkText : styles.lightText,
            ]}
          >
            Settings
          </Text>
          <View style={styles.setting}>
            <Text
              style={[
                styles.labelText,
                theme === "dark" ? styles.darkText : styles.lightText,
              ]}
            >
              Enable Notifications
            </Text>
            <Switch
              trackColor={{ false: "#ccc", true: "#333" }}
              thumbColor="#f48c42"
              onValueChange={toggleSwitch}
              value={isNotificationsEnabled}
            />
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            theme === "dark" ? styles.darkButton : styles.lightButton,
            { width: "45%" },
          ]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
