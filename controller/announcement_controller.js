import Announcement from "../model/announcementSchema.js";

export const addAnnouncement = async (req, res) => {
  const newAnnouncement = new Announcement({
    ...req.body,
  });

  try {
    newAnnouncement
      .save()
      .then((item) => {
        return res.status(201).json({
          status: true,
          message: "Data Added successfully",
          data: item,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          status: false,
          message: "Fail to Add Data ",
          error: error,
        });
      });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Fail to Add Data ", error: error });
  }
};

export const getAnnouncementByCollegeId = async (req, res) => {
  try {
    const announcement = await Announcement.find({ college_id: req.body.id });

    if (!announcement || announcement.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No Announcement found for this college ID",
      });
    }

    res.status(200).json({
      status: true,
      message: "Announcements found for this college ID",
      data: announcement,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to get Announcements",
      error: error,
    });
  }
};
export const announcementItemUpdate = async (request, response) => {
  Announcement.findByIdAndUpdate(request.body.id, request.body.updatedata)
    .then((item) => {
      if (!item) {
        return response
          .status(404)
          .json({ status: false, message: "Item not found" });
      } else {
        return response.status(200).json({
          status: true,
          message: "Item Updated successfully",
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
