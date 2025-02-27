import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, PlusCircleIcon, } from '@heroicons/react/24/outline';

export default function BusManagement() {
    const [buses, setBuses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);

    // Fetch buses from API
    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const response = await axios.get('http://localhost:8080/bus/all');
                setBuses(response.data);
            } catch (error) {
                console.error('Error fetching buses:', error);
            }
        };
        fetchBuses();
    }, []);

    // Search functionality
    const filteredBuses = buses.filter(bus =>
        bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus._id.includes(searchTerm)
    );

    // Delete bus
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this bus?')) {
            try {
                await axios.delete(`http://localhost:8080/bus/delete/${id}`);
                setBuses(buses.filter(bus => bus._id !== id));
            } catch (error) {
                console.error('Error deleting bus:', error);
            }
        }
    };

    // Handle form submission
    const handleFormSubmit = async (data) => {
        try {
            if (selectedBus) {
                // Update existing bus
                await axios.put(`http://localhost:8080/bus/update/${selectedBus._id}`, data);
            } else {
                // Create new bus
                await axios.post('http://localhost:8080/bus/add', data);
            }
            setIsModalOpen(false);
            setSelectedBus(null);
            // Refresh bus list
            const response = await axios.get('http://localhost:8080/bus/all');
            setBuses(response.data);
        } catch (error) {
            console.error('Error saving bus:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header and Search */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Bus Management System
                    </h1>
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search buses..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-4" />
                    </div>
                </div>

                {/* Bus Table */}
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/30 shadow-2xl overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-900/30">
                            <tr>
                                <th className="px-6 py-4 text-left text-cyan-400">Bus Number</th>
                                <th className="px-6 py-4 text-left text-cyan-400">Routes</th>
                                <th className="px-6 py-4 text-left text-cyan-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {filteredBuses.map((bus) => (
                                <tr key={bus._id} className="hover:bg-gray-900/20 transition-colors">
                                    <td className="px-6 py-4 text-gray-100 font-mono">{bus.busNumber}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {bus.routes.map((route, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-sm"
                                                >
                                                    {route.startPoint} → {route.endPoint}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => {
                                                    setSelectedBus(bus);
                                                    setIsModalOpen(true);
                                                }}
                                                className="text-cyan-400 hover:text-cyan-300"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(bus._id)}
                                                className="text-rose-400 hover:text-rose-300"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add New Bus Button */}
                <button
                    onClick={() => {
                        setSelectedBus(null);
                        setIsModalOpen(true);
                    }}
                    className="fixed bottom-8 right-8 p-4 bg-cyan-600 hover:bg-cyan-500 rounded-full shadow-2xl transition-all"
                >
                    <PlusCircleIcon className="h-8 w-8 text-white" />
                </button>

                {/* Bus Form Modal */}
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
        </div>
    );
}

function BusFormModal({ bus, onClose, onSubmit }) {
    const { register, handleSubmit, control, reset } = useForm({
        defaultValues: bus || {
            busNumber: '',
            routes: [{
                routeNumber: 1,
                startPoint: '',
                endPoint: '',
                departureTimes: [''],
                arrivalTimes: ['']
            }]
        }
    });

    const { fields: routes, append, remove } = useFieldArray({
        control,
        name: 'routes'
    });

    useEffect(() => {
        reset(bus || {
            busNumber: '',
            routes: [{
                routeNumber: 1,
                startPoint: '',
                endPoint: '',
                departureTimes: [''],
                arrivalTimes: ['']
            }]
        });
    }, [bus, reset]);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 w-full max-w-3xl border border-gray-700/30 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-cyan-400">
                        {bus ? 'Edit Bus' : 'Add New Bus'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Bus Number Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Bus Number
                        </label>
                        <input
                            {...register('busNumber', { required: true })}
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-3 px-4 text-gray-100 focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    {/* Routes Section */}
                    {routes.map((route, index) => (
                        <div key={route.id} className="bg-gray-900/30 p-6 rounded-xl border border-gray-700/50">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-cyan-400">
                                    Route #{index + 1}
                                </h3>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-rose-400 hover:text-rose-300"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            {/* Route Fields */}
                            <div className="space-y-4">
                                <input
                                    {...register(`routes.${index}.routeNumber`)}
                                    type="number"
                                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-gray-100"
                                    placeholder="Route Number"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        {...register(`routes.${index}.startPoint`)}
                                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-gray-100"
                                        placeholder="Start Point"
                                    />
                                    <input
                                        {...register(`routes.${index}.endPoint`)}
                                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-gray-100"
                                        placeholder="End Point"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => append({
                            routeNumber: routes.length + 1,
                            startPoint: '',
                            endPoint: '',
                            departureTimes: [''],
                            arrivalTimes: ['']
                        })}
                        className="w-full py-3 bg-cyan-600/30 hover:bg-cyan-600/40 border border-cyan-500/50 rounded-xl text-cyan-400 flex items-center justify-center gap-2"
                    >
                        <PlusCircleIcon className="h-5 w-5" />
                        Add Route
                    </button>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700/50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white font-semibold"
                        >
                            {bus ? 'Update Bus' : 'Create Bus'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}