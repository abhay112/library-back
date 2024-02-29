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
        const { amount, feesStatus, shift } = fee?.fees?.slice(-1)[0]
        const { day, month, year } = getCurrentDateObj()
        // const feeDateParts = fee.feesSubmissionDate.split('/');
        const feeDateParts = fee.fees.slice(-1)[0].date.split('/');
        const feeDay = parseInt(feeDateParts[0], 10);
        const feeMonth = parseInt(feeDateParts[1], 10) - 1; // Months are zero-indexed
        const feeYear = parseInt(feeDateParts[2], 10);
        const feeDate = new Date(feeYear, feeMonth, feeDay);
        const diffMilliseconds = currentDate.getTime() - feeDate.getTime();
        const diffDays = Math.ceil(diffMilliseconds / (1000 * 60 * 60 * 24));
        if (diffDays >= 30 && feeMonth !== currentMonth) {
            await Fees.updateOne(
                { _id: fee._id },
                {$addToSet: { fees: { date: getCurrentFormattedDate(), day, month, year, feesStatus: false, amount, shift } }},
            );
            await Fees.updateOne(
                { _id: fee._id },
                {$set: { feesStatus: false }}
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
export const getUserFees = TryCatch(async (req, res, next) => {
    const _id = req.params.id;
    try {
        const fees = await Fees.find({ _id });
        if (!fees) {
            return res.status(404).json({
                success: false,
                message: 'Fees not found for the specified studentId.',
            });
        }
        return res.status(200).json({
            success: true,
            fees,
        });
    } catch (error) {
        console.error('Error fetching fees:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
})

export const submitDueFees = TryCatch(async (req,res, next) => {
    const  _id = req.params.id;
    try {
        const fee = await Fees.findById(_id);
        if (!fee) {
            return res.status(404).json({
                success: false,
                message: 'Fees not found for the specified _id.',
            });
        }
        console.log(fee);
        await Fees.updateOne(
            { _id: _id },
            { $set: { 'fees.$[elem].date': getCurrentFormattedDate(), 'fees.$[elem].feesStatus': true } },
            { arrayFilters: [{ 'elem.feesStatus': false }] }
        );
        return res.status(200).json({
            success: true,
            message: 'Due fees submitted successfully.',
        });
    } catch (error) {
        console.error('Error submitting due fees:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});