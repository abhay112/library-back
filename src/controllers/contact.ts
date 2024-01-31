import { NextFunction, Request, Response } from "express";
import { Contact } from "../models/contact.js";
import { NewQueryRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import requestIp  from 'request-ip';

export const newQuery = TryCatch(
  async (
    req: Request<{}, {}, NewQueryRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, mobile,library, _id } = req.body;

    if (!name || !email || !mobile || !library)
      return next(new ErrorHandler("Please add all fields", 400));

      const clientIp = requestIp.getClientIp(req);
    await Contact.create({
      name,
      email,
      mobile,
      library,
      location:clientIp,
      _id,
    });

    return res.status(201).json({
      success: true,
      message: `Welcome, ${name}`,
    });
  }
);



