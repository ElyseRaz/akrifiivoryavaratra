import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaCalendar, FaMoneyBill, FaTicketAlt, FaGithub } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#2563eb', '#06b6d4', '#f97316', '#a78bfa'];

const About: React.FC = () => {
  const [membersCount, setMembersCount] = useState<number | null>(null);
  const [activitiesCount, setActivitiesCount] = useState<number | null>(null);
  const [depensesCount, setDepensesCount] = useState<number | null>(null);
  const [quetesCount, setQuetesCount] = useState<number | null>(null);
  const [billetsCount, setBilletsCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

// Vite expose les variables d'environnement via import.meta.env (préfixer par VITE_)
    const base = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${base}/api/members`);
      setMembersCount(Array.isArray(res.data) ? res.data.length : 0);
    } catch (err) {
      console.error('Erreur fetchMembers', err);
      setMembersCount(0);
      setError('Erreur lors de la récupération des membres.');
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await axios.get(`${base}/api/activities`);
      // controller returns { activities, total }
      setActivitiesCount(res.data && typeof res.data.total === 'number' ? res.data.total : (Array.isArray(res.data) ? res.data.length : 0));
    } catch (err) {
      console.error('Erreur fetchActivities', err);
      setActivitiesCount(0);
      setError('Erreur lors de la récupération des activités.');
    }
  };

  const fetchDepenses = async () => {
    try {
      const res = await axios.get(`${base}/api/depenses`);
      setDepensesCount(Array.isArray(res.data) ? res.data.length : 0);
    } catch (err) {
      console.error('Erreur fetchDepenses', err);
      setDepensesCount(0);
      setError('Erreur lors de la récupération des dépenses.');
    }
  };

  const fetchQuetes = async () => {
    try {
      const res = await axios.get(`${base}/api/quete`);
      setQuetesCount(Array.isArray(res.data) ? res.data.length : 0);
    } catch (err) {
      console.error('Erreur fetchQuetes', err);
      setQuetesCount(0);
      setError('Erreur lors de la récupération des quêtes.');
    }
  };

  const fetchBillets = async () => {
    try {
      const res = await axios.get(`${base}/api/billets`);
      setBilletsCount(Array.isArray(res.data) ? res.data.length : 0);
    } catch (err) {
      console.error('Erreur fetchBillets', err);
      setBilletsCount(0);
      setError('Erreur lors de la récupération des billets.');
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchMembers(), fetchActivities(), fetchDepenses(), fetchQuetes(), fetchBillets()]);
      setLoading(false);
    };

    fetchAll();
  }, []);

  const pieData = [
    { name: 'Membres', value: membersCount ?? 0 },
    { name: 'Quêtes', value: quetesCount ?? 0 },
    { name: 'Billets', value: billetsCount ?? 0 },
  ];


  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-6">
        <h2 className="text-3xl font-extrabold">À propos — AKRIFI Ivory Avaratra</h2>
        <p className="text-gray-600 mt-2">Application de gestion associative simple et moderne — membres, activités, dépenses, quêtes, billets.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <main className="md:col-span-2 space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6 border">
            <h3 className="text-xl font-semibold mb-2">Présentation rapide</h3>
            <p className="text-gray-700">AKRIFI Ivory Avaratra aide à gérer simplement les aspects administratifs et financiers d'une association : enregistrement des membres, planification d'activités, enregistrement des dépenses avec pièces justificatives, gestion des quêtes (dons), et suivi des billets et lots.</p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                <FaUsers className="mx-auto text-blue-600 text-2xl" />
                <div className="font-semibold mt-2">{loading ? '—' : membersCount}</div>
                <div className="text-xs text-gray-500">Membres</div>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
                <FaCalendar className="mx-auto text-green-600 text-2xl" />
                <div className="font-semibold mt-2">{loading ? '—' : activitiesCount}</div>
                <div className="text-xs text-gray-500">Activités</div>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-center">
                <FaMoneyBill className="mx-auto text-orange-500 text-2xl" />
                <div className="font-semibold mt-2">{loading ? '—' : depensesCount}</div>
                <div className="text-xs text-gray-500">Quêtes / Dépenses</div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-center">
                <FaTicketAlt className="mx-auto text-indigo-600 text-2xl" />
                <div className="font-semibold mt-2">{loading ? '—' : billetsCount}</div>
                <div className="text-xs text-gray-500">Billets</div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 border">
            <h3 className="text-xl font-semibold mb-2">Fonctionnalités clés</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>CRUD pour Membres, Activités, Quêtes, Dépenses</li>
                <li>Upload et conservation des justificatifs</li>
                <li>API REST sécurisée (JWT)</li>
              </ul>

              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Gestion des billets et lots</li>
                <li>Documentation Swagger intégrée</li>
                <li>Statistiques et graphiques (Recharts)</li>
              </ul>
            </div>

            <div className="mt-4 flex gap-3">
              <a href="http://localhost:5000/api-docs" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Documentation API</a>
              <a href="https://github.com/ElyseRaz/akrifiivoryavaratra" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-gray-200 px-4 py-2 rounded hover:bg-gray-50"><FaGithub /> Dépôt GitHub</a>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6 border">
            <h3 className="text-xl font-semibold mb-2">Base de données</h3>
            <p className="text-gray-700">Le schéma d'initialisation se trouve dans <code className="bg-gray-100 px-1 rounded">backend/migrations/AKRIFI.SQL</code>. Les tables principales : MEMBRE, ACTIVITES, DEPENSE, QUETE, BILLET, LOT_BILLET, UTILISATEURS.</p>
          </div>
        </main>

        <aside className="space-y-4">
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">RZ</div>
              <div>
                <h4 className="font-semibold">RaZAFINDRAVONJY Solofonirina ELysé</h4>
                <p className="text-sm text-gray-500">Auteur & Développeur</p>
              </div>
            </div>

            <div className="mt-4">
              <a href="https://github.com/ElyseRaz" target="_blank" rel="noreferrer" className="text-sm text-gray-600 hover:underline flex items-center gap-2"><FaGithub /> ElyseRaz</a>
            </div>

            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Répartition</h5>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" outerRadius={60} fill="#8884d8" label>
                      {pieData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number | undefined) => value ?? 0} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <h5 className="font-semibold mb-2">Notes</h5>
            <p className="text-sm text-gray-600">Les chiffres présentés sur cette page proviennent de l'API backend (en direct). Si vous voyez des tirets « — », les données sont en cours de chargement ou l'API n'est pas disponible.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default About;
