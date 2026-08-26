import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../shared/ui/ProtectedRoute";
import { PublicRoute } from "../shared/ui/PublicRoute";
import Home from "../features/marketing/pages/Home";
import About from "../features/marketing/pages/About";
import Contact from "../features/marketing/pages/Contact";
import Blog from "../features/marketing/pages/Blog";
import BlogDetail from "../features/marketing/pages/BlogDetail";
import Privacy from "../features/marketing/pages/Privacy";
import Terms from "../features/marketing/pages/Terms";
import ErrorPage from "../features/marketing/pages/ErrorPage";
import Login from "../features/auth/pages/Login";
import { Register } from "../features/auth/pages/Register";
import VerifyEmail from "../features/auth/pages/VerifyEmail";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import Dashboard from "../features/blood-requests/pages/Dashboard";
import Messages from "../features/messaging/pages/Messages";
import { ProfilePage } from "../features/profile/pages/ProfilePage";
import MyRequests from "../features/donations/pages/MyRequests";
import MyDonationOffers from "../features/donations/pages/MyDonationOffers";
import { AccountSettings } from "../features/profile/pages/AccountSettings";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-requests"
        element={
          <ProtectedRoute>
            <MyRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-offers"
        element={
          <ProtectedRoute>
            <MyDonationOffers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account-settings"
        element={
          <ProtectedRoute>
            <AccountSettings />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
