import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const OfficerApplicationReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [remarks, setRemarks] = useState("");

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const updateStatus = async (status) => {
    setError("");
    setSuccess("");

    if (!remarks.trim()) {
      setError("Please enter remarks before submitting.");
      return;
    }

    setProcessing(status);

    try {
      const response = await api.patch(
        `/applications/${id}/status`,
        {
          status,
          remarks,
        }
      );

      setApplication(response.data.application);

      setSuccess(
        status === "APPROVED"
          ? "Application approved successfully."
          : "Application rejected successfully."
      );

      setRemarks("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update application status"
      );
    } finally {
      setProcessing("");
    }
  };

  if (loading) {
    return <p>Loading application...</p>;
  }

  if (!application) {
    return <p>Application not found.</p>;
  }

  return (
    <div>
      <button
        onClick={() =>
          navigate("/officer/dashboard")
        }
      >
        ← Back to Dashboard
      </button>

      <h1>Application Review</h1>

      <hr />

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

      <hr />

      <h2>Citizen Information</h2>

      <p>
        <strong>Name:</strong>{" "}
        {application.userId?.name || "N/A"}
      </p>

      <p>
        <strong>Email:</strong>{" "}
        {application.userId?.email || "N/A"}
      </p>

      <p>
        <strong>Government ID:</strong>{" "}
        {application.userId?.governmentId || "N/A"}
      </p>

      <hr />

      <h2>Officer Decision</h2>

      {success && <p>{success}</p>}

      {error && <p>{error}</p>}

      {application.status === "OFFICER_REVIEW" ? (
        <>
          <textarea
            value={remarks}
            onChange={(e) =>
              setRemarks(e.target.value)
            }
            placeholder="Enter review remarks..."
            rows="5"
          />

          <br />
          <br />

          <button
            onClick={() =>
              updateStatus("APPROVED")
            }
            disabled={processing !== ""}
          >
            {processing === "APPROVED"
              ? "Approving..."
              : "Approve Application"}
          </button>

          <button
            onClick={() =>
              updateStatus("REJECTED")
            }
            disabled={processing !== ""}
          >
            {processing === "REJECTED"
              ? "Rejecting..."
              : "Reject Application"}
          </button>
        </>
      ) : (
        <p>
          This application has already been processed.
        </p>
      )}
    </div>
  );
};

export default OfficerApplicationReview;