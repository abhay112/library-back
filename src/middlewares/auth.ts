import { Admin } from "../models/admin.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

// Middleware to make sure only admin is allowed
export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;
  if (!id) return next(new ErrorHandler("Login First", 401));
  const user = await Admin.findById(id);
  if (!user) return next(new ErrorHandler("Admin Id is Not valid", 401));
  // if (user.role !== "admin")
  //   return next(new ErrorHandler("Saale Aukat Nhi Hai Teri", 403));
  next();
});
