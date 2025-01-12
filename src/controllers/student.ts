import { Request, Response, response } from "express";
import { TryCatch } from "../middlewares/error";
import { BaseQuery, NewStudentRequestBody, SearchRequestQuery } from "../types/types";
import ErrorHandler from "../utils/utility-class";
import { rm } from "fs";
import { Student } from "../models/student";
import { myCache } from "../app.js";
import { getCurrentDateObj, getCurrentFormattedDate, invalidateCache } from "../utils/features.js";
import { Attendance } from "../models/attendance";
import { User } from "../models/user";
import { Fees } from "../models/fees";


export const newStudent = TryCatch(
  async (req: Request<{}, {}, NewStudentRequestBody>, res, next) => {
    const { name, email, mobile, shift, feesAmount } = req.body;
    const adminId = req.query.id;
    const adminDetails = await User.findOne({ _id: adminId });
    // let library = adminDetails?.library || "defaultLibrary";
    let library = "defaultLibrary";

    const photo = req?.file;
    const { day, month, year } = getCurrentDateObj();
    const todayDate = getCurrentFormattedDate();
    if (!photo) return next(new ErrorHandler("Please add Photo", 400));
    if (!adminId || !name || !email || !mobile) {
      rm(photo?.path, () => {
        console.log("Deleted");
      });
      return next(new ErrorHandler("Please enter All Fields", 400));
    }
    const mobileString = typeof mobile === "string" ? mobile : mobile.toString();
    let newStudent = await Student.create({
      adminId,
      name,
      email,
      mobile: mobileString,
      shift,
      feesAmount,
      active: true,
      dateOfJoining: todayDate,
      // library: library ? library?.toLowerCase() : null,
      photo: photo?.path,
    });
    // Create an initial attendance record for the new student
    if (newStudent) {
      await Attendance.create({
        adminId: adminId,
        studentId: newStudent._id, // Use the _id of the newly created student
        studentName: newStudent.name,
        attendance: [{ day: null, idx1: null, idx2: null, isPresent: null, seatNumber: null }],
      });
    };
    await Fees.create({
      adminId: adminId,
      studentId: newStudent._id,
      studentName: newStudent.name,
      mobile: mobileString,
      fees: [{ date: todayDate, day: day, month: month, year: year, amount: feesAmount, feesStatus: true, shift: shift }]
    })

    invalidateCache({ student: true, admin: true, adminId: String(adminId) });
    return res.status(201).json({
      success: true,
      message: "Student Created Successfully",
    });
  }
);

export const getlatestStudents = TryCatch(async (req, res, next) => {
  let students;
  const adminId = req.query.id;
  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: 'Admin ID is required in the query parameters.',
    });
  }
  const cacheKey = `latest-students-${adminId}`;
  if (myCache.has(cacheKey)) {
    students = JSON.parse(myCache.get(cacheKey) as string);
  } else {
    students = await Student.find({ adminId: adminId, active: true }).sort({ createdAt: -1 });
    myCache.set(cacheKey, JSON.stringify(students));
  }

  return res.status(200).json({
    success: true,
    students,
  });
});

//get student by filter
export const getAllStudents = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, name, sort } = req.query;
    const page = Number(req.query.page) || 1;
    // 1,2,3,4,5,6,7,8
    // 9,10,11,12,13,14,15,16
    // 17,18,19,20,21,22,23,24
    const limit = 8;
    const skip = (page - 1) * limit;
    const baseQuery: BaseQuery = {};
    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };
    const studentPromise = Student.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);
    const [students, filteredOnlystudent] = await Promise.all([
      studentPromise,
      Student.find(baseQuery),
    ]);
    const totalPage = Math.ceil(filteredOnlystudent.length / limit);
    return res.status(200).json({
      success: true,
      students,
      totalPage,
    });
  }
);
export const getSingleStudent = TryCatch(async (req, res, next) => {
  const adminId = req.query.id; // Add this line to get adminId from query
  let student;
  const id = req.params.id;
  if (myCache.has(`student-${id}`))
    student = JSON.parse(myCache.get(`student-${id}`) as string);
  else {
    student = await Student.findOne({ _id: id });
    if (!student) return next(new ErrorHandler("student Not Found", 404));
    myCache.set(`student-${id}`, JSON.stringify(student));
  }

  return res.status(200).json({
    success: true,
    student,
  });
});
export const getAllEnrolledStudent = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    let students;
    const adminId = req.query.id;
    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: 'Admin ID is required in the query parameters.',
      });
    }
    const cacheKey = `enrolled-students-${adminId}`;
    if (myCache.has(cacheKey)) {
      students = JSON.parse(myCache.get(cacheKey) as string);
    } else {
      students = await Student.find({ adminId: adminId, active: false }).sort({ createdAt: -1 });
      myCache.set(cacheKey, JSON.stringify(students));
    }
    return res.status(200).json({
      success: true,
      students,
    });
  })

