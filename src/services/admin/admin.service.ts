import mongoose from "mongoose";
import { Admin } from "../../models/admin.js";
import ErrorHandler from "../../utils/utility-class.js";
import { StatusCodes } from "http-status-codes";
import { Library } from "../../models/library.js";


const adminService = {
  createAdmin: async (userData: {
    name: string;
    email: string;
    password: string;
    library: string;
  }) => {
    const { name, email, password, library } = userData;

    if (!name || !email || !password || !library) {
      throw new ErrorHandler("Please add all fields", StatusCodes.BAD_REQUEST);
    }

    let admin = await Admin.findOne({ email });
    if (admin) {
      throw new ErrorHandler("Email already registered", StatusCodes.CONFLICT);
    }

    admin = await Admin.create({
      name,
      email,
      password, // Password will be hashed in the model's pre-save hook
      library,
    });

    return {
      success: true,
      message: `Admin created successfully, welcome ${admin.name}`,
      admin,
    };
  },

  fetchAdmins: async () => {
    const admins = await Admin.find();
    if (!admins || admins.length === 0) {
      throw new ErrorHandler("No admins found", StatusCodes.NOT_FOUND);
    }

    return {
      success: true,
      admins,
    };
  },

  fetchAdminById: async (id: string) => {
    const admin = await Admin.findById(id);
    if (!admin) {
      throw new ErrorHandler("Admin not found", StatusCodes.NOT_FOUND);
    }

    return {
      success: true,
      admin,
    };
  },

  updateAdmin: async (id: string, userData: {
    name?: string;
    email?: string;
    password?: string;
    library?: any; // object id
  }) => {
    const admin = await Admin.findById(id);
    if (!admin) {
      throw new ErrorHandler("Admin not found", StatusCodes.NOT_FOUND);
    }

    // Update fields as necessary
    if (userData.name) admin.name = userData.name;
    if (userData.email) {
      const existingAdmin = await Admin.findOne({ email: userData.email });
      if (existingAdmin) {
        throw new ErrorHandler("Email already registered", StatusCodes.CONFLICT);
      }
      admin.email = userData.email;
    }
    if (userData.password) admin.password = userData.password; // Password will be hashed in the pre-save hook
    if (userData.library) admin.library = userData.library;

    await admin.save(); // Save the updated admin

    return {
      success: true,
      message: `Admin updated successfully, welcome ${admin.name}`,
      admin,
    };
  },

  deleteAdmin: async (id: string) => {
    const admin = await Admin.findById(id);
    if (!admin) {
      throw new ErrorHandler("Admin not found", StatusCodes.NOT_FOUND);
    }

    await Admin.deleteOne({ _id: id }); 
    return {
      success: true,
      message: "Admin deleted successfully",
    };
  },
};

const libraryService = {
  // Create Library
  createLibrary: async (libraryData: {
    name: string;
    address: string;
    pincode: number;
    students?: mongoose.Schema.Types.ObjectId[];
    admins?: mongoose.Schema.Types.ObjectId[];
  }) => {
    const {  name, address, pincode } = libraryData;

    if (!name || !address || !pincode) {
      throw new ErrorHandler("Please add all required fields", StatusCodes.BAD_REQUEST);
    }

    const existingLibrary = await Library.findOne({pincode,name});
    if (existingLibrary) {
      throw new ErrorHandler("Library with this ID already exists", StatusCodes.CONFLICT);
    }

    const library = await Library.create({
      name,
      address,
      pincode,
      students: libraryData.students || [],
      admins: libraryData.admins || [],
    });

    return {
      success: true,
      message: `Library created successfully: ${library.name}`,
      library,
    };
  },

  // Fetch All Libraries
  fetchLibraries: async () => {
    const libraries = await Library.find().populate("students admins");
    if (!libraries || libraries.length === 0) {
      throw new ErrorHandler("No libraries found", StatusCodes.NOT_FOUND);
    }

    return {
      success: true,
      libraries,
    };
  },

  // Fetch Library by ID
  fetchLibraryById: async (id: string) => {
    const library = await Library.findById(id).populate("students admins");
    if (!library) {
      throw new ErrorHandler("Library not found", StatusCodes.NOT_FOUND);
    }

    return {
      success: true,
      library,
    };
  },

  // Update Library
  updateLibrary: async (id: string, libraryData: {
    name?: string;
    address?: string;
    pincode?: number;
    students?: mongoose.Schema.Types.ObjectId[];
    admins?: mongoose.Schema.Types.ObjectId[];
  }) => {
    const library = await Library.findById(id);
    if (!library) {
      throw new ErrorHandler("Library not found", StatusCodes.NOT_FOUND);
    }

    // Update fields as necessary
    if (libraryData.name) library.name = libraryData.name;
    if (libraryData.address) library.address = libraryData.address;
    if (libraryData.pincode) library.pincode = libraryData.pincode;
    if (libraryData.students) library.students = libraryData.students;
    if (libraryData.admins) library.admins = libraryData.admins;

    await library.save(); 

    return {
      success: true,
      message: `Library updated successfully: ${library.name}`,
      library,
    };
  },

  // Delete Library
  deleteLibrary: async (id: string) => {
    const library = await Library.findById(id);
    if (!library) {
      throw new ErrorHandler("Library not found", StatusCodes.NOT_FOUND);
    }

    await Library.deleteOne({ _id: id });
    return {
      success: true,
      message: "Library deleted successfully",
    };
  },
};





export {adminService,libraryService};
