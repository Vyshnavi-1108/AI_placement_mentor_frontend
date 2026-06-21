import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Onboarding from "../pages/Onboarding";
import Dashboard from "../pages/Dashboard";
import Roadmap from "../pages/Roadmap";
import Chat from "../pages/Chat";
import Tasks from "../pages/Tasks";
import Interview from "../pages/Interview";
import Analytics from "../pages/Analytics";
import Profile from "../pages/Profile";
import Feedback from "../pages/Feedback";
import AdminDashboard from "../pages/AdminDashboard";
import AdminUsers from "../pages/AdminUsers";

import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#0f172a",
            color: "#f8fafc",
            border: "1px solid #1e293b",
          },
        }}
      />
      <Routes>
        {/* Public Landing & Auth Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Guarded Onboarding Profile Setup */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute onboardingPage={true}>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* Private Student preparation dashboard routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/feedback" element={<Feedback />} />
        </Route>

        {/* Admin Portal Dashboard and Operations */}
        <Route
          element={
            <ProtectedRoute adminOnly={true}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

        {/* Fallback to index */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
