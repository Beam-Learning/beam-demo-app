import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import axios from 'axios';
import { API_AGENT_TASKS_LIST_URL } from '../../utils/endpoints';
import CreateTaskModal from '../CreateTaskModal';

const TasksList = () => {
    const { selectedAgent } = useDashboard();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const workspaceId = localStorage.getItem("selectedWorkspaceId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!selectedAgent) return;

        const fetchTasks = async () => {
            try {
                const res = await axios.get(API_AGENT_TASKS_LIST_URL, {
                    headers: { "current-workspace-id": workspaceId, "Authorization": `Bearer ${token}` },
                    params: { agentId: selectedAgent.id },
                });
                setTasks(res.data || []);
            } catch (err) {
                console.error("Failed to fetch agent tasks", err);
            }
        };

        fetchTasks();

        const interval = setInterval(fetchTasks, 5000);
        return () => clearInterval(interval);
    }, [selectedAgent, workspaceId, token, refreshTrigger]);

    const getStatusIcon = (status) => {
        switch (status) {
            case "QUEUED":
                return "⏳";
            case "IN_PROGRESS":
                return "🔄";
            case "COMPLETED":
                return "✅";
            case "FAILED":
                return "❌";
            case "USER_INPUT_REQUIRED":
                return "📝";
            case "USER_CONSENT_REQUIRED":
                return "🛑";
            default:
                return "📄";
        }
    };

    if (!selectedAgent) {
        return <p>Please select an agent to view tasks.</p>;
    }

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Tasks for {selectedAgent.name}</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                >
                    Create New Task
                </button>
            </div>
            {tasks?.data?.[0]?.tasks?.length > 0 ? (
                <ul className="space-y-2">
                    {tasks?.data?.[0]?.tasks?.map((task) => (
                        <li
                            key={task.id}
                            onClick={() => navigate(`/dashboard/task/${task.id}`)}
                            className="bg-white p-4 rounded shadow"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-lg">{task.customId}</h3>
                                <span className={`text-xs font-medium px-2 py-1 rounded ${{
                                        "Queued": "bg-gray-200 text-gray-800",
                                        "In progress": "bg-blue-100 text-blue-800",
                                        "Completed": "bg-green-100 text-green-800",
                                        "Failed": "bg-red-100 text-red-800",
                                        "User input required": "bg-yellow-100 text-yellow-800",
                                        "User consent required": "bg-indigo-100 text-indigo-800",
                                    }[task.status] || "bg-gray-100 text-gray-600"
                                    }`}>
                                    {getStatusIcon(task.status)} {task.status?.replace(/_/g, " ")}
                                </span>
                            </div>

                            <p>{task.taskObjective}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tasks found.</p>
            )}

            {isModalOpen && (
                <CreateTaskModal
                    onClose={() => setIsModalOpen(false)}
                    agentId={selectedAgent.id}
                    onTaskCreated={() => setRefreshTrigger(prev => prev + 1)}
                />
            )}
        </>
    )
}

export default TasksList