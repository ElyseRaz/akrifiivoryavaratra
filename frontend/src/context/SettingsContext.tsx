import React, { createContext, useContext, useEffect, useState } from 'react';

export type SettingsState = {
  language: string;
  theme: 'light' | 'dark';
  primaryColor: string;
  fontSize: 'small' | 'normal' | 'large';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
};

const DEFAULTS: SettingsState = {
  language: 'fr',
  theme: 'light',
  primaryColor: '#2563eb',
  fontSize: 'normal',
  notifications: { email: true, sms: false, push: true },
};

type ContextValue = {
  settings: SettingsState;
  setSettings: (s: SettingsState | ((prev: SettingsState) => SettingsState)) => void;
  saveToServer: () => Promise<boolean>;
  loadFromServer: () => Promise<boolean>;
};

const SettingsContext = createContext<ContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const raw = localStorage.getItem('app_settings');
      return raw ? (JSON.parse(raw) as SettingsState) : DEFAULTS;
    } catch (e) {
      return DEFAULTS;
    }
  });

  useEffect(() => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
  }, [settings]);

  // Apply visual settings globally (theme, primary color, font-size)
  useEffect(() => {
    try {
      document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
      if (settings.theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');

      const size = settings.fontSize === 'small' ? '14px' : settings.fontSize === 'large' ? '18px' : '16px';
      document.documentElement.style.fontSize = size;
    } catch (e) {
      // ignore in non-browser environments
    }
  }, [settings.theme, settings.primaryColor, settings.fontSize]);

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';

  // Save settings to server (requires backend implementation)
  const saveToServer = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/user/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        console.warn('saveToServer: non-ok response', res.status);
        return false;
      }
      // Try to parse JSON only when content-type is JSON
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        try { await res.json(); } catch { /* ignore parse errors */ }
      }
      return true;
    } catch (e) {
      console.error('Erreur saveToServer', e);
      return false;
    }
  };

  const loadFromServer = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/user/settings`);
      if (!res.ok) {
        console.warn('loadFromServer: non-ok response', res.status);
        return false;
      }
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        console.warn('loadFromServer: server did not return JSON, content-type=', ct);
        return false;
      }
      let data: any;
      try {
        data = await res.json();
      } catch (err) {
        console.error('loadFromServer: invalid JSON', err);
        return false;
      }
      setSettings((prev) => ({ ...prev, ...data }));
      return true;
    } catch (e) {
      console.error('Erreur loadFromServer', e);
      return false;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, saveToServer, loadFromServer }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
