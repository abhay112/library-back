import mongoose from "mongoose";
import ErrorHandler from "../../utils/utility-class.js";
import { StatusCodes } from "http-status-codes";
import { Attendance } from "../../models/attendance.js";
import { ObjectId } from 'mongodb'; 
import moment from "moment-timezone";
import Seats from "../../models/seats.js";
import { Student } from "../../models/student.js";

const AttendanceService:any = {

    createAttendance: async (studentId: string, adminId:string, attendanceRecords: any[]) => {
        const session = await mongoose.startSession();
        session.startTransaction(); // Start a new transaction

        try {
            const currentDate = moment.tz("Asia/Kolkata");
            const seatRecord = await Seats.findOne({ adminId: adminId }).session(session);

            if (!seatRecord) {
                return {
                    success: false,
                    message: "Seat record not found",
                };
            }
            if(seatRecord){
                let row =  attendanceRecords[0]?.rowIndex
                let col =  attendanceRecords[0]?.colIndex
                let number =  attendanceRecords[0]?.seatNumber
                let seatNumber = seatRecord?.matrix[row][col]?.seatNumber
                let seatStatus = seatRecord?.matrix[row][col]?.status
                if(seatNumber !== number ){
                    return {
                        success: false,
                        message: "Seat Number not found",
                    };
                }
                if(["filled","blank","blocked"].includes(seatStatus)){
                    return {
                        success: false,
                        message: "Seat already taken",
                    };
                }
            }

            // Check if attendance already exists for the student on the current day
            const existingAttendance = await Attendance.findOne({ studentId }).session(session);
            console.log(existingAttendance)
            if (existingAttendance) {
                const lastRecord = existingAttendance.attendanceRecords[existingAttendance.attendanceRecords.length - 1];
                const checkoutStatus = lastRecord?.checkOutStatus;
                const checkoutDate = lastRecord?.checkOut;

                if (checkoutDate !== null && checkoutStatus) {
                    // Push new attendance records into the existing attendance
                    existingAttendance.attendanceRecords.push(
                        ...attendanceRecords.map((record: any) => ({
                            ...record,
                            day: currentDate.toDate(), // Store in UTC format
                            checkIn: currentDate.toDate(), // Store in UTC format
                            checkOut: null, // Set checkOut to null
                            requestedByStudent: true,
                            status: "pending",
                            checkOutStatus: false, // Default to false on creation
                        }))
                    );

                    // Save the updated attendance
                    await existingAttendance.save({ session });

                    const lastRecordSeat = attendanceRecords[0];


                    let res = await Seats.updateOne(
                        { adminId: existingAttendance.adminId },
                        { 
                          $set: { 
                            [`matrix.${lastRecordSeat.rowIndex}.${lastRecordSeat.colIndex}.status`]: "blocked", 
                            [`matrix.${lastRecordSeat.rowIndex}.${lastRecordSeat.colIndex}.studentId`]: studentId,
                            [`matrix.${lastRecordSeat.rowIndex}.${lastRecordSeat.colIndex}.studentName`]: lastRecordSeat.studentName,
                          } 
                        },
                        { session } // Include session for the transaction
                    );
                    await session.commitTransaction(); // Commit the transaction
                    session.endSession();

                    return {
                        success: true,
                        message: "Attendance records updated successfully",
                        attendance: existingAttendance,
                    };
                } else {
                    await session.abortTransaction(); // Rollback transaction on error
                    session.endSession();

                    return {
                        success: false,
                        status: StatusCodes.UNPROCESSABLE_ENTITY,
                        message: "Attendance already present for the current date and not checked out.",
                        attendance: existingAttendance,
                    };
                }
            } else {
                // Create a new attendance record
                const attendanceData = {
                    studentId,
                    adminId,
                    attendanceRecords: attendanceRecords.map((record: any) => ({
                        ...record,
                        day: currentDate,
                        checkIn: currentDate,
                        checkOut: null,
                        requestedByStudent: true,
                        status: "pending",
                        checkOutStatus: false, // Default to false on creation
                    })),
                };
                console.log(attendanceData)
                const attendance = new Attendance(attendanceData);

                // Save the new attendance record
                await attendance.save({ session });
                console.log(attendance.adminId)
                // Block the seat in the seat layout
                const firstRecord = attendanceRecords[0]; // Get seat info from the first attendance record
                await Seats.updateOne(
                    { adminId: attendance.adminId },
                    { 
                      $set: { 
                        [`matrix.${firstRecord.rowIndex}.${firstRecord.colIndex}.status`]: "blocked", 
                        [`matrix.${firstRecord.rowIndex}.${firstRecord.colIndex}.studentId`]: studentId,
                        [`matrix.${firstRecord.rowIndex}.${firstRecord.colIndex}.studentName`]: firstRecord.studentName
                      } 
                    },
                    { session } // Include session for the transaction
                  );

                await session.commitTransaction(); // Commit the transaction
                session.endSession();

                return {
                    success: true,
                    message: "Attendance record created successfully",
                    attendance,
                };
            }
        } catch (error) {
            await session.abortTransaction(); // Rollback on error
            session.endSession();

            throw new ErrorHandler("Error creating attendance record", StatusCodes.BAD_REQUEST);
        }
    },

    performActionOnAttendance: async (attendanceId: string, action: string) => {
        const session = await mongoose.startSession(); // Start a new session for the transaction
        session.startTransaction(); // Start the transaction
    
        try {
            const attendance = await Attendance.findById(attendanceId).session(session); // Include session in the query
            const currentDate = moment.tz("Asia/Kolkata");
    
            if (!attendance) {
                return {
                    success: false,
                    message: "Attendance record not found",
                };
            }

            const seatRecord = await Seats.findOne({ adminId: attendance.adminId }).session(session);

            if (!seatRecord) {
                return {
                    success: false,
                    message: "Seat record not found",
                };
            }

            // Find the attendance record for the current date in the seat record
            const attendanceRecord = seatRecord.attendanceRecords.find(record =>
                moment(record.date).isSame(currentDate, 'day')
            );
            console.log(attendanceRecord);
    
            const lastRecordIndex = attendance.attendanceRecords?.length - 1;
            const lastRecord = attendance.attendanceRecords[lastRecordIndex];
    
            if (["approved", "rejected"].includes(lastRecord?.status)) {
                await session.abortTransaction(); // Abort transaction if no records to update
                session.endSession();
                return {
                    success: false,
                    message: "No pending attendance records to approve or reject",
                };
            }
    
            // Update the status of the last pending attendance record
            lastRecord.status = action === "approve" ? "approved" : "rejected";
            lastRecord.statusUpdateTime = currentDate?.toDate();
            const lastRecordSeat = lastRecord;
            
            let studentName = await Student.findById(attendance?.studentId).select('name').session(session); // Get student name with session
            console.log(studentName?.name);
    
            // Save the updated attendance record
            await attendance.save({ session });
    
            // Perform seat status update based on the action (approve or reject)
            const seatStatus = action === "approve" ? "filled" : "vacant"; // Change to 'filled' on approval or 'vacant' on rejection
    
            await Seats.updateOne(
                { adminId: attendance.adminId },
                {
                    $set: {
                        [`matrix.${lastRecordSeat.rowIndex}.${lastRecordSeat.colIndex}.status`]: seatStatus,
                        [`matrix.${lastRecordSeat.rowIndex}.${lastRecordSeat.colIndex}.studentId`]: action === "approve" ? attendance?.studentId : null,
                        [`matrix.${lastRecordSeat.rowIndex}.${lastRecordSeat.colIndex}.studentName`]: action === "approve" ? studentName?.name : null,
                    },
                },
                { session }
            );


            if (attendanceRecord) {
                // Update existing attendance record
                attendanceRecord.filledSeats.push({
                    seatNumber: lastRecordSeat.seatNumber, 
                    studentId: attendance.studentId,
                    studentName: studentName?.name ??"",
                });
            } else {
                seatRecord.attendanceRecords.push({
                    date: currentDate.toDate(),
                    filledSeats: [{
                        seatNumber: lastRecordSeat.seatNumber,
                        studentId: attendance.studentId,
                        studentName: studentName?.name??"",
                    }]
                });
            }
            await seatRecord.save({ session });
            // Commit the transaction after all operations succeed
            await session.commitTransaction();
            session.endSession();
    
            return {
                success: true,
                message: `Attendance ${action} updated successfully`,
                attendance,
            };
        } catch (error) {
            // Rollback the transaction if anything fails
            await session.abortTransaction();
            session.endSession();
            throw new ErrorHandler("Error updating attendance", StatusCodes.BAD_REQUEST);
        }
    },
    
    checkOutStudent: async (studentId: string, attendanceId: string) => {
        const session = await mongoose.startSession(); // Start a session for the transaction
        session.startTransaction(); // Start the transaction
    
        try {
            const currentDate = moment.tz("Asia/Kolkata");
    
            // Fetch the attendance record with a session
            const attendance = await Attendance.findOne({ studentId }).session(session);
            
            // Check if the last attendance record has already been checked out
            if (attendance?.attendanceRecords[attendance.attendanceRecords?.length - 1]?.checkOutStatus) {
                await session.abortTransaction();
                session.endSession();
                return {
                    success: false,
                    status: StatusCodes.UNPROCESSABLE_ENTITY,
                    message: "Student already checked out",
                };
            }
    
            if (attendance) {
                // Get the last attendance record
                const lastRecordIndex = attendance.attendanceRecords.length - 1;
                const lastRecord = attendance.attendanceRecords[lastRecordIndex];
    
                // Update the check-out details for the last attendance record
                lastRecord.checkOut = currentDate?.toDate();
                lastRecord.checkOutStatus = true;
    
                // Save the updated attendance document with the session
                await attendance.save({ session });
    
                // Update the seat status to 'vacant'
                await Seats.updateOne(
                    { adminId: attendance.adminId },
                    {
                        $set: {
                            [`matrix.${lastRecord.rowIndex}.${lastRecord.colIndex}.status`]: 'vacant',  // Change the seat status to 'vacant'
                            [`matrix.${lastRecord.rowIndex}.${lastRecord.colIndex}.studentId`]: null,   // Clear the student ID
                            [`matrix.${lastRecord.rowIndex}.${lastRecord.colIndex}.studentName`]: null  // Clear the student name
                        }
                    },
                    { session } // Include session for the seat update
                );
    
                // Commit the transaction after all operations succeed
                await session.commitTransaction();
                session.endSession();
    
                return {
                    success: true,
                    status: StatusCodes.OK,
                    message: "Attendance record updated and seat vacated successfully",
                };
            } else {
                // Rollback the transaction if no attendance record is found
                await session.abortTransaction();
                session.endSession();
                return {
                    success: false,
                    status: StatusCodes.NOT_FOUND,
                    message: "Attendance record not found.",
                };
            }
        } catch (error) {
            // Rollback the transaction in case of an error
            await session.abortTransaction();
            session.endSession();
            throw new ErrorHandler("Error updating check-out time and seat status", StatusCodes.BAD_REQUEST);
        }
    },
    

    // Fetch All Attendances
    fetchAttendances: async (query: any) => {
        try {
        const attendances = await Attendance.find(query)
            .populate("studentId", "name")
            .populate("adminId", "name")
            .sort({ createdAt: -1 }); // Sort by newest records first

        if (!attendances || attendances.length === 0) {
            throw new ErrorHandler("No attendance records found", StatusCodes.NOT_FOUND);
        }

        return {
            success: true,
            attendances,
        };
        } catch (error) {
        throw new ErrorHandler("Error fetching attendance records", StatusCodes.BAD_REQUEST);
        }
    },

    // Fetch Attendance by Student ID
    fetchAttendanceByStudentId: async (studentId: mongoose.Schema.Types.ObjectId) => {
        try {
        const attendance = await Attendance.find({ studentId })
            .populate("studentId", "name")
            .populate("adminId", "name");

        if (!attendance || attendance.length === 0) {
            throw new ErrorHandler("No attendance records found for the given student", StatusCodes.NOT_FOUND);
        }

        return {
            success: true,
            attendance,
        };
        } catch (error) {
        throw new ErrorHandler("Error fetching attendance record by student ID", StatusCodes.BAD_REQUEST);
        }
    },

    // Update Attendance
    updateAttendance: async (id: string, updateData: any) => {
        try {
        const attendance = await Attendance.findById(id);
        if (!attendance) {
            throw new ErrorHandler("Attendance record not found", StatusCodes.NOT_FOUND);
        }

        // Update the fields as necessary
        Object.assign(attendance, updateData);
        await attendance.save();

        return {
            success: true,
            message: `Attendance record updated successfully`,
            attendance,
        };
        } catch (error) {
        throw new ErrorHandler("Error updating attendance record", StatusCodes.BAD_REQUEST);
        }
    },

    // Delete Attendance
    deleteAttendance: async (id: string) => {
        try {
        const attendance = await Attendance.findById(id);
        if (!attendance) {
            throw new ErrorHandler("Attendance record not found", StatusCodes.NOT_FOUND);
        }

        //   await attendance.remove();
        return {
            success: true,
            message: "Attendance record deleted successfully",
        };
        } catch (error) {
        throw new ErrorHandler("Error deleting attendance record", StatusCodes.BAD_REQUEST);
        }
    },
};

export { AttendanceService };
