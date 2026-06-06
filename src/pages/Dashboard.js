import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import {
  UserCircleIcon,
  UsersIcon,
  Cog8ToothIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';

import { FaBus } from 'react-icons/fa';

import { API_BASE_URL, ENDPOINTS } from "../config/api";

export default function Dashboard() {

  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);

  const [companyName, setCompanyName] = useState('');

  const [loadingCompany, setLoadingCompany] = useState(true);

  const companyId = localStorage.getItem('companyId');

 const cards = [
  {
    title: 'Driver Registration',
    icon: <UserCircleIcon className="w-8 h-8" />,
    link: '/driver/register',
    color: 'text-blue-400',
    bg: 'from-blue-500/20 to-blue-500/10',
  },
  {
    title: 'Driver Management',
    icon: <UsersIcon className="w-8 h-8" />,
    link: '/drivers/manage',
    color: 'text-blue-400',
    bg: 'from-blue-500/20 to-blue-500/10',
  },
  {
    title: 'Bus Registration',
    icon: <FaBus className="w-8 h-8" />,
    link: '/bus/register',
    color: 'text-blue-400',
    bg: 'from-blue-500/20 to-blue-500/10',
  },
  {
    title: 'Bus Management',
    icon: <Cog8ToothIcon className="w-8 h-8" />,
    link: '/bus/management',
    color: 'text-blue-400',
    bg: 'from-blue-500/20 to-blue-500/10',
  },
];

 useEffect(() => {
  if (!companyId) {
    setLoadingCompany(false);
    return;
  }

  fetch(`${API_BASE_URL}${ENDPOINTS.COMPANY_BY_ID}/${companyId}`)
    .then((res) => res.json())
    .then((data) => {
      setCompanyName(data.companyName);
      setLoadingCompany(false);
    })
    .catch((err) => {
      console.error(err);
      setLoadingCompany(false);
    });

  const socket = new SockJS(`${API_BASE_URL}/ws-location`);

  const stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      const topic = `/topic/messages/${companyId}`;

      stompClient.subscribe(topic, (message) => {
        try {
          const alert = JSON.parse(message.body);

          setAlerts((prev) => {
            const exists = prev.some((a) => a.id === alert.id);

            const updated = exists
              ? prev
              : [alert, ...prev];

            return updated.sort(
              (a, b) =>
                new Date(b.timestamp) -
                new Date(a.timestamp)
            );
          });
        } catch (error) {
          console.error(error);
        }
      });
    },
  });

  stompClient.activate();

  return () => {
    if (stompClient.connected) {
      stompClient.deactivate();
    }
  };
}, [companyId]);


if (loadingCompany) {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
      Loading Dashboard...
    </div>
  );
}

return (
  <div className="min-h-screen bg-[#020617] text-white flex relative overflow-hidden">

    {/* Background Glow */}
   <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full"></div>
<div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full"></div>

    {/* Sidebar */}
    <aside className="w-72 bg-black/20 backdrop-blur-2xl border-r border-white/10 flex flex-col z-10">

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

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate('/driver/register')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all"
        >
          Driver Registration
        </button>

        <button
          onClick={() => navigate('/drivers/manage')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all"
        >
          Driver Management
        </button>

        <button
          onClick={() => navigate('/bus/register')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all"
        >
          Bus Registration
        </button>

        <button
          onClick={() => navigate('/bus/management')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all"
        >
          Bus Management
        </button>

      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="text-sm text-gray-500">
          BusBuddy © 2026
        </div>
      </div>

    </aside>

    {/* Main Content */}
    <main className="flex-1 p-8 relative z-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <FaBus className="text-emerald-400 text-3xl" />

            {companyName
              ? `${companyName} Dashboard`
              : 'Transport Dashboard'}
          </h1>

          <p className="text-gray-400 mt-2">
            Welcome back 👋 Manage buses, drivers and alerts
          </p>

        </div>
<div className="flex items-center gap-4">

  {/* Company Name */}
  <div className="text-right">
    <h3 className="font-semibold text-white">
      {companyName || "Company"}
    </h3>
    <p className="text-xs text-gray-400">
      Company Account
    </p>
  </div>

  {/* Company Avatar */}
 <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center font-bold text-lg text-white shadow-lg">
  {companyName?.trim()
    ? companyName.trim().charAt(0).toUpperCase()
    : "B"}
</div>

</div>

      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        {cards.map((card, index) => (
          <button
            key={index}
            onClick={() => navigate(card.link)}
            className="
              group
              relative
              overflow-hidden
              bg-white/5
              backdrop-blur-xl
              border
              border-white/10
              rounded-3xl
              p-8
              hover:border-emerald-400/40
              hover:-translate-y-2
              hover:shadow-emerald-500/10
              transition-all
              duration-300
              shadow-xl
            "
          >

            <div className="relative z-10">

              <div
                className={`w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-r ${card.bg}
                flex items-center justify-center ${card.color}`}
              >
                {card.icon}
              </div>

              <h2 className="text-xl font-semibold">
                {card.title}
              </h2>

              <p className="text-gray-400 text-sm mt-2">
                Manage and monitor operations
              </p>

            </div>

          </button>
        ))}

      </div>

      {/* Alerts */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">

        <div className="flex justify-between items-center mb-6">

          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <ChatBubbleLeftIcon className="w-6 h-6 text-purple-400" />
            Recent Alerts
          </h2>

          <button
            onClick={() => navigate('/alerts', { state: { companyId } })}
            className="text-emerald-400 hover:text-emerald-300"
          >
            View All →
          </button>

        </div>

        {alerts.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-16">

            <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-5">
              <ChatBubbleLeftIcon className="w-10 h-10 text-purple-400" />
            </div>

            <h3 className="text-xl font-semibold">
              No alerts received yet
            </h3>

            <p className="text-gray-400 mt-2">
              Driver messages and complaints will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {alerts.slice(0, 3).map((alert, index) => (

              <div
                key={index}
                className="
                  p-5
                  rounded-2xl
                  bg-black/20
                  border
                  border-white/5
                  hover:border-emerald-400/20
                  hover:bg-white/[0.03]
                  transition-all
                "
              >

                <div className="flex justify-between items-center">

                  <h3 className="font-semibold text-lg">
                    {alert.senderName}
                  </h3>

                  <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400">
                    {alert.type}
                  </span>

                </div>

                <p className="text-gray-400 mt-2">
                  {alert.message}
                </p>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>

  </div>
);
}