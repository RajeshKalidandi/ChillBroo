import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="/images/logo.png" 
              alt="ChillBroo Logo" 
              className="w-8 h-8 object-contain mr-2"
            />
            <span className="text-xl font-bold">ChillBroo</span>
          </div>
          <nav className="flex space-x-4">
            <Link to="/about" className="hover:text-blue-300 transition-colors duration-200">About</Link>
            <Link to="/privacy" className="hover:text-blue-300 transition-colors duration-200">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-300 transition-colors duration-200">Terms of Service</Link>
          </nav>
          <p className="mt-4 md:mt-0">&copy; 2024 ChillBroo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;