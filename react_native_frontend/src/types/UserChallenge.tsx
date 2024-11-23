import { Challenge } from "./Challenge";

export interface UserChallenge {
  id: number;
  challenge_id: number;
  completed: boolean;
  favorites: boolean;
  challenges: {
    id: number;
    name: string;
    difficulty: string;
    description: string;
  };
}
// export interface UserChallenge {
//   id: number;
//   challenge_id: number;
//   challenges: Challenge; // The Challenge object associated with this userChallenge
// }
