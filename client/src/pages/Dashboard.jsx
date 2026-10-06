import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>GovConnect Dashboard</h1>

      <h2>Welcome, {user?.name}</h2>

      <p>
        <strong>Email:</strong> {user?.email}
      </p>

      <p>
        <strong>Government ID:</strong> {user?.governmentId}
      </p>

      <p>
        <strong>Role:</strong> {user?.role}
      </p>

      <button onClick={() => navigate("/applications")}>
  My Applications
</button>


      <button onClick={logout}>
        Logout
      </button>




    </div>
  );
};

export default Dashboard;