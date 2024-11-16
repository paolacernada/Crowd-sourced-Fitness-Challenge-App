import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import ScreenContainer from "../src/components/ScreenContainer";
import globalStyles from "../src/components/ScreenStyles";
import { useTheme } from "../src/context/ThemeContext";

export default function SettingsScreen() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isDataSharingEnabled, setIsDataSharingEnabled] = useState(false);
  const [userName, setUserName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const { theme, toggleTheme } = useTheme();

  const handleSave = () => {
    Alert.alert("Settings Saved", "Your changes have been saved successfully!");
  };

  const handleLogout = () => {
    Alert.alert("Logged Out", "You have been logged out.");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => console.log("Account Deleted"),
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
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

          {/* Profile Section */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                theme === "dark" ? styles.darkText : styles.lightText,
              ]}
            >
              Profile
            </Text>
            <TextInput
              style={[
                styles.input,
                theme === "dark" ? styles.darkInput : styles.lightInput,
              ]}
              value={userName}
              onChangeText={setUserName}
              placeholder="Name"
              placeholderTextColor={theme === "dark" ? "#888" : "#ccc"}
            />
            <TextInput
              style={[
                styles.input,
                theme === "dark" ? styles.darkInput : styles.lightInput,
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              placeholderTextColor={theme === "dark" ? "#888" : "#ccc"}
            />
          </View>

          {/* Notification Preferences */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                theme === "dark" ? styles.darkText : styles.lightText,
              ]}
            >
              Notifications
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
                onValueChange={() => setIsNotificationsEnabled((prev) => !prev)}
                value={isNotificationsEnabled}
              />
            </View>
          </View>

          {/* Privacy Settings */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                theme === "dark" ? styles.darkText : styles.lightText,
              ]}
            >
              Privacy
            </Text>
            <View style={styles.setting}>
              <Text
                style={[
                  styles.labelText,
                  theme === "dark" ? styles.darkText : styles.lightText,
                ]}
              >
                Enable Data Sharing
              </Text>
              <Switch
                trackColor={{ false: "#ccc", true: "#333" }}
                thumbColor="#f48c42"
                onValueChange={() => setIsDataSharingEnabled((prev) => !prev)}
                value={isDataSharingEnabled}
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.button,
              theme === "dark" ? styles.darkButton : styles.lightButton,
            ]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          {/* Account Management */}
          <View style={styles.section}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.smallButton,
                { backgroundColor: "red" },
              ]}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.smallButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  ...globalStyles, // Inherit global styles
  appName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 6,
    fontSize: 14,
  },
  section: {
    marginBottom: 15,
    width: "100%",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: "center",
  },
  smallButton: {
    marginBottom: -16,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  smallButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
});
