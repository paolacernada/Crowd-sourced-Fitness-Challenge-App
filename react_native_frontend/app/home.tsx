import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { supabase } from "../src/config/supabaseClient";
// import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../src/context/ThemeContext";
import styles from "../src/components/ScreenStyles";
import ScreenContainer from "../src/components/ScreenContainer";
import { ROUTES } from "../src/config/routes";
import UserChallengesList from "@/src/components/userChallenges/UserChallengesList";

export default function HomeScreen() {
  // const [loading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // error state
  const [userUuid, setUserUuid] = useState<string | null>(null); // userUuid state (instead of userId)
  const navigation = useNavigation();
  const { theme } = useTheme();
  // const router = useRouter();

  // Fetch user data (userUuid) when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching

      try {
        // Fetch the user data from Supabase Auth to get the user UUID
        const { data, error: authError } = await supabase.auth.getUser();
        console.log("Fetched user data:", data); // Log user data for debugging

        if (authError || !data?.user?.id) {
          setError("User not authenticated or unable to fetch user data.");
          console.log("Auth Error: ", authError); // Log authError if it exists
          return;
        }

        const userUuid = data.user.id; // Get the authenticated user UUID
        setUserUuid(userUuid); // Set userUuid in state
        console.log("User UUID from Supabase Auth:", userUuid); // Log the UUID being used
      } catch (err) {
        console.error("Error fetching user data:", err); // Log error details
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Only run once when component mounts

  // Fetch challenges once userId is set
  useEffect(() => {
    const fetchUserChallenges = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null); // Reset error state before fetching

      try {
        const response = await getUserChallenges(userId); // Assuming this function makes the API call
        console.log("Challenges response:", response); // Log the response
        if ("error" in response) { // Check if error is in the response
          if (typeof response.error === "string") {
            setError(response.error); // If error exists, set the error message
          } else {
            setError("An unknown error occurred.");
          }
        } else {
          setChallenges(response); // Store the fetched challenges
        }
      } catch (err) {
        console.error("Error fetching user challenges:", err);
        setError("Failed to load user challenges.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserChallenges();
  }, [userId]); // This effect runs when userId is set

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace("landing");
  };

  return (
    <ScreenContainer>
      {/* App name */}
      <Text
        style={[
          styles.appName,
          theme === "dark" ? styles.darkAppName : styles.lightAppName,
        ]}
      >
        FitTogether Challenges
      </Text>

      {/* Show error if there is one */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Show loading message */}
      {loading ? (
        <Text>Loading user data...</Text>
      ) : (
        userUuid && <UserChallengesList userUuid={userUuid} /> // Pass userUuid to the list component for fetching challenges
      )}

      {/* Form container */}
      <View
        style={[
          styles.formContainer,
          theme === "dark" ? styles.darkForm : styles.lightForm,
          { paddingVertical: 20 },
        ]}
      >
        {/* Page title */}
        <Text
          style={[
            styles.title,
            theme === "dark" ? styles.darkText : styles.lightText,
            { marginBottom: 20 },
          ]}
        >
          Start Your Journey
        </Text>

        {/* Buttons */}
        <TouchableOpacity
          style={[
            styles.button,
            theme === "dark" ? styles.darkButton : styles.lightButton,
            { width: "70%", marginBottom: 14, marginTop: 5 },
          ]}
          onPress={() => navigation.navigate("Challenges")}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "View Challenges..." : "View Existing Challenges"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            theme === "dark" ? styles.darkButton : styles.lightButton,
            { width: "70%", marginBottom: 14 },
          ]}
          onPress={() => navigation.navigate("CreateChallenge")}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Create Challenge..." : "Create a New Challenge"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            theme === "dark" ? styles.darkButton : styles.lightButton,
            { width: "35%", marginBottom: 4, marginTop: 10 },
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

// import React, { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import { supabase } from "../src/config/supabaseClient";
// import { useRouter } from "expo-router";
// import { useTheme } from "../src/context/ThemeContext";
// import styles from "../src/components/ScreenStyles";
// import ScreenContainer from "../src/components/ScreenContainer";
// import { ROUTES } from "../src/config/routes";
// import UserChallengesList from "@/src/components/userChallenges/UserChallengesList";

// export default function HomeScreen() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null); // error state
//   const [userUuid, setUserUuid] = useState<string | null>(null); // userUuid state (instead of userId)
//   const { theme } = useTheme();
//   const router = useRouter();

//   // Fetch user data (userUuid) when the component mounts
//   useEffect(() => {
//     const fetchUserData = async () => {
//       setLoading(true);
//       setError(null); // Reset error state before fetching

//       try {
//         // Fetch the user data from Supabase Auth to get the user UUID
//         const { data, error: authError } = await supabase.auth.getUser();
//         console.log("Fetched user data:", data); // Log user data for debugging

//         if (authError || !data?.user?.id) {
//           setError("User not authenticated or unable to fetch user data.");
//           console.log("Auth Error: ", authError); // Log authError if it exists
//           return;
//         }

//         const userUuid = data.user.id; // Get the authenticated user UUID
//         setUserUuid(userUuid); // Set userUuid in state
//         console.log("User UUID from Supabase Auth:", userUuid); // Log the UUID being used
//       } catch (err) {
//         console.error("Error fetching user data:", err); // Log error details
//         setError("Failed to load user data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []); // Only run once when component mounts

//   // Logout handler
//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     router.replace("/landing");
//   };

//   return (
//     <ScreenContainer>
//       <Text
//         style={[
//           styles.appName,
//           theme === "dark" ? styles.darkAppName : styles.lightAppName,
//         ]}
//       >
//         FitTogether Challenges
//       </Text>

//       {/* Show error if there is one */}
//       {error && <Text style={styles.errorText}>{error}</Text>}

//       {/* Show loading message */}
//       {loading ? (
//         <Text>Loading user data...</Text>
//       ) : (
//         // userUuid && <UserChallengesList userId={userUuid} /> // Pass userUuid to the list component for fetching challenges
//         userUuid && <UserChallengesList userUuid={userUuid} /> // Pass userUuid to the list component for fetching challenges
//       )}

//       {/* Action buttons */}
//       <View style={{ alignItems: "center", width: "100%", marginTop: 12 }}>
//         <TouchableOpacity
//           style={[
//             styles.button,
//             theme === "dark" ? styles.darkButton : styles.lightButton,
//             { width: "70%" },
//           ]}
//           onPress={() => router.push(ROUTES.allChallenges)}
//           disabled={loading}
//         >
//           <Text style={styles.buttonText}>
//             {loading ? "View Challenges..." : "View Existing Challenges"}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.button,
//             theme === "dark" ? styles.darkButton : styles.lightButton,
//             { width: "70%" },
//           ]}
//           onPress={() => router.push(ROUTES.createChallenge)}
//           disabled={loading}
//         >
//           <Text style={styles.buttonText}>
//             {loading ? "Create Challenge..." : "Create a New Challenge"}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.button,
//             theme === "dark" ? styles.darkButton : styles.lightButton,
//             { marginTop: 4, width: "35%" },
//           ]}
//           onPress={handleLogout}
//         >
//           <Text style={styles.buttonText}>Log Out</Text>
//         </TouchableOpacity>
//       </View>
//     </ScreenContainer>
//   );
// }
