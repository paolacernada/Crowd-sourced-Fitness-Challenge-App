import { Router } from "express";
import userRoutes from "./usersRoutes";
import difficultyRoutes from "./difficultyRoutes";
import goalRoutes from "./goalsRoutes";
import challengeRoutes from "./challengesRoutes";
import tagRoutes from "./tagsRoutes";
import challengeGoalRoutes from "./challengeGoalsRoutes";

const router = Router();

router.use("/users", userRoutes); // Prefixes all routes in userRoutes.ts with 'users'
router.use("/difficulties", difficultyRoutes); // Prefixes all routes in difficultyRoutes.ts with 'difficulties'
router.use("/goals", goalRoutes); // Prefixes all routes in goalRoutes.ts with 'goals'
router.use("/challenges", challengeRoutes); // Prefixes all routes in challengeRoutes.ts with 'challenges'
router.use("/tags", tagRoutes); // Prefixes all routes in tagRoutes.ts with 'tags'
router.use("/challengeGoals", challengeGoalRoutes); // Prefixes all routes in tagRoutes.ts with 'challenge_goals'

export default router;
