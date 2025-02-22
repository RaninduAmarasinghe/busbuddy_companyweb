import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Driverregister from "./pages/Driverregister";
import Busregister from "./pages/Busregister";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/driver/register" element={<Driverregister />} />
        <Route path="/bus/register" element={<Busregister />} />
      </Routes>
    </Router>
  );
}

export default App;