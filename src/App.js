import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Driverregister from "./pages/Driverregister";
import Busregister from "./pages/Busregister";
import Busmanagement from "./pages/Busmanagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/driver/register" element={<Driverregister />} />
        <Route path="/bus/register" element={<Busregister />} />
        <Route path="/bus/management" element={<Busmanagement />} />
      </Routes>
    </Router>
  );
}

export default App;