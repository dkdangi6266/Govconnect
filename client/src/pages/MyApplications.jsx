import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("/applications/my");

        setApplications(response.data.applications || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load applications"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING_VERIFICATION":
        return "Pending Verification";

      case "VERIFICATION_IN_PROGRESS":
        return "Verification In Progress";

      case "OFFICER_REVIEW":
        return "Officer Review";

      case "APPROVED":
        return "Approved";

      case "REJECTED":
        return "Rejected";

      default:
        return status;
    }
  };

  if (loading) {
    return <p>Loading applications...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>My Applications</h1>

      {applications.length === 0 ? (
        <div>
          <p>You have not submitted any applications yet.</p>

          <button onClick={() => navigate("/services")}>
            Browse Services
          </button>
        </div>
      ) : (
        applications.map((application) => (
          <div key={application._id}>
            <h2>
              {application.serviceId?.name || "Government Service"}
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
              {getStatusText(application.status)}
            </p>

            <p>
              <strong>Submitted:</strong>{" "}
              {new Date(application.submittedAt).toLocaleDateString()}
            </p>

            <button
              onClick={() =>
                navigate(`/applications/${application._id}`)
              }
            >
              View Details
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MyApplications;