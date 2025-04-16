import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Driverregister from "./pages/Driverregister";
import Drivermanagement from "./pages/Drivermanagement"; // ✅ Import the new page
import Busregister from "./pages/Busregister";
import Busmanagement from "./pages/Busmanagement";
import AlertsPage from "./pages/AlertsPage";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/driver/register" element={<Driverregister />} />
          <Route path="/drivers/manage" element={<Drivermanagement />} /> {/* ✅ New route */}
          <Route path="/bus/register" element={<Busregister />} />
          <Route path="/bus/management" element={<Busmanagement />} />
          <Route path="/alerts" element={<AlertsPage />} />
        </Routes>
      </Router>
  );
}

export default App;