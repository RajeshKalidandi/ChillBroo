import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Menu, X, ChevronDown, LogOut, Settings, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">ChillBroo</Link>
          <nav className="hidden md:flex space-x-4 items-center">
            <NavLink to="/pricing">Pricing</NavLink>
            {user ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/generate">Generate Content</NavLink>
                <NavLink to="/templates">Templates</NavLink>
                <NavLink to="/analytics">Analytics</NavLink>
                <NavLink to="/usage">Usage</NavLink>
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-1 hover:text-blue-200 focus:outline-none"
                  >
                    <span>{user.displayName || user.email}</span>
                    <ChevronDown size={20} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <DropdownItem to="/profile" icon={<UserIcon size={18} />}>Profile</DropdownItem>
                      <DropdownItem to="/settings" icon={<Settings size={18} />}>Settings</DropdownItem>
                      <DropdownItem onClick={handleLogout} icon={<LogOut size={18} />}>Logout</DropdownItem>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </nav>
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="px-4 pt-2 pb-4 space-y-2">
            <MobileNavLink to="/pricing" onClick={toggleMenu}>Pricing</MobileNavLink>
            {user ? (
              <>
                <MobileNavLink to="/dashboard" onClick={toggleMenu}>Dashboard</MobileNavLink>
                <MobileNavLink to="/generate" onClick={toggleMenu}>Generate Content</MobileNavLink>
                <MobileNavLink to="/templates" onClick={toggleMenu}>Templates</MobileNavLink>
                <MobileNavLink to="/analytics" onClick={toggleMenu}>Analytics</MobileNavLink>
                <MobileNavLink to="/profile" onClick={toggleMenu}>Profile</MobileNavLink>
                <MobileNavLink to="/settings" onClick={toggleMenu}>Settings</MobileNavLink>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-700">Logout</button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" onClick={toggleMenu}>Login</MobileNavLink>
                <MobileNavLink to="/register" onClick={toggleMenu}>Register</MobileNavLink>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link to={to} className="hover:text-blue-200 transition-colors duration-200">
    {children}
  </Link>
);

const MobileNavLink: React.FC<{ to: string; onClick: () => void; children: React.ReactNode }> = ({ to, onClick, children }) => (
  <Link to={to} className="block px-4 py-2 text-sm hover:bg-blue-700" onClick={onClick}>
    {children}
  </Link>
);

const DropdownItem: React.FC<{ to?: string; onClick?: () => void; icon: React.ReactNode; children: React.ReactNode }> = ({ to, onClick, icon, children }) => {
  const content = (
    <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
      <span className="mr-2">{icon}</span>
      <span>{children}</span>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : <div onClick={onClick}>{content}</div>;
};

export default Header;