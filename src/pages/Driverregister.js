import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";

export default function DriverRegister() {
    const [formData, setFormData] = useState({
        driverName: "",
        driverEmail: "",
        driverPhone: "",
        driverPassword: "",
        busId: "", // Changed to busId
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [companyId, setCompanyId] = useState("");
    const [buses, setBuses] = useState([]);
    const [loadingBuses, setLoadingBuses] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCompanyId = localStorage.getItem("companyId");
        console.log("Retrieved Company ID:", storedCompanyId); // Debugging log

        if (!storedCompanyId) {
            alert("Company ID not found. Please log in again.");
            navigate("/login");
        } else {
            setCompanyId(storedCompanyId);
            fetchBuses(storedCompanyId);
        }
    }, [navigate]);

    const fetchBuses = async (companyId) => {
        try {
            console.log("Fetching buses for companyId:", companyId);
            const response = await fetch(`http://localhost:8080/bus/company/${companyId}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch buses: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched Buses:", data);
            setBuses(data);
        } catch (error) {
            console.error("Error fetching buses:", error);
        } finally {
            setLoadingBuses(false);
        }
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.driverName.trim()) {
            newErrors.driverName = "Full Name is required";
        }

        if (!formData.driverEmail.trim()) {
            newErrors.driverEmail = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.driverEmail)) {
            newErrors.driverEmail = "Invalid email format";
        }

        if (!formData.driverPhone.trim()) {
            newErrors.driverPhone = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.driverPhone)) {
            newErrors.driverPhone = "Phone number must be 10 digits";
        }

        if (!formData.driverPassword.trim()) {
            newErrors.driverPassword = "Password is required";
        } else if (formData.driverPassword.length < 6) {
            newErrors.driverPassword = "Password must be at least 6 characters long";
        }

        if (!formData.busId) {
            newErrors.busId = "Please select a bus";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(
                `http://localhost:8080/driver/add?companyId=${companyId}`,  // you can keep or remove this param
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...formData, companyId }), // add companyId here
                }
            );

            if (!response.ok) {
                throw new Error((await response.text()) || "Registration failed");
            }

            const data = await response.json();  // get JSON response (with driverId)
            alert(`Registration successful! Your Driver ID is: ${data.driverId}`);
            navigate("/dashboard");
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
            <div className="bg-gray-900/50 backdrop-blur-md border border-cyan-300/20 shadow-xl w-full max-w-md p-8 rounded-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-3xl font-bold flex items-center justify-center gap-2">
                        <FiUser className="h-7 w-7" />
                        Driver Registration
                    </h1>
                    <p className="text-gray-300 mt-2 text-sm">Create your driver account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-cyan-200 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="driverName"
                            value={formData.driverName}
                            onChange={handleChange}
                            className={`w-full bg-gray-800/50 border ${
                                errors.driverName ? "border-red-400" : "border-gray-700"
                            } rounded-lg py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                        />
                        {errors.driverName && (
                            <p className="text-red-400 text-xs mt-1">{errors.driverName}</p>
                        )}
                    </div>

                    {/* Email Address */}
                    <div>
                        <label className="block text-sm font-medium text-cyan-200 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="driverEmail"
                            value={formData.driverEmail}
                            onChange={handleChange}
                            className={`w-full bg-gray-800/50 border ${
                                errors.driverEmail ? "border-red-400" : "border-gray-700"
                            } rounded-lg py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                        />
                        {errors.driverEmail && (
                            <p className="text-red-400 text-xs mt-1">{errors.driverEmail}</p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-medium text-cyan-200 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="driverPhone"
                            value={formData.driverPhone}
                            onChange={handleChange}
                            className={`w-full bg-gray-800/50 border ${
                                errors.driverPhone ? "border-red-400" : "border-gray-700"
                            } rounded-lg py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                        />
                        {errors.driverPhone && (
                            <p className="text-red-400 text-xs mt-1">{errors.driverPhone}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-cyan-200 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="driverPassword"
                            value={formData.driverPassword}
                            onChange={handleChange}
                            className={`w-full bg-gray-800/50 border ${
                                errors.driverPassword ? "border-red-400" : "border-gray-700"
                            } rounded-lg py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                        />
                        {errors.driverPassword && (
                            <p className="text-red-400 text-xs mt-1">{errors.driverPassword}</p>
                        )}
                    </div>

                    {/* Assign Bus */}
                    <div>
                        <label className="block text-sm font-medium text-cyan-200 mb-2">
                            Assign Bus
                        </label>
                        <select
                            name="busId"
                            value={formData.busId}
                            onChange={handleChange}
                            className={`w-full bg-gray-800/50 border ${
                                errors.busId ? "border-red-400" : "border-gray-700"
                            } rounded-lg py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
                        >
                            <option value="">Select Bus</option>
                            {loadingBuses ? (
                                <option>Loading buses...</option>
                            ) : (
                                buses.map((bus) => (
                                    <option key={bus.busId} value={bus.busId}>
                                        {bus.busNumber} - {bus.companyName}
                                    </option>
                                ))
                            )}
                        </select>
                        {errors.busId && (
                            <p className="text-red-400 text-xs mt-1">{errors.busId}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white font-semibold rounded-lg shadow-md hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? "Registering..." : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
}