import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Activites from './pages/Activites';
import Billet from './pages/Billet';
import Membres from './pages/Membres';
import Quete from './pages/Quete';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import About from './pages/About';
import Depenses from './pages/Depenses';
import Login from './pages/Login';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen(v => !v);

  return (
    <div className="flex flex-row min-h-screen">
      {isAuthenticated && <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />}
      <main className={`flex-1 ${isAuthenticated ? 'md:ml-64' : ''} pt-16`}>
        <Navbar onToggleSidebar={toggleSidebar} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/activites"
            element={<PrivateRoute><Activites /></PrivateRoute>}
          />
          <Route
            path="/billet"
            element={<PrivateRoute><Billet /></PrivateRoute>}
          />
          <Route
            path="/membres"
            element={<PrivateRoute><Membres /></PrivateRoute>}
          />
          <Route
            path="/quete"
            element={<PrivateRoute><Quete /></PrivateRoute>}
          />
          <Route
            path="/settings"
            element={<PrivateRoute><Settings /></PrivateRoute>}
          />
          <Route
            path="/about"
            element={<PrivateRoute><About /></PrivateRoute>}
          />
          <Route
            path="/depenses"
            element={<PrivateRoute><Depenses /></PrivateRoute>}
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </SettingsProvider>
  );
}

export default App
