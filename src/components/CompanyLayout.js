import { useNavigate, useLocation } from "react-router-dom";
import { FaBus } from "react-icons/fa";

export default function CompanySidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Driver Registration",
      path: "/driver/register",
    },
    {
      name: "Driver Management",
      path: "/drivers/manage",
    },
    {
      name: "Bus Registration",
      path: "/bus/register",
    },
    {
      name: "Bus Management",
      path: "/bus/management",
    },
  ];

  return (
    <aside className="w-72 bg-black/20 backdrop-blur-2xl border-r border-white/10 flex flex-col">

      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <FaBus className="text-white text-xl" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              BusBuddy
            </h1>

            <p className="text-xs text-gray-400">
              Company Portal
            </p>
          </div>

        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">

        {menuItems.map((item) => (

          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${
                location.pathname === item.path
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
          >
            {item.name}
          </button>

        ))}

      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="text-sm text-gray-500">
          BusBuddy © 2026
        </div>
      </div>

    </aside>
  );
}