import express from 'express';
import {LibraryController} from '../../controllers/admin/admin.controller.js'; 

const router = express.Router();

// Create a new library
router.post("/library", LibraryController.createLibrary);

// Fetch the list of library
router.get("/library", LibraryController.fetchLibraries);

// Fetch a single library by ID
router.get("/library/:id", LibraryController.getLibraryById);

// Update an library by ID
router.put("/library/:id", LibraryController.updateLibrary);

// Delete an library by ID
router.delete("/library/:id", LibraryController.deleteLibrary);

export default router;
