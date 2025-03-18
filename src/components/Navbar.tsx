import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ClipboardList, UserCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { ProfileModal } from './ProfileModal';
import { SearchModal } from './SearchModal';
import { AddressDropdown } from './AddressDropdown';

export const Navbar: React.FC = () => {
  const { userDetails } = useUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'glass-effect' : 'bg-white border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center text-primary-600">
              <span className="text-2xl font-bold tracking-tight">NN</span>
            </Link>

            {/* Address Dropdown */}
            <AddressDropdown />
          </div>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-2">
            <Link
              to="/"
              className={`bottom-nav-item ${isActive('/') ? 'text-primary-600' : ''}`}
            >
              <Home className="bottom-nav-icon" />
              <span className="bottom-nav-label">Home</span>
            </Link>
            
            <button
              onClick={() => setIsSearchOpen(true)}
              className="bottom-nav-item"
            >
              <Search className="bottom-nav-icon" />
              <span className="bottom-nav-label">Search</span>
            </button>
            
            <Link
              to="/orders"
              className={`bottom-nav-item ${isActive('/orders') ? 'text-primary-600' : ''}`}
            >
              <ClipboardList className="bottom-nav-icon" />
              <span className="bottom-nav-label">Orders</span>
            </Link>

            <button
              onClick={() => setIsProfileOpen(true)}
              className={`bottom-nav-item ${isProfileOpen ? 'text-primary-600' : ''}`}
            >
              <UserCircle className="bottom-nav-icon" />
              <span className="bottom-nav-label">Profile</span>
            </button>
          </div>
        </div>
      </div>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <div className="pb-20"></div>
    </>
  );
};