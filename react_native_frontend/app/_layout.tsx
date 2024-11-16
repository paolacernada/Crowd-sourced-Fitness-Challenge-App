import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { supabase } from "../src/config/supabaseClient";
import { ThemeProvider } from "../src/context/ThemeContext";

export default function RootLayout() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialRoute, setInitialRoute] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setIsAuthenticated(true);
        setInitialRoute("tabs"); // Redirect to tabs if logged in
        router.replace("/tabs"); // Ensure proper navigation
      } else {
        setIsAuthenticated(false);
        setInitialRoute("landing"); // Redirect to landing if not logged in
        router.replace("/landing");
      }
    };

    checkSession();
  }, [router]);

  // Avoid rendering the layout until the initial route is determined
  if (initialRoute === "") {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRoute}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="landing" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
          </>
        ) : (
          <>
            <Stack.Screen name="tabs" />
            <Stack.Screen name="searchChallenges" />
            <Stack.Screen name="challengeDetails" />
          </>
        )}
      </Stack>
    </ThemeProvider>
  );
}
