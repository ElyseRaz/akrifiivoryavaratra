import { Link, useLocation } from 'react-router-dom';
import {FaCalendar, FaTicketAlt, FaUsers, FaBullseye,FaHouseUser, FaMoneyBill,} from 'react-icons/fa';

const Sidebar = () => {
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
    <div className="fixed left-0 top-0 h-screen w-64 bg-blue-800 text-white shadow-lg z-40">
      <div className="p-6">
        <div >
            <img src="/logo.png" alt="AKRIFI Logo" className="w-40 h-40 mx-auto mb-4"/>
            <h1 className="text-2xl font-bold mb-8 text-center">Fankalazana ny faha 40 Taona ny AKRIFI </h1>
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
      <div className="absolute bottom-0 w-64 p-4">
        <div className="text-center text-sm opacity-75">
          © 2026 Akrifi Ivory
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
