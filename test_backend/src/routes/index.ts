import { Router } from "express";
import userRoutes from "./usersRoutes";
import difficultyRoutes from "./difficultyRoutes";

const router = Router();

router.use("/users", userRoutes); // Prefixes all routes in userRoutes.ts with 'users'
router.use("/difficulties", difficultyRoutes); // Prefixes all routes in difficultyRoutes.ts with 'difficulties'

export default router;
