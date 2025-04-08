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
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <EnvelopeIcon className="w-7 h-7 text-purple-600" />
                All Alerts
            </h1>

            {loading ? (
                <p className="text-gray-600">Loading...</p>
            ) : alerts.length === 0 ? (
                <p className="text-gray-500">No alerts available.</p>
            ) : (
                <div className="space-y-4">
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className="flex items-center p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition"
                        >
                            <div className={`p-3 rounded-full ${alert.type === 'Complaint' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                                <EnvelopeIcon className={`w-6 h-6 ${alert.type === 'Complaint' ? 'text-red-600' : 'text-yellow-600'}`} />
                            </div>
                            <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-lg text-gray-800">{alert.senderName}</h3>
                                    <span className="text-sm font-medium text-gray-500">{alert.type}</span>
                                </div>
                                <p className="text-gray-600 text-sm mt-1">{alert.message}</p>
                                <p className="text-gray-400 text-xs mt-1">📞 {alert.contactNumber}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}