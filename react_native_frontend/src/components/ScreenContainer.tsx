import React, { ReactNode } from "react";
import { View, Switch } from "react-native";
import { useTheme } from "../context/ThemeContext";
import styles from "./ScreenStyles";

interface ScreenContainerProps {
  children: ReactNode;
}

export default function ScreenContainer({ children }: ScreenContainerProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        theme === "dark" ? styles.darkContainer : styles.lightContainer,
      ]}
    >
      <View style={styles.toggleContainer}>
        <Switch
          value={theme === "dark"}
          onValueChange={toggleTheme}
          thumbColor={theme === "dark" ? "#fff" : "#f48c42"}
          trackColor={{ false: "#ccc", true: "#333" }}
        />
      </View>

      {/* Main Content */}
      {children}
    </View>
  );
}
