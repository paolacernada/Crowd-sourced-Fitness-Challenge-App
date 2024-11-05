import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { supabase } from "../src/config/supabaseClient";
import { ThemeProvider } from "../src/context/ThemeContext";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace("/home");
      } else {
        router.replace("/landing");
      }
    };

    checkSession();
  }, []);

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen
          name="landing"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="profile_screen"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="home" options={{ title: "Home" }} />
      </Stack>
    </ThemeProvider>
  );
}
