import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../src/config/supabaseClient";
import { useTheme } from "../src/context/ThemeContext";
import styles from "../components/ScreenStyles";
import ScreenContainer from "../components/ScreenContainer";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Login Error", error.message);
      setLoading(false);
    } else {
      Alert.alert("Success", "You have logged in!");
      setLoading(false);
      router.push("/tabs");
    }
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
            Sign in
          </Text>
          <TextInput
            placeholder="Email Address"
            placeholderTextColor={theme === "dark" ? "#999" : "#999"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[
              styles.input,
              theme === "dark" ? styles.darkInput : styles.lightInput,
            ]}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={theme === "dark" ? "#999" : "#999"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={[
              styles.input,
              theme === "dark" ? styles.darkInput : styles.lightInput,
            ]}
          />
          <TouchableOpacity
            style={[
              styles.button,
              theme === "dark" ? styles.darkButton : styles.lightButton,
              { width: "45%" },
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text
              style={[
                styles.linkText,
                theme === "dark" ? styles.darkAppName : styles.lightAppName,
              ]}
            >
              Don't have an account? Sign up for FitTogether
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
