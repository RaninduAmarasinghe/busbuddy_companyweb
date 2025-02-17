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
            const response = await fetch("http://localhost:8080/companies/login", {  // Changed port to 8080
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    companyEmail: email,
                    companyPassword: password,
                }),
            });

            const result = await response.text();

            if (response.ok) {
                alert("Login Successful!");
                navigate("/dashboard");
            } else {
                setError(result || "Invalid email or password. Please try again.");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] relative overflow-hidden">
            {/* Floating bubbles background */}
            <div className="absolute w-full h-full flex flex-wrap">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-4 h-4 bg-white opacity-10 rounded-full animate-float"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${Math.random() * 10 + 10}s`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    ></div>
                ))}
            </div>

            {/* Login card */}
            <div className="flex w-full max-w-4xl h-4/5 bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden relative z-10">
                {/* Left side - Welcome message */}
                <div className="flex-1 flex flex-col justify-center items-center p-10 text-center text-white bg-gradient-to-br from-purple-800 via-blue-600 to-transparent relative overflow-hidden">
                    <h1 className="text-4xl font-bold relative z-10 animate-fade-in">Welcome Back</h1>
                    <p className="mt-2 text-gray-300 relative z-10 animate-fade-in delay-100">
                        Where Innovation Meets Security
                    </p>
                </div>

                {/* Right side - Login form */}
                <div className="flex-1 flex justify-center items-center p-10">
                    <form
                        className="bg-black bg-opacity-50 p-8 rounded-lg w-full max-w-sm animate-slide-in"
                        onSubmit={handleSubmit}
                    >
                        <h2 className="text-white text-2xl font-semibold text-center mb-6">Company Login</h2>

                        {/* Display error message */}
                        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

                        <div className="mb-4 relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-transparent border-b-2 border-gray-500 text-white py-2 px-3 focus:outline-none focus:border-orange-400 transition-all"
                            />
                            <label className="absolute left-3 top-2 text-gray-400 text-sm transition-all pointer-events-none">
                                Company Email
                            </label>
                        </div>
                        <div className="mb-6 relative">
                            <input
                                type={showPassword ? "text" : "password"}  // Toggle password visibility
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-transparent border-b-2 border-gray-500 text-white py-2 px-3 focus:outline-none focus:border-orange-400 transition-all"
                            />
                            <label className="absolute left-3 top-2 text-gray-400 text-sm transition-all pointer-events-none">
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2 text-gray-400 text-sm"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:opacity-90 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}  // Disable button while loading
                        >
                            {loading ? "Logging In..." : "Login"}
                        </button>
                        <p className="mt-4 text-center text-gray-400 cursor-pointer hover:text-orange-400 transition">
                            Forgot Password?
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}