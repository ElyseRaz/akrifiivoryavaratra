import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaCog, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement | null>(null);

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
    // Remplacez par votre logique réelle de déconnexion
    localStorage.removeItem('token');
    setIsOpen(false);
    navigate('/login');
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
    <nav className="bg-white shadow-md sticky top-0 z-20">
      <div className="flex justify-between items-center py-3 pr-6 pl-6">
        <div>
          <h1 className="text-xl font-bold text-blue-800">AKRIFI Ivory Avaratra</h1>
          <p className="text-sm opacity-80 text-black">"Aoka hazava eo imason'ny olona toy izany koa ny fahazavanareo" Matio 5:16a</p>
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
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                <FaSignOutAlt /> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;