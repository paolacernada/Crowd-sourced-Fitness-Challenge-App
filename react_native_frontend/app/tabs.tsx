import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "../src/context/ThemeContext";
import HomeScreen from "./home";
import IndexScreen from "./index";
import DisplayAllChallengesScreen from "./challenges/DisplayAllChallengesScreen";
import SearchChallenges from "./searchChallenges";
import SettingsScreen from "./settings";
import CreateChallengeScreen from "./challenges/CreateChallengeScreen";
import { supabase } from "../src/config/supabaseClient";
import { useRouter } from "expo-router";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { theme } = useTheme();
  const activeColor = theme === "dark" ? "#b05600" : "#f48c42";
  const inactiveColor = theme === "dark" ? "#888" : "#ccc";
  const backgroundColor = theme === "dark" ? "#121212" : "#fff";
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/landing");
  };

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
      <Tab.Screen
        name="Challenges"
        component={DisplayAllChallengesScreen}
        options={{ title: "All Challenges", headerShown: false }}
      />
      <Tab.Screen
        name="CreateChallenge"
        component={CreateChallengeScreen}
        options={{
          title: "Create Challenge",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="SearchChallenges"
        component={SearchChallenges}
        options={{ title: "Search", headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings", headerShown: false }}
      />
      <Tab.Screen
        name="Logout"
        component={() => null}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
        options={{
          title: "Logout",
          tabBarStyle: { display: "none" },
        }}
      />
    </Tab.Navigator>
  );
}
