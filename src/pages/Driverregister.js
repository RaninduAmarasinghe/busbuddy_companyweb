import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";

export default function DriverRegister() {
    const [formData, setFormData] = useState({
        driverName: "",
        driverEmail: "",
        driverPhone: "",
        driverPassword: "",
        busNumber: "",
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
            console.log("Fetched Buses:", data); // Debugging output
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

        if (!formData.busNumber) {
            newErrors.busNumber = "Please select a bus";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8080/driver/add?companyId=${companyId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(await response.text() || "Registration failed");
            }

            alert("Registration successful!");
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
            [name]: value
        }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                        <FiUser className="text-blue-600" />
                        Driver Registration
                    </h1>
                    <p className="text-gray-500 mt-2">Create your driver account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            name="driverName"
                            value={formData.driverName}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${errors.driverName ? "border-red-500" : "border-gray-300"}`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="driverEmail"
                            value={formData.driverEmail}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${errors.driverEmail ? "border-red-500" : "border-gray-300"}`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            name="driverPhone"
                            value={formData.driverPhone}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${errors.driverPhone ? "border-red-500" : "border-gray-300"}`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            name="driverPassword"
                            value={formData.driverPassword}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${errors.driverPassword ? "border-red-500" : "border-gray-300"}`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assign Bus</label>
                        <select
                            name="busNumber"
                            value={formData.busNumber}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${errors.busNumber ? "border-red-500" : "border-gray-300"}`}
                        >
                            <option value="">Select Bus</option>
                            {loadingBuses ? (
                                <option>Loading buses...</option>
                            ) : (
                                buses.map((bus) => (
                                    <option key={bus.busId} value={bus.busNumber}>
                                        {bus.busNumber} - {bus.companyName}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg disabled:bg-gray-400"
                    >
                        {isSubmitting ? "Registering..." : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
}