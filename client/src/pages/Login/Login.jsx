import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_LOGIN_URL, API_ME_URL } from "../../utils/endpoints";

const Login = () => {
    const [apiKey, setApiKey] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await axios.post(API_LOGIN_URL, { apiKey });
            const token = response.data.idToken;
            localStorage.setItem("token", token);

            const meResponse = await axios.get(API_ME_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.setItem("user", JSON.stringify(meResponse.data));

            setLoading(false);

            navigate("/select-workspace");
        } catch (err) {
            setLoading(false);
            setApiKey('');
            setError(err?.response?.data?.error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4">Login</h2>
                <input
                    type="text"
                    placeholder="Enter API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                />
                <button onClick={handleLogin} className="w-full bg-blue-500 text-white p-2 rounded">
                    {isLoading ? "Loading..." : "Login"}
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
        </div>
    )
}

export default Login