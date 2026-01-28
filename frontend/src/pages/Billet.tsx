
import React, { useState, useEffect } from 'react';
import { Plus, Edit, ArrowLeft, Zap, Eye, X, Check} from 'lucide-react';

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
  membre_id: string;
  lot_billet_id: string;
  numero: number;
  statut: string;
  prix_unitaire: number;
  nom_membre: string;
  prenom_membre: string;
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
  const [billets, setBillets] = useState<Billet[]>([]);
  const [selectedLot, setSelectedLot] = useState<LotBillet | null>(null);
  // const [lotBilletsMap, setLotBilletsMap] = useState<Record<string, Billet[]>>({});
  const [selectedLotBillets, setSelectedLotBillets] = useState<Billet[] | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const getFilteredBillets = () => {
    if (!selectedLotBillets) return [];
    
    let filtered = selectedLotBillets;
    
    // Filtre par terme de recherche
    if (searchTerm.trim()) {
      filtered = filtered.filter(billet => 
        billet.numero.toString().includes(searchTerm) || 
        `${billet.nom_membre || ''} ${billet.prenom_membre || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtre par statut
    if (statusFilter) {
      console.log('Filtering by status:', JSON.stringify(statusFilter));
      filtered = filtered.filter(billet => {
        console.log('Comparing:', JSON.stringify(billet.statut), '===', JSON.stringify(statusFilter), 'Result:', billet.statut === statusFilter);
        return billet.statut === statusFilter;
      });
    }
    
    return filtered;
  };

  const getCurrentPageBillets = () => {
    const filtered = getFilteredBillets();
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(getFilteredBillets().length / itemsPerPage);
  const [editingBilletId, setEditingBilletId] = useState<string | null>(null);
  const [editingMemberInput, setEditingMemberInput] = useState<string>('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLotModal, setShowLotModal] = useState(false);
  const [lotForm, setLotForm] = useState({ nom_lot_billet: '', description: '', prix_unitaire: 0, numero_debut: 1, numero_fin: 100 });
  const [currentLotToGenerate, setCurrentLotToGenerate] = useState<LotBillet | null>(null);

  const [allLots, setAllLots] = useState<LotBillet[]>([]);

  const fetchAllLots = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/lot_billet`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des lots');
      const data = await response.json();
      if (Array.isArray(data)) {
        const normalized = data.map((l: any) => ({
          ...l,
          lot_billet_id: l?.lot_billet_id ? String(l.lot_billet_id).trim() : String(l.lot_billet_id)
        }));
        setAllLots(normalized);
      } else {
        setError('Données des lots invalides');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/activities`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des activités');
      const data = await response.json();
      const activitiesArray = data.activities || data;
      if (Array.isArray(activitiesArray)) {
        setActivities(activitiesArray);
      } else {
        setError('Données des activités invalides');
      }
    } catch (err) {
      setError('Impossible de charger les activités');
      console.error(err);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/members`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des membres');
      const data = await response.json();
      if (Array.isArray(data)) {
        setMembers(data);
      } else {
        setError('Données des membres invalides');
      }
    } catch (err) {
      setError('Impossible de charger les membres');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchMembers();
    fetchAllLots();
  }, []);

  const fetchLotsForActivity = async (activiteId: number) => {
    console.log('activiteId:', activiteId);
    console.log('allLots:', allLots);
    const filteredLots = allLots.filter((lot: LotBillet) => {
      console.log('lot.activite_id:', lot.activite_id, 'type:', typeof lot.activite_id);
      return Number(lot.activite_id) === Number(activiteId);
    });
    console.log('filteredLots:', filteredLots);
    setLots(filteredLots);
    await fetchBilletsForActivity(activiteId);
  };

  const fetchBilletsForActivity = async (activiteId: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/lot_billet/billets/${activiteId}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des billets');
      const data = await response.json();
      if (Array.isArray(data)) {
        const normalized = data.map((b: any) => {
          const trimmedStatut = b?.statut ? String(b.statut).trim() : b?.statut;
          return {
            ...b,
            lot_billet_id: b?.lot_billet_id ? String(b.lot_billet_id).trim() : String(b.lot_billet_id),
            statut: trimmedStatut
          };
        });
        setBillets(normalized);
      } else {
        setError('Données des billets invalides');
      }
    } catch (err) {
      setError('Impossible de charger les billets');
      console.error(err);
    }
  };

  const fetchBilletsByLot = async (lotId: string) => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/billets/lot/${lotId}`);
      if (!resp.ok) throw new Error('Erreur lors de la récupération des billets du lot');
      const data = await resp.json();
      if (Array.isArray(data)) {
        const normalized = data.map((b: any) => {
          const trimmedStatut = b?.statut ? String(b.statut).trim().toLowerCase() : b?.statut;
          // Normaliser les statuts pour correspondre aux valeurs du select
          let normalizedStatut = trimmedStatut;
          if (trimmedStatut === 'disponible') normalizedStatut = 'disponible';
          else if (trimmedStatut === 'assigné' || trimmedStatut === 'assigne') normalizedStatut = 'Assigné';
          else if (trimmedStatut === 'payé' || trimmedStatut === 'paye') normalizedStatut = 'Payé';
          
          console.log('Original statut:', JSON.stringify(b?.statut), 'Trimmed:', JSON.stringify(trimmedStatut), 'Normalized:', JSON.stringify(normalizedStatut));
          return {
            ...b,
            lot_billet_id: b?.lot_billet_id ? String(b.lot_billet_id).trim() : String(b.lot_billet_id),
            statut: normalizedStatut
          };
        });
        setSelectedLotBillets(normalized);
        setCurrentPage(0); // Reset to first page when loading new lot
        return normalized;
      }
      return [];
    } catch (err) {
      console.error(err);
      setSelectedLotBillets([]);
      return [];
    }
  };

  const handleGenerateLot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity) return;
    try {
      setLoading(true);
      if (currentLotToGenerate) {
        // Générer billets pour un lot existant
        const generateResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/lot_billet/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lot_billet_id: currentLotToGenerate.lot_billet_id,
            prix_unitaire: lotForm.prix_unitaire,
          }),
        });
        if (!generateResponse.ok) throw new Error('Erreur lors de la génération des billets');

        await fetchAllLots();
        await fetchLotsForActivity(selectedActivity.id);
        setLotForm({ nom_lot_billet: '', description: '', prix_unitaire: 0, numero_debut: 1, numero_fin: 100 });
        setCurrentLotToGenerate(null);
        setShowLotModal(false);
      } else {
        const lotResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/lot_billet/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activite_id: selectedActivity.id,
            nom_lot_billet: lotForm.nom_lot_billet,
            description: lotForm.description,
            numero_debut: lotForm.numero_debut,
            numero_fin: lotForm.numero_fin,
          }),
        });
        if (!lotResponse.ok) throw new Error('Erreur lors de la création du lot');
        const newLot = await lotResponse.json();

        // Générer les billets
        const generateResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/lot_billet/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lot_billet_id: newLot.lot_billet_id,
            prix_unitaire: lotForm.prix_unitaire,
          }),
        });
        if (!generateResponse.ok) throw new Error('Erreur lors de la génération des billets');

        await fetchAllLots();
        fetchLotsForActivity(selectedActivity.id);
        setLotForm({ nom_lot_billet: '', description: '', prix_unitaire: 0, numero_debut: 1, numero_fin: 100 });
        setShowLotModal(false);
      }
    } catch (err) {
      setError('Erreur lors de la génération du lot et des billets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activitiesWithLots = activities;

  return (
    <div className="min-h-screen bg-linear-to from-slate-50 to-slate-100 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Billets</h1>
          <p className="text-slate-600">Gérez les billets par activité</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {!selectedActivity ? (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Choisissez une activité</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activitiesWithLots.map(activity => (
                <div
                  key={activity.id}
                  onClick={() => {
                    setSelectedActivity(activity);
                    fetchLotsForActivity(activity.id);
                  }}
                  className="bg-white p-6 border-b-blue-800 border-b-8 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  <h3 className="text-xl font-semibold">{activity.nom}</h3>
                  <p className="text-slate-600">{activity.description}</p>
                  <p className="text-sm text-slate-500">{new Date(activity.date_activite).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedActivity(null)}
              className="mb-4 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 flex items-center gap-2"
              title="Retour aux activités"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Activité : {selectedActivity.nom}</h2>

            <div>
              <h3 className="text-xl font-semibold mb-4">Lots de billets et leurs billets</h3>
              {selectedLot ? (
                <div>
                  <button
                    onClick={() => setSelectedLot(null)}
                    className="mb-4 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 flex items-center gap-2"
                    title="Retour aux lots"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h4 className="text-lg font-semibold mb-2">{selectedLot.nom_lot_billet}</h4>
                  <p className="text-slate-600 mb-4">{selectedLot.description}</p>
                  <div>
                    <h5 className="text-md font-medium mb-2">Billets du lot</h5>
                    
                    {/* Search Bar */}
                    {selectedLotBillets && selectedLotBillets.length > 0 && (
                      <div className="mb-4 flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                          <input
                            type="text"
                            placeholder="Rechercher par numéro ou nom du membre..."
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              setCurrentPage(0); // Reset to first page when searching
                            }}
                            className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                        
                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                          <label htmlFor="statusFilter" className="text-sm text-slate-600">Statut:</label>
                          <select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => {
                              setStatusFilter(e.target.value);
                              setCurrentPage(0); // Reset to first page when filtering
                            }}
                            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          >
                            <option value="">Tous les statuts</option>
                            <option value="disponible">Disponible</option>
                            <option value="Assigné">Assigné</option>
                            <option value="Payé">Payé</option>
                          </select>
                        </div>
                        
                        {(searchTerm || statusFilter) && (
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setStatusFilter('');
                              setCurrentPage(0);
                            }}
                            className="px-3 py-2 text-slate-600 hover:text-slate-800"
                          >
                            ✕ Effacer filtres
                          </button>
                        )}
                      </div>
                    )}
                    
                    {selectedLotBillets === null ? (
                      <p className="text-slate-500">Chargement...</p>
                    ) : getFilteredBillets().length === 0 ? (
                      <p className="text-slate-500">
                        {searchTerm || statusFilter ? 
                          `Aucun billet trouvé pour les filtres appliqués${searchTerm ? ` (recherche: "${searchTerm}")` : ''}${statusFilter ? ` (statut: ${statusFilter})` : ''}` 
                          : 'Aucun billet pour ce lot'
                        }
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-12">Numéro</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-full">Membre</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Prix</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-200">
                            {getCurrentPageBillets().map(billet => (
                              <tr key={billet.billet_id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900 text-center w-12">{billet.numero}</td>
                                <td
                                  className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (editingBilletId !== billet.billet_id) {
                                      setEditingBilletId(billet.billet_id);
                                      setEditingMemberInput(`${billet.nom_membre || ''} ${billet.prenom_membre || ''}`);
                                    }
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="flex flex-col">
                                      <div className="font-medium text-slate-900 truncate">{billet.nom_membre} {billet.prenom_membre}</div>
                                      {/* show contact if available from members list */}
                                      {(() => {
                                        const assigned = members.find(m => String(m.membre_id) === String(billet.membre_id));
                                        if (assigned && assigned.contact_membre) {
                                          return <div className="text-xs text-slate-500 truncate">{assigned.contact_membre}</div>;
                                        }
                                        return null;
                                      })()}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {editingBilletId === billet.billet_id ? (
                                    <div className="flex items-center gap-2 w-full">
                                        <div className="relative flex-1">
                                          <input
                                            autoFocus
                                            value={editingMemberInput}
                                            onChange={(e) => setEditingMemberInput(e.target.value)}
                                            onKeyDown={async (e) => {
                                              if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const typed = editingMemberInput.trim().toLowerCase();
                                                const matched = members.find(m => `${m.nom_membre} ${m.prenom_membre}`.toLowerCase().includes(typed));
                                                if (!matched) { alert('Membre non trouvé'); return; }
                                                const existing = selectedLotBillets!.find(b => b.membre_id === matched.membre_id && b.billet_id !== billet.billet_id);
                                                if (existing) {
                                                  const ok = window.confirm(`Le membre ${matched.nom_membre} ${matched.prenom_membre} est déjà assigné au billet n°${existing.numero}. Continuer ?`);
                                                  if (!ok) return;
                                                }
                                                try {
                                                  const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/billets/update/${billet.billet_id}`, {
                                                    method: 'PUT', headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ membre_id: matched.membre_id, statut: 'Assigné' })
                                                  });
                                                  if (!resp.ok) throw new Error('Erreur mise à jour billet');
                                                  const updated = await resp.json();
                                                  const normalizedUpdated = {
                                                    ...updated,
                                                    statut: updated.statut ? String(updated.statut).trim() : updated.statut
                                                  };
                                                  setSelectedLotBillets(prev => prev!.map(b => b.billet_id === updated.billet_id ? ({ ...b, ...normalizedUpdated }) : b));
                                                  setEditingBilletId(null); setEditingMemberInput('');
                                                } catch (err) { console.error(err); }
                                              }
                                            }}
                                            className="w-2xl h-10 px-3 py-2 box-border text-sm border rounded"
                                          />
                                          {/* Suggestions */}
                                          {editingMemberInput.trim().length > 0 && (
                                            <ul className="absolute left-0 right-0 mt-1 max-h-40 overflow-auto bg-white border rounded shadow z-50">
                                              {members.filter(m => `${m.nom_membre} ${m.prenom_membre}`.toLowerCase().includes(editingMemberInput.trim().toLowerCase())).slice(0,8).map(m => (
                                                <li
                                                  key={m.membre_id}
                                                  onClick={async (e) => {
                                                    e.stopPropagation();
                                                          // confirm if member already has a billet in this lot
                                                          // const existing = selectedLotBillets!.find(b => b.membre_id === m.membre_id && b.billet_id !== billet.billet_id);
                                                          // if (existing) {
                                                          //   const ok = window.confirm(`Le membre ${m.nom_membre} ${m.prenom_membre} est déjà assigné au billet n°${existing.numero}. Continuer ?`);
                                                          //   if (!ok) return;
                                                          // }
                                                          try {
                                                            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/billets/update/${billet.billet_id}`, {
                                                              method: 'PUT', headers: { 'Content-Type': 'application/json' },
                                                              body: JSON.stringify({ membre_id: m.membre_id, statut: 'Assigné' })
                                                            });
                                                            if (!resp.ok) throw new Error('Erreur mise à jour billet');
                                                            const updated = await resp.json();
                                                            const normalizedUpdated = {
                                                              ...updated,
                                                              statut: updated.statut ? String(updated.statut).trim() : updated.statut
                                                            };
                                                            setSelectedLotBillets(prev => prev!.map(b => b.billet_id === updated.billet_id ? ({ ...b, ...normalizedUpdated }) : b));
                                                            setEditingBilletId(null); setEditingMemberInput('');
                                                          } catch (err) { console.error(err); }
                                                  }}
                                                  className="px-3 py-2 hover:bg-slate-100 cursor-pointer"
                                                >
                                                  {m.nom_membre} {m.prenom_membre}
                                                </li>
                                              ))}
                                            </ul>
                                          )}
                                        </div>
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); setEditingBilletId(null); setEditingMemberInput(''); }} 
                                          className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                          title="Annuler"
                                        >
                                          <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                      ) : billet.membre_id ? (
                                        // Assigné: afficher juste le bouton modifier
                                        <div className="cursor-pointer flex items-center justify-center px-2 py-1 rounded hover:bg-slate-50">
                                          <Edit className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                                        </div>
                                      ) : (
                                        // Non assigné: zone vide clickable
                                        <div className="cursor-pointer w-full px-2 py-1 rounded hover:bg-slate-50 text-slate-400 text-sm">
                                          Cliquez pour assigner
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 w-full">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${billet.statut === 'Payé' ? 'bg-green-100 text-green-800' : billet.statut === 'Assigné' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
                                      {billet.statut}
                                    </span>
                                    <button
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        try {
                                          const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/billets/update/${billet.billet_id}`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ statut: 'Payé' })
                                          });
                                          if (!resp.ok) throw new Error('Erreur mise à jour statut');
                                          const updated = await resp.json();
                                          const normalizedUpdated = {
                                            ...updated,
                                            statut: updated.statut ? String(updated.statut).trim() : updated.statut
                                          };
                                          setSelectedLotBillets(prev => prev!.map(b => b.billet_id === updated.billet_id ? ({ ...b, ...normalizedUpdated }) : b));
                                        } catch (err) {
                                          console.error(err);
                                        }
                                      }}
                                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500">{billet.prix_unitaire} Ar</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Pagination Controls */}
                    {getFilteredBillets().length > 0 && (
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <label htmlFor="itemsPerPage" className="text-sm text-slate-600">Billets par page:</label>
                          <input
                            id="itemsPerPage"
                            type="number"
                            min="1"
                            max="100"
                            value={itemsPerPage}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 10;
                              setItemsPerPage(value);
                              setCurrentPage(0); // Reset to first page
                            }}
                            className="w-16 px-2 py-1 border border-slate-300 rounded text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">
                            Page {currentPage + 1} sur {totalPages} ({getFilteredBillets().length} billet{getFilteredBillets().length > 1 ? 's' : ''})
                          </span>
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            disabled={currentPage === 0}
                            className="px-3 py-1 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ‹ Précédent
                          </button>
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                            disabled={currentPage >= totalPages - 1}
                            className="px-3 py-1 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Suivant ›
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : lots.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-600 mb-4">Aucun lot de billets pour cette activité</p>
                  <button
                    onClick={() => { setCurrentLotToGenerate(null); setShowLotModal(true); }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
                    title="Générer un lot de billets"
                  >
                    <Zap className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {lots.map(lot => {
                    const lotBillets = billets.filter(b => b.lot_billet_id === lot.lot_billet_id);
                    return (
                      <div key={lot.lot_billet_id} className="bg-white p-6 rounded-lg shadow-md cursor-pointer" onClick={() => { setSelectedLot(lot); fetchBilletsByLot(lot.lot_billet_id); }}>
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold">{lot.nom_lot_billet}</h4>
                          <p className="text-slate-600">{lot.description}</p>
                          <p className="text-sm text-slate-500">Numéros: {lot.numero_debut} - {lot.numero_fin}</p>
                          <div className="mt-3 flex gap-2">
                            {/* Prevent showing generate button if billets already exist for this lot */}
                            {lotBillets.length === 0 && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setCurrentLotToGenerate(lot); setShowLotModal(true); }}
                                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center gap-2"
                                title="Générer billets"
                              >
                                <Zap className="w-4 h-4" />
                              </button>
                            )}
                            {lotBillets.length > 0 && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedLot(lot); fetchBilletsByLot(lot.lot_billet_id); }}
                                className="px-3 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 text-sm flex items-center gap-2"
                                title="Voir billets"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 mt-2">{lotBillets.length} billet(s) associés</p>
                      </div>
                    );
                  })}
                  <div
                    onClick={() => { setCurrentLotToGenerate(null); setShowLotModal(true); }}
                    className="bg-slate-100 p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center"
                  >
                    <Plus className="w-8 h-8 text-slate-600" />
                    <span className="ml-2 text-slate-600">Nouveau lot</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {showLotModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">{currentLotToGenerate ? `Générer billets pour "${currentLotToGenerate.nom_lot_billet}"` : 'Générer un lot de billets'}</h3>
              <form onSubmit={handleGenerateLot}>
                {currentLotToGenerate ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700">Prix unitaire (Ariary)</label>
                      <input
                        type="number"
                        value={lotForm.prix_unitaire}
                        onChange={(e) => setLotForm({ ...lotForm, prix_unitaire: parseFloat(e.target.value) || 0 })}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700">Nom du lot</label>
                      <input
                        type="text"
                        value={lotForm.nom_lot_billet}
                        onChange={(e) => setLotForm({ ...lotForm, nom_lot_billet: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700">Description</label>
                      <textarea
                        value={lotForm.description}
                        onChange={(e) => setLotForm({ ...lotForm, description: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700">Prix unitaire (Ariary)</label>
                      <input
                        type="number"
                        value={lotForm.prix_unitaire}
                        onChange={(e) => setLotForm({ ...lotForm, prix_unitaire: parseFloat(e.target.value) || 0 })}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700">Numéro de début</label>
                      <input
                        type="number"
                        value={lotForm.numero_debut}
                        onChange={(e) => setLotForm({ ...lotForm, numero_debut: parseInt(e.target.value) || 1 })}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700">Numéro de fin</label>
                      <input
                        type="number"
                        value={lotForm.numero_fin}
                        onChange={(e) => setLotForm({ ...lotForm, numero_fin: parseInt(e.target.value) || 100 })}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowLotModal(false); setCurrentLotToGenerate(null); }}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Génération...' : 'Générer'}
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
