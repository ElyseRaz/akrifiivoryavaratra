import { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import axios from 'axios';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

interface Depense {
  id: number;
  activity_id: number;
  nom_depense: string;
  montant: number;
  date_depense: string;
}

interface Quete {
  quete_id: string;
  montant_quete: number | string;
  date_quete: string;
}

interface Activity {
  id: number;
  nom: string;
  date_activite?: string;
}

interface Billet {
  billet_id: string;
  lot_billet_id?: string;
  statut?: string;
  prix_unitaire: number | string;
  date_paiement?: string;
}

interface SansBillet {
  sans_billet_id: string;
  montant: number | string;
  date_don: string;
}

interface LotBillet {
  lot_billet_id: string;
  activite_id: number;
  nom_lot_billet?: string;
} 

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalDepenses: 0,
    totalQuetes: 0,
    totalBillets: 0,
    totalBenefices: 0,
    totalMembers: 0,
    totalActivities: 0
  });

  const [depensesByActivity, setDepensesByActivity] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const apiUrl = 'http://localhost:5000/api';

      // Récupérer les totaux et données
      const [depensesRes, quetesRes, membersRes, activitiesRes, billetsRes, lotBilletsRes, sansBilletsRes] = await Promise.all([
        axios.get(`${apiUrl}/depenses`).catch(() => ({ data: [] })),
        axios.get(`${apiUrl}/quete`).catch(() => ({ data: [] })),
        axios.get(`${apiUrl}/members`).catch(() => ({ data: [] })),
        axios.get(`${apiUrl}/activities`).catch(() => ({ data: { activities: [] } })),
        axios.get(`${apiUrl}/billets`).catch(() => ({ data: [] })),
        axios.get(`${apiUrl}/lot_billet`).catch(() => ({ data: [] })),
        axios.get(`${apiUrl}/sans_billets`).catch(() => ({ data: [] }))
      ]);

      const depenses: Depense[] = Array.isArray(depensesRes.data) ? depensesRes.data : [];
      const quetes: Quete[] = Array.isArray(quetesRes.data) ? quetesRes.data : (Array.isArray(quetesRes.data?.quetes) ? quetesRes.data.quetes : []);
      const members = Array.isArray(membersRes.data) ? membersRes.data : [];
      const activities: Activity[] = Array.isArray(activitiesRes.data?.activities) 
        ? activitiesRes.data.activities 
        : (Array.isArray(activitiesRes.data) ? activitiesRes.data : []);
      const billets: Billet[] = Array.isArray(billetsRes.data) ? billetsRes.data : [];
      const lotBillets: LotBillet[] = Array.isArray(lotBilletsRes.data) ? lotBilletsRes.data : [];
      const sansBillets: SansBillet[] = Array.isArray(sansBilletsRes.data) ? sansBilletsRes.data : [];

      // Calculer les totaux
      const totalDepenses = depenses.reduce((sum, d) => sum + (parseFloat(d.montant as any) || 0), 0);
      const totalQuetes = quetes.reduce((sum, q) => sum + (parseFloat(q.montant_quete as any) || 0), 0);
      
      // Calculer les billets payés : accepter soit un statut payé (même corrompu), soit une date de paiement non nulle
      const normalize = (s?: string) => (s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

      const totalBillets = billets
        .filter(b => {
          const paidByStatus = normalize(b.statut).includes('pay');
          const paidByDate = !!(b as any).date_paiement && String((b as any).date_paiement).trim() !== '';
          return paidByStatus || paidByDate;
        })
        .reduce((sum, b) => {
          const raw = String((b as any).prix_unitaire ?? '0').replace(/\s+/g, '').replace(',', '.');
          const val = parseFloat(raw) || 0;
          return sum + val;
        }, 0);

      // Calculer les sans-billets
      const totalSansBillets = sansBillets.reduce((sum, s) => sum + (parseFloat((s as any).montant as any) || 0), 0);
      
      // Bénéfices = Quêtes + Billets payés + Sans-billets
      const totalBenefices = totalQuetes + totalBillets + totalSansBillets;

      setStats({
        totalDepenses,
        totalQuetes,
        totalBillets,
        totalBenefices,
        totalMembers: members.length,
        totalActivities: activities.length
      });


      // Traiter les données des graphiques (inclure les billets payés répartis sur la date de l'activité liée)
      processChartData(depenses, quetes, activities, sansBillets, billets, lotBillets);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (depenses: Depense[], quetes: Quete[], activities: Activity[], sansBillets: SansBillet[] = [], billets: Billet[] = [], lotBillets: LotBillet[] = []) => {
    // === Graphique en camembert : Dépenses par activité ===
    const depensesByActivityMap = new Map<number, number>();
    
    depenses.forEach(depense => {
      const montant = parseFloat(depense.montant as any) || 0;
      const current = depensesByActivityMap.get(depense.activity_id) || 0;
      depensesByActivityMap.set(depense.activity_id, current + montant);
    });

    const activitiesMap = new Map(activities.map(a => [a.id, a.nom]));
    
    const depensesByActivityData = Array.from(depensesByActivityMap.entries()).map(
      ([activityId, total], index) => ({
        name: activitiesMap.get(activityId) || `Activité ${activityId}`,
        value: Math.round(total),
        color: COLORS[index % COLORS.length]
      })
    );

    setDepensesByActivity(depensesByActivityData);

    // === Graphique mensuel : Dépenses vs Bénéfices sur les 12 derniers mois ===
    const monthlyMap = new Map<string, { depenses: number; quetes: number; sans: number; billets: number }>();
    const monthLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

    // Générer les 12 mois commençant par Décembre 2025
    const startDate = new Date(2025, 11, 1); // Décembre 2025

    for (let i = 0; i < 12; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthName = monthLabels[month];
      const key = `${monthName} ${year}`;
      monthlyMap.set(key, { depenses: 0, quetes: 0, sans: 0, billets: 0 });
    }

    // Ajouter les dépenses
    depenses.forEach(depense => {
      const montant = parseFloat(depense.montant as any) || 0;
      const date = new Date(depense.date_depense);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthName = monthLabels[month];
      const key = `${monthName} ${year}`;
      
      if (monthlyMap.has(key)) {
        const current = monthlyMap.get(key) || { depenses: 0, quetes: 0, sans: 0, billets: 0 };
        monthlyMap.set(key, {
          ...current,
          depenses: current.depenses + montant
        });
      }
    });

    // Ajouter les quêtes
    quetes.forEach(quete => {
      const montant = parseFloat(quete.montant_quete as any) || 0;
      const date = new Date(quete.date_quete);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthName = monthLabels[month];
      const key = `${monthName} ${year}`;
      
      if (monthlyMap.has(key)) {
        const current = monthlyMap.get(key) || { depenses: 0, quetes: 0, sans: 0, billets: 0 };
        monthlyMap.set(key, {
          ...current,
          quetes: current.quetes + montant
        });
      }
    });

    // Ajouter les sans-billets
    sansBillets.forEach(sb => {
      const montant = parseFloat((sb as any).montant as any) || 0;
      const date = new Date(sb.date_don);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthName = monthLabels[month];
      const key = `${monthName} ${year}`;
      
      if (monthlyMap.has(key)) {
        const current = monthlyMap.get(key) || { depenses: 0, quetes: 0, sans: 0, billets: 0 };
        monthlyMap.set(key, {
          ...current,
          sans: current.sans + montant
        });
      }
    });

    // Ajouter les billets payés (accepter statut OU date de paiement). Prioritiser la date de paiement si elle existe, sinon la date de l'activité.
    billets
      .filter(b => {
        const s = b.statut ? String(b.statut).trim().toLowerCase() : '';
        const paidByStatus = s === 'payé' || s === 'paye' || s === 'paid' || s === 'payed';
        const paidByDate = !!(b as any).date_paiement && String((b as any).date_paiement).trim() !== '';
        return paidByStatus || paidByDate;
      })
      .forEach(b => {
        const montant = parseFloat(String((b as any).prix_unitaire ?? '0').replace(/\s+/g, '').replace(',', '.')) || 0;

        // Choisir la date : date_paiement si fournie, sinon date de l'activité liée via le lot
        let dateStr = (b as any).date_paiement;

        if (!dateStr) {
          const lot = lotBillets.find(l => String(l.lot_billet_id) === String(b.lot_billet_id));
          if (lot) {
            const activity = activities.find(a => a.id === lot.activite_id);
            if (activity) {
              dateStr = (activity as any).date_activite;
            }
          }
        }

        if (!dateStr) return; // on a besoin d'une date pour agréger par mois

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return;
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthName = monthLabels[month];
        const key = `${monthName} ${year}`;
        if (monthlyMap.has(key)) {
          const current = monthlyMap.get(key) || { depenses: 0, quetes: 0, sans: 0, billets: 0 };
          monthlyMap.set(key, {
            ...current,
            billets: current.billets + montant
          });
        }
      });

    const monthlyDataArray = Array.from(monthlyMap.entries()).map(([key, data]) => ({
      month: key,
      depenses: Math.round(data.depenses),
      benefices: Math.round(data.quetes + data.sans + data.billets)
    }));

    setMonthlyData(monthlyDataArray);
  };

  const statCards: StatCard[] = [
    {
      title: 'Dépenses Totales',
      value: `${stats.totalDepenses.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar`,
      icon: <DollarSign className="w-8 h-8" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Quêtes Totales',
      value: `${stats.totalQuetes.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar`,
      icon: <TrendingUp className="w-8 h-8" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Billets Payés',
      value: `${stats.totalBillets.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar`,
      icon: <DollarSign className="w-8 h-8" />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Bénéfices Totaux',
      value: `${stats.totalBenefices.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar`,
      icon: <TrendingUp className="w-8 h-8" />,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Membres',
      value: stats.totalMembers,
      icon: <Users className="w-8 h-8" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Activités',
      value: stats.totalActivities,
      icon: <Activity className="w-8 h-8" />,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Chargement du dashboard...</div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 min-h-screen pl-80">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble de votre organisation</p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                <p className="text-xl font-bold text-gray-900 mt-2">{card.value}</p>
              </div>
              <div className={card.textColor}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Message si pas de données */}
      {depensesByActivity.length === 0 && monthlyData.every(m => m.depenses === 0 && ((m as any).benefices ?? 0) === 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800">
            Aucune donnée disponible. Commencez par ajouter des activités, dépenses, quêtes ou dons sans-billet.
          </p>
        </div>
      )}

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Graphique en courbes - Dépenses vs Bénéfices */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Tendance Dépenses vs Bénéfices</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => (value ?? 0).toLocaleString('fr-FR')}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="depenses"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444' }}
                name="Dépenses"
              />
              <Line
                type="monotone"
                dataKey="benefices"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
                name="Bénéfices"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique en barres - Comparaison mensuelle */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Comparaison Mensuelle — Dépenses vs Bénéfices</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => (value ?? 0).toLocaleString('fr-FR')}
              />
              <Legend />
              <Bar dataKey="depenses" fill="#ef4444" name="Dépenses" radius={[8, 8, 0, 0]} />
              <Bar dataKey="benefices" fill="#10b981" name="Bénéfices" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Deuxième rangée de graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique en camembert - Répartition dépenses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Répartition des Dépenses par Activité</h2>
          {depensesByActivity.length === 0 ? (
            <div className="flex items-center justify-center h-80 text-gray-500">
              Aucune dépense enregistrée
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={depensesByActivity}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toLocaleString('fr-FR')}Ar`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {depensesByActivity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => (value ?? 0).toLocaleString('fr-FR') + 'Ar'} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Tableau récapitulatif */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Récapitulatif par Activité</h2>
          {depensesByActivity.length === 0 ? (
            <div className="flex items-center justify-center h-80 text-gray-500">
              Aucune activité avec des dépenses
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Activité</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Montant</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Pourcentage</th>
                  </tr>
                </thead>
                <tbody>
                  {depensesByActivity.map((activity, index) => {
                    const total = depensesByActivity.reduce((sum, a) => sum + a.value, 0);
                    const percentage = total > 0 ? ((activity.value / total) * 100).toFixed(1) : '0';
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-700">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: activity.color }}
                            ></div>
                            {activity.name}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                          {activity.value.toLocaleString('fr-FR')} Ar
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">{percentage}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
