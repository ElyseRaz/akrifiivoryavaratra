import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, ArrowLeft, Zap, Eye, X, Check, Search } from 'lucide-react';

interface Activity {
  id: number;
  nom: string;
  description: string;
  date_activite: string;
}

interface LotBillet {
  lot_billet_id: string;
  activite_id: number;
  nom_lot_billet: string;
  description: string;
  numero_debut: number;
  numero_fin: number;
}

interface Billet {
  billet_id: string;
  membre_id: string | null;
  lot_billet_id: string;
  numero: number;
  statut: string;
  prix_unitaire: number;
  nom_membre?: string;
  prenom_membre?: string;
  date_paiement?: string;
}

interface Member {
  membre_id: string;
  nom_membre: string;
  prenom_membre: string;
  contact_membre: string;
}

export default function Billet() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [lots, setLots] = useState<LotBillet[]>([]);
  const [allLots, setAllLots] = useState<LotBillet[]>([]);
  const [billets, setBillets] = useState<Billet[]>([]);
  const [selectedLot, setSelectedLot] = useState<LotBillet | null>(null);
  const [selectedLotBillets, setSelectedLotBillets] = useState<Billet[] | null>(null);
  
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage,] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const [editingBilletId, setEditingBilletId] = useState<string | null>(null);
  const [editingMemberInput, setEditingMemberInput] = useState<string>('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLotModal, setShowLotModal] = useState(false);
  const [lotForm, setLotForm] = useState({ nom_lot_billet: '', description: '', prix_unitaire: 0, numero_debut: 1, numero_fin: 100 });
  const [currentLotToGenerate, setCurrentLotToGenerate] = useState<LotBillet | null>(null);

  const normalizeStatus = (s?: string) => (s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

  // Initialisation
  useEffect(() => {
    const initData = async () => {
      try {
        await Promise.all([fetchActivities(), fetchMembers(), fetchAllLots()]);
      } catch (err) {
        setError("Erreur lors du chargement initial");
      }
    };
    initData();
  }, []);

  const fetchAllLots = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/lot_billet`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setAllLots(data.map((l: any) => ({ ...l, lot_billet_id: String(l.lot_billet_id).trim() })));
      }
    } catch (err) { console.error(err); }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/activities`);
      const data = await response.json();
      setActivities(data.activities || data);
    } catch (err) { setError('Impossible de charger les activités'); }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/members`);
      const data = await response.json();
      setMembers(data);
    } catch (err) { console.error(err); }
  };

  const fetchLotsForActivity = async (activiteId: number) => {
    const filteredLots = allLots.filter((lot) => Number(lot.activite_id) === Number(activiteId));
    setLots(filteredLots);
    // Optionnel : charger tous les billets de l'activité pour l'affichage des badges
    try {
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/lot_billet/billets/${activiteId}`);
        const data = await resp.json();
        setBillets(data);
    } catch (e) { console.error(e); }
  };

  const fetchBilletsByLot = async (lotId: string) => {
    try {
      setLoading(true);
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/billets/lot/${lotId}`);
      const data = await resp.json();
      if (Array.isArray(data)) {
        const normalized = data.map((b: any) => {
          const t = normalizeStatus(b.statut);
          let normalizedStatut = b.statut;
          if (t.includes('dispon')) normalizedStatut = 'Disponible';
          else if (t.includes('assign')) normalizedStatut = 'Assigné';
          else if (t.includes('pay')) normalizedStatut = 'Payé';
          return { ...b, lot_billet_id: String(b.lot_billet_id).trim(), statut: normalizedStatut };
        });
        setSelectedLotBillets(normalized);
        setCurrentPage(0);
      }
    } catch (err) { setError('Erreur de chargement des billets');
    } finally { setLoading(false); }
  };

  // Filtrage intelligent
  const filteredBillets = useMemo(() => {
    if (!selectedLotBillets) return [];
    return selectedLotBillets.filter(billet => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = billet.numero.toString().includes(searchLower) || 
        `${billet.nom_membre} ${billet.prenom_membre}`.toLowerCase().includes(searchLower);
      
      const bNorm = normalizeStatus(billet.statut);
      const fNorm = normalizeStatus(statusFilter);
      const matchesStatus = !statusFilter || bNorm.includes(fNorm);
      
      return matchesSearch && matchesStatus;
    });
  }, [selectedLotBillets, searchTerm, statusFilter]);

  const currentBillets = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    return filteredBillets.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBillets, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredBillets.length / itemsPerPage);

  const handleUpdateBillet = async (billetId: string, payload: any) => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/billets/update/${billetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!resp.ok) throw new Error('Erreur mise à jour');
      const updated = await resp.json();
      
      // Mise à jour locale de l'état
      setSelectedLotBillets(prev => prev ? prev.map(b => b.billet_id === billetId ? { ...b, ...updated } : b) : null);
      setEditingBilletId(null);
      setEditingMemberInput('');
    } catch (err) {
      alert("Erreur lors de la modification");
    }
  };

  const handleGenerateLot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity) return;
    setLoading(true);
    try {
      let lotId = currentLotToGenerate?.lot_billet_id;

      if (!currentLotToGenerate) {
        const lotResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/lot_billet/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...lotForm, activite_id: selectedActivity.id }),
        });
        const newLot = await lotResponse.json();
        lotId = newLot.lot_billet_id;
      }

      await fetch(`${import.meta.env.VITE_BACKEND_URL}/lot_billet/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lot_billet_id: lotId, prix_unitaire: lotForm.prix_unitaire }),
      });

      await fetchAllLots();
      fetchLotsForActivity(selectedActivity.id);
      setShowLotModal(false);
      setCurrentLotToGenerate(null);
      setLotForm({ nom_lot_billet: '', description: '', prix_unitaire: 0, numero_debut: 1, numero_fin: 100 });
    } catch (err) {
      setError('Erreur lors de la génération');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-10 px-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Gestion des Billets</h1>
          <p className="text-slate-600">Suivi des ventes et assignations par activité</p>
        </div>

        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        {!selectedActivity ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activities.map(activity => (
              <div
                key={activity.id}
                onClick={() => { setSelectedActivity(activity); fetchLotsForActivity(activity.id); }}
                className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-blue-600 hover:shadow-md transition-all cursor-pointer"
              >
                <h3 className="text-xl font-bold mb-2">{activity.nom}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{activity.description}</p>
                <div className="text-xs font-semibold text-slate-400">
                  {new Date(activity.date_activite).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => { setSelectedActivity(null); setSelectedLot(null); }}
                className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 transition"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h2 className="text-2xl font-bold text-slate-800">{selectedActivity.nom}</h2>
            </div>

            {selectedLot ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">{selectedLot.nom_lot_billet}</h3>
                      <p className="text-sm text-slate-500">{selectedLot.description}</p>
                    </div>
                    <button 
                        onClick={() => setSelectedLot(null)}
                        className="text-sm text-blue-600 font-medium hover:underline"
                    >
                        Changer de lot
                    </button>
                  </div>

                  {/* Filtres */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[250px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text"
                        placeholder="N° ou Nom du membre..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select 
                      className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">Tous les statuts</option>
                      <option value="Disponible">Disponible</option>
                      <option value="Assigné">Assigné</option>
                      <option value="Payé">Payé</option>
                    </select>
                  </div>
                </div>

                {/* Liste des billets */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-4 sm:px-6 font-semibold text-left">N°</th>
                        <th className="px-4 py-4 sm:px-6 font-semibold text-left">Membre / Assigné</th>
                        <th className="px-4 py-4 sm:px-6 font-semibold text-left">Statut</th>
                        <th className="px-4 py-4 sm:px-6 font-semibold text-left">Prix</th>
                        <th className="px-4 py-4 sm:px-6 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentBillets.map(billet => (
                        <tr key={billet.billet_id} className="hover:bg-slate-50/50 transition">
                          <td className="px-4 py-4 sm:px-6 font-bold text-slate-700">#{billet.numero}</td>
                          <td className="px-4 py-4 sm:px-6 relative">
                            {editingBilletId === billet.billet_id ? (
                              <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                  <input 
                                    autoFocus
                                    className="w-full px-3 py-1 border border-blue-500 rounded outline-none text-sm"
                                    value={editingMemberInput}
                                    onChange={(e) => setEditingMemberInput(e.target.value)}
                                    placeholder="Chercher un membre..."
                                  />
                                  {editingMemberInput.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white shadow-xl border rounded-md max-h-48 overflow-y-auto">
                                      {members.filter(m => `${m.nom_membre} ${m.prenom_membre}`.toLowerCase().includes(editingMemberInput.toLowerCase()))
                                        .map(m => (
                                          <div 
                                            key={m.membre_id}
                                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                                            onClick={() => handleUpdateBillet(billet.billet_id, { membre_id: m.membre_id, statut: 'Assigné' })}
                                          >
                                            {m.nom_membre} {m.prenom_membre}
                                          </div>
                                        ))
                                      }
                                    </div>
                                  )}
                                </div>
                                <button onClick={() => setEditingBilletId(null)}><X className="w-4 h-4 text-slate-400" /></button>
                              </div>
                            ) : (
                              <div 
                                className="group flex items-center gap-2 cursor-pointer"
                                onClick={() => { setEditingBilletId(billet.billet_id); setEditingMemberInput(billet.nom_membre || ''); }}
                              >
                                <span className={billet.nom_membre ? "text-slate-900" : "text-slate-300 italic"}>
                                  {billet.nom_membre ? `${billet.nom_membre} ${billet.prenom_membre}` : "Non assigné"}
                                </span>
                                <Edit className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition" />
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4 sm:px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              billet.statut === 'Payé' ? 'bg-green-100 text-green-700' : 
                              billet.statut === 'Assigné' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {billet.statut}
                            </span>
                          </td>
                          <td className="px-4 py-4 sm:px-6 text-sm text-slate-600">{billet.prix_unitaire} MGA</td>
                          <td className="px-4 py-4 sm:px-6 text-right">
                            {billet.statut !== 'Payé' && (
                              <button 
                                onClick={() => handleUpdateBillet(billet.billet_id, { statut: 'Payé' })}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                                title="Marquer comme payé"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="p-4 bg-slate-50 border-t flex items-center justify-between">
                  <span className="text-sm text-slate-500">Page {currentPage + 1} / {totalPages || 1}</span>
                  <div className="flex gap-2">
                    <button 
                      disabled={currentPage === 0}
                      onClick={() => setCurrentPage(p => p - 1)}
                      className="px-4 py-2 bg-white border rounded-lg text-sm disabled:opacity-50"
                    >
                      Précédent
                    </button>
                    <button 
                      disabled={currentPage >= totalPages - 1}
                      onClick={() => setCurrentPage(p => p + 1)}
                      className="px-4 py-2 bg-white border rounded-lg text-sm disabled:opacity-50"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lots.map(lot => {
                  const count = billets.filter(b => b.lot_billet_id === lot.lot_billet_id).length;
                  return (
                    <div key={lot.lot_billet_id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                      <h4 className="text-lg font-bold mb-1">{lot.nom_lot_billet}</h4>
                      <p className="text-xs text-slate-400 mb-4 font-mono">Numéros {lot.numero_debut} à {lot.numero_fin}</p>
                      
                      {count === 0 ? (
                        <button 
                          onClick={() => { setCurrentLotToGenerate(lot); setShowLotModal(true); }}
                          className="w-full flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium text-sm"
                        >
                          <Zap className="w-4 h-4" /> Générer les billets
                        </button>
                      ) : (
                        <button 
                          onClick={() => { setSelectedLot(lot); fetchBilletsByLot(lot.lot_billet_id); }}
                          className="w-full flex items-center justify-center gap-2 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium text-sm"
                        >
                          <Eye className="w-4 h-4" /> Voir les {count} billets
                        </button>
                      )}
                    </div>
                  );
                })}
                <button 
                  onClick={() => { setCurrentLotToGenerate(null); setShowLotModal(true); }}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl hover:bg-white hover:border-blue-400 transition-all group"
                >
                  <Plus className="w-8 h-8 text-slate-300 group-hover:text-blue-500 mb-2" />
                  <span className="text-slate-400 group-hover:text-blue-600 font-medium">Nouveau lot</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal Lot */}
        {showLotModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <h3 className="text-xl font-bold mb-6">
                {currentLotToGenerate ? `Initier "${currentLotToGenerate.nom_lot_billet}"` : "Créer un nouveau lot"}
              </h3>
              <form onSubmit={handleGenerateLot} className="space-y-4">
                {!currentLotToGenerate && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Nom du lot</label>
                      <input 
                        required
                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        value={lotForm.nom_lot_billet}
                        onChange={e => setLotForm({...lotForm, nom_lot_billet: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1">Début n°</label>
                        <input type="number" className="w-full px-4 py-2 border rounded-lg" value={lotForm.numero_debut} onChange={e => setLotForm({...lotForm, numero_debut: parseInt(e.target.value)})}/>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Fin n°</label>
                        <input type="number" className="w-full px-4 py-2 border rounded-lg" value={lotForm.numero_fin} onChange={e => setLotForm({...lotForm, numero_fin: parseInt(e.target.value)})}/>
                      </div>
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-semibold mb-1">Prix unitaire (MGA)</label>
                  <input 
                    type="number" required
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={lotForm.prix_unitaire}
                    onChange={e => setLotForm({...lotForm, prix_unitaire: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowLotModal(false)}
                    className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Génération..." : "Confirmer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}