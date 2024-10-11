import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './components/AuthContext';
import './i18n'; // Import i18n configuration
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import ContentGenerator from './pages/ContentGenerator';
import Templates from './pages/Templates';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Onboarding from './pages/Onboarding';
import Pricing from './pages/Pricing';
import Auth from './pages/Auth';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import SocialMediaIntegration from './components/SocialMediaIntegration';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './components/Login';
import Register from './components/Register';
import Checkout from './pages/Checkout';
import Usage from './pages/Usage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header user={user} />
        <main className="flex-grow container mx-auto px-4 py-8">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Routes>
              <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Onboarding />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/generate" element={<ProtectedRoute><ContentGenerator /></ProtectedRoute>} />
              <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/advanced-analytics" element={<ProtectedRoute><AdvancedAnalytics /></ProtectedRoute>} />
              <Route path="/social-media-integration" element={<ProtectedRoute><SocialMediaIntegration /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/usage" element={<ProtectedRoute><Usage /></ProtectedRoute>} />
            </Routes>
          )}
        </main>
        <Footer />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;