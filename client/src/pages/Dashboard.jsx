import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isCitizen = user?.role === "citizen";
  const isOfficer = user?.role === "government_officer";
  const isDepartmentAdmin = user?.role === "department_admin";
  const isSuperAdmin = user?.role === "super_admin";

  return (
    <div>
      <h1>GovConnect Dashboard</h1>

      <h2>Welcome, {user?.name}</h2>

      <p>
        <strong>Email:</strong> {user?.email}
      </p>

      <p>
        <strong>Government ID:</strong>{" "}
        {user?.governmentId || "N/A"}
      </p>

      <p>
        <strong>Role:</strong> {user?.role}
      </p>

      <hr />

      {/* CITIZEN */}
      {isCitizen && (
        <>
          <button onClick={() => navigate("/services")}>
            Government Services
          </button>

          <button onClick={() => navigate("/applications")}>
            My Applications
          </button>

          <button onClick={() => navigate("/notifications")}>
            Notifications
          </button>
        </>
      )}

      {/* GOVERNMENT OFFICER */}
      {isOfficer && (
        <>
          <button
            onClick={() =>
              navigate("/officer/dashboard")
            }
          >
            Assigned Applications
          </button>

          <button onClick={() => navigate("/notifications")}>
            Notifications
          </button>
        </>
      )}

      {/* DEPARTMENT ADMIN */}
      {isDepartmentAdmin && (
        <>
          <button onClick={() => navigate("/services")}>
            Manage Services
          </button>

          <button onClick={() => navigate("/officer/dashboard")}>
            Applications
          </button>

          <button onClick={() => navigate("/notifications")}>
            Notifications
          </button>
          <button onClick={() => navigate("/admin/applications")}>
             Manage Applications
          </button>
        </>
      )}

      {/* SUPER ADMIN */}
      {isSuperAdmin && (
        <>
          <button onClick={() => navigate("/services")}>
            Manage Services
          </button>

          <button onClick={() => navigate("/officer/dashboard")}>
            Applications
          </button>

          <button onClick={() => navigate("/notifications")}>
            Notifications
          </button>
          <button onClick={() => navigate("/admin/applications")}>
            Manage Applications
          </button>
        </>
      )}

      <br />
      <br />

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;