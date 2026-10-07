import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await api.get(`/applications/${id}`);
        setApplication(response.data.application);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load application"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

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
    return <p>Loading application...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!application) {
    return <p>Application not found.</p>;
  }

  return (
    <div>
      <button onClick={() => navigate("/applications")}>
        ← Back to My Applications
      </button>

      <h1>Application Details</h1>

      <hr />

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
        {new Date(application.submittedAt).toLocaleString()}
      </p>

      {application.remarks && (
        <p>
          <strong>Remarks:</strong> {application.remarks}
        </p>
      )}

      <hr />

      <h2>Application Progress</h2>

      <ul>
        <li>
          ✓ Application Submitted
        </li>

        <li>
          {application.status === "PENDING_VERIFICATION"
            ? "⏳"
            : "✓"}{" "}
          Identity Verification
        </li>

        <li>
          {application.status === "PENDING_VERIFICATION"
            ? "⏳"
            : "✓"}{" "}
          Data Verification
        </li>

        <li>
          {application.status === "OFFICER_REVIEW" ||
          application.status === "APPROVED" ||
          application.status === "REJECTED"
            ? "✓"
            : "⏳"}{" "}
          Officer Review
        </li>

        <li>
          {application.status === "APPROVED"
            ? "✓"
            : application.status === "REJECTED"
            ? "✗"
            : "⏳"}{" "}
          Final Decision
        </li>
      </ul>

      <hr />

      <button
        onClick={() =>
          navigate(`/applications/${application._id}/documents`)
        }
      >
       
        Manage Documents
      </button>
       <button
  onClick={() =>
    navigate(`/applications/${application._id}/document-list`)
  }
>
  View Documents
</button>

      <button
        onClick={() =>
          navigate(`/applications/${application._id}/consent`)
        }
      >
        Manage Consent
      </button>
      <button
  onClick={() =>
    navigate(`/applications/${application._id}/verification`)
  }
>
  Verification Status
</button>
    </div>
  );
};

export default ApplicationDetails;