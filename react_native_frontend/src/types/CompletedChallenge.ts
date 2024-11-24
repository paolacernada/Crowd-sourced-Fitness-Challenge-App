export interface CompletedChallenge {
  user_challenge_id: number; // This serves as the unique identifier
  user_id: number; // Id of user (who completed the challenge)
  user_name: string; // Name of user
  user_uuid: string; // User's Universally Unique Identifier (UUID)
  challenge_name: string;
  challenge_id: number;
}
