
import mongoose, { Document } from "mongoose";
import { myCache } from "../app.js";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";

// const uri = 'mongodb+srv://admin:admin@cluster1.3xsqvxd.mongodb.net/libraryDB?retryWrites=true&w=majority'
const uri = 'mongodb+srv://admin:admin@cluster1.3xsqvxd.mongodb.net/studyPointDB?retryWrites=true&w=majority'

export async function connect() {
  try {
      await mongoose.connect(uri);
      console.log("Connected to MongoDB");
  } catch (error) {
      console.error("Error connecting to MongoDB:", error);
  }
}

export const invalidateCache = ({
  student,
  admin,
  studentId,
  adminId,
  attendance,
}: InvalidateCacheProps) => {
  if (student) {
    const studentKeys: string[] = [
      "latest-students",
      `student-${studentId}`
      // "categories",
      // "all-products",
    ];
    if (attendance) {
      studentKeys.push(`attendance-${studentId}`);
    }
    if(adminId){
      studentKeys.push(`latest-students-${adminId}`);
      studentKeys.push(`enrolled-students-${adminId}`);
    }
    if(studentId){
      studentKeys.push(`student-${studentId}`);
    }

    if (typeof studentId === "string") studentKeys.push(`student-${studentId}`);
    

    // if (typeof productId === "object")
    //   productId.forEach((i) => productKeys.push(`product-${i}`));

    myCache.del(studentKeys);
  }
};
export const getCurrentFormattedDate=()=> {
  const currentDate = new Date();
  return `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
}
export const getCurrentDateObj = () => {
  const currentDate = new Date();

  // Define arrays for day names and month names
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Get day, month, and year from the current date
  const day = daysOfWeek[currentDate.getDay()];
  const month = monthsOfYear[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  // Return an object with the formatted date properties
  return { day, month, year };
};