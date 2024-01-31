
import mongoose, { Document } from "mongoose";
import { myCache } from "../app.js";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";

const uri = 'mongodb+srv://admin:admin@cluster1.3xsqvxd.mongodb.net/libraryDB?retryWrites=true&w=majority'

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
}: InvalidateCacheProps) => {
  if (student) {
    const studentKeys: string[] = [
      "latest-students",
      // "categories",
      // "all-products",
    ];

    if (typeof studentId === "string") studentKeys.push(`product-${studentId}`);

    // if (typeof productId === "object")
    //   productId.forEach((i) => productKeys.push(`product-${i}`));

    myCache.del(studentKeys);
  }
};
export const getCurrentFormattedDate=()=> {
  const currentDate = new Date();
  return `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
}
