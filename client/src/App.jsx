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
import DocumentUpload from "./pages/DocumentUpload";
import DocumentList from "./pages/DocumentList";
import Notifications from "./pages/Notifications";
import OfficerDashboard from "./pages/OfficerDashboard";
import OfficerApplicationReview from "./pages/OfficerApplicationReview";
import AdminApplications from "./pages/AdminApplications";


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
<Route
  path="/applications/:id/documents"
  element={<DocumentUpload />}
/>
<Route
  path="/applications/:id/document-list"
  element={<DocumentList />}
/>
<Route
  path="/notifications"
  element={<Notifications />}
/>
<Route
  path="/officer/dashboard"
  element={<OfficerDashboard />}
/>
<Route
  path="/officer/applications/:id"
  element={<OfficerApplicationReview />}
/>
<Route
  path="/admin/applications"
  element={<AdminApplications />}
/>
</Route>
</Routes>
    </BrowserRouter>
  );
}

export default App;