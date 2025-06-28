import React, { useState } from "react";
import axios from "axios";
import { API_AGENT_TASKS_CREATE_URL } from "../../utils/endpoints";

const CreateTaskModal = ({ onClose, agentId, onTaskCreated }) => {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const workspaceId = localStorage.getItem("selectedWorkspaceId");
    const token = localStorage.getItem("token");

    const handleSubmit = async () => {
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded w-full max-w-md shadow-md border border-border">
                <h4 className="text-foreground mb-2">Create New Task</h4>
                <textarea
                    rows="4"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter task query..."
                    className="w-full border border-input p-2 rounded mb-4 bg-background text-foreground"
                />
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="bg-secondary hover:bg-accent/90 text-accent-foreground text-sm py-2 px-4 rounded"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md border outline-none transition duration-150 ease-in-out focus:border-foreground-50 active:focus:border-foreground-50 disabled:cursor-not-allowed disabled:opacity-50 border-none border-primary bg-primary text-foreground hover:bg-primary-90 disabled:hover:bg-primary h-10 px-4 py-2"
                        disabled={loading || !query.trim()}
                    >
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;
