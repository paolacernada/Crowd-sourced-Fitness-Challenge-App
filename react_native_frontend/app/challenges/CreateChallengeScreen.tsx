/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../src/context/ThemeContext";
import ScreenContainer from "../../src/components/ScreenContainer";
import styles from "../../src/components/ScreenStyles";

import { ChallengeForm } from "../../src/components/challenges/ChallengeForm";
import { createChallenge } from "@/src/services/challengeService";

export default function CreateChallengeScreen() {
  // const [challengeId, setChallengeId] = useState("");
  // const [challengeName, setChallengeName] = useState("");
  // const [challengeDescription, setChallengeDescription] = useState("");
  // const [challengeDifficulty, setChallengeDifficulty] = useState("");

  const [loading, setLoading] = useState(false);
  const [challengeData, setChallengeData] = useState({
    name: "",
    description: "",
    difficulty: "",
  });

  const navigation = useNavigation();
  const { theme } = useTheme();

  const handleCreateChallenge = async () => {
    // todo: use a map to make this code cleaner
    if (!challengeData.name) {
      Alert.alert("Error", "Challenge name cannot be empty.");
      return;
    }
    if (!challengeData.description) {
      Alert.alert("Error", "Challenge description cannot be empty.");
      return;
    }
    if (!challengeData.difficulty) {
      Alert.alert("Error", "Challenge difficulty cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      // Call the service function to create the challenge in the backend
      const createdChallenge = await createChallenge(challengeData);

      // Alert the user and reset form state
      Alert.alert("Success", "Challenge created successfully!");
      setChallengeData({ name: "", description: "", difficulty: "" });

      // Navigate to the "All Challenges" screen, showing newly-created challenge included with the other challenges
      navigation.navigate("Challenges"); // Navigate to all challenges screen
    } catch (error) {
      // Handle errors that occur during the challenge creation
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
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

      <View
        style={[
          styles.formContainer,
          theme === "dark" ? styles.darkForm : styles.lightForm,
        ]}
      >
        {/* Title */}
        <Text
          style={[
            styles.title,
            theme === "dark" ? styles.darkText : styles.lightText,
            { marginBottom: 20 },
          ]}
        >
          Start a New Challenge
        </Text>
        <ChallengeForm
          challengeData={challengeData}
          setChallengeData={setChallengeData}
          theme={theme}
        />

        {/* Button to submit the form */}
        <View style={{ width: "100%", alignItems: "center", marginTop: 12 }}>
          <TouchableOpacity
            style={[
              styles.button,
              theme === "dark" ? styles.darkButton : styles.lightButton,
              { width: "50%", marginTop: -6, marginBottom: 2 },
            ]}
            onPress={handleCreateChallenge}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creating Challenge..." : "Let’s Go!"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}

// export default function CreateChallengeScreen() {
//   const [challengeId, setChallengeId] = useState("");
//   const [challengeName, setChallengeName] = useState("");
//   const [challengeDescription, setChallengeDescription] = useState("");
//   const [challengeDifficulty, setChallengeDifficulty] = useState("");

//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const { theme } = useTheme();

//   const handleCreateChallenge = async () => {
//     // todo: use a map to make this code cleaner
//     if (!challengeName) {
//       Alert.alert("Error", "Challenge name cannot be empty.");
//       return;
//     }
//     if (!challengeDescription) {
//       Alert.alert("Error", "Challenge description cannot be empty.");
//       return;
//     }
//     if (!challengeDifficulty) {
//       Alert.alert("Error", "Challenge difficulty cannot be empty.");
//       return;
//     }

//     setLoading(true);

//     // todo: check if I can handle challenge.id better
//     const newChallenge = {
//       id: challengeId,
//       name: challengeName,
//       description: challengeDescription,
//       difficulty: challengeDifficulty,
//     };

//     try {
//       // Call createChallenge function from challenge services
//       const createdChallenge = await createChallenge(newChallenge);

//       // If challenge successfully created
//       Alert.alert("Success", "Challenge created successfully!");

//       // reset input fields
//       setChallengeName("");
//       setChallengeDescription("");
//       setChallengeDifficulty("");
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : "An error occurred";
//       Alert.alert("Error", errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

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

//       <View
//         style={[
//           styles.formContainer,
//           theme === "dark" ? styles.darkForm : styles.lightForm,
//           { paddingVertical: 20 },
//         ]}
//       >
//         <Text
//           style={[
//             styles.title,
//             theme === "dark" ? styles.darkText : styles.lightText,
//           ]}
//         >
//           Create a New Challenge
//         </Text>

//         <TextInput
//           placeholder="Enter a new challenge name"
//           placeholderTextColor={theme === "dark" ? "#999" : "#999"}
//           value={challengeName}
//           onChangeText={setChallengeName}
//           style={[
//             styles.input,
//             theme === "dark" ? styles.darkInput : styles.lightInput,
//           ]}
//         />
//         <TextInput
//           placeholder="Enter challenge description"
//           placeholderTextColor={theme === "dark" ? "#999" : "#999"}
//           value={challengeDescription}
//           onChangeText={setChallengeDescription}
//           style={[
//             styles.input,
//             theme === "dark" ? styles.darkInput : styles.lightInput,
//           ]}
//         />
//         <TextInput
//           placeholder="Enter challenge difficulty"
//           placeholderTextColor={theme === "dark" ? "#999" : "#999"}
//           value={challengeDifficulty}
//           onChangeText={setChallengeDifficulty}
//           style={[
//             styles.input,
//             theme === "dark" ? styles.darkInput : styles.lightInput,
//           ]}
//         />

//         <View style={{ alignItems: "center", width: "100%", marginTop: 12 }}>
//           <TouchableOpacity
//             style={[
//               styles.button,
//               theme === "dark" ? styles.darkButton : styles.lightButton,
//               { width: "70%" },
//             ]}
//             onPress={handleCreateChallenge}
//             disabled={loading}
//           >
//             <Text style={styles.buttonText}>
//               {loading ? "Creating Challenge..." : "Create a New Challenge"}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.button,
//               theme === "dark" ? styles.darkButton : styles.lightButton,
//               { marginTop: 4, width: "35%" },
//             ]}
//             onPress={handleLogout}
//           >
//             <Text style={styles.buttonText}>Log Out</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScreenContainer>
//   );
// }
