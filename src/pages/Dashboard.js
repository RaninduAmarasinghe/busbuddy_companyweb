import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {
  UserCircleIcon,
  UsersIcon,
  TruckIcon,
  Cog8ToothIcon,
  ChatBubbleLeftIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const companyId = localStorage.getItem('companyId');

  const cards = [
    {
      title: 'Driver Registration',
      icon: <UserCircleIcon className="w-8 h-8" />,
      link: '/driver/register',
    },
    {
      title: 'Driver Management',
      icon: <UsersIcon className="w-8 h-8" />,
      link: '/drivers/manage',
    },
    {
      title: 'Bus Registration',
      icon: <TruckIcon className="w-8 h-8" />,
      link: '/bus/register',
    },
    {
      title: 'Bus Management',
      icon: <Cog8ToothIcon className="w-8 h-8" />,
      link: '/bus/management',
    },
  ];

  useEffect(() => {
    if (!companyId) {
      console.warn("⚠️ No companyId found in localStorage");
      return;
    }

    // Fetch company name
    fetch(`http://localhost:8080/companies/${companyId}`)
        .then((res) => res.json())
        .then((data) => {
          setCompanyName(data.companyName);
        })
        .catch((err) => console.error("Failed to fetch company:", err));

    // WebSocket
    const socket = new SockJS('http://localhost:8080/ws-location');
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
              const updated = exists ? prev : [alert, ...prev];
              return updated.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            });
          } catch (error) {
            console.error("❌ Failed to parse alert message:", error);
          }
        });
      },
      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame);
      },
    });

    stompClient.activate();

    return () => {
      if (stompClient.connected) stompClient.deactivate();
    };
  }, [companyId]);

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 text-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center sm:text-left">
          {companyName ? `${companyName} Dashboard` : 'Transport Management Dashboard'}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, index) => (
              <button
                  key={index}
                  onClick={() => navigate(card.link)}
                  className="group relative p-6 rounded-xl bg-white bg-opacity-5
                     backdrop-blur-md transition-transform duration-300
                     hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-center">
                  <div className="p-3 rounded-full bg-white bg-opacity-5 group-hover:bg-opacity-10">
                    {card.icon}
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-1 text-center">
                  {card.title}
                </h2>
                <p className="text-sm text-gray-300 text-center">
                  Manage and monitor {card.title.toLowerCase()}
                </p>
              </button>
          ))}
        </div>

        <div className="w-full rounded-xl bg-white bg-opacity-5 backdrop-blur-md p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center text-xl font-semibold gap-2">
              <ChatBubbleLeftIcon className="w-6 h-6 text-purple-400" />
              Recent Alerts
            </h2>
            <button
                onClick={() => navigate('/alerts', { state: { companyId } })}
                className="text-sm text-blue-400 hover:text-blue-200 transition"
            >
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {alerts.length === 0 ? (
                <p className="text-gray-400 text-sm">No alerts received yet.</p>
            ) : (
                alerts.slice(0, 3).map((alert, index) => (
                    <div
                        key={index}
                        onClick={() => navigate('/alerts', { state: { companyId } })}
                        className="flex items-center p-4 rounded-lg cursor-pointer hover:bg-white hover:bg-opacity-10 transition-colors border-b border-white border-opacity-10 last:border-b-0"
                    >
                      <div
                          className={`p-3 rounded-lg ${
                              alert.type === 'Complaint'
                                  ? 'bg-red-600 bg-opacity-20'
                                  : alert.type === 'DriverMessage'
                                      ? 'bg-blue-600 bg-opacity-20'
                                      : 'bg-yellow-500 bg-opacity-20'
                          }`}
                      >
                        <EnvelopeIcon
                            className={`w-6 h-6 ${
                                alert.type === 'Complaint'
                                    ? 'text-red-400'
                                    : alert.type === 'DriverMessage'
                                        ? 'text-blue-400'
                                        : 'text-yellow-300'
                            }`}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{alert.senderName}</h3>
                          <span className="text-sm text-gray-400">
                      {alert.type === 'DriverMessage'
                          ? 'Driver Message'
                          : alert.type || 'General'}
                    </span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
                      </div>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
  );
}