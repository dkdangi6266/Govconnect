import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const ApplyService = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/applications", {
        serviceId: id,
      });

      alert("Application submitted successfully!");

      navigate(`/applications/${response.data.application._id}`);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to create application"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Apply for Service</h1>

      <p>
        You are applying for the selected government service.
      </p>

      <p>
        After submitting, your application will go through
        identity, income, education and residence verification.
      </p>

      {error && <p>{error}</p>}

      <button onClick={handleApply} disabled={loading}>
        {loading ? "Submitting..." : "Confirm & Apply"}
      </button>

      <button onClick={() => navigate(`/services/${id}`)}>
        Cancel
      </button>
    </div>
  );
};

export default ApplyService;