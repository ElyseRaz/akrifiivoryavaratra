import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';

type User = {
  id: number;
  nom_utilisateur: string;
  email: string;
  role?: string;
} | null;

type AuthContextValue = {
  isAuthenticated: boolean;
  token: string | null;
  user: User;
  login: (email: string, mot_de_passe: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User>(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, mot_de_passe: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/utilisateurs/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mot_de_passe }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUser(data.utilisateur || data.user || null);
        return { ok: true };
      }
      return { ok: false, message: data.error || 'Erreur de connexion' };
    } catch (error) {
      return { ok: false, message: 'Erreur réseau' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
