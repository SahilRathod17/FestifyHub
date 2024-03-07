import Teacher from "../model/teacherSchema.js";
import bcrypt from "bcryptjs";
import xlsx from "xlsx";
import Event from "../model/eventSchma.js";

export const teacherLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Teacher.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ status: false, error: "Invalid email or password" });
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
        .json({ status: false, error: "Invalid email or password" });
    }

    res
      .status(200)
      .json({ status: true, message: "Login successful", data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Failed to Get Data", error: error });
  }
};

export const teacherSignup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await Teacher.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Teacher({
      ...req.body,
      password: hashedPassword,
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
export const Teacherforgetpassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const teacher = await Teacher.find({ email });

    if (!teacher || teacher.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No Teacher found for this college EmailID",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacherToUpdate = teacher[0];
    teacherToUpdate.password = hashedPassword;
    teacherToUpdate.ispasswordset = "true";

    await teacherToUpdate.save();

    res.status(200).json({
      status: true,
      message: "Teacher's password has been updated",
      data: teacherToUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to update Teacher's password",
      error: error,
    });
  }
};
export const teacherItemUpdate = async (request, response) => {
  Teacher.findByIdAndUpdate(request.body.id, request.body.updatedata)
    .then((item) => {
      if (!item) {
        return response.status(404).json({
          status: false,
          message: "Email Not Registered, Contact your admin",
        });
      } else {
        return response.status(200).json({
          status: true,
          message: "Password Updated Succesfully !",
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

export const getTeacherByCollegeId = async (req, res) => {
  try {
    const teacher = await Teacher.find({ college_id: req.body.id });

    if (!teacher || teacher.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No teacher found for this college ID",
      });
    }

    res.status(200).json({
      status: true,
      message: "teacher found for this college ID",
      data: teacher,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Failed to get teacher", error: error });
  }
};

export const addMultipleTeacher = async (req, res) => {
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

  const existingTeacher = await Teacher.find({ college_name: college_name });
  const duplicateTeacher = [];
  const teacherToAdd = parsedData.filter((teacher) => {
    const isDuplicate = existingTeacher.some(
      (existingTeachers) => existingTeachers.email === teacher.Email
    );
    if (isDuplicate) {
      duplicateTeacher.push(teacher);
    }
    return !isDuplicate;
  });

  const data = teacherToAdd.map((item) => {
    return {
      ...item,
      college_id: id,
      college_name: college_name,
      name: item.Name,
      department: item.Department,
      profileimage: "",
      email: item.Email,
      password: "123@456",
      phonenumber: item.Phonenumber,
      events_hosted: [],
      events_request: [],
      ispasswordset: "false",
    };
  });
  try {
    const result = await Teacher.insertMany(data);
    if (duplicateTeacher.length > 0) {
      return res.status(200).send({
        status: true,
        message:
          "Teachers List saved and Duplicate students were found and Neglected.",
        duplicate: duplicateTeacher,
      });
    } else {
      return res.status(200).send({
        status: true,
        message: "Teachers List saved !!!",
      });
    }
  } catch (error) {
    console.error("Error saving data to MongoDB:", error);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
};

export const SearchTeacher = async (req, res) => {
  try {
    const { searchText } = req.body;
    let query = {};

    if (searchText) {
      query.$or = [
        { name: { $regex: new RegExp(searchText, "i") } },
        { department: { $regex: new RegExp(searchText, "i") } },
      ];
    }

    const teachers = await Teacher.find(query);

    res.status(200).send({
      status: true,
      data: teachers,
      message: "Data saved to MongoDB",
    });
  } catch (error) {
    console.error("Error searching for teachers:", error);
    res.status(500).send({ status: false, message: "Internal Server Error" });
  }
};

export const teacherAssignEvents = async (req, res) => {
  try {
    const { id } = req.body;
    const currentDate = new Date();
    const events = await Event.aggregate([
      {
        $match: {
          "event_coordinators._id": id,
          "event_coordinators.status": "ACCEPTED",
          event_date: { $gte: currentDate.toISOString() },
        },
      },
    ]);

    if (!events || events.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No events found for this teacher",
      });
    }

    res.status(200).json({
      status: true,
      message: "Events found for this teacher",
      data: events,
    });
  } catch (error) {
    console.error("Failed to get events:", error);
    return res
      .status(500)
      .json({ status: false, message: "Failed to get events", error: error });
  }
};

export const teacherAssignRequested = async (req, res) => {
  try {
    const { id } = req.body;
    const currentDate = new Date();

    const events = await Event.aggregate([
      {
        $match: {
          "created_by.entity": "student",
          "event_coordinators._id": id,
          "event_coordinators.status": "REQUESTED",
          event_date: { $gte: currentDate.toISOString() },
        },
      },
    ]);

    if (!events || events.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No events found for this teacher",
      });
    }

    res.status(200).json({
      status: true,
      message: "Events found for this teacher",
      data: events,
    });
  } catch (error) {
    console.error("Failed to get events:", error);
    return res
      .status(500)
      .json({ status: false, message: "Failed to get events", error: error });
  }
};
