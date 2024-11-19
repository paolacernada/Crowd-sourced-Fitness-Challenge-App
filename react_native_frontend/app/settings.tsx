import React, { useState, useEffect } from "react";
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
import { supabase } from "../src/config/supabaseClient";

export default function SettingsScreen() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isDataSharingEnabled, setIsDataSharingEnabled] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setEmail(user.email || "Email");
          const { data, error } = await supabase
            .from("users")
            .select("name")
            .eq("uuid", user.id)
            .single();

          if (!error) {
            setUserName(data.name || "Full Name");
          }

          // PROBLEM: The settings table does not exist, so these calls fail.
          // FUTURE WORK: Create a `settings` table in the database with fields
          // `notifications` and `data_sharing` to store user preferences.
          const { data: settings, error: settingsError } = await supabase
            .from("settings")
            .select("*")
            .eq("user_id", user.id)
            .single();

          if (!settingsError) {
            setIsNotificationsEnabled(settings.notifications || false);
            setIsDataSharingEnabled(settings.data_sharing || false);
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error("Error fetching user details:", err.message);
        } else {
          console.error("Unexpected error:", err);
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleSave = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // PROBLEM: This operation targets a `settings` table that doesn’t exist.
        // FUTURE WORK: Add a `settings` table to store these preferences. Fields
        // should include `user_id`, `notifications` (boolean), and `data_sharing` (boolean).
        // cspell: disable-next-line
        await supabase.from("settings").upsert({
          user_id: user.id,
          notifications: isNotificationsEnabled,
          data_sharing: isDataSharingEnabled,
        });

        // Update user name in the `users` table.
        const { error: updateNameError } = await supabase
          .from("users")
          .update({ name: userName })
          .eq("uuid", user.id);

        if (updateNameError) {
          throw updateNameError;
        }

        // Update user email in Supabase Auth.
        const { error: updateEmailError } = await supabase.auth.updateUser({
          email,
        });

        if (updateEmailError) {
          throw updateEmailError;
        }

        // PROBLEM: The Alert does not always show up.
        // FUTURE WORK: Debug why Alert isn’t firing.
        Alert.alert("Success", "Your changes have been saved successfully!");
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error saving settings:", err.message);
      } else {
        console.error("Unexpected error:", err);
      }
      Alert.alert("Error", "Failed to save settings. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const {
                data: { user },
              } = await supabase.auth.getUser();

              if (user) {
                // PROBLEM: Deleting the user from the `users` table doesn't works, we also need
                // to handle cleanup in related tables (e.g., `settings` if implemented).
                // FUTURE WORK: Set up cascade deletes to remove all related data
                // when a user is deleted.
                await supabase.from("users").delete().eq("uuid", user.id);

                // Log out the user from Supabase Auth.
                const { error: signOutError } = await supabase.auth.signOut();
                if (signOutError) throw signOutError;

                Alert.alert(
                  "Account Deleted",
                  "Your account has been deleted."
                );
              }
            } catch (err) {
              if (err instanceof Error) {
                console.error("Error deleting account:", err.message);
              } else {
                console.error("Unexpected error:", err);
              }
              Alert.alert(
                "Error",
                "Failed to delete account. Please try again."
              );
            }
          },
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
              { width: "60%" },
            ]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          {/* Delete Account */}
          <View style={styles.section}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.smallButton,

                {
                  backgroundColor: theme === "dark" ? "#8B0000" : "red",
                },
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
  ...globalStyles,
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
