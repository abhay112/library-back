import { Request, Response } from "express";
import { TryCatch } from "../middlewares/error";
import { Fees } from "../models/fees";
import { getCurrentDateObj, getCurrentFormattedDate } from "../utils/features";
import { Student } from "../models/student";

export const getCurrentMonthFees = TryCatch(async (req: Request, res: Response, next: any) => {
    const adminId = req.query.id as string;
    if (!adminId) {
        return res.status(400).json({
            success: false,
            message: 'Admin ID is required in the query parameters.',
        });
    }
    const activeStudents = await Student.find({ adminId: adminId, active: true });
    const activeStudentIds = activeStudents.map(student => String(student._id));
    console.log(activeStudentIds)

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; 
    // const fees = await Fees.find({ adminId: adminId });
    const aggregatedFees = await Fees.aggregate([
        {
          $match: {
            adminId: adminId,
            studentId: { $in: activeStudentIds }
          }
        }
      ]);
      console.log(aggregatedFees)
      
    for (const fee of aggregatedFees) {
        const {amount,feesStatus,shift} = fee.fees.slice(-1)[0]
        const {day,month,year} = getCurrentDateObj()
        const feeDateParts = fee.fees.slice(-1)[0].date.split('/');
        const feeDay = parseInt(feeDateParts[0], 10);
        const feeMonth = parseInt(feeDateParts[1], 10) - 1; // Months are zero-indexed
        const feeYear = parseInt(feeDateParts[2], 10);

        // Construct a Date object from the components
        const feeDate = new Date(feeYear, feeMonth, feeDay);

        // Calculate the difference in days
        const diffMilliseconds = currentDate.getTime() - feeDate.getTime();
        const diffDays = Math.ceil(diffMilliseconds / (1000 * 60 * 60 * 24));

        if (diffDays >= 30 && feeMonth !== currentMonth) {
            await Fees.updateOne(
                { _id: fee._id },
                { $addToSet: { fees: { date: getCurrentFormattedDate(), day, month, year, amount, feesStatus: false, shift } } }
            );
        }
    }
    const currentFees = aggregatedFees.map((fee) => ({
        ...fee,
        fees: fee.fees[fee.fees.length - 1]
    }));
    return res.status(200).json({
        success: true,
        currentFees,
    });
});

