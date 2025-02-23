import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios'; // Import Axios for HTTP requests
import { PlusCircleIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';

// Yup validation schema
const schema = yup.object().shape({
    busNumber: yup.string().required('Bus number is required'),
    routes: yup.array().of(
        yup.object().shape({
            routeNumber: yup.number().required('Route number is required').typeError('Route number must be a number'),
            startPoint: yup.string().required('Start point is required'),
            endPoint: yup.string().required('End point is required'),
            departureTimes: yup.array().of(
                yup.string().required('Departure time is required')
            ).min(1, 'At least one departure time required'),
            arrivalTimes: yup.array().of(
                yup.string().required('Arrival time is required')
            ).min(1, 'At least one arrival time required')
        })
    ).min(1, 'At least one route required')
});

export default function BusRegister() {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            routes: [{
                routeNumber: 1, // Default value for routeNumber
                startPoint: '',
                endPoint: '',
                departureTimes: [''],
                arrivalTimes: ['']
            }]
        }
    });

    const { fields: routes, append: appendRoute, remove: removeRoute } = useFieldArray({
        control,
        name: 'routes'
    });

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            // Send POST request to the backend
            const response = await axios.post('http://localhost:8080/bus/add', data);
            if (response.data === 'success') {
                alert('Bus registered successfully!');
            } else {
                alert('Failed to register bus.');
            }
        } catch (error) {
            console.error('Error registering bus:', error);
            alert('An error occurred while registering the bus.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-700/30">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
                    Bus Registration
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Bus Number Field */}
                    <div className="group relative">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Bus Number
                        </label>
                        <input
                            {...register('busNumber')}
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-3 px-4 text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                            placeholder="Enter bus number"
                        />
                        {errors.busNumber && (
                            <p className="text-rose-400 text-sm mt-1">{errors.busNumber.message}</p>
                        )}
                    </div>

                    {/* Routes Section */}
                    <div className="space-y-6">
                        {routes.map((route, routeIndex) => (
                            <RouteFields
                                key={route.id}
                                control={control}
                                register={register}
                                routeIndex={routeIndex}
                                errors={errors}
                                onRemove={() => removeRoute(routeIndex)}
                            />
                        ))}
                    </div>

                    {/* Add Another Route Button */}
                    <button
                        type="button"
                        onClick={() => appendRoute({
                            routeNumber: routes.length + 1, // Auto-increment routeNumber
                            startPoint: '',
                            endPoint: '',
                            departureTimes: [''],
                            arrivalTimes: ['']
                        })}
                        className="w-full py-3 bg-cyan-600/30 hover:bg-cyan-600/40 border border-cyan-500/50 rounded-xl text-cyan-400 flex items-center justify-center gap-2 transition-all"
                    >
                        <PlusCircleIcon className="h-5 w-5" />
                        Add Another Route
                    </button>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl text-white font-semibold shadow-lg transition-all"
                    >
                        Register Bus
                    </button>
                </form>
            </div>
        </div>
    );
}

// RouteFields Component
const RouteFields = ({ control, register, routeIndex, errors, onRemove }) => {
    const { fields: departureTimes, append: appendDeparture, remove: removeDeparture } = useFieldArray({
        control,
        name: `routes.${routeIndex}.departureTimes`
    });
    const { fields: arrivalTimes, append: appendArrival, remove: removeArrival } = useFieldArray({
        control,
        name: `routes.${routeIndex}.arrivalTimes`
    });

    return (
        <div className="bg-gray-900/30 p-6 rounded-2xl border border-gray-700/50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-cyan-400">
                    Route #{routeIndex + 1}
                </h3>
                {routeIndex > 0 && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-rose-400 hover:text-rose-300 transition-colors"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Route Number Field */}
            <div className="relative mb-4">
                <input
                    type="number"
                    {...register(`routes.${routeIndex}.routeNumber`, { valueAsNumber: true })}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-gray-100 focus:ring-cyan-500"
                    placeholder="Route Number"
                />
                {errors.routes?.[routeIndex]?.routeNumber && (
                    <p className="text-rose-400 text-sm mt-1">
                        {errors.routes[routeIndex].routeNumber.message}
                    </p>
                )}
            </div>

            {/* Start Point and End Point Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <input
                        {...register(`routes.${routeIndex}.startPoint`)}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-gray-100 focus:ring-cyan-500"
                        placeholder="Starting point"
                    />
                    {errors.routes?.[routeIndex]?.startPoint && (
                        <p className="text-rose-400 text-sm mt-1">
                            {errors.routes[routeIndex].startPoint.message}
                        </p>
                    )}
                </div>
                <div className="relative">
                    <input
                        {...register(`routes.${routeIndex}.endPoint`)}
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-gray-100 focus:ring-cyan-500"
                        placeholder="Destination"
                    />
                    {errors.routes?.[routeIndex]?.endPoint && (
                        <p className="text-rose-400 text-sm mt-1">
                            {errors.routes[routeIndex].endPoint.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Departure Times and Arrival Times Section */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <ClockIcon className="h-4 w-4" />
                        Departure Times
                    </label>
                    {departureTimes.map((time, timeIndex) => (
                        <div key={time.id} className="flex items-center gap-2">
                            <input
                                type="time"
                                {...register(`routes.${routeIndex}.departureTimes.${timeIndex}`)}
                                className="bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-gray-100"
                            />
                            {timeIndex > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeDeparture(timeIndex)}
                                    className="text-rose-400 hover:text-rose-300"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => appendDeparture('')}
                        className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
                    >
                        <PlusCircleIcon className="h-4 w-4" />
                        Add Departure Time
                    </button>
                    {errors.routes?.[routeIndex]?.departureTimes && (
                        <p className="text-rose-400 text-sm mt-1">
                            {errors.routes[routeIndex].departureTimes.message}
                        </p>
                    )}
                </div>
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <ClockIcon className="h-4 w-4" />
                        Arrival Times
                    </label>
                    {arrivalTimes.map((time, timeIndex) => (
                        <div key={time.id} className="flex items-center gap-2">
                            <input
                                type="time"
                                {...register(`routes.${routeIndex}.arrivalTimes.${timeIndex}`)}
                                className="bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-gray-100"
                            />
                            {timeIndex > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeArrival(timeIndex)}
                                    className="text-rose-400 hover:text-rose-300"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => appendArrival('')}
                        className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
                    >
                        <PlusCircleIcon className="h-4 w-4" />
                        Add Arrival Time
                    </button>
                    {errors.routes?.[routeIndex]?.arrivalTimes && (
                        <p className="text-rose-400 text-sm mt-1">
                            {errors.routes[routeIndex].arrivalTimes.message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};