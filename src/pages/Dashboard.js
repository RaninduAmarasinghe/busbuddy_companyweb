// Dashboard.js
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

  const companyId = localStorage.getItem('companyId');

  const cards = [
    {
      title: 'Driver Registration',
      icon: <UserCircleIcon className="w-8 h-8" />,
      link: '/driver/register',
      color: 'bg-blue-100 hover:bg-blue-200',
    },
    {
      title: 'Driver Management',
      icon: <UsersIcon className="w-8 h-8" />,
      link: '/drivers/manage',
      color: 'bg-green-100 hover:bg-green-200',
    },
    {
      title: 'Bus Registration',
      icon: <TruckIcon className="w-8 h-8" />,
      link: '/bus/register',
      color: 'bg-purple-100 hover:bg-purple-200',
    },
    {
      title: 'Bus Management',
      icon: <Cog8ToothIcon className="w-8 h-8" />,
      link: '/bus/management',
      color: 'bg-orange-100 hover:bg-orange-200',
    },
  ];

  useEffect(() => {
    if (!companyId) {
      console.warn("⚠️ No companyId found in localStorage");
      return;
    }

    const socket = new SockJS('http://localhost:8080/ws-location');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        const topic = `/topic/messages/${companyId}`;
        console.log('🛰️ Subscribing to', topic);

        stompClient.subscribe(topic, (message) => {
          try {
            const alert = JSON.parse(message.body);
            console.log('📩 Incoming alert:', alert);
            setAlerts((prev) => {
              const exists = prev.some((a) => a.id === alert.id);
              return exists ? prev : [alert, ...prev];
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
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Transport Management Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, index) => (
              <button
                  key={index}
                  className={`${card.color} p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 text-left`}
                  onClick={() => navigate(card.link)}
              >
                <div className="mb-4 text-gray-700">{card.icon}</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {card.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  Manage and monitor {card.title.toLowerCase()}
                </p>
              </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ChatBubbleLeftIcon className="w-6 h-6 text-purple-600" />
              Recent Alerts
            </h2>
            <button
                className="text-blue-600 hover:text-blue-800 text-sm"
                onClick={() => navigate('/alerts', { state: { companyId } })}
            >
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {alerts.length === 0 ? (
                <p className="text-gray-500 text-sm">No alerts received yet.</p>
            ) : (
                alerts.slice(0, 3).map((alert, index) => (
                    <div
                        key={index}
                        className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border-b"
                    >
                      <div
                          className={`p-3 rounded-lg ${
                              alert.type === 'Complaint' ? 'bg-red-100' : 'bg-yellow-100'
                          }`}
                      >
                        <EnvelopeIcon
                            className={`w-6 h-6 ${
                                alert.type === 'Complaint'
                                    ? 'text-red-600'
                                    : 'text-yellow-600'
                            }`}
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">
                            {alert.senderName}
                          </h3>
                          <span className="text-sm text-gray-500">{alert.type}</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {alert.message}
                        </p>
                      </div>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
  );
}