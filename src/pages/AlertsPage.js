import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

export default function AlertsPage() {
    const location = useLocation();
    const companyId = location.state?.companyId || localStorage.getItem('companyId');
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!companyId) {
            console.error("❌ companyId is missing.");
            setLoading(false);
            return;
        }

        fetch(`http://localhost:8080/company/${companyId}`)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then((data) => {
                setAlerts(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching alerts:", error);
                setLoading(false);
            });
    }, [companyId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6 text-gray-100">
            {/* Page Title */}
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-center sm:text-left">
                <EnvelopeIcon className="w-7 h-7 text-purple-400" />
                All Alerts
            </h1>

            {loading ? (
                <p className="text-gray-300">Loading...</p>
            ) : alerts.length === 0 ? (
                <p className="text-gray-400">No alerts available.</p>
            ) : (
                <div className="w-full max-w-3xl mx-auto bg-white bg-opacity-5 backdrop-blur-md p-6 rounded-xl shadow-lg space-y-4">
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className="flex items-center p-4 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors
                         border-b border-white border-opacity-10 last:border-b-0"
                        >
                            {/* Icon bubble for alert type */}
                            <div
                                className={`p-3 rounded-lg 
                  ${
                                    alert.type === 'Complaint'
                                        ? 'bg-red-600 bg-opacity-20'
                                        : 'bg-yellow-500 bg-opacity-20'
                                }
                `}
                            >
                                <EnvelopeIcon
                                    className={`w-6 h-6
                    ${
                                        alert.type === 'Complaint'
                                            ? 'text-red-400'
                                            : 'text-yellow-300'
                                    }
                  `}
                                />
                            </div>

                            {/* Alert details */}
                            <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg">{alert.senderName}</h3>
                                    <span className="text-sm text-gray-400 font-medium">
                    {alert.type}
                  </span>
                                </div>
                                <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    📞 {alert.contactNumber}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}