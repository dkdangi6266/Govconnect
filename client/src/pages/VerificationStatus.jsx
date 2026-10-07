import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const verificationConfig = {
  IDENTITY: {
    type: "IDENTITY",
    title: "Identity Verification",
  },

  INCOME: {
    type: "INCOME",
    title: "Income Verification",
  },

  EDUCATION: {
    type: "EDUCATION",
    title: "Education Verification",
  },

  RESIDENCE: {
    type: "RESIDENCE",
    title: "Residence Verification",
  },
};

const VerificationStatus = () => {
  const { id } = useParams();

  const [verifications, setVerifications] = useState([]);
  const [requiredVerifications, setRequiredVerifications] =
    useState([]);

  const [serviceName, setServiceName] = useState("");

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState("");
  const [error, setError] = useState("");

  // Load application + service + verification status
  const fetchData = async () => {
    try {
      setError("");

      // 1. Get application
      const applicationResponse = await api.get(
        `/applications/${id}`
      );

      const application =
        applicationResponse.data.application;

      if (!application) {
        throw new Error("Application not found");
      }

      /*
        serviceId may already be populated by backend.

        If populated:
        application.serviceId._id

        If not populated:
        application.serviceId
      */
      const serviceId =
        application.serviceId?._id ||
        application.serviceId;

      if (!serviceId) {
        throw new Error(
          "Service information not found"
        );
      }

      // 2. Get service configuration
      const serviceResponse = await api.get(
        `/services/${serviceId}`
      );

      const service = serviceResponse.data.service;

      setServiceName(service?.name || "");

      setRequiredVerifications(
        service?.requiredVerifications || []
      );

      // 3. Get existing verification records
      const verificationResponse = await api.get(
        `/integrations/applications/${id}/verifications`
      );

      setVerifications(
        verificationResponse.data.verifications || []
      );
    } catch (error) {
      console.error(
        "Verification page error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load verification status"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const getVerification = (type) => {
    return verifications.find(
      (verification) =>
        verification.dataType === type
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

      // Refresh complete page data
      await fetchData();
    } catch (error) {
      console.error(
        "Verification error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Verification failed"
      );
    } finally {
      setProcessing("");
    }
  };

  if (loading) {
    return (
      <p>Loading verification status...</p>
    );
  }

  return (
    <div>
      <h1>Verification Status</h1>

      {serviceName && (
        <h2>{serviceName}</h2>
      )}

      <p>
        Application ID: <strong>{id}</strong>
      </p>

      {error && (
        <p>
          <strong>Error:</strong> {error}
        </p>
      )}

      {requiredVerifications.length === 0 ? (
        <p>
          No verification requirements configured
          for this service.
        </p>
      ) : (
        requiredVerifications.map((type) => {
          const item =
            verificationConfig[type];

          // Ignore unknown verification type
          if (!item) {
            return null;
          }

          const verification =
            getVerification(type);

          const status =
            verification?.status || "PENDING";

          return (
            <div key={type}>
              <h2>{item.title}</h2>

              <p>
                <strong>Status:</strong>{" "}
                {status}
              </p>

              {verification?.source && (
                <p>
                  <strong>Source:</strong>{" "}
                  {verification.source}
                </p>
              )}

              {status === "VERIFIED" ? (
                <p>
                  ✓ Successfully Verified
                </p>
              ) : status === "FAILED" ? (
                <button
                  onClick={() =>
                    handleVerify(type)
                  }
                  disabled={
                    processing === type
                  }
                >
                  {processing === type
                    ? "Verifying..."
                    : "Retry Verification"}
                </button>
              ) : (
                <button
                  onClick={() =>
                    handleVerify(type)
                  }
                  disabled={
                    processing === type
                  }
                >
                  {processing === type
                    ? "Verifying..."
                    : `Verify ${type}`}
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default VerificationStatus;