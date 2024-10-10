import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import ContentGenerator from './pages/ContentGenerator';
import Templates from './pages/Templates';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Onboarding from './pages/Onboarding';
import Pricing from './pages/Pricing';
import Register from './components/Register';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import Auth from './pages/Auth';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import SocialMediaIntegration from './components/SocialMediaIntegration';
import UserSettings from './components/UserSettings';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header user={user} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Onboarding />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/generate" element={user ? <ContentGenerator /> : <Navigate to="/login" />} />
            <Route path="/templates" element={user ? <Templates /> : <Navigate to="/login" />} />
            <Route path="/settings" element={user ? <UserSettings /> : <Navigate to="/login" />} />
            <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/login" />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/profile" element={user ? <UserProfile /> : <Navigate to="/login" />} />
            <Route path="/advanced-analytics" element={user ? <AdvancedAnalytics /> : <Navigate to="/login" />} />
            <Route path="/social-media-integration" element={user ? <SocialMediaIntegration /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </Router>
  );
};

export default App;