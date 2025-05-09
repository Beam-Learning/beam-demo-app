import React, { useState } from "react";
import axios from "axios";
import { API_AGENT_TASKS_CREATE_URL } from "../../utils/endpoints";

const CreateTaskModal = ({ onClose, agentId, onTaskCreated }) => {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const workspaceId = localStorage.getItem("selectedWorkspaceId");
    const token = localStorage.getItem("token");

    const handleSubmit = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            await axios.post(
                API_AGENT_TASKS_CREATE_URL,
                { taskQuery: { query, additionalInfo: "", }, parsingUrls: [], encodedContextFiles: [], agentId },
                { headers: { "current-workspace-id": workspaceId, "Authorization": `Bearer ${token}` } }
            );
            setQuery("");
            onTaskCreated();
            onClose();
        } catch (err) {
            console.error("Failed to create task", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#000000BF] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded w-full max-w-md shadow-md">
                <h2 className="text-lg font-semibold mb-2">Create New Task</h2>
                <textarea
                    rows="4"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter task query..."
                    className="w-full border p-2 rounded mb-4"
                />
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-sm px-4 py-2 rounded hover:bg-gray-400"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;
