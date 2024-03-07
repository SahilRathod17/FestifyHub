import express from "express";
import {
  Adminforgetpassword,
  adminEventData,
  adminLogin,
  adminSignup,
  adminUpdate,
  getcounts,
} from "../controller/admin_controller.js";
import {
  teacherLogin,
  teacherSignup,
  teacherItemUpdate,
  addMultipleTeacher,
  getTeacherByCollegeId,
  Teacherforgetpassword,
  SearchTeacher,
  teacherAssignEvents,
  teacherAssignRequested,
} from "../controller/teacher_controller.js";
import {
  studentLogin,
  studentSignup,
  studentItemUpdate,
  addMultipleStudent,
  getStudentsByCollegeId,
  Studentforgetpassword,
  SearchStudent,
} from "../controller/student_controller.js";
import {
  addEvent,
  getEventByCollegeId,
  getEvents,
  upadteEvent,
} from "../controller/Event_controller.js";
import multer from "multer";
import {
  addAnnouncement,
  announcementItemUpdate,
  getAnnouncementByCollegeId,
} from "../controller/announcement_controller.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Admin Routes
router.post("/adminLogin", adminLogin);
router.post("/adminSignup", adminSignup);
router.patch("/Adminforgetpassword", Adminforgetpassword);
router.post("/getcounts", getcounts);
router.post("/adminUpdate", adminUpdate);

//Teacher Routes
router.post("/teacherLogin", teacherLogin);
router.post("/teacheradd", teacherSignup);
router.patch("/Teacherforgetpassword", Teacherforgetpassword);
router.patch("/teacherItemUpdate", teacherItemUpdate);
router.post("/addMultipleTeacher", upload.single("file"), addMultipleTeacher);
router.post("/teacherbyCollegeID", getTeacherByCollegeId);
router.post("/SearchTeacher", SearchTeacher);
router.post("/teacherAssignEvents", teacherAssignEvents);
router.post("/teacherAssignRequested", teacherAssignRequested);

//Student Routes
router.post("/studentLogin", studentLogin);
router.post("/studentadd", studentSignup);
router.patch("/Studentforgetpassword", Studentforgetpassword);
router.post("/studentbyCollegeID", getStudentsByCollegeId);
router.patch("/studentItemUpdate", studentItemUpdate);
router.post("/addMultipleStudent", upload.single("file"), addMultipleStudent);
router.post("/SearchStudent", SearchStudent);

//Event
router.post("/addEvent", addEvent);
router.post("/eventbyCollegeID", getEventByCollegeId);
router.patch("/upadteEvent", upadteEvent);
router.post("/getEvents", getEvents);
router.post("/adminEventData", adminEventData);

//Anncounments
router.post("/addAnnouncement", addAnnouncement);
router.post("/AnnouncementByCollegeId", getAnnouncementByCollegeId);
router.patch("/AnnouncementItemUpdate", announcementItemUpdate);
export default router;
