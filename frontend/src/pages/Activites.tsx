import { useState, useEffect } from 'react';
import { Search, Plus, Calendar, FileText, Trash2, Edit } from 'lucide-react';

interface Activity {
  id: number;
  nom: string;
  description: string;
  date_activite: string;
}

export default function Activites() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nom: '', description: '', date_activite: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [, setCurrentPage] = useState(1);
  const [, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);

  // Effacer l'erreur automatiquement après 5 secondes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000); // 5 secondes

      return () => clearTimeout(timer);
    }
  }, [error]);

  // Charger les activités au montage du composant
  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/activities?page=${page}&limit=10`);
      if (!response.ok) throw new Error('Erreur lors de la récupération');
      const data = await response.json();
      setActivities(data.activities);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
      console.log(data);
      setError('');
    } catch (err) {
      setError('Impossible de charger les activités');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = editingId
        ? `${import.meta.env.VITE_BACKEND_URL}/activities/update/${editingId}`
        : `${import.meta.env.VITE_BACKEND_URL}/activities/add`;
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'opération');
      
      setFormData({ nom: '', description: '', date_activite: '' });
      setEditingId(null);
      setShowModal(false);
      fetchActivities();
    } catch (err) {
      setError('Erreur lors de l\'ajout/modification');
      console.error(err);
    }
  };

  const handleDeleteActivity = (activity: Activity) => {
    setActivityToDelete(activity);
    setShowDeleteModal(true);
  };

  const confirmDeleteActivity = async () => {
    if (!activityToDelete) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/activities/delete/${activityToDelete.id}`, {
        method: 'DELETE',
      });
      if (response.status === 409) {
        const errorData = await response.json();
        setError(errorData.error);
        setShowDeleteModal(false);
        setActivityToDelete(null);
        return;
      }
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      fetchActivities();
      setShowDeleteModal(false);
      setActivityToDelete(null);
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error(err);
      setShowDeleteModal(false);
      setActivityToDelete(null);
    }
  };

  const cancelDeleteActivity = () => {
    setShowDeleteModal(false);
    setActivityToDelete(null);
  };

  const handleEditActivity = (activity: Activity) => {
    setFormData({
      nom: activity.nom,
      description: activity.description,
      date_activite: activity.date_activite.split('T')[0],
    });
    setEditingId(activity.id);
    setShowModal(true);
  };

  const filteredActivities = activities.filter(activity =>
    activity.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-linear-to from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Activités</h1>
          <p className="text-slate-600">Gérez les activités et événements</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une activité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <button
            onClick={() => {
              setFormData({ nom: '', description: '', date_activite: '' });
              setEditingId(null);
              setShowModal(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouvelle Activité
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
            <p className="text-slate-600">Chargement des activités...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">Aucune activité trouvée</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition border border-slate-200 overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{activity.nom}</h3>
                  
                  <div className="flex items-center gap-2 mb-3 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(activity.date_activite).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 mb-4">
                    <FileText className="w-4 h-4 text-slate-600 mt-1 shrink-0" />
                    <p className="text-slate-700 text-sm line-clamp-3">{activity.description}</p>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => handleEditActivity(activity)}
                      className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Éditer
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(activity)}
                      className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {editingId ? 'Modifier l\'activité' : 'Nouvelle activité'}
              </h2>

              <form onSubmit={handleAddActivity} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date_activite}
                    onChange={(e) => setFormData({ ...formData, date_activite: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setFormData({ nom: '', description: '', date_activite: '' });
                      setEditingId(null);
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
        {showDeleteModal && activityToDelete && (
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
                  Êtes-vous sûr de vouloir supprimer l'activité <strong>"{activityToDelete.nom}"</strong> ? 
                  Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={cancelDeleteActivity}
                    className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg font-medium hover:bg-slate-300 transition"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDeleteActivity}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
