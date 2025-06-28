import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_AGENT_LIST_URL } from "../../utils/endpoints";
import { useDashboard } from "../../contexts/DashboardContext";
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
      <aside className="bg-transparent w-64 text-card-foreground flex flex-col justify-between h-full p-4 border-r border-border">
        <div className="overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Agents</h2>
          {agents?.agents?.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`block w-full text-left p-2 rounded mb-2 ${selectedAgent?.id === agent.id ? "bg-primary text-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
            >
              {agent.name}
            </button>
          ))}
        </div>


        <div className="pt-4 border-t border-border mt-4">
          <button
            onClick={() => {
              localStorage.removeItem("selectedWorkspaceId");
              window.location.href = "/select-workspace";
            }}
            className="w-full bg-secondary hover:bg-accent/90 text-accent-foreground text-sm py-2 px-3 rounded mb-2"
          >
            Change Workspace
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm py-2 px-3 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
