import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Edit, TrendingUp, Eye } from 'lucide-react';

interface Depense {
  id: string;
  activity_id: string | number;
  nom_depense: string;
  piece_justificatif: string;
  date_depense: string;
  montant: number | string;
}

interface Activity {
  id: number;
  nom: string;
  description?: string;
  date_activite: string;
}

export default function Depenses() {
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivityFilter, setSelectedActivityFilter] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitySearchTerm, setActivitySearchTerm] = useState('');
  const [showActivitySuggestions, setShowActivitySuggestions] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    activity_id: '',
    nom_depense: '',
    piece_justificatif: null as File | null,
    date_depense: new Date().toISOString().split('T')[0],
    montant: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [depenseToDelete, setDepenseToDelete] = useState<Depense | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [depenseDetails, setDepenseDetails] = useState<Depense | null>(null);
  const activitySearchRef = useRef<HTMLDivElement>(null);

  // Effacer l'erreur automatiquement après 5 secondes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  // Gérer la fermeture des suggestions quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activitySearchRef.current && !activitySearchRef.current.contains(event.target as Node)) {
        setShowActivitySuggestions(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showModal]);

  // Charger les dépenses au montage du composant
  useEffect(() => {
    fetchDepenses();
    fetchTotalExpenses();
    fetchActivities();
  }, []);

  const fetchDepenses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/depenses`);
      if (!response.ok) throw new Error('Erreur lors de la récupération');
      const data = await response.json();
      console.log('Dépenses reçues:', data);
      setDepenses(data);
      setError('');
    } catch (err) {
      setError('Impossible de charger les dépenses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalExpenses = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/depenses/sum/all`);
      if (response.ok) {
        const data = await response.json();
        setTotalExpenses(data.total || 0);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération du total', err);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/activities`);
      if (response.ok) {
        const data = await response.json();
        // L'API retourne un objet avec une propriété 'activities'
        const activitiesArray = Array.isArray(data) ? data : (data.activities || []);
        setActivities(Array.isArray(activitiesArray) ? activitiesArray : []);
      } else {
        setActivities([]);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des activités', err);
      setActivities([]);
    }
  };

  const handleAddDepense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity) {
      setError('Veuillez sélectionner une activité');
      return;
    }
    try {
      const endpoint = editingId
        ? `${import.meta.env.VITE_BACKEND_URL}/depenses/update/${editingId}`
        : `${import.meta.env.VITE_BACKEND_URL}/depenses/add`;
      
      const method = editingId ? 'PUT' : 'POST';

      // Utiliser FormData pour supporter l'upload de fichier
      const requestData = new FormData();
      requestData.append('activity_id', selectedActivity.id.toString());
      requestData.append('nom_depense', formData.nom_depense);
      if (formData.piece_justificatif) {
        requestData.append('piece_justificatif', formData.piece_justificatif);
      }
      requestData.append('date_depense', formData.date_depense);
      requestData.append('montant', formData.montant.toString());

      const response = await fetch(endpoint, {
        method,
        body: requestData,
      });

      if (!response.ok) throw new Error('Erreur lors de l\'opération');
      
      const result = await response.json();
      console.log('Dépense créée/modifiée:', result);
      
      setFormData({
        activity_id: '',
        nom_depense: '',
        piece_justificatif: null,
        date_depense: new Date().toISOString().split('T')[0],
        montant: 0,
      });
      setActivitySearchTerm('');
      setSelectedActivity(null);
      setEditingId(null);
      setShowModal(false);
      fetchDepenses();
      fetchTotalExpenses();
    } catch (err) {
      setError('Erreur lors de l\'ajout/modification');
      console.error(err);
    }
  };

  const handleDeleteDepense = (depense: Depense) => {
    console.log('Suppression de la dépense:', depense);
    console.log('ID de la dépense:', depense.id);
    setDepenseToDelete(depense);
    setShowDeleteModal(true);
  };

  const confirmDeleteDepense = async () => {
    if (!depenseToDelete) return;
    console.log('Confirmation suppression - ID:', depenseToDelete.id);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/depenses/delete/${depenseToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      fetchDepenses();
      fetchTotalExpenses();
      setShowDeleteModal(false);
      setDepenseToDelete(null);
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error(err);
      setShowDeleteModal(false);
      setDepenseToDelete(null);
    }
  };

  const cancelDeleteDepense = () => {
    setShowDeleteModal(false);
    setDepenseToDelete(null);
  };

  const handleViewDepense = (depense: Depense) => {
    setDepenseDetails(depense);
    setShowDetailsModal(true);
  };

  const handleEditDepense = (depense: Depense) => {
    console.log('Edit depense:', depense);
    console.log('Activities:', activities);
    
    // Convertir l'activity_id en nombre pour la comparaison
    const activityIdNum = typeof depense.activity_id === 'string' ? parseInt(depense.activity_id) : depense.activity_id;
    const activity = activities.find(a => a.id === activityIdNum);
    console.log('Looking for activity with ID:', activityIdNum);
    console.log('Found activity:', activity);
    
    setFormData({
      activity_id: depense.activity_id.toString(),
      nom_depense: depense.nom_depense.trim(),
      piece_justificatif: null,
      date_depense: depense.date_depense.split('T')[0],
      montant: typeof depense.montant === 'string' ? parseFloat(depense.montant) : depense.montant,
    });
    
    if (activity) {
      console.log('Setting activity:', activity.nom);
      setSelectedActivity(activity);
      setActivitySearchTerm(activity.nom);
    } else {
      console.log('Activity not found for ID:', activityIdNum);
      // Essayer de charger les activités à nouveau
      fetchActivities();
    }
    
    setEditingId(depense.id.trim());
    setShowModal(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const getActivityName = (activityId: string | number) => {
    const activityIdStr = activityId.toString();
    const activity = activities.find(a => a.id.toString() === activityIdStr);
    return activity ? activity.nom : activityIdStr;
  };

  const filteredDepenses = depenses.filter(depense => {
    const matchesSearch = 
      depense.nom_depense.toLowerCase().includes(searchTerm.toLowerCase()) ||
      depense.piece_justificatif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getActivityName(depense.activity_id).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesActivity = selectedActivityFilter === null || depense.activity_id.toString() === selectedActivityFilter.toString();
    
    return matchesSearch && matchesActivity;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 pt-25">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Dépenses</h1>
          <p className="text-slate-600">Gérez les dépenses de l'AKRIFI</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Dépenses totales</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Nombre de dépenses</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {depenses.length}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Moyenne par dépense</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {formatCurrency(depenses.length > 0 ? totalExpenses / depenses.length : 0)}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une dépense..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <select
            value={selectedActivityFilter === null ? '' : selectedActivityFilter}
            onChange={(e) => setSelectedActivityFilter(e.target.value === '' ? null : parseInt(e.target.value))}
            className="px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-900 min-w-80"
          >
            <option value="">Toutes les activités</option>
            {activities.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.nom}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setFormData({
                activity_id: '',
                nom_depense: '',
                piece_justificatif: null,
                date_depense: new Date().toISOString().split('T')[0],
                montant: 0,
              });
              setActivitySearchTerm('');
              setSelectedActivity(null);
              setEditingId(null);
              setShowActivitySuggestions(false);
              setShowModal(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouvelle Dépense
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Chargement des dépenses...</p>
          </div>
        ) : filteredDepenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">Aucune dépense trouvée</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Activité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Dépense
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Pièce Justificative
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredDepenses.map((depense) => (
                  <tr key={depense.id || `depense-${Math.random()}`} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {getActivityName(depense.activity_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {depense.nom_depense}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {depense.piece_justificatif}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {formatDate(depense.date_depense)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {formatCurrency(typeof depense.montant === 'string' ? parseFloat(depense.montant) : depense.montant)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDepense(depense)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Voir les détails"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEditDepense(depense)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Éditer"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteDepense(depense)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {editingId ? 'Modifier la dépense' : 'Nouvelle dépense'}
              </h2>

              <form onSubmit={handleAddDepense} className="space-y-4">
                <div className="relative" ref={activitySearchRef}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Activité
                  </label>
                  <input
                    type="text"
                    value={activitySearchTerm}
                    onChange={(e) => {
                      setActivitySearchTerm(e.target.value);
                      setShowActivitySuggestions(true);
                      if (e.target.value !== selectedActivity?.nom) {
                        setSelectedActivity(null);
                      }
                    }}
                    onFocus={() => setShowActivitySuggestions(true)}
                    placeholder="Rechercher une activité..."
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none`}
                    required
                  />
                  
                  {/* Suggestions dropdown */}
                  {showActivitySuggestions && Array.isArray(activities) && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {activities.filter(activity =>
                        activity.nom.toLowerCase().includes(activitySearchTerm.toLowerCase())
                      ).length > 0 ? (
                        activities
                          .filter(activity =>
                            activity.nom.toLowerCase().includes(activitySearchTerm.toLowerCase())
                          )
                          .map((activity) => (
                            <div
                              key={activity.id}
                              onClick={() => {
                                setSelectedActivity(activity);
                                setActivitySearchTerm(activity.nom);
                                setShowActivitySuggestions(false);
                              }}
                              className={`px-4 py-3 cursor-pointer border-b border-slate-200 last:border-b-0 ${
                                selectedActivity?.id === activity.id ? 'bg-blue-100' : 'hover:bg-blue-50'
                              }`}
                            >
                              <p className="font-medium text-slate-900">{activity.nom}</p>
                              <p className="text-xs text-slate-500">
                                {new Date(activity.date_activite).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          ))
                      ) : (
                        <div className="px-4 py-3 text-slate-500 text-sm">
                          Aucune activité trouvée
                        </div>
                      )}
                    </div>
                  )}

                  {/* {selectedActivity && (
                    <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                      <p className="text-sm font-medium text-green-900">
                        ✓ {selectedActivity.nom}
                      </p>
                      <p className="text-xs text-green-700">
                        {new Date(selectedActivity.date_activite).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )} */}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Dépense
                  </label>
                  <input
                    type="text"
                    value={formData.nom_depense}
                    onChange={(e) => setFormData({ ...formData, nom_depense: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Pièce Justificative
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={(e) => setFormData({ ...formData, piece_justificatif: e.target.files?.[0] || null })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </div>
                  {formData.piece_justificatif && (
                    <p className="text-xs text-slate-500 mt-1">✓ {formData.piece_justificatif.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date_depense}
                    onChange={(e) => setFormData({ ...formData, date_depense: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Montant (MGA)
                  </label>
                  <input
                    type="number"
                    value={formData.montant}
                    onChange={(e) => setFormData({ ...formData, montant: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.01"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setFormData({
                        activity_id: '',
                        nom_depense: '',
                        piece_justificatif: null,
                        date_depense: new Date().toISOString().split('T')[0],
                        montant: 0,
                      });
                      setActivitySearchTerm('');
                      setSelectedActivity(null);
                      setEditingId(null);
                      setShowActivitySuggestions(false);
                    }}
                    className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg font-medium hover:bg-slate-300 transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    {editingId ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {showDeleteModal && depenseToDelete && (
          <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-xl flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Confirmer la suppression
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  Êtes-vous sûr de vouloir supprimer la dépense <strong>"{depenseToDelete.nom_depense}"</strong> (
                  {formatCurrency(typeof depenseToDelete.montant === 'string' ? parseFloat(depenseToDelete.montant) : depenseToDelete.montant)}) ?
                  Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={cancelDeleteDepense}
                    className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg font-medium hover:bg-slate-300 transition"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDeleteDepense}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de détails */}
        {showDetailsModal && depenseDetails && (
          <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Détails de la dépense</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Activité</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {getActivityName(depenseDetails.activity_id.toString())}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Dépense</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {depenseDetails.nom_depense.trim()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Date</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {formatDate(depenseDetails.date_depense)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Montant</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {formatCurrency(typeof depenseDetails.montant === 'string' ? parseFloat(depenseDetails.montant) : depenseDetails.montant)}
                  </p>
                </div>
              </div>

              {depenseDetails.piece_justificatif && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-slate-600 mb-2">Pièce Justificative</p>
                  <div className="bg-slate-100 rounded-lg p-4">
                    {depenseDetails.piece_justificatif.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL.replace('/api', '')}/uploads/${depenseDetails.piece_justificatif.includes('/') ? depenseDetails.piece_justificatif : `depenses/${depenseDetails.piece_justificatif}`}`}
                        alt="Pièce justificative"
                        className="max-w-full h-auto rounded-lg"
                      />
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-slate-600 mb-2">Fichier : {depenseDetails.piece_justificatif}</p>
                        <a
                          href={`${import.meta.env.VITE_BACKEND_URL.replace('/api', '')}/uploads/${depenseDetails.piece_justificatif.includes('/') ? depenseDetails.piece_justificatif : `depenses/${depenseDetails.piece_justificatif}`}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 font-semibold"
                        >
                          Télécharger le fichier
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg font-medium hover:bg-slate-300 transition"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEditDepense(depenseDetails);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
