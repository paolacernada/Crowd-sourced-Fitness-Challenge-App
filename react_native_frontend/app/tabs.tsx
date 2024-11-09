import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "../src/context/ThemeContext";
import HomeScreen from "./home";
import IndexScreen from "./index";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { theme } = useTheme();
  const activeColor = theme === "dark" ? "#b05600" : "#f48c42";
  const inactiveColor = theme === "dark" ? "#888" : "#ccc";
  const backgroundColor = theme === "dark" ? "#121212" : "#fff";

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: backgroundColor,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home", headerShown: false }}
      />
      <Tab.Screen
        name="Users"
        component={IndexScreen}
        options={{ title: "Users", headerShown: false }}
      />
    </Tab.Navigator>
  );
}
