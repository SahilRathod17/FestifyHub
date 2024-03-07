import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  phonenumber: {
    type: String,
  },
  profileimage: {
    type: String,
  },
  address: {
    type: String,
  },
  state: {
    type: String,
  },
  town: {
    type: String,
  },
  location: {
    type: Object,
  },
});
const Admin = new mongoose.model("Admin", AdminSchema);
export default Admin;
