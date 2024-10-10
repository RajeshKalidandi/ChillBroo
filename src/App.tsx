import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { auth } from './firebaseConfig';
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

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header user={user} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/generate" element={user ? <ContentGenerator /> : <Navigate to="/login" />} />
            <Route path="/templates" element={user ? <Templates /> : <Navigate to="/login" />} />
            <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
            <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/login" />} />
            <Route path="/pricing" element={<Pricing />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;