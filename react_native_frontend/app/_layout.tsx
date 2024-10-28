import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { supabase } from "../src/config/supabaseClient";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in when the app starts
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace("/home"); // If the user is logged in, go to the Home screen
      } else {
        router.replace("/login"); // Otherwise, go to the Login screen
      }
    };

    checkSession();
  }, []);

  return (
    <Stack>
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
      <Stack.Screen name="home" options={{ title: "Home" }} />
    </Stack>
  );
}
