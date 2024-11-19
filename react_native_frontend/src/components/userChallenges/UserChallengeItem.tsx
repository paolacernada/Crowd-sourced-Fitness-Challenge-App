import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Challenge } from '@/src/types/Challenge';
import styles from '@/src/components/ScreenStyles'; // Import your existing styles

interface UserChallengeItemProps {
  challenge: Challenge;
}

const UserChallengeItem: React.FC<UserChallengeItemProps> = ({ challenge }) => {
    return (
      <View style={styles.challengeItem}>
        <Text style={[styles.challengeText, styles.usernameText]}>{challenge.name}</Text>
        <Text style={styles.challengeText}>{challenge.description}</Text>
        <Text style={styles.challengeText}>Difficulty: {challenge.difficulty}</Text>
      </View>
    );
  };
  
  export default UserChallengeItem;