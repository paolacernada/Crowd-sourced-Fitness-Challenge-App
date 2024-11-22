import React, { useState, useEffect } from "react";
import { Text, ActivityIndicator, View } from "react-native";
import { supabase } from "../src/config/supabaseClient";
import { useTheme } from "../src/context/ThemeContext";
import ScreenContainer from "../src/components/ScreenContainer";
import styles from "../src/components/ScreenStyles";

export default function IndexScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator
          size="large"
          color={theme === "dark" ? "#fff" : "#f48c42"}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
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
          FitTogether Users
        </Text>
        {users.map((user, index) => (
          <Text
            key={index}
            style={[
              styles.usernameText,
              theme === "dark" ? styles.darkText : styles.lightText,
            ]}
          >
            {user.name}
          </Text>
        ))}
      </View>
    </ScreenContainer>
  );
}
