import { NextFunction, Request, Response } from "express";
import { NewEnquiryRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import requestIp  from 'request-ip';
import { Enquiry } from "../models/enquiry.js";

export const newEnquiry = TryCatch(
  async (
    req: Request<{}, {}, NewEnquiryRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const adminId = req.query.id;
    const { name, email, mobile, gender, shift, _id } = req.body;
    console.log(name,email,mobile,gender,shift,_id);
    if (!name || !email || !mobile)
      return next(new ErrorHandler("Please add all fields", 400));
      const clientIp = requestIp.getClientIp(req);
    await Enquiry.create({
      name,
      email,
      mobile,
      gender,
      shift,
      adminId,
      _id,
    });

    return res.status(201).json({
      success: true,
      message: `enquiry created for , ${name}`,
    });
  }
);
export const getEnquiries = TryCatch(
    async (
      req: Request<{}, {}, NewEnquiryRequestBody>,
      res: Response,
      next: NextFunction
    ) => {
      const adminId = req.query.id;
      const enquiries = await Enquiry.find({ adminId }).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        enquiries,
      });
    }
);
export const getSingleEnquiries = TryCatch(
  async ( req,res,next) => {
    const adminId = req.query.id;
    const {id} = req.params
    const enquiries = await Enquiry.findOne({ _id:id });
    return res.status(200).json({
      success: true,
      enquiries,
    });
  }
);
interface EnquiryRequestParams {
  id: string;
}
// export const updateEnquiry = TryCatch(
//   async (
//     req: Request<{}, {}, NewEnquiryRequestBody>,
//     res: Response,
//     next: NextFunction
//   ) => {
//     const adminId = req.query.id;
//     const enquiryId = req.params.id; // Assuming you include the enquiryId in the route path
//     const { name,message } = req.body;
//     // Validate if the enquiry exists
//     const existingEnquiry = await Enquiry.findById(enquiryId);
//     if (!existingEnquiry) {
//       return next(new ErrorHandler("Enquiry not found", 404));
//     }
    
//     existingEnquiry.message = message;
//     existingEnquiry.name = name;
//     await existingEnquiry.save();
//     return res.status(200).json({
//       success: true,
//       message: `Enquiry updated for ${existingEnquiry.name}`,
//     });
//   }
// );
// export const deleteEnquiry = TryCatch(
//   async (
//     req: Request<{}, {}, NewEnquiryRequestBody>,
//     res: Response,
//     next: NextFunction
//   ) => {
//     const adminId = req.query.id;
//     const enquiryId = req.params.id;

//     // Validate if the enquiry exists
//     const existingEnquiry = await Enquiry.findById(enquiryId);
//     if (!existingEnquiry) {
//       return next(new ErrorHandler("Enquiry not found", 404));
//     }

//     // Check if the existingEnquiry object is an instance of the Enquiry model
//     if (!(existingEnquiry instanceof Enquiry)) {
//       return next(new ErrorHandler("Invalid enquiry object", 500));
//     }

//     // Delete the enquiry
//     await existingEnquiry.deleteOne();

//     return res.status(200).json({
//       success: true,
//       message: `Enquiry deleted for ${existingEnquiry.name}`,
//     });
//   }
// );

export const updateEnquiry = TryCatch(
  async (
    req,
    res,
    next
  ) => {
    const adminId = req.query.id;
    const enquiryId = req.params.id; // Assuming you include the enquiryId in the route path
    const { name,message } = req.body;
    // Validate if the enquiry exists
    const existingEnquiry = await Enquiry.findById(enquiryId);
    if (!existingEnquiry) {
      return next(new ErrorHandler("Enquiry not found", 404));
    }
    
    existingEnquiry.message = message;
    existingEnquiry.name = name;
    await existingEnquiry.save();
    return res.status(200).json({
      success: true,
      message: `Enquiry updated for ${existingEnquiry.name}`,
    });
  }
);
export const deleteEnquiry = TryCatch(
  async (
    req,res,next
  ) => {
    const adminId = req.query.id;
    const enquiryId = req.params.id;

    // Validate if the enquiry exists
    const existingEnquiry = await Enquiry.findById(enquiryId);
    if (!existingEnquiry) {
      return next(new ErrorHandler("Enquiry not found", 404));
    }

    // Check if the existingEnquiry object is an instance of the Enquiry model
    if (!(existingEnquiry instanceof Enquiry)) {
      return next(new ErrorHandler("Invalid enquiry object", 500));
    }

    // Delete the enquiry
    await existingEnquiry.deleteOne();

    return res.status(200).json({
      success: true,
      message: `Enquiry deleted for ${existingEnquiry.name}`,
    });
  }
);



