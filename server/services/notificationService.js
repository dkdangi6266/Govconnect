const Notification = require("../models/Notification");

const createNotification = async ({
  userId,
  applicationId = null,
  type,
  title,
  message
}) => {
  const notification = await Notification.create({
    userId,
    applicationId,
    type,
    title,
    message
  });

  return notification;
};

module.exports = {
  createNotification
};