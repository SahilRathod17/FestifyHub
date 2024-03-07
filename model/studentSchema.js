import mongoose from "mongoose";
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  college_id: {
    type: String,
  },
  college_name: {
    type: String,
  },
  enrollment_number: {
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
  events_hosted: {
    type: Array,
  },
  tickets_for_events: {
    type: Array,
  },
  events_attended: {
    type: Array,
  },
  ispasswordset: {
    type: String,
  },
});
const Student = new mongoose.model("Student", StudentSchema);
export default Student;
