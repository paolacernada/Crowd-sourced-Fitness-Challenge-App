// src/components/UserChallengesList.tsx
import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, ActivityIndicator } from 'react-native';
import { getUserChallenges } from '@/src/services/userChallengeService'; // Assuming this function exists
import UserChallengeItem from './UserChallengeItem';
import styles from "../ScreenStyles";
import { Challenge } from '@/src/types/Challenge';

interface UserChallengesListProps {
    userId: string;
  }
  
  const UserChallengesList: React.FC<UserChallengesListProps> = ({ userId }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
  
    useEffect(() => {
      const fetchChallenges = async () => {
        setLoading(true);
        try {
          const userChallenges = await getUserChallenges(userId); // Fetching user-specific challenges
          setChallenges(userChallenges);
        } catch (error) {
          console.error('Error fetching challenges:', error);
        } finally {
          setLoading(false);
        }
      };
  
      if (userId) {
        fetchChallenges();
      }
    }, [userId]);
  
    if (loading) {
      return <ActivityIndicator size="large" color="#f48c42" />;
    }
  
    if (challenges.length === 0) {
      return <Text style={styles.errorText}>You are not part of any challenges yet.</Text>;
    }
  
    return (
      <FlatList
        data={challenges}
        // keyExtractor={(item) => item.id.toString()}
        keyExtractor={(item) =>
        item.id ? item.id.toString() : item.name || "unknown-id"
      } // Handles cases where the id does or does not exist

        renderItem={({ item }) => <UserChallengeItem challenge={item} />}
        contentContainerStyle={styles.challengeListContainer}
      />
    );
  };
  
  export default UserChallengesList;
