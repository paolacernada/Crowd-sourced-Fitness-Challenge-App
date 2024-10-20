import { Router, Request, Response } from 'express';
// import { Router } from 'express';
import supabase from "../config/supabaseClient";

const router = Router();

// Returns all users
router.get("/", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("users") // Replace with your table name
        .select("*");
  
      if (error) {
        throw error;
      }
  
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error-- Unable to fetch "users" data.' });
    }
  });
  
// Returns user by id
router.get("/:id", async (req: any, res: any) => {  // Todo: "any" bypasses the type checking here, but I need to figure it out eventually.
    // const {id} = req.params;  // Todo: look into if this is shorthand
    const id = req.params.id; // Extract the ID from the route parameters

    try {
        const { data, error } = await supabase
            .from("users") // Replace with your table name
            .select("*")
            .eq('id', id) // Pass 'id' directly, not as an object
            .single(); // Fetch a single user (instead of all)

        if (error) {
            throw error;
        }

        if (!data) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error-- Unable to fetch user data.' });
    }
});

// Add new user
// router.post('/users', (req, res) => {
//   // Create a user
// });

// Update user

// Delete user


export default router;
