import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";
import { fetchUserProfile } from "../src/services/userService";
import styles from "../src/components/ScreenStyles";
interface Profile {
  id: number;
  name: string;
  registration_date: string;
}

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useLocalSearchParams();
  const { theme } = useTheme();

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userId) return;

      try {
        console.log(userId);
        const userIdNumber = parseInt(userId as string, 10);
        const profile = await fetchUserProfile(userIdNumber);
        setUserProfile(profile);
      } catch {
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={theme === "dark" ? "#fff" : "#000"}
      />
    );
  }
  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!userProfile) {
    return (
      <Text style={{ color: theme === "dark" ? "#fff" : "#000" }}>
        No user profile found.
      </Text>
    );
  }

  return (
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
        ]}
      >
        <Text
          style={[
            styles.title,
            theme === "dark" ? styles.darkText : styles.lightText,
          ]}
        >
          User Profile
        </Text>
        <Text style={theme === "dark" ? styles.darkText : styles.lightText}>
          ID: {userProfile.id}
        </Text>
        <Text style={theme === "dark" ? styles.darkText : styles.lightText}>
          Username: {userProfile.name}
        </Text>
        <Text style={theme === "dark" ? styles.darkText : styles.lightText}>
          Created At: {userProfile.registration_date}
        </Text>
        <TouchableOpacity
          style={[
            styles.button,
            theme === "dark" ? styles.darkButton : styles.lightButton,
          ]}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
