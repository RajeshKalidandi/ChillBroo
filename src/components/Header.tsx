import React from 'react';
import { Link } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';

interface HeaderProps {
  session: Session | null;
}

const Header: React.FC<HeaderProps> = ({ session }) => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">ChillBroo</Link>
        <ul className="flex space-x-4">
          <li><Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link></li>
          <li><Link to="/generate" className="text-gray-600 hover:text-blue-600">Generate</Link></li>
          <li><Link to="/templates" className="text-gray-600 hover:text-blue-600">Templates</Link></li>
          <li><Link to="/analytics" className="text-gray-600 hover:text-blue-600">Analytics</Link></li>
          <li><Link to="/pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link></li>
          {session ? (
            <li><Link to="/settings" className="text-gray-600 hover:text-blue-600">Settings</Link></li>
          ) : (
            <>
              <li><Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link></li>
              <li><Link to="/register" className="text-gray-600 hover:text-blue-600">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;