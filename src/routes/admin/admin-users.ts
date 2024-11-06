import express from 'express';
import {AdminController} from '../../controllers/admin/admin.controller.js'; 

const router = express.Router();

// Create a new admin
router.post("/admins", AdminController.createAdmin);

// Fetch the list of admins
router.get("/admins", AdminController.fetchAdmins);

// Fetch a single admin by ID
router.get("/admins/:id", AdminController.getAdminById);

// Update an admin by ID
router.put("/admins/:id", AdminController.updateAdmin);

// Delete an admin by ID
router.delete("/admins/:id", AdminController.deleteAdmin);



export default router;
