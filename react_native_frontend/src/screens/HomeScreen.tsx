import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { supabase } from "../config/supabaseClient";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import styles from "../components/ScreenStyles";
import ScreenContainer from "../components/ScreenContainer";
import { ROUTES } from "../config/routes";
import UserChallengesList from "@/src/components/userChallenges/UserChallengesList";

const HomeScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const { theme } = useTheme();
  const router = useRouter();

  // Fetch user's UUID when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching

      try {
        // Get user data (to get user UUID) through Supabase Auth call
        const { data, error: authError } = await supabase.auth.getUser();
        // console.log("Fetched user data:", data); // Log user data for debugging

        if (authError || !data?.user?.id) {
          setError("User not authenticated or unable to fetch user data.");
          //   console.log("Auth Error: ", authError); // Log authError if it exists
          return;
        }

        const userUuid = data.user.id; // Get user UUID from within authenticated user data
        setUserUuid(userUuid); // Set userUuid in state
        // console.log("User UUID from Supabase Auth:", userUuid); // Log the UUID being used
      } catch (err) {
        // console.error("Error fetching user data:", err); // Log error details
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Runs once component mounts

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/landing");
  };

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

      {/* Show error if there is one */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Show loading message */}
      {loading ? (
        <Text>Loading user data...</Text>
      ) : (
        // Pass obtained userUuid to list component to fetch that user's challenges
        userUuid && <UserChallengesList userUuid={userUuid} />
      )}

      {/* Action buttons */}
      <View style={{ alignItems: "center", width: "100%", marginTop: 12 }}>
        <TouchableOpacity
          style={[
            styles.button,
            theme === "dark" ? styles.darkButton : styles.lightButton,
            { width: "70%" },
          ]}
          onPress={() => router.push(ROUTES.allChallenges)}
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
            { width: "70%" },
          ]}
          onPress={() => router.push(ROUTES.createChallenge)}
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
            { marginTop: 4, width: "35%" },
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

export default HomeScreen;

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
//   const [userId, setUserId] = useState<string | null>(null); // userId state
//   const { theme } = useTheme();
//   const router = useRouter();

//   // Fetch user data (userId) when the component mounts
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
//           console.log("Auth Error: ", authError);  // Log authError if it exists
//           return;
//         }

//         const userUuid = data.user.id; // Get the authenticated user UUID
//         setUserId(userUuid); // Set userId in state
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
//         userId && <UserChallengesList userId={userId} /> // Pass userId to the list component for fetching challenges
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
