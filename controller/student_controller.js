import Student from "../model/studentSchema.js";
import bcrypt from "bcryptjs";
import xlsx from "xlsx";

export const studentLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Student.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: false, error: "Invalid email" });
    }
    if (user.ispasswordset === "false") {
      return res.status(400).json({
        status: false,
        error: "Please set a password before logging in",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: false, error: "Password Do not match" });
    }

    res
      .status(200)
      .json({ status: true, message: "Login successful", data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Fail to Get Data ", error: error });
  }
};

export const studentSignup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await Student.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "Email already in use" });
    }
    // generate random pass
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Student({
      ...req.body,
      password: hashedPassword, //random pass
    });

    newUser
      .save()
      .then((item) => {
        return res.status(201).json({
          status: true,
          message: "Data Added successfully",
          data: item,
        });
      })
      .catch((error) => {
        return res
          .status(500)
          .json({ status: false, message: "Fail to Add Data ", error: error });
      });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Fail to Add Data ", error: error });
  }
};
export const Studentforgetpassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const students = await Student.find({ email });

    if (!students || students.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Email ID is not Registered, Contact you Admin",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const studentToUpdate = students[0];
    studentToUpdate.password = hashedPassword;
    studentToUpdate.ispasswordset = "true";

    await studentToUpdate.save();

    res.status(200).json({
      status: true,
      message: "Password Updated Succesfully!!",
      data: studentToUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to update student's password",
      error: error,
    });
  }
};
export const getStudentsByCollegeId = async (req, res) => {
  try {
    const students = await Student.find({ college_id: req.body.id });

    if (!students || students.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No students found for this college ID",
      });
    }

    res.status(200).json({
      status: true,
      message: "students found for this college ID",
      data: students,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Failed to get students", error: error });
  }
};

export const studentItemUpdate = async (request, response) => {
  Student.findByIdAndUpdate(request.body.id, request.body.updatedata)
    .then((item) => {
      if (!item) {
        return response.status(404).json({
          status: false,
          message: "Email Not Registered, Contact your admin",
        });
      } else {
        return response.status(200).json({
          status: true,
          message: "Password Updated Succesfully",
          data: item,
        });
      }
    })
    .catch((error) => {
      return response
        .status(500)
        .json({ status: false, message: "Fail to Update Data ", error: error });
    });
};

export const addMultipleStudent = async (req, res) => {
  const { id, college_name } = req.body;
  const fileBuffer = req.file.buffer;
  const fileExtension = req.file.originalname.split(".").pop().toLowerCase();

  let parsedData;
  if (fileExtension === "xlsx") {
    try {
      const workbook = xlsx.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      parsedData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      return res
        .status(500)
        .send({ status: false, message: "Internal Server Error" });
    }
  } else {
    console.error("Unsupported file type");
    return res
      .status(400)
      .send({ status: false, message: "Unsupported file type" });
  }

  const existingStudents = await Student.find({ college_name: college_name });
  const duplicateStudents = [];
  const studentsToAdd = parsedData.filter((student) => {
    const isDuplicate = existingStudents.some(
      (existingStudent) => existingStudent.email === student.Email
    );
    if (isDuplicate) {
      duplicateStudents.push(student);
    }
    return !isDuplicate;
  });

  const data = studentsToAdd.map((item) => {
    //send email with password
    return {
      ...item,
      college_id: id,
      college_name: college_name,
      name: item.Name,
      department: item.Department,
      enrollment_number: item.EnrollmentNumber,
      profileimage: "",
      email: item.Email,
      password: "123@456",
      phonenumber: item.Phonenumber,
      events_hosted: [],
      events_attended: [],
      tickets_for_events: [],
      ispasswordset: "false",
    };
  });
  try {
    const result = await Student.insertMany(data);
    if (duplicateStudents.length > 0) {
      return res.status(200).send({
        status: true,
        message:
          "Students List saved and Duplicate students were found and Neglected.",
        duplicate: duplicateStudents,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "Students List saved !!!",
      });
    }
  } catch (error) {
    console.error("Error saving data to MongoDB:", error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

export const SearchStudent = async (req, res) => {
  try {
    const { searchText } = req.body;
    let query = {};

    if (searchText) {
      query.$or = [
        { name: { $regex: new RegExp(searchText, "i") } },
        { department: { $regex: new RegExp(searchText, "i") } },
      ];
    }

    const student = await Student.find(query);

    res.status(200).send({
      status: true,
      data: student,
      message: "Data saved to MongoDB",
    });
  } catch (error) {
    console.error("Error searching for students:", error);
    res.status(500).send({ status: false, message: "Internal Server Error" });
  }
};
