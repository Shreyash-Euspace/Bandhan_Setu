import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./pages/auth/login";
import Register from "./pages/auth/Register";
import Layout from "./pages/layout/Layout";
import Dashboard from "./pages/admin/Dashboard";  // Add this import
import ApproveReject from "./pages/admin/AproveReject";

export default function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? <Login /> : <Navigate to="/admin/dashboard" replace />
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? <Register /> : <Navigate to="/admin/dashboard" replace />
          }
        />
        <Route
          path="/admin"
          element={
            isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
          }
        >
          {/* Add the Dashboard route */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="requests" element={<ApproveReject />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/admin/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}