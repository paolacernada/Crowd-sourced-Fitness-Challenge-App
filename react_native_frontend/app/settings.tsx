import React, { useState } from "react";
import { View, Text, Switch, Button } from "react-native";
import styles from "../components/ScreenStyles";

export default function SettingsScreen() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const toggleSwitch = () =>
    setIsNotificationsEnabled((previousState) => !previousState);

  const handleSave = () => {
    console.log("Saved settings:", { isNotificationsEnabled });
    // Logic to save settings can be implemented here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.setting}>
        <Text>Enable Notifications</Text>
        <Switch
          value={isNotificationsEnabled}
          onValueChange={toggleSwitch}
          thumbColor="#f48c42"
          trackColor={{ false: "#ccc", true: "#333" }}
        />
      </View>

      <Button title="Save Settings" onPress={handleSave} />
    </View>
  );
}
