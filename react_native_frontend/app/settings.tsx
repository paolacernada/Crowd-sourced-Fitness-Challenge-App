import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../src/context/ThemeContext";
import styles from "../components/ScreenStyles";

export default function SettingsScreen() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [username] = useState("");
  const { theme, toggleTheme } = useTheme();
  const toggleSwitch = () =>
    setIsNotificationsEnabled((previousState) => !previousState);

  const handleSave = () => {
    // Logic to save settings can be implemented here
    console.log("Saved settings:", { username, isNotificationsEnabled });
  };

  return (
    <View
      style={[
        styles.container,
        theme === "dark" ? styles.darkContainer : styles.lightContainer,
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
        <Text style={[theme === "dark" ? styles.darkText : styles.lightText]}>
          Enable Notifications
        </Text>
        <Switch
          value={isNotificationsEnabled}
          onValueChange={toggleSwitch}
          thumbColor={theme === "dark" ? "#fff" : "#f48c42"}
          trackColor={{ false: "#ccc", true: "#333" }}
        />
      </View>

      <View style={styles.setting}>
        <Text style={[theme === "dark" ? styles.darkText : styles.lightText]}>
          Enable Darkmode
        </Text>
        <Switch
          value={theme === "dark"}
          onValueChange={toggleTheme}
          thumbColor={theme === "dark" ? "#fff" : "#f48c42"}
          trackColor={{ false: "#ccc", true: "#333" }}
        />
      </View>

      <Button title="Save Settings" onPress={handleSave} />
    </View>
  );
}
