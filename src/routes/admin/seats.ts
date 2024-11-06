import { Router } from 'express';
import { SeatsController } from '../../controllers/admin/admin.controller';

const router = Router();

router.post('/seats', SeatsController.createSeats); // Create seats
router.get('/seats', SeatsController.fetchSeats); // Fetch all seats by adminId
router.get('/seats/:id', SeatsController.getSeatById); // Get seat by ID
router.put('/seats/:id', SeatsController.updateSeat); // Update seat
router.delete('/seats/:id', SeatsController.deleteSeat); // Delete seat

export default router;