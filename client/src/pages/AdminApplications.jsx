import { useEffect, useState } from "react";
import api from "../api/axios";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [officers, setOfficers] = useState([]);

  const [selectedOfficer, setSelectedOfficer] = useState({});
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      setError("");

      const [applicationResponse, officerResponse] =
        await Promise.all([
          api.get("/applications"),
          api.get("/officers"),
        ]);

      setApplications(
        applicationResponse.data.applications || []
      );

      setOfficers(
        officerResponse.data.officers || []
      );
    } catch (error) {
      console.error("Admin application fetch error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOfficerChange = (applicationId, officerId) => {
    setSelectedOfficer((prev) => ({
      ...prev,
      [applicationId]: officerId,
    }));

    setError("");
    setMessage("");
  };

  const handleAssign = async (applicationId) => {
    const officerId = selectedOfficer[applicationId];

    if (!officerId) {
      setError("Please select an officer");
      setMessage("");
      return;
    }

    setError("");
    setMessage("");
    setAssigning(applicationId);

    try {
      const response = await api.post(
        `/applications/${applicationId}/assign`,
        {
          officerId,
        }
      );

      setMessage(
        response.data.message ||
          "Officer assigned successfully"
      );

      // Refresh applications after assignment
      await fetchData();

      // Remove selected officer for this application
      setSelectedOfficer((prev) => {
        const updated = { ...prev };
        delete updated[applicationId];
        return updated;
      });
    } catch (error) {
      console.error("Assign officer error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to assign application"
      );
    } finally {
      setAssigning("");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "status approved";

      case "REJECTED":
        return "status rejected";

      case "OFFICER_REVIEW":
        return "status review";

      case "VERIFICATION_IN_PROGRESS":
        return "status verification";

      case "PENDING_VERIFICATION":
        return "status pending";

      default:
        return "status";
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <h1>Application Management</h1>
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1>Application Management</h1>

      <p>
        Manage government applications and assign
        eligible applications to government officers.
      </p>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="empty-state">
          <h3>No Applications Available</h3>
          <p>
            There are currently no applications in the
            system.
          </p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((application) => {
            const canAssign =
              application.status === "OFFICER_REVIEW" &&
              !application.assignedOfficerId;

            return (
              <div
                className="application-card"
                key={application._id}
              >
                {/* Service */}
                <div className="application-header">
                  <div>
                    <h2>
                      {application.serviceId?.name ||
                        "Government Service"}
                    </h2>

                    {application.serviceId?.code && (
                      <p>
                        Service Code:{" "}
                        {application.serviceId.code}
                      </p>
                    )}
                  </div>

                  <span
                    className={getStatusClass(
                      application.status
                    )}
                  >
                    {application.status?.replaceAll(
                      "_",
                      " "
                    )}
                  </span>
                </div>

                <hr />

                {/* Application Information */}
                <div className="application-info">
                  <p>
                    <strong>Application ID:</strong>{" "}
                    {application._id}
                  </p>

                  <p>
                    <strong>Citizen:</strong>{" "}
                    {application.userId?.name || "N/A"}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {application.userId?.email || "N/A"}
                  </p>

                  <p>
                    <strong>Government ID:</strong>{" "}
                    {application.userId?.governmentId ||
                      "N/A"}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {application.status}
                  </p>
                </div>

                {/* Assigned Officer */}
                {application.assignedOfficerId ? (
                  <div className="assigned-officer">
                    <strong>
                      Assigned Officer:
                    </strong>

                    <p>
                      {
                        application.assignedOfficerId
                          .name
                      }
                    </p>

                    <p>
                      {
                        application.assignedOfficerId
                          .email
                      }
                    </p>
                  </div>
                ) : (
                  <div className="assignment-section">
                    <p>
                      <strong>
                        Assigned Officer:
                      </strong>{" "}
                      Not Assigned
                    </p>

                    {application.status ===
                      "OFFICER_REVIEW" ? (
                      <>
                        <div className="assignment-controls">
                          <select
                            value={
                              selectedOfficer[
                                application._id
                              ] || ""
                            }
                            onChange={(e) =>
                              handleOfficerChange(
                                application._id,
                                e.target.value
                              )
                            }
                          >
                            <option value="">
                              Select Government Officer
                            </option>

                            {officers.map((officer) => (
                              <option
                                key={officer._id}
                                value={officer._id}
                              >
                                {officer.name} -{" "}
                                {officer.governmentId ||
                                  officer.email}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() =>
                              handleAssign(
                                application._id
                              )
                            }
                            disabled={
                              assigning ===
                              application._id
                            }
                          >
                            {assigning ===
                            application._id
                              ? "Assigning..."
                              : "Assign Officer"}
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="info-message">
                        Officer assignment will be
                        available after verification is
                        completed.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminApplications;