import { useEffect, useState } from "react";
import api from "../api/axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications/my");

      setNotifications(response.data.notifications || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(
        `/notifications/${notificationId}/read`
      );

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to mark notification as read"
      );
    }
  };

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  return (
    <div>
      <h1>Notifications</h1>

      {error && <p>{error}</p>}

      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        notifications.map((notification) => (
          <div key={notification._id}>
            <h2>{notification.title}</h2>

            <p>{notification.message}</p>

            <p>
              <strong>Type:</strong> {notification.type}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(
                notification.createdAt
              ).toLocaleString()}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {notification.isRead
                ? "Read"
                : "Unread"}
            </p>

            {!notification.isRead && (
              <button
                onClick={() =>
                  markAsRead(notification._id)
                }
              >
                Mark as Read
              </button>
            )}

            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;