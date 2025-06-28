import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../contexts/DashboardContext';
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
        return <p className='text-foreground'>Please select an agent to view tasks.</p>;
    }

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h3 className='text-foreground'>Tasks for {selectedAgent.name}</h3>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="small inline-flex items-center justify-center whitespace-nowrap rounded-md border outline-none transition duration-150 ease-in-out focus:border-foreground-50 active:focus:border-foreground-50 disabled:cursor-not-allowed disabled:opacity-50 border-none border-primary bg-primary text-foreground hover:bg-primary-90 disabled:hover:bg-primary h-10 px-4 py-2"
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
                            className="bg-card p-4 rounded shadow border border-border hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-foreground font-bold text-lg">{task.customId}</h3>
                                <span className={`text-xs font-medium px-2 py-1 rounded ${{
                                        "Queued": "bg-muted text-muted-foreground",
                                        "In progress": "bg-primary/10 text-primary",
                                        "Completed": "bg-green-500/10 text-green-700 dark:text-green-400",
                                        "Failed": "bg-destructive/10 text-destructive",
                                        "User input required": "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
                                        "User consent required": "bg-purple-500/10 text-purple-700 dark:text-purple-400",
                                    }[task.status] || "bg-muted text-muted-foreground"
                                    }`}>
                                    {getStatusIcon(task.status)} {task.status?.replace(/_/g, " ")}
                                </span>
                            </div>

                            <p className='text-foreground'>{task.taskObjective}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className='text-foreground'>No tasks found.</p>
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