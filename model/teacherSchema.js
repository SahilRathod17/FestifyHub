import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
  college_id: {
    type: String,
  },
  college_name: {
    type: String,
  },

  name: {
    type: String,
  },
  department: {
    type: String,
  },
  profileimage: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  phonenumber: {
    type: String,
  },
  events_coordinated: {
    type: Array,
  },
  events_request: {
    type: Array,
  },
  ispasswordset: {
    type: String,
  },
});
const Teacher = new mongoose.model("Teacher", TeacherSchema);
export default Teacher;
