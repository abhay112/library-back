
import mongoose from "mongoose";
import { Admin } from "../../models/admin.js";
import ErrorHandler from "../../utils/utility-class.js";
import { StatusCodes } from "http-status-codes";
import { Student } from "../../models/student.js";
import { Fees } from "../../models/fees.js";



const studentService = {
    // Create Student
    createStudent: async (studentData: {
      name: string;
      email: string;
      mobile: number;
      photo: string;
      shift: string;
      fixedSeatNumber: string;
      dateOfJoining?: Date;
      adminId: mongoose.Schema.Types.ObjectId;
      active?: boolean;
      feesAmount: number;
    }) => {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
    
        const { email, adminId, dateOfJoining, feesAmount } = studentData;
        // Check if student already exists by email
        const existingStudent = await Student.findOne({ email }).session(session);
        if (existingStudent) {
          throw new ErrorHandler(
            "Student with this email already exists",
            StatusCodes.CONFLICT
          );
        }
    
        // Fetch libraryId using adminId
        const admin = await Admin.findById(adminId).session(session);
        if (!admin) {
          throw new ErrorHandler("Admin not found", StatusCodes.NOT_FOUND);
        }
        const libraryId = admin.library;
  

         // Prepare membership history
        let membershipHistory = [];
        if (dateOfJoining) {
            membershipHistory.push({
                startDate: dateOfJoining,
                isActive: true,
            });
        }
        // Create student
        const student = await Student.create(
          [
            {
              ...studentData,
              membershipHistory,
              libraryId,
            },
          ],
          { session }
        );
    
        // Create fees entry for the student
        const feesData = {
          adminId: admin._id,
          studentId: student[0]._id,
          studentName: student[0].name,
          feesSubmissionDate: studentData.dateOfJoining || new Date(),
          fees: [
            {
                date: dateOfJoining || new Date(), 
                amount: feesAmount, 
                feesStatus: true, 
                shift: studentData.shift, 
              },
          ],
        };
        const fees = await Fees.create([feesData], { session });
    
        await session.commitTransaction();
    
        return {
          success: true,
          message: `Student created successfully: ${student[0].name}`,
          student: student[0],
        };
      } catch (error) {
        // Abort the transaction in case of error
        await session.abortTransaction();
        throw error;
      } finally {
        // End the session
        session.endSession();
      }
    },

    // Fetch All Students
    fetchStudents: async (adminId:string) => {
        const students = await Student.find({ adminId })
        
        if (!students || students.length === 0) {
            throw new ErrorHandler("No students found", StatusCodes.NOT_FOUND);
        }
    
        return {
            success: true,
            students,
        };
    },
  
    // Fetch Student by ID
    fetchStudentById: async (id: string) => {
      const student = await Student.findById(id).populate("feesId libraryId adminId attendance");
      if (!student) {
        throw new ErrorHandler("Student not found", StatusCodes.NOT_FOUND);
      }
  
      return {
        success: true,
        student,
      };
    },
  
    // Update Student
    updateStudent: async (id: string, studentData: any) => {
      const student = await Student.findById(id);
      if (!student) {
        throw new ErrorHandler("Student not found", StatusCodes.NOT_FOUND);
      }
  
      // Update fields as necessary
      Object.assign(student, studentData);
      await student.save();
  
      return {
        success: true,
        message: `Student updated successfully: ${student.name}`,
        student,
      };
    },

    updateStudentMembership: async (
        studentId: string, 
        membershipData: { startDate?: Date; endDate?: Date; isActive?: boolean; feesAmount?: number }
    ) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        
        const { startDate, endDate, isActive, feesAmount } = membershipData;

        // Find the student by ID
        const student = await Student.findById(studentId).session(session);
        if (!student) {
            throw new ErrorHandler("Student not found", StatusCodes.NOT_FOUND);
        }

        if (startDate) {
            // Add a new membership period if `startDate` is provided
            student.membershipHistory.push({
            startDate,
            endDate: endDate || undefined,
            isActive: isActive !== undefined ? isActive : true,
            });

            // Create fees entry when a new membership starts
            // this creating new attendance which need to update 
            if (feesAmount) {
            const feesData = {
                adminId: student.adminId, // Assuming adminId is part of the student schema
                studentId: student._id,
                studentName: student.name,
                feesSubmissionDate: startDate, // Use the start date of the new membership
                fees: [
                {
                    date: startDate, // Same as feesSubmissionDate
                    amount: feesAmount,
                    feesStatus: true, // Mark fee as paid
                    shift: student.shift, // Assuming shift is part of the student schema
                },
                ],
            };
            await Fees.create([feesData], { session });
            }
        } else if (endDate) {
            // Find the most recent active membership and update its `endDate`
            const activeMembership = student.membershipHistory.find(
            (membership) => membership.isActive
            );
            if (activeMembership) {
            activeMembership.endDate = endDate; // Assign endDate directly
            activeMembership.isActive = false; // Mark as inactive
            } else {
            throw new ErrorHandler(
                "No active membership found to update",
                StatusCodes.BAD_REQUEST
            );
            }
        }

        await student.save({ session });
        await session.commitTransaction();

        return {
            success: true,
            message: "Student membership updated successfully",
            student,
        };
    },
        
    // Delete Student
    deleteStudent: async (id: string) => {
      const student = await Student.findById(id);
      if (!student) {
        throw new ErrorHandler("Student not found", StatusCodes.NOT_FOUND);
      }
  
      await Student.deleteOne({ _id: id });
      return {
        success: true,
        message: "Student deleted successfully",
      };
    },
};

export {studentService};
