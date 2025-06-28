import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_AGENT_TASKS_DETAILS_URL, API_AGENT_TASKS_RATING_URL, API_AGENT_TASKS_RETRY_URL } from "../../utils/endpoints";

const TaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const workspaceId = localStorage.getItem("selectedWorkspaceId");
  const token = localStorage.getItem("token");

  const [task, setTask] = useState(null);
  const [error, setError] = useState("");
  const [nodeRatings, setNodeRatings] = useState({});
  const [reRunning, setReRunning] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`${API_AGENT_TASKS_DETAILS_URL}/${taskId}`, {
          headers: { "current-workspace-id": workspaceId, "Authorization": `Bearer ${token}` },
        });
        setTask(res.data);
      } catch (err) {
        console.error("Failed to fetch task details.", err);
        setError("Failed to fetch task details.");
      }
    };

    fetchTask();

    const interval = setInterval(fetchTask, 5000);
    return () => clearInterval(interval);
  }, [taskId, workspaceId, token]);

  useEffect(() => {
    if (task?.agentTaskNodes) {
      const initialRatings = {};
      task.agentTaskNodes.forEach((node) => {
        if (node.rating) {
          initialRatings[node.id] = node.rating;
        }
      });
      setNodeRatings(initialRatings);
    }
  }, [task]);


  const handleRetryTask = async () => {
    if (!task) return;
    setReRunning(true);

    try {
      await axios.post(
        API_AGENT_TASKS_RETRY_URL,
        { taskId: task.id },
        { headers: { "current-workspace-id": workspaceId, "Authorization": `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to re-run task", err);
    } finally {
      setReRunning(false);
    }
  };

  const handleRating = async (taskId, nodeId, ratingType) => {
    try {
      await axios.patch(
        `${API_AGENT_TASKS_RATING_URL}/${taskId}`,
        { taskNodeId: nodeId, rating: ratingType, },
        { headers: { "current-workspace-id": workspaceId, "Authorization": `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to submit rating", err);
      alert("Failed to submit feedback.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "FAILED":
        return "bg-destructive/10 text-destructive";
      case "IN_PROGRESS":
        return "bg-primary/10 text-primary";
      case "QUEUED":
        return "bg-muted text-muted-foreground";
      case "USER_INPUT_REQUIRED":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "USER_CONSENT_REQUIRED":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };


  if (error) return <div className="text-destructive">{error}</div>;
  if (!task) return <div>Loading task...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-foreground hover:underline"
        >
          ← Back to Task List
        </button>
        <button
          onClick={handleRetryTask}
          className="small inline-flex items-center justify-center whitespace-nowrap rounded-md border outline-none transition duration-150 ease-in-out focus:border-foreground-50 active:focus:border-foreground-50 disabled:cursor-not-allowed disabled:opacity-50 border-none border-primary bg-primary text-foreground hover:bg-primary-90 disabled:hover:bg-primary h-10 px-4 py-2"
          disabled={reRunning}
        >
          {reRunning ? "Re-running..." : "Re-run Task"}
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-2 text-foreground">{task.customId}</h1>
      <p className="mb-4 text-muted-foreground">{task.taskObjective ? typeof task.taskObjective === 'string' ? task.taskObjective : JSON.stringify(task.taskObjective) : task?.taskQuery || task?.originalTaskQuery}</p>

      <div className="mt-8">
        <h2 className="text-lg text-muted-foreground mb-3">Execution Steps</h2>
        <div className="space-y-4">
          {task?.agentTaskNodes?.map((node) => {
            const tool = node.agentGraphNode?.toolConfiguration?.originalTool;
            const objective = node.agentGraphNode?.objective;
            const status = node.status;

            return (
              <div key={node.id} className="flex items-center gap-4 p-2 bg-card rounded border border-border">
                <img
                  src={tool?.iconSrc || "https://www.pngplay.com/wp-content/uploads/8/Tool-Icon-Transparent-Background.png"}
                  alt={tool?.toolName || "Tool"}
                  className="w-10 h-10 object-contain rounded"
                />
                <div className="flex-1">
                  <h5 className="font-medium text-foreground">{objective || "Unknown Objective"}</h5>
                  <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${getStatusColor(status)}`}>
                    {status.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Feedback buttons */}
                {node.status === "COMPLETED" && <div className="flex gap-2 items-center text-xl">
                  {nodeRatings[node.id] !== "negative" && (
                    <button
                      title="Thumbs Up"
                      onClick={() => handleRating(task.id, node.id, "positive")}
                      className="text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 cursor-pointer"
                    >
                      👍
                    </button>
                  )}
                  {nodeRatings[node.id] !== "positive" && (
                    <button
                      title="Thumbs Down"
                      onClick={() => handleRating(task.id, node.id, "negative")}
                      className="text-destructive hover:text-destructive/80 cursor-pointer"
                    >
                      👎
                    </button>
                  )}
                </div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
