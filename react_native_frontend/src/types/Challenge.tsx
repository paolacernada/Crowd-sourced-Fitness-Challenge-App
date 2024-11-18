export interface Challenge {
  id?: number; // Makes id optional during creation, as it's automatically created by the backend DB
  name: string;
  description: string;
  difficulty: string;
}
