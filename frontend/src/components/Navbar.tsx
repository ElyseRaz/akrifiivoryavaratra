import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaCog, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement | null>(null);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  const handleSettings = () => {
    setIsOpen(false);
    navigate('/settings');
  };

  const handleAbout = () => {
    setIsOpen(false);
    navigate('/about');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 ${isAuthenticated ? 'md:left-64' : ''} bg-white shadow-md z-30`}>
      <div className="flex justify-between items-center py-3 px-4 sm:px-6">
        <div className="flex items-center">
          <button className="md:hidden mr-3 p-2 rounded-md hover:bg-gray-100" onClick={onToggleSidebar} aria-label="Toggle menu">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-bold text-blue-800">AKRIFI Ivory Avaratra</h1>
            <p className="hidden sm:block text-sm opacity-80 text-black">"Aoka hazava eo imason'ny olona toy izany koa ny fahazavanareo" Matio 5:16a</p>
          </div>
        </div>
        <div className="relative" ref={ref}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-haspopup="true"
            aria-expanded={isOpen}
            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
          >
            <FaUser className="text-gray-700" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <button
                onClick={handleSettings}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <FaCog /> Paramètres
              </button>
              <button
                onClick={handleAbout}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <FaInfoCircle /> À propos
              </button>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  <FaSignOutAlt /> Déconnexion
                </button>
              ) : (
                <button
                  onClick={() => { setIsOpen(false); navigate('/login'); }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-blue-700 hover:bg-gray-100"
                >
                  <FaUser /> Se connecter
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>

  );
};

export default Navbar;