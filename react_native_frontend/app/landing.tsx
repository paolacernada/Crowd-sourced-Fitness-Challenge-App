import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";
import styles from "../src/components/ScreenStyles";
import ScreenContainer from "../src/components/ScreenContainer";

export default function LandingScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  return (
    <ScreenContainer>
      <Switch
        style={styles.toggleContainer}
        value={theme === "dark"}
        onValueChange={toggleTheme}
        thumbColor={theme === "dark" ? "#fff" : "#f48c42"}
        trackColor={{ false: "#ccc", true: "#333" }}
      />

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
          Your next challenge awaits!
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            theme === "dark" ? styles.darkButton : styles.lightButton,
            { marginVertical: 8, width: "35%" },
          ]}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            theme === "dark" ? styles.darkButton : styles.lightButton,
            { marginVertical: 12, width: "45%" },
          ]}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
