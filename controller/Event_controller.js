import Event from "../model/eventSchma.js";

export const addEvent = async (req, res) => {
  const { event_name } = req.body;

  try {
    const existingEvent = await Event.findOne({ event_name });

    if (existingEvent) {
      return res
        .status(400)
        .json({ status: false, message: "same Event Name already in use" });
    }

    const newEvent = new Event({
      ...req.body,
    });

    newEvent
      .save()
      .then((item) => {
        return res.status(201).json({
          status: true,
          message: "Event Created Succesfully !!",
          data: item,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          status: false,
          message: "Fail to Add Datas",
          error: error,
        });
      });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Fail to Add Datas ", error: error });
  }
};

export const getEventByCollegeId = async (req, res) => {
  try {
    const event = await Event.find({
      college_id: req.body.id,
    });
    if (!event || event.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No event found for this college ID",
      });
    }

    res.status(200).json({
      status: true,
      message: "event found for this college ID",
      data: event,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Failed to get event", error: error });
  }
};

export const upadteEvent = async (request, response) => {
  await Event.findByIdAndUpdate(request.body.id, request.body.updatedata)
    .then((item) => {
      if (!item) {
        return response.status(404).json({
          status: false,
          message: "No Event Found",
        });
      } else {
        return response.status(200).json({
          status: true,
          message: "Event Updated Succesfully !",
          data: item,
        });
      }
    })
    .catch((error) => {
      return response.status(500).json({
        status: false,
        message: "Fail to Update Event ",
        error: error,
      });
    });
};

export const getEvents = async (req, res) => {
  try {
    const { id } = req.body;
    const currentDate = new Date();

    const events = await Event.find({
      college_id: id,
      restriction: "Public",
      event_visiblity: "PUBLISHED",
      event_date: { $gte: currentDate.toISOString() },
    });

    if (!events || events.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No upcoming events found for this college",
      });
    }

    res.status(200).json({
      status: true,
      message: "Upcoming events found for this college",
      data: events,
    });
  } catch (error) {
    console.error("Failed to get events:", error);
    return res
      .status(500)
      .json({ status: false, message: "Failed to get events", error: error });
  }
};
