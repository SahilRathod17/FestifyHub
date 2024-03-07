import Admin from "../model/adminSchema.js";
import Teacher from "../model/teacherSchema.js";
import Student from "../model/studentSchema.js";
import Event from "../model/eventSchma.js";
import bcrypt from "bcryptjs";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: false, error: "Invalid email" });
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

export const adminSignup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await Admin.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Admin({
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
export const Adminforgetpassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admins = await Admin.find({ email });

    if (!admins || admins.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Email ID is not Registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminToUpdate = admins[0];
    adminToUpdate.password = hashedPassword;

    await adminToUpdate.save();

    res.status(200).json({
      status: true,
      message: "Password Updated Succesfully!!",
      data: adminToUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to update Admin's password",
      error: error,
    });
  }
};

export const getcounts = async (req, res) => {
  const { id } = req.body;
  try {
    const teachersCount = await Teacher.countDocuments({ college_id: id });
    const studentsCount = await Student.countDocuments({ college_id: id });
    const eventsCount = await Event.countDocuments({ college_id: id });
    res.status(200).json({
      status: true,
      message: "Item Updated successfully",
      data: {
        teachersCount,
        studentsCount,
        eventsCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to get total count",
      error: error,
    });
  }
};

export const adminUpdate = async (request, response) => {
  Admin.findByIdAndUpdate(request.body.id, request.body.updatedata)
    .then((item) => {
      if (!item) {
        return response.status(404).json({
          status: false,
          message: "Email Not Registered",
        });
      } else {
        return response.status(200).json({
          status: true,
          message: "Admin Updated Succesfully",
          data: item,
        });
      }
    })
    .catch((error) => {
      return response.status(500).json({
        status: false,
        message: "Fail to Update Admin ",
        error: error,
      });
    });
};

export const adminEventData = async (req, res) => {
  try {
    const { id } = req.body;
    const currentDate = new Date();

    // Find events with status "ACCEPTED"
    const acceptedEvents = await Event.find({
      college_id: id,
      "event_status.entity": "Admin",
      "event_status.status": "ACCEPTED",
      event_date: { $gte: currentDate.toISOString() },
    });

    // Find events with status "REQUESTED"
    const requestedEvents = await Event.find({
      college_id: id,
      "event_status.entity": "Admin",
      "event_status.status": "REQUESTED",
      event_date: { $gte: currentDate.toISOString() },
    });

    res.status(200).json({
      status: true,
      message: "Data retrieved successfully",
      data: [acceptedEvents, requestedEvents],
    });
  } catch (error) {
    console.error("Failed to get events:", error);
    return res
      .status(500)
      .json({ status: false, message: "Failed to get events", error: error });
  }
};