export const deleteStudent = TryCatch(
  async (req, res, next) => {
    const adminId = req.query.id;
    const id = req.params.id;
    const student = await Student.findOne({ _id: id, adminId });
    if (!student) return next(new ErrorHandler("Student Not Found", 404));
    rm(student.photo!, () => {
      console.log("Student Photo Deleted");
    });
    await Attendance.deleteOne({ studentId: student._id });
    await Fees.deleteOne({ studentId: student._id });
    await student.deleteOne();
    invalidateCache({
      student: true,
      admin: true,
      adminId: String(adminId)
    });
    return res.status(200).json({
      success: true,
      message: "Student Deleted Successfully",
    });
  }
);

export const updateStudent = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const adminId = req.query.id;
  const { name, email, mobile, shift, feesAmount, dateOfJoining, active } = req.body;
  const photo = req.file;
  const student = await Student.findOne({ _id: id, adminId });

  if (!student) return next(new ErrorHandler("student Not Found", 404));

  if (photo) {
    rm(student.photo!, () => {
      console.log("Old Photo Deleted");
    });
    student.photo = photo.path;
  }
  if (name) student.name = name;
  if (email) student.email = email;
  if (mobile) student.mobile = mobile;
  if (shift) student.shift = shift;
  // if (feesAmount) student.feesAmount = Number(feesAmount);
  let activeTrue = active === 'true';
  console.log(activeTrue);
  if (active) student.active = activeTrue;
  if (dateOfJoining) student.dateOfJoining = dateOfJoining;
  // console.log("Cache keys bef update:", myCache.keys());

  await student.save();
  // Invalidate cache for the list of latest students
  invalidateCache({
    student: true,
    admin: true,
    adminId: String(adminId),
    studentId: String(id),
  });
  return res.status(200).json({
    success: true,
    message: "student Updated Successfully",
  });
});

// const generateRandomStudentsWithAttendance = async (count: number = 1) => {
//   const students = [];
//   for (let i = 0; i < count; i++) {
//     const student = {
//       adminId: "WwVwFGKPaPWkvXveW9F40sDEqDV2",
//       name: faker.person.fullName(),
//       email: faker.internet.email(),
//       mobile: parseInt('950668666'+i),
//       photo: "uploads\\dbaeaaab-0ad5-4339-8b33-357b4d6fdcee.jpg",
//       library: null,
//       createdAt: faker.date.past(),
//       updatedAt: faker.date.recent(),
//       __v: 0,
//     };
//     const newStudent = await Student.create(student);
//     const attendance = {
//       adminId: "WwVwFGKPaPWkvXveW9F40sDEqDV2",
//       studentId: newStudent._id,
//       studentName: newStudent.name,
//       attendance: [
//         {
//           day: null,
//           idx1: null,
//           idx2: null,
//           isPresent: null,
//           seatNumber:null,
//         },
//       ],
//     };
//     await Attendance.create(attendance);
//     students.push(newStudent);
//   }
//   console.log({ success: true });
// };

// generateRandomStudentsWithAttendance();

// const deleteRandomsStudents = async (count: number = 10) => {
//   const students = await Student.find({})
//   for (let i = 0; i < students.length; i++) {
//     const student = students[i];
//     await student.deleteOne();
//   }
//   console.log({ succecss: true });
//   const attendance= await Attendance.find({})
//   for(let i = 0; i<attendance.length;i++){
//     const att = attendance[i];
//     await att.deleteOne();
//   }
// };
// deleteRandomsStudents();