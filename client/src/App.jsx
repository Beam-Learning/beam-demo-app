import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/TasksList";
import TaskDetails from "./pages/TaskDetails";
import WorkspaceSelect from "./pages/WorkspaceSelect";
import { DashboardProvider } from "./context/DashboardContext";


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

const WorkspaceProtectedRoute = ({ children }) => {
  const workspaceId = localStorage.getItem("selectedWorkspaceId");
  return workspaceId ? children : <Navigate to="/select-workspace" />;
};

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/select-workspace"
            element={
              <ProtectedRoute>
                <WorkspaceSelect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <WorkspaceProtectedRoute>
                  <DashboardProvider>
                    <Dashboard />
                  </DashboardProvider>
                </WorkspaceProtectedRoute>
              </ProtectedRoute>
            }
          >
            <Route index element={<TaskList />} />
            <Route path="task/:taskId" element={<TaskDetails />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
