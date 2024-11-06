import Seats from "../../models/seats";

const seatsService: any = {
    // Create Seats
    createSeats: async (seatsData: any) => {
      try {
        const newSeats = new Seats(seatsData);
        await newSeats.save();
        return { success: true, message: 'Seats created successfully', data: newSeats };
      } catch (error) {
        return { success: false, message: 'Error creating seats', error };
      }
    },
  
    // Fetch All Seats by Admin ID
    fetchSeats: async (adminId: string) => {
      try {
        const seats = await Seats.find({ adminId });
        return { success: true, data: seats };
      } catch (error) {
        return { success: false, message: 'Error fetching seats', error };
      }
    },
  
    // Fetch Seat by ID
    getSeatById: async (seatId: string) => {
      try {
        const seat = await Seats.findById(seatId);
        if (!seat) {
          return { success: false, message: 'Seat not found' };
        }
        return { success: true, data: seat };
      } catch (error) {
        return { success: false, message: 'Error fetching seat', error };
      }
    },
  
    // Update Seat
    updateSeat: async (seatId: string, updateData: any) => {
      try {
        const seat = await Seats.findByIdAndUpdate(seatId, updateData, { new: true });
        if (!seat) {
          return { success: false, message: 'Seat not found' };
        }
        return { success: true, message: 'Seat updated successfully', data: seat };
      } catch (error) {
        return { success: false, message: 'Error updating seat', error };
      }
    },
  
    // Delete Seat
    deleteSeat: async (seatId: string) => {
      try {
        const seat = await Seats.findByIdAndDelete(seatId);
        if (!seat) {
          return { success: false, message: 'Seat not found' };
        }
        return { success: true, message: 'Seat deleted successfully' };
      } catch (error) {
        return { success: false, message: 'Error deleting seat', error };
      }
    },
};
  
export {seatsService}