import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8080/companies/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyEmail: email, companyPassword: password })
            });

            if (!response.ok) {
                throw new Error('Login failed. Please check your email and password.');
            }

            const companyId = await response.text();
            localStorage.setItem('companyId', companyId);
            navigate('/dashboard');
        } catch (error) {
            setError(error.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
            {/* Container */}
            <div className="w-full max-w-md p-8 rounded-xl bg-black bg-opacity-40 shadow-lg backdrop-blur-sm">

                {/* TMS Branding / Title */}
                <h2 className="text-3xl font-semibold text-center text-gray-100 mb-1">
                    Transport Management System
                </h2>
                <p className="text-gray-400 text-center mb-6 text-sm">
                    Where Efficiency Meets Reliability
                </p>

                {/* Display error message */}
                {error && (
                    <div className="mb-4 text-center text-red-400">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">
                            Company Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 text-gray-200 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 text-gray-200 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:border-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-sm hover:text-gray-200 focus:outline-none"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-md font-semibold text-white transition-all ${
                            loading
                                ? 'bg-indigo-500 opacity-50 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-500'
                        }`}
                    >
                        {loading ? "Logging In..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}