import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  _id: string;
}


export interface NewAdminRequestBody {
  name:string;
  email: string;
  password:string;
  library:string;
  _id: string;
}
export interface NewSeatRequestBody {
  rows:number;
  columns:number;
  matrix: number;
  adminId: string;
  _id: string;
  filledSeats?: {
      day:string;
      idx1: number;
      idx2: number;
      isPresent:string;
      studentId: string;
      studentName: string;
  }[];
};
export interface FetchSeatRequestBody{
  adminId:string;
  // studentId:string;
  // studentName:string
  // day:string,
  // idx1:Number,
  // idx2:Number,
  // isPresent: string
}

export interface NewQueryRequestBody {
  name: string;
  email: string;
  mobile: string;
  library:string;
  location:string;
  _id: string;
}
export interface NewEnquiryRequestBody {
  name: string;
  email: string;
  mobile: string;
  gender:string;
  shift:string;
  message:string;
  adminId:string;
  _id: string;
}
export interface NewAttendanceRequestBody {
  adminId:string;
  studentId:string;
  studentName:string
  day:string,
  idx1:Number,
  idx2:Number,
  isPresent: string
}


export interface ParamTypes{
  id:string;
}

export interface NewStudentRequestBody {
  adminId:string;
  name: string;
  email: string;
  mobile: number;
  library:string;
  shift:string;
  feesAmount:number;
  photo: string;
  active:boolean;
  attendance:any; // letter it will rectify array to set letter
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

// export type SearchRequestQuery = {
//   search?: string;
//   price?: string;
//   category?: string;
//   sort?: string;
//   page?: string;
// };
export type SearchRequestQuery = {
  id?:string;
  adminId?:string;
  search?: string;
  name?: string;
  sort?: string;
  page?: string;
};

export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
}
// export interface BaseQuery {
//   name?: {
//     $regex: string;
//     $options: string;
//   };
//   price?: { $lte: number };
//   category?: string;
// }

export type InvalidateCacheProps = {
  student?: boolean;
  admin?: boolean;
  adminId?: string;
  attendance?:boolean;
  studentId?: string | string[];
};
// export type InvalidateCacheProps = {
//   student?: boolean;
//   order?: boolean;
//   admin?: boolean;
//   userId?: string;
//   orderId?: string;
//   productId?: string | string[];
// };

export type OrderItemType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
};

export type ShippingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
};

export interface NewOrderRequestBody {
  shippingInfo: ShippingInfoType;
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItems: OrderItemType[];
}
