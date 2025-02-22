import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import {
    UserCircleIcon,
    UsersIcon,
    TruckIcon,
    Cog8ToothIcon,
    ChatBubbleLeftIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [messages] = useState([
        { id: 1, sender: 'John Doe', preview: 'Regarding tomorrow\'s schedule...', time: '2h ago' },
        { id: 2, sender: 'Maintenance Team', preview: 'Bus inspection report ready...', time: '4h ago' },
        { id: 3, sender: 'Sarah Smith', preview: 'Route change request...', time: '1d ago' },
    ]);

    const cards = [
        {
            title: 'Driver Registration',
            icon: <UserCircleIcon className="w-8 h-8" />,
            link: '/driver/register',
            color: 'bg-blue-100 hover:bg-blue-200'
        },
        {
            title: 'Driver Management',
            icon: <UsersIcon className="w-8 h-8" />,
            link: '/drivers/manage',
            color: 'bg-green-100 hover:bg-green-200'
        },
        {
            title: 'Bus Registration',
            icon: <TruckIcon className="w-8 h-8" />,
            link: '/bus/register',
            color: 'bg-purple-100 hover:bg-purple-200'
        },
        {
            title: 'Bus Management',
            icon: <Cog8ToothIcon className="w-8 h-8" />,
            link: '/buses/manage',
            color: 'bg-orange-100 hover:bg-orange-200'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Transport Management Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card, index) => (
                    <button
                        key={index}
                        className={`${card.color} p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 text-left`}
                        onClick={() => navigate(card.link)}  // Use navigate here
                    >
                        <div className="mb-4 text-gray-700">{card.icon}</div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h2>
                        <p className="text-gray-600 text-sm">Manage and monitor {card.title.toLowerCase()}</p>
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <ChatBubbleLeftIcon className="w-6 h-6 text-purple-600" />
                        Recent Messages
                    </h2>
                    <a href="/messages" className="text-blue-600 hover:text-blue-800 text-sm">
                        View All →
                    </a>
                </div>

                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border-b"
                        >
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <EnvelopeIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900">{message.sender}</h3>
                                    <span className="text-sm text-gray-500">{message.time}</span>
                                </div>
                                <p className="text-gray-600 text-sm mt-1">{message.preview}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}