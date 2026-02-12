import React, { useEffect, useRef, type ChangeEvent, useState } from 'react';
import { FaMoon, FaSun, FaSave, FaUndo } from 'react-icons/fa';
import { useSettings } from '../context/SettingsContext';

const Settings: React.FC = () => {
  const { settings, setSettings, saveToServer, loadFromServer } = useSettings();
  const [showAll, setShowAll] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Apply visual changes dynamically
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    if (settings.theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    const size = settings.fontSize === 'small' ? '14px' : settings.fontSize === 'large' ? '18px' : '16px';
    document.documentElement.style.fontSize = size;
  }, [settings.theme, settings.primaryColor, settings.fontSize]);

  useEffect(() => {
    // Try to load remote settings if backend exists (non-blocking)
    loadFromServer().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = <K extends keyof typeof settings>(key: K, value: typeof settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value } as any));
  };

  const updateNested = (section: string, key: string | number, value: any) => {
    setSettings((prev: any) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
  };

  const resetDefaults = () => {
    const defaults = {
      language: 'fr',
      theme: 'light',
      primaryColor: '#2563eb',
      fontSize: 'normal',
      notifications: { email: true, sms: false, push: true },
    } as typeof settings;
    setSettings(defaults);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'akrifi-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        setSettings((prev) => ({ ...prev, ...(parsed as Partial<typeof settings>) }));
        alert('Paramètres importés');
      } catch (err) {
        alert('Fichier invalide');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveServer = async () => {
    setSaving(true);
    const ok = await saveToServer();
    setSaving(false);
    if (ok) alert('Paramètres enregistrés sur le serveur');
    else alert('Impossible d\'enregistrer sur le serveur (aucun backend ?)');
  };

  return (
    <div className="p-8 ml-72">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Paramètres</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAll((s) => !s)}
            className="px-3 py-2 bg-gray-100 rounded shadow text-sm hover:bg-gray-200 flex items-center gap-2"
          >
            {showAll ? 'Cacher tous les paramètres' : 'Voir tous les paramètres'}
          </button>
          <button
            onClick={exportSettings}
            className="px-3 py-2 bg-green-600 text-white rounded shadow text-sm hover:bg-green-700 flex items-center gap-2"
          >
            Exporter
          </button>
          <label className="px-3 py-2 bg-blue-600 text-white rounded shadow text-sm hover:bg-blue-700 cursor-pointer flex items-center gap-2">
            Importer
            <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={importSettings} />
          </label>
          <button onClick={handleSaveServer} disabled={saving} className="px-3 py-2 bg-indigo-600 text-white rounded shadow text-sm hover:bg-indigo-700 flex items-center gap-2">
            <FaSave /> Enregistrer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="p-4 border rounded shadow-sm bg-white">
          <h3 className="font-semibold mb-3">Général</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Langue</label>
              <select
                value={settings.language}
                onChange={(e) => update('language', e.target.value)}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="fr">Français</option>
                <option value="mg">Malagasy</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Taille du texte</label>
              <div className="flex gap-2">
                {(['small', 'normal', 'large'] as typeof settings['fontSize'][]).map((s) => (
                  <button
                    key={s}
                    onClick={() => update('fontSize', s)}
                    className={`px-3 py-2 border rounded ${settings.fontSize === s ? 'bg-blue-600 text-white' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="p-4 border rounded shadow-sm bg-white">
          <h3 className="font-semibold mb-3">Apparence</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Thème</label>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => update('theme', 'light')}
                  className={`px-3 py-2 border rounded flex items-center gap-2 ${settings.theme === 'light' ? 'bg-blue-600 text-white' : ''}`}
                >
                  <FaSun /> Clair
                </button>
                <button
                  onClick={() => update('theme', 'dark')}
                  className={`px-3 py-2 border rounded flex items-center gap-2 ${settings.theme === 'dark' ? 'bg-blue-600 text-white' : ''}`}
                >
                  <FaMoon /> Sombre
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Couleur principale</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => update('primaryColor', e.target.value)}
                  className="h-10 w-16 p-0 border rounded"
                />
                <div className="flex-1">
                  <div className="text-sm text-gray-600">Aperçu :</div>
                  <div className="mt-2 p-3 rounded" style={{ border: `1px solid ${settings.primaryColor}` }}>
                    <div className="font-semibold" style={{ color: settings.primaryColor }}>
                      Couleur principale
                    </div>
                    <div className="text-xs text-gray-500">Utilisée pour boutons et accents</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p-4 border rounded shadow-sm bg-white">
          <h3 className="font-semibold mb-3">Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => updateNested('notifications', 'email', e.target.checked)}
              />
              <span>Email</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.notifications.sms}
                onChange={(e) => updateNested('notifications', 'sms', e.target.checked)}
              />
              <span>SMS</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) => updateNested('notifications', 'push', e.target.checked)}
              />
              <span>Push</span>
            </label>
          </div>
        </section>

        <section className="p-4 border rounded shadow-sm bg-white">
          <h3 className="font-semibold mb-3">Sécurité</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Changer le mot de passe</label>
              <input type="password" placeholder="Mot de passe actuel" className="w-full border rounded px-3 py-2 mb-2" />
              <input type="password" placeholder="Nouveau mot de passe" className="w-full border rounded px-3 py-2 mb-2" />
              <input type="password" placeholder="Confirmer le mot de passe" className="w-full border rounded px-3 py-2 mb-2" />
              <button className="px-3 py-2 bg-indigo-600 text-white rounded">Mettre à jour</button>
            </div>
          </div>
        </section>

        <section className="p-4 border rounded shadow-sm bg-white md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Sauvegarde & Réinitialisation</h3>
            <button onClick={resetDefaults} className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center gap-2"><FaUndo /> Réinitialiser</button>
          </div>
          <p className="text-sm text-gray-600">Exporter vos paramètres ou importer un fichier JSON de configuration.</p>
        </section>
      </div>

      {showAll && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h4 className="font-semibold mb-2">Tous les paramètres (JSON)</h4>
          <pre className="bg-white p-4 rounded overflow-x-auto text-sm">{JSON.stringify(settings, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Settings;
