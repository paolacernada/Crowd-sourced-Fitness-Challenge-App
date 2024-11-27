import React from "react";
import { FlatList, Text } from "react-native";
import UserChallengeItem from "./UserChallengeItem";
import styles from "../ScreenStyles";
import { UserChallenge } from "@/src/types/UserChallenge";

interface UserChallengesListProps {
  userUuid: string;
  challenges: UserChallenge[];
  onRemove: (userChallengeId: number) => void;
}

const UserChallengesList: React.FC<UserChallengesListProps> = ({
  userUuid,
  challenges,
  onRemove,
}) => {
  if (challenges.length === 0) {
    return (
      <Text style={[styles.errorText, { textAlign: "center" }]}>
        You are not part of any challenges yet.
      </Text>
    );
  }

  return (
    <FlatList
      data={challenges}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <UserChallengeItem
          challenge={item.challenges}
          userChallengeId={item.id}
          userUuid={userUuid}
          onRemove={onRemove}
          showUnjoinButton={true}
        />
      )}
      contentContainerStyle={{
        paddingBottom: 20,
        paddingHorizontal: 10,
      }}
    />
  );
};

export default UserChallengesList;
