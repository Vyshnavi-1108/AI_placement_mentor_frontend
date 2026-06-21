import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "./Loader";

const ProtectedRoute = ({ children, adminOnly = false, onboardingPage = false }) => {
  const { token, user, onboardingCompleted, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  // Regular users are redirected to onboarding if incomplete
  if (!onboardingCompleted && !onboardingPage && user.role !== "admin") {
    return <Navigate to="/onboarding" />;
  }

  return children;
};

export default ProtectedRoute;
