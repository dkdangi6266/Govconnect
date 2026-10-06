import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");

        setServices(response.data.services || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Unable to load services"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <p>Loading services...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Government Services</h1>

      {services.length === 0 ? (
        <p>No services available.</p>
      ) : (
        services.map((service) => (
          <div key={service._id}>
            <h2>{service.name}</h2>

            <p>
              <strong>Code:</strong> {service.code}
            </p>

            <p>
              {service.description}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              {service.departmentId?.name || "N/A"}
            </p>

            {service.isActive ? (
              <button
                onClick={() =>
                  navigate(`/services/${service._id}`)
                }
              >
                View Service
              </button>
            ) : (
              <button disabled>
                Currently Unavailable
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Services;