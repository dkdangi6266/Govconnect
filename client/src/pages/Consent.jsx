import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const consentTypes = [
  {
    type: "IDENTITY",
    title: "Identity Information",
    purpose: "Identity verification for the government service",
  },
  {
    type: "INCOME",
    title: "Income Information",
    purpose: "Income verification for the government service",
  },
  {
    type: "EDUCATION",
    title: "Education Information",
    purpose: "Education verification for the government service",
  },
  {
    type: "RESIDENCE",
    title: "Residence Information",
    purpose: "Residence verification for the government service",
  },
];

const Consent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState("");
  const [error, setError] = useState("");

  const fetchConsents = async () => {
    try {
      const response = await api.get("/consents/my");

      const applicationConsents = (
        response.data.consents || []
      ).filter(
        (consent) =>
          consent.applicationId?.toString() === id ||
          consent.applicationId?._id?.toString() === id
      );

      setConsents(applicationConsents);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load consent information"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsents();
  }, [id]);

  const getConsent = (type) => {
    return consents.find(
      (consent) => consent.dataType === type
    );
  };

  const handleGrant = async (type, purpose) => {
    setError("");
    setProcessing(type);

    try {
      await api.post("/consents", {
        applicationId: id,
        dataType: type,
        purpose,
      });

      await fetchConsents();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to grant consent"
      );
    } finally {
      setProcessing("");
    }
  };

  const handleRevoke = async (consentId, type) => {
    setError("");
    setProcessing(type);

    try {
      await api.patch(`/consents/${consentId}/revoke`);

      await fetchConsents();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to revoke consent"
      );
    } finally {
      setProcessing("");
    }
  };

  if (loading) {
    return <p>Loading consent information...</p>;
  }

  return (
    <div>
      <button
        onClick={() =>
          navigate(`/applications/${id}`)
        }
      >
        ← Back to Application
      </button>

      <h1>Consent Management</h1>

      <p>
        You control which information can be accessed for
        verification.
      </p>

      {error && (
        <p>
          <strong>Error:</strong> {error}
        </p>
      )}

      {consentTypes.map((item) => {
        const consent = getConsent(item.type);
        const isGranted = consent?.status === "GRANTED";

        return (
          <div key={item.type}>
            <h2>{item.title}</h2>

            <p>{item.purpose}</p>

            <p>
              <strong>Status:</strong>{" "}
              {isGranted ? "Granted" : "Not Granted"}
            </p>

            {isGranted ? (
              <button
                onClick={() =>
                  handleRevoke(consent._id, item.type)
                }
                disabled={processing === item.type}
              >
                {processing === item.type
                  ? "Processing..."
                  : "Revoke Consent"}
              </button>
            ) : (
              <button
                onClick={() =>
                  handleGrant(
                    item.type,
                    item.purpose
                  )
                }
                disabled={processing === item.type}
              >
                {processing === item.type
                  ? "Processing..."
                  : "Grant Consent"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Consent;