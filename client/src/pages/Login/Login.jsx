import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_LOGIN_URL, API_ME_URL } from "../../utils/endpoints";
import AuthPanel from "../../components/auth-panel/auth-panel";

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
        <div className="bg-theme flex flex-row">
            <div className="hidden w-1/2 flex-col md:flex">
                <AuthPanel />
            </div>

            <div className="flex h-screen w-full flex-col md:w-1/2">
                <div className="flex h-full flex-col items-center justify-center gap-6">
                    <div className="bg-card p-6 rounded-lg shadow-md w-full max-w-sm border border-border">
                        <h2 className="text-xl font-bold mb-4 text-foreground">Login</h2>
                        <input
                            type="text"
                            placeholder="Enter API Key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full p-2 border border-input rounded bg-background text-foreground"
                        />
                        {error && <p className="text-destructive text-sm mt-1">{error}</p>}
                        <button onClick={handleLogin} disabled={!apiKey || isLoading} className="mt-4 w-full small inline-flex items-center justify-center whitespace-nowrap rounded-md border outline-none transition duration-150 ease-in-out focus:border-foreground-50 active:focus:border-foreground-50 disabled:cursor-not-allowed disabled:opacity-50 border-none border-primary bg-primary text-foreground hover:bg-primary-90 disabled:hover:bg-primary h-10 px-4 py-2">
                            {isLoading ? "Loading..." : "Login"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login