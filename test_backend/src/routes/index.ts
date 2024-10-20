import { Router } from "express";
import userRoutes from "./usersRoutes";

const router = Router();

router.use('/users', userRoutes);  // Prefixes all routes in userRoutes.ts with 'users' 

export default router;