import { Link, useLocation } from 'react-router-dom';
import {FaCalendar, FaTicketAlt, FaUsers, FaBullseye,FaHouseUser, FaMoneyBill,} from 'react-icons/fa';

const Sidebar = ({ isOpen = false, onClose }: { isOpen?: boolean; onClose?: () => void }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Tableau de Bord', path: '/', icon: <FaHouseUser /> },
    { name: 'Activités', path: '/activites', icon: <FaCalendar /> },
    { name: 'Billets', path: '/billet', icon: <FaTicketAlt /> },
    { name: 'Membres', path: '/membres', icon: <FaUsers /> },
    { name: 'Quête', path: '/quete', icon: <FaBullseye /> },
    { name: 'Dépenses', path: '/depenses', icon: <FaMoneyBill /> },
  ];

  return (
    <>
      {/* Backdrop for mobile when sidebar is open */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={onClose} />}

      <div className={`fixed left-0 top-0 h-screen w-64 bg-blue-800 text-white shadow-lg z-40 transform transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 relative">
          <button className="md:hidden absolute top-4 right-4 p-2 text-white" onClick={onClose} aria-label="Close menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <div >
              <img src="/logo.png" alt="AKRIFI Logo" className="w-20 h-20 md:w-40 md:h-40 mx-auto mb-4"/>
              <h1 className="text-lg md:text-2xl font-bold mb-8 text-center">Fankalazana ny faha 40 Taona ny AKRIFI </h1>
          </div>
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-md ${
                      location.pathname === item.path
                        ? 'bg-blue-700 shadow-md border-l-4 border-white'
                        : ''
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="absolute bottom-0 w-full p-4">
          <div className="text-center text-sm opacity-75">
            © 2026 Akrifi Ivory
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
