import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";
import { fetchUserProfile } from "../src/services/userService";

interface Profile {
  id: number;
  name: string;
  registration_date: string;
  email: string | null;  
}

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { userId = "2"} = useLocalSearchParams();
  const { theme } = useTheme();


  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userId) return;
  
      try {
        const userIdNumber = parseInt(userId as string, 10);
        const profile = await fetchUserProfile(userIdNumber);
        setUserProfile(profile);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    loadUserProfile();
  }, [userId]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color={theme === "dark" ? "#fff" : "#000"} />
    );
  }

  if (!userProfile) {
    return <Text style={{ color: theme === "dark" ? "#fff" : "#000" }}>No user profile found.</Text>;
  }

  return (
    <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.appName, theme === "dark" ? styles.darkAppName : styles.lightAppName]}>
        FitTogether Challenges
      </Text>
      <View style={[styles.formContainer, theme === "dark" ? styles.darkForm : styles.lightForm]}>
        <Text style={[styles.title, theme === "dark" ? styles.darkText : styles.lightText]}>
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
        <TouchableOpacity style={[styles.button, theme === "dark" ? styles.darkButton : styles.lightButton]}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  lightContainer: {
    backgroundColor: "#f7f9fc",
  },
  appName: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  darkAppName: {
    color: "#b05600",
  },
  lightAppName: {
    color: "#f48c42",
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#000",
  },
  formContainer: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  darkForm: {
    backgroundColor: "#333",
  },
  lightForm: {
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#f48c42",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  darkButton: {
    backgroundColor: "#4d4d4d",
  },
  lightButton: {
    backgroundColor: "#f48c42",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
