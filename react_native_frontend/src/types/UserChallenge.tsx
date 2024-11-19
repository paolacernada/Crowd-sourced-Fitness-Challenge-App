import { Challenge } from "./Challenge";

export interface UserChallenge {
  id: number;
  challenge_id: number;
  challenges: Challenge; // The Challenge object associated with this userChallenge
}
