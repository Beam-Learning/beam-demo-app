import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_AGENT_LIST_URL } from "../../utils/endpoints";
import { useDashboard } from "../../context/DashboardContext";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const { selectedAgent, setSelectedAgent } = useDashboard();

  const workspaceId = localStorage.getItem("selectedWorkspaceId");
  const token = localStorage.getItem("token");

  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get(API_AGENT_LIST_URL, {
          headers: { "current-workspace-id": workspaceId, "Authorization": `Bearer ${token}` }
        });
        setAgents(res.data || []);
      } catch (err) {
        console.error("Failed to fetch agents", err);
      }
    };

    fetchAgents();
  }, [workspaceId, token]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col justify-between h-full p-4">
        <div className="overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Agents</h2>
          {agents?.agents?.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`block w-full text-left p-2 rounded mb-2 ${selectedAgent?.id === agent.id ? "bg-blue-600" : "bg-gray-700"
                }`}
            >
              {agent.name}
            </button>
          ))}
        </div>


        <div className="pt-4 border-t border-gray-700 mt-4">
          <button
            onClick={() => {
              localStorage.removeItem("selectedWorkspaceId");
              window.location.href = "/select-workspace";
            }}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 px-3 rounded mb-2"
          >
            Change Workspace
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
