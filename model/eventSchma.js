import mongoose from "mongoose";
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  can_host: {
    type: String,
  },
  college_id: {
    type: String,
  },
  college_name: {
    type: String,
  },
  created_by: {
    type: Object,
  },
  event_name: {
    type: String,
    unique: true,
  },
  event_description: {
    type: String,
  },
  event_place: {
    type: String,
  },
  event_images: {
    type: Array,
  },
  event_date: {
    type: String,
  },
  event_time: {
    type: String,
  },
  max_SubEvents: {
    type: Number,
  },
  max_Regsiteration: {
    type: Number,
  },
  registeration_EndDate: {
    type: String,
  },
  restriction: {
    type: String,
  },
  charge: {
    type: String,
  },
  fees: {
    type: Number,
  },
  is_this_subEvent: {
    type: Boolean,
  },
  event_visiblity: {
    type: String,
  },
  main_event_id: {
    type: String,
  },
  sub_event_list: {
    type: Array,
  },
  event_host: {
    type: Array,
  },
  event_coordinators: {
    type: Array,
  },
  event_location_coords: {
    type: Object,
  },
  registeration_list: {
    type: Array,
  },
  event_status: {
    type: Object,
  },
});
const Event = new mongoose.model("Event", EventSchema);
export default Event;
