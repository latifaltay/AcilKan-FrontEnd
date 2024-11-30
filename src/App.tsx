import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Messages from './pages/Messages';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ErrorPage from './pages/ErrorPage';
import { ProfilePage } from './pages/ProfilePage';
import { UserProfileView } from './pages/UserProfileView';
import { ActiveUsersPage } from './pages/ActiveUsersPage';
import { AccountSettings } from './pages/AccountSettings';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { useScrollToTop } from './hooks/useScrollToTop';
import NewMessage from './pages/NewMessage';
import { BloodDonationProvider } from './context/BloodDonationContext';

function ScrollToTop() {
  useScrollToTop();
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <BloodDonationProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            <ScrollToTop />
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
              <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

              {/* Protected Routes */}
              <Route path="/home" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/user/:userId" element={<ProtectedRoute><UserProfileView /></ProtectedRoute>} />
              <Route path="/activeUser" element={<ProtectedRoute><ActiveUsersPage /></ProtectedRoute>} />
              <Route path="/AccountSettings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
              <Route path="/messages/new" element={<ProtectedRoute><NewMessage /></ProtectedRoute>} />
              {/* Error Page */}
              <Route path="*" element={<ErrorPage />} />
            </Routes>
            <Footer />
          </div>
          </BloodDonationProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;