import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
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
                routeNumber: 1,
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
            const companyId = localStorage.getItem('companyId');
            if (!companyId) {
                alert('Company ID not found. Please log in again.');
                return;
            }

            const busData = {
                busNumber: data.busNumber,
                companyId: companyId,
                routes: data.routes
            };

            const response = await axios.post(
                `http://localhost:8080/bus/add?companyId=${companyId}`,
                busData
            );

            if (response.data.includes('success')) {
                alert('Bus registered successfully!');
            } else {
                alert('Failed to register bus');
            }
        } catch (error) {
            console.error('Error registering bus:', error);
            alert('An error occurred while registering the bus. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-gray-900/50 backdrop-blur-md rounded-2xl border border-cyan-300/20 shadow-xl p-6">
                <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-3xl font-bold mb-8">
                    Bus Registration
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Bus Number Field */}
                    <div>
                        <label className="block text-sm font-medium text-cyan-200 mb-1">
                            Bus Number
                        </label>
                        <input
                            {...register('busNumber')}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2 px-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                            placeholder="Enter bus number"
                        />
                        {errors.busNumber && (
                            <p className="text-red-400 text-xs mt-1">{errors.busNumber.message}</p>
                        )}
                    </div>

                    {/* Routes Section */}
                    <div className="space-y-4">
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
                            routeNumber: routes.length + 1,
                            startPoint: '',
                            endPoint: '',
                            departureTimes: [''],
                            arrivalTimes: ['']
                        })}
                        className="flex items-center justify-center w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-all"
                    >
                        <PlusCircleIcon className="h-5 w-5 mr-1" />
                        Add Another Route
                    </button>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold shadow-md hover:shadow-cyan-500/50 hover:opacity-90 transition-all"
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
        <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/30">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-cyan-300 font-semibold">Route #{routeIndex + 1}</h3>
                {routeIndex > 0 && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-red-400 hover:text-red-300 transition-colors"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Route Number Field */}
            <div className="mb-3">
                <input
                    type="number"
                    {...register(`routes.${routeIndex}.routeNumber`, { valueAsNumber: true })}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2 px-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    placeholder="Route Number"
                />
                {errors.routes?.[routeIndex]?.routeNumber && (
                    <p className="text-red-400 text-xs mt-1">
                        {errors.routes[routeIndex].routeNumber.message}
                    </p>
                )}
            </div>

            {/* Start & End Point Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <input
                        {...register(`routes.${routeIndex}.startPoint`)}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2 px-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                        placeholder="Starting point"
                    />
                    {errors.routes?.[routeIndex]?.startPoint && (
                        <p className="text-red-400 text-xs mt-1">
                            {errors.routes[routeIndex].startPoint.message}
                        </p>
                    )}
                </div>
                <div>
                    <input
                        {...register(`routes.${routeIndex}.endPoint`)}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2 px-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                        placeholder="Destination"
                    />
                    {errors.routes?.[routeIndex]?.endPoint && (
                        <p className="text-red-400 text-xs mt-1">
                            {errors.routes[routeIndex].endPoint.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Departure & Arrival Times */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Departure Times */}
                <div>
                    <label className="flex items-center text-sm text-cyan-200 mb-2">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        Departure Times
                    </label>
                    {departureTimes.map((time, timeIndex) => (
                        <div key={time.id} className="flex items-center mb-2">
                            <input
                                type="time"
                                {...register(`routes.${routeIndex}.departureTimes.${timeIndex}`)}
                                className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg py-1 px-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                            />
                            {timeIndex > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeDeparture(timeIndex)}
                                    className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => appendDeparture('')}
                        className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
                    >
                        Add Departure Time
                    </button>
                </div>

                {/* Arrival Times */}
                <div>
                    <label className="flex items-center text-sm text-cyan-200 mb-2">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        Arrival Times
                    </label>
                    {arrivalTimes.map((time, timeIndex) => (
                        <div key={time.id} className="flex items-center mb-2">
                            <input
                                type="time"
                                {...register(`routes.${routeIndex}.arrivalTimes.${timeIndex}`)}
                                className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg py-1 px-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                            />
                            {timeIndex > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeArrival(timeIndex)}
                                    className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => appendArrival('')}
                        className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
                    >
                        Add Arrival Time
                    </button>
                </div>
            </div>
        </div>
    );
};