import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const verificationTypes = [
  {
    type: "IDENTITY",
    title: "Identity Verification",
  },
  {
    type: "INCOME",
    title: "Income Verification",
  },
  {
    type: "EDUCATION",
    title: "Education Verification",
  },
  {
    type: "RESIDENCE",
    title: "Residence Verification",
  },
];

const VerificationStatus = () => {
  const { id } = useParams();

  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState("");
  const [error, setError] = useState("");

  const fetchVerifications = async () => {
    try {
      const response = await api.get(
        `/integrations/applications/${id}/verifications`
      );

      setVerifications(response.data.verifications || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load verification status"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, [id]);

  const getVerification = (type) => {
    return verifications.find(
      (verification) => verification.dataType === type
    );
  };

  const handleVerify = async (type) => {
    setError("");
    setProcessing(type);

    try {
      await api.post(
        `/integrations/applications/${id}/verify`,
        {
          dataType: type,
        }
      );

      await fetchVerifications();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Verification failed"
      );
    } finally {
      setProcessing("");
    }
  };

  if (loading) {
    return <p>Loading verification status...</p>;
  }

  return (
    <div>
      <h1>Verification Status</h1>

      <p>
        Application ID: <strong>{id}</strong>
      </p>

      {error && (
        <p>
          <strong>Error:</strong> {error}
        </p>
      )}

      {verificationTypes.map((item) => {
        const verification = getVerification(item.type);

        const status = verification?.status || "PENDING";

        return (
          <div key={item.type}>
            <h2>{item.title}</h2>

            <p>
              <strong>Status:</strong> {status}
            </p>

            {verification?.source && (
              <p>
                <strong>Source:</strong>{" "}
                {verification.source}
              </p>
            )}

            {status === "VERIFIED" ? (
              <p>✓ Successfully Verified</p>
            ) : status === "FAILED" ? (
              <button
                onClick={() => handleVerify(item.type)}
                disabled={processing === item.type}
              >
                {processing === item.type
                  ? "Verifying..."
                  : "Retry Verification"}
              </button>
            ) : (
              <button
                onClick={() => handleVerify(item.type)}
                disabled={processing === item.type}
              >
                {processing === item.type
                  ? "Verifying..."
                  : `Verify ${item.type}`}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default VerificationStatus;