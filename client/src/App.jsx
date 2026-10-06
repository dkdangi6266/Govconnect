import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import ApplyService from "./pages/ApplyService";
import MyApplications from "./pages/MyApplications";
import ApplicationDetails from "./pages/ApplicationDetails";
import Consent from "./pages/Consent";
import VerificationStatus from "./pages/VerificationStatus";

function App() {
  return (
    <BrowserRouter>
     <Routes>

  <Route
    path="/login"
    element={<Login />}
  />

  <Route
    path="/register"
    element={<Register />}
  />

<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/services" element={<Services />} />
  <Route path="/services/:id" element={<ServiceDetails />} />
  <Route
    path="/services/:id/apply"
    element={<ApplyService />}
  />
  <Route
  path="/applications"
  element={<MyApplications />}
/>

<Route
  path="/applications/:id"
  element={<ApplicationDetails />}
/>
<Route
  path="/applications/:id/consent"
  element={<Consent />}
/>
<Route
  path="/applications/:id/verification"
  element={<VerificationStatus />}
/>
</Route>
</Routes>
    </BrowserRouter>
  );
}

export default App;