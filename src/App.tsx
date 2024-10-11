import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './components/AuthContext';
import './i18n'; // Import i18n configuration
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ContentGenerator = lazy(() => import('./pages/ContentGenerator'));
const Templates = lazy(() => import('./pages/Templates'));
const Settings = lazy(() => import('./pages/Settings'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Auth = lazy(() => import('./pages/Auth'));
const AdvancedAnalytics = lazy(() => import('./components/AdvancedAnalytics'));
const SocialMediaIntegration = lazy(() => import('./components/SocialMediaIntegration'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Usage = lazy(() => import('./pages/Usage'));

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
  const { theme } = useTheme();

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <Header user={user} />
      <main className="flex-grow w-full bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Suspense fallback={<LoadingSpinner />}>
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
              <Route path="/social-media-integration" element={
                <ProtectedRoute>
                  <SocialMediaIntegration content={{}} />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/usage" element={<ProtectedRoute><Usage /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        )}
      </main>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} theme={theme} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider>
          <ErrorBoundary>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

export default App;