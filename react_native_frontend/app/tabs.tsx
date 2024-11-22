import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "../src/context/ThemeContext";
import HomeScreen from "./home";
import IndexScreen from "./index";
import DisplayAllChallengesScreen from "./challenges/DisplayAllChallengesScreen";
import SearchChallenges from "./searchChallenges";
import SettingsScreen from "./settings";
import CreateChallengeScreen from "./challenges/CreateChallengeScreen";
import FavoritesScreen from "../src/screens/FavoritesScreen";
import UserChallengesScreen from "../src/screens/UserChallengesScreen";
import { supabase } from "../src/config/supabaseClient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: backgroundColor,
        },
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = "";

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "UserChallenges":
              iconName = focused ? "star" : "star-outline";
              break;
            case "Challenges":
              iconName = focused ? "list" : "list-outline";
              break;
            case "CreateChallenge":
              iconName = focused ? "add-circle" : "add-circle-outline";
              break;
            case "SearchChallenges":
              iconName = focused ? "search" : "search-outline";
              break;
            case "Favorites":
              iconName = focused ? "heart" : "heart-outline";
              break;
            case "Users":
              iconName = focused ? "people" : "people-outline";
              break;
            case "Settings":
              iconName = focused ? "settings" : "settings-outline";
              break;
            case "Logout":
              iconName = focused ? "log-out" : "log-out-outline";
              break;
            default:
              iconName = "ellipse";
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="UserChallenges"
        component={UserChallengesScreen}
        options={{ title: "My Challenges" }}
      />
      <Tab.Screen
        name="Challenges"
        component={DisplayAllChallengesScreen}
        options={{ title: "All Challenges" }}
      />
      <Tab.Screen
        name="CreateChallenge"
        component={CreateChallengeScreen}
        options={{ title: "Create Challenge" }}
      />
      <Tab.Screen
        name="SearchChallenges"
        component={SearchChallenges}
        options={{ title: "Search" }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: "Favorites" }}
      />
      <Tab.Screen
        name="Users"
        component={IndexScreen}
        options={{ title: "Community" }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
