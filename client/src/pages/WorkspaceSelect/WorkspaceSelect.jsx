import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthPanel from "../../components/auth-panel/auth-panel";

const WorkspaceSelectPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [workspaceId, setWorkspaceId] = useState("");

  const handleContinue = () => {
    localStorage.setItem("selectedWorkspaceId", workspaceId);
    navigate("/dashboard");
  };

  return (
    <div className="bg-theme flex flex-row">
      <div className="hidden w-1/2 flex-col md:flex">
        <AuthPanel />
      </div>

      <div className="flex h-screen w-full flex-col md:w-1/2">
        <div className="flex h-full flex-col items-center justify-center gap-6">
          <div className="bg-card p-6 rounded-lg shadow-md w-full max-w-sm border border-border">
            <h2 className="text-xl font-bold mb-4 text-foreground">Select Workspace</h2>
            <select
              value={workspaceId}
              onChange={(e) => setWorkspaceId(e.target.value)}
              className="w-full p-2 border border-input rounded bg-background text-foreground"
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
              disabled={!workspaceId}
              className="mt-4 w-full small inline-flex items-center justify-center whitespace-nowrap rounded-md border outline-none transition duration-150 ease-in-out focus:border-foreground-50 active:focus:border-foreground-50 disabled:cursor-not-allowed disabled:opacity-50 border-none border-primary bg-primary text-foreground hover:bg-primary-90 disabled:hover:bg-primary h-10 px-4 py-2"
            >
              Continue
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSelectPage;
