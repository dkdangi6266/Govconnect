import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const OfficerDashboard = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("/applications/officer");

        setApplications(response.data.applications || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load assigned applications"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <p>Loading officer dashboard...</p>;
  }

  return (
    <div>
      <h1>Government Officer Dashboard</h1>

      <p>
        <strong>Assigned Applications:</strong>{" "}
        {applications.length}
      </p>

      {error && <p>{error}</p>}

      {applications.length === 0 ? (
        <p>No applications assigned to you.</p>
      ) : (
        applications.map((application) => (
          <div key={application._id}>
            <h2>
              {application.serviceId?.name ||
                "Government Service"}
            </h2>

            <p>
              <strong>Application ID:</strong>{" "}
              {application._id}
            </p>

            <p>
              <strong>Service Code:</strong>{" "}
              {application.serviceId?.code || "N/A"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {application.status}
            </p>

            <p>
              <strong>Submitted:</strong>{" "}
              {new Date(
                application.submittedAt
              ).toLocaleString()}
            </p>

            <button
              onClick={() =>
                navigate(
                  `/officer/applications/${application._id}`
                )
              }
            >
              View Application
            </button>

            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default OfficerDashboard;