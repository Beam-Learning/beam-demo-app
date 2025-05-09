import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const WorkspaceSelectPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [workspaceId, setWorkspaceId] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!workspaceId) {
      setError("You must select a workspace");
      return;
    }

    localStorage.setItem("selectedWorkspaceId", workspaceId);
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Select Workspace</h2>
        <select
          value={workspaceId}
          onChange={(e) => setWorkspaceId(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">-- Select a workspace --</option>
          {user?.workspaces?.map((ws) => (
            <option key={ws.id} value={ws.id}>
              {ws.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleContinue}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Continue
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default WorkspaceSelectPage;
