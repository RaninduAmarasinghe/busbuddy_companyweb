import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function BusManagement() {
    const [buses, setBuses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);
    const companyId = localStorage.getItem('companyId');

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/bus/company/${companyId}`);
                setBuses(response.data);
            } catch (error) {
                console.error('Error fetching buses:', error);
            }
        };
        fetchBuses();
    }, [companyId]);

    const filteredBuses = buses.filter((bus) =>
        bus.busNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.busId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this bus?')) {
            try {
                await axios.delete(`http://localhost:8080/bus/delete/${id}`);
                setBuses((prev) => prev.filter((bus) => bus.busId !== id));
            } catch (error) {
                console.error('Error deleting bus:', error);
            }
        }
    };

    const handleFormSubmit = async (data) => {
        try {
            await axios.put(`http://localhost:8080/bus/update/${selectedBus.busId}`, data);
            setIsModalOpen(false);
            setSelectedBus(null);

            // Refresh buses
            const response = await axios.get(`http://localhost:8080/bus/company/${companyId}`);
            setBuses(response.data);
        } catch (error) {
            console.error('Error saving bus:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6 flex flex-col items-center">
            {/* Main container */}
            <div className="w-full max-w-5xl bg-gray-900/50 backdrop-blur-md border border-cyan-300/20 shadow-xl rounded-2xl p-6 text-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-3xl font-bold">
                        Bus Management
                    </h2>
                    <div>
                        <input
                            type="text"
                            placeholder="Search by bus number or ID"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="rounded-lg py-2 px-3 bg-gray-800/50 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-400 text-gray-100 transition-all w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-700 text-gray-100">
                        <thead>
                        <tr className="bg-gray-800/50 border-b border-gray-700">
                            <th className="p-3 text-left">Bus Number</th>
                            <th className="p-3 text-left">Routes</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredBuses.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="p-3 text-center text-gray-400">
                                    No buses found.
                                </td>
                            </tr>
                        ) : (
                            filteredBuses.map((bus) => (
                                <tr key={bus.busId} className="border-b border-gray-700">
                                    <td className="p-3">{bus.busNumber}</td>
                                    <td className="p-3">
                                        {bus.routes.map((route, i) => (
                                            <div key={i} className="mb-2">
                                                <strong>
                                                    {route.startPoint} → {route.endPoint}
                                                </strong>
                                                <div>
                                                    Departure: {route.departureTimes.join(', ')}
                                                </div>
                                                <div>Arrival: {route.arrivalTimes.join(', ')}</div>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="p-3 space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedBus(bus);
                                                setIsModalOpen(true);
                                            }}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:opacity-90 transition-all inline-flex items-center"
                                        >
                                            <PencilIcon className="w-4 h-4 mr-1" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(bus.busId)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:opacity-90 transition-all inline-flex items-center"
                                        >
                                            <TrashIcon className="w-4 h-4 mr-1" />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <BusFormModal
                    bus={selectedBus}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedBus(null);
                    }}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
}

function BusFormModal({ bus, onClose, onSubmit }) {
    const { register, handleSubmit, control, reset } = useForm({
        defaultValues: bus || {
            busNumber: '',
            routes: [
                { routeNumber: 1, startPoint: '', endPoint: '', departureTimes: [''], arrivalTimes: [''] },
            ],
        },
    });

    const { fields: routes } = useFieldArray({
        control,
        name: 'routes',
    });

    useEffect(() => {
        reset(
            bus || {
                busNumber: '',
                routes: [
                    {
                        routeNumber: 1,
                        startPoint: '',
                        endPoint: '',
                        departureTimes: [''],
                        arrivalTimes: [''],
                    },
                ],
            }
        );
    }, [bus, reset]);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {/* Modal container */}
            <div className="bg-gray-900/70 border border-cyan-300/10 shadow-2xl rounded-xl p-6 w-full max-w-2xl text-gray-100">
                <h3 className="text-lg font-semibold text-cyan-300 mb-4">Edit Bus</h3>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Bus Number */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Bus Number</label>
                        <input
                            {...register('busNumber')}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                        />
                    </div>

                    {/* Routes */}
                    {routes.map((route, index) => (
                        <div key={route.id} className="border border-gray-700 rounded-lg p-3 mb-4 bg-gray-800/30">
                            <label className="block text-sm font-medium mb-1">Start Point</label>
                            <input
                                {...register(`routes.${index}.startPoint`)}
                                className="w-full mb-2 bg-gray-800/50 border border-gray-700 rounded-lg py-1 px-2 text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                            />

                            <label className="block text-sm font-medium mb-1">End Point</label>
                            <input
                                {...register(`routes.${index}.endPoint`)}
                                className="w-full mb-2 bg-gray-800/50 border border-gray-700 rounded-lg py-1 px-2 text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                            />

                            <label className="block text-sm font-medium mb-1">Departure Times</label>
                            <input
                                {...register(`routes.${index}.departureTimes.0`)}
                                type="time"
                                className="w-full mb-2 bg-gray-800/50 border border-gray-700 rounded-lg py-1 px-2 text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                            />

                            <label className="block text-sm font-medium mb-1">Arrival Times</label>
                            <input
                                {...register(`routes.${index}.arrivalTimes.0`)}
                                type="time"
                                className="w-full mb-2 bg-gray-800/50 border border-gray-700 rounded-lg py-1 px-2 text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                            />
                        </div>
                    ))}

                    {/* Form actions */}
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-gray-100 px-4 py-2 rounded hover:opacity-90 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded font-semibold hover:opacity-90 transition-all"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}