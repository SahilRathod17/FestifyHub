import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
  announcement_description: {
    type: String,
  },
  announcement_title: {
    type: String,
  },
  announcement_type: {
    type: String,
  },
  college_id: {
    type: String,
  },
  college_name: {
    type: String,
  },
  short_description: {
    type: String,
  },
});
const Announcement = new mongoose.model("Accouncement", AnnouncementSchema);
export default Announcement;
