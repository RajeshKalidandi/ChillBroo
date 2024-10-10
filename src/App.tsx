import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import ContentGenerator from './pages/ContentGenerator'
import Templates from './pages/Templates'
import Settings from './pages/Settings'
import Analytics from './pages/Analytics'
import Onboarding from './pages/Onboarding'
import Pricing from './pages/Pricing'
import Register from './pages/Register'
import Login from './components/Login'
import { AuthProvider } from './components/AuthContext'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/generate" element={<ContentGenerator />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;