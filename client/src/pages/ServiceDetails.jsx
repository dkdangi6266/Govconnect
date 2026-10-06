import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(`/services/${id}`);
        setService(response.data.service);
      } catch (error) {
        setError(
          error.response?.data?.message || "Unable to load service"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return <p>Loading service...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!service) {
    return <p>Service not found.</p>;
  }

  return (
    <div>
      <button onClick={() => navigate("/services")}>
        ← Back to Services
      </button>

      <h1>{service.name}</h1>

      <p>
        <strong>Service Code:</strong> {service.code}
      </p>

      <p>{service.description}</p>

      <p>
        <strong>Department:</strong>{" "}
        {service.departmentId?.name || "N/A"}
      </p>

      <h2>Required Documents</h2>

      {service.requiredDocuments?.length > 0 ? (
        <ul>
          {service.requiredDocuments.map((document, index) => (
            <li key={index}>{document}</li>
          ))}
        </ul>
      ) : (
        <p>No specific documents listed.</p>
      )}

      {service.isActive ? (
        <button
          onClick={() => navigate(`/services/${service._id}/apply`)}
        >
          Apply Now
        </button>
      ) : (
        <button disabled>Service Unavailable</button>
      )}
    </div>
  );
};

export default ServiceDetails;