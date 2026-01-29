import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Eye, Edit2, AlertCircle, X } from 'lucide-react';
import { TrendingUp } from 'lucide-react';

interface Quete {
  quete_id: string;
  date_quete: string;
  nom_donnateur: string;
  montant_quete: number | string;
  piece_justificatif: string;
}

// Alias pour compatibilité
interface QueteView extends Quete {
  id?: string;
}

export default function Quete() {
  const [quetes, setQuetes] = useState<Quete[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [totalQuetes, setTotalQuetes] = useState(0);
  const [formData, setFormData] = useState({
    date_quete: new Date().toISOString().split('T')[0],
    nom_donnateur: '',
    montant_quete: 0,
    piece_justificatif: null as File | string | null,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [queteToDelete, setQueteToDelete] = useState<Quete | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [queteDetails, setQueteDetails] = useState<Quete | null>(null);

  // Effacer l'erreur automatiquement après 5 secondes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  // Charger les quêtes au montage du composant
  useEffect(() => {
    fetchQuetes();
    fetchTotalQuetes();
  }, []);

  const fetchQuetes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quete`);
      if (!response.ok) throw new Error('Erreur lors de la récupération');
      const data = await response.json();
      console.log('Quêtes reçues:', data);
      setQuetes(data);
      setError('');
    } catch (err) {
      setError('Impossible de charger les quêtes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalQuetes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quete/sum`);
      if (response.ok) {
        const data = await response.json();
        setTotalQuetes(data.total || 0);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération du total', err);
    }
  };

  const handleAddQuete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom_donnateur || !formData.montant_quete) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    try {
      const endpoint = editingId
        ? `${import.meta.env.VITE_BACKEND_URL}/quete/update/${editingId}`
        : `${import.meta.env.VITE_BACKEND_URL}/quete/add`;

      const method = editingId ? 'PUT' : 'POST';

      // Utiliser FormData pour supporter l'upload de fichier
      const requestData = new FormData();
      requestData.append('date_quete', formData.date_quete);
      requestData.append('nom_donnateur', formData.nom_donnateur);
      requestData.append('montant', formData.montant_quete.toString());
      // Si un File est sélectionné, l'ajouter; sinon envoyer le nom de fichier existant (string)
      if (formData.piece_justificatif) {
        if (typeof formData.piece_justificatif === 'string') {
          requestData.append('piece_justificatif', formData.piece_justificatif);
        } else {
          requestData.append('piece_justificatif', formData.piece_justificatif);
        }
      }

      const response = await fetch(endpoint, {
        method,
        body: requestData,
      });

      if (!response.ok) throw new Error('Erreur lors de l\'opération');

      const result = await response.json();
      console.log('Quête créée/modifiée:', result);

      setFormData({
        date_quete: new Date().toISOString().split('T')[0],
        nom_donnateur: '',
        montant_quete: 0,
        piece_justificatif: null,
      });
      setEditingId(null);
      setShowModal(false);
      fetchQuetes();
      fetchTotalQuetes();
    } catch (err) {
      setError('Erreur lors de l\'ajout/modification');
      console.error(err);
    }
  };

  const handleDeleteQuete = (quete: Quete) => {
    console.log('Suppression de la quête:', quete);
    setQueteToDelete(quete);
    setShowDeleteModal(true);
  };

  const confirmDeleteQuete = async () => {
    if (!queteToDelete) return;
    console.log('Confirmation suppression - ID:', queteToDelete.quete_id);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/quete/delete/${queteToDelete.quete_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      fetchQuetes();
      fetchTotalQuetes();
      setShowDeleteModal(false);
      setQueteToDelete(null);
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error(err);
      setShowDeleteModal(false);
      setQueteToDelete(null);
    }
  };

  const cancelDeleteQuete = () => {
    setShowDeleteModal(false);
    setQueteToDelete(null);
  };

  const handleViewQuete = (quete: Quete) => {
    setQueteDetails(quete);
    setShowDetailsModal(true);
  };

  const handleEditQuete = (quete: Quete) => {
    console.log('Edit quête:', quete);

    setFormData({
      date_quete: quete.date_quete.split('T')[0],
      nom_donnateur: quete.nom_donnateur.trim(),
      montant_quete: typeof quete.montant_quete === 'string' ? parseFloat(quete.montant_quete) : quete.montant_quete,
      // Récupérer le nom de la pièce existante pour l'afficher dans le formulaire d'édition
      piece_justificatif: quete.piece_justificatif || null,
    });

    setEditingId(quete.quete_id.trim());
    setShowDetailsModal(false);
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

  const getFileUrl = (piece: string) => {
    if (!piece) return '';
    // Déterminer la base du backend sans le segment '/api' si présent
    let base = import.meta.env.VITE_BACKEND_URL || '';
    if (base.endsWith('/api')) base = base.replace(/\/api$/, '');
    // Si la valeur contient un chemin (ex: quetes/filename), utiliser uploads/<path>
    if (piece.includes('/')) return `${base}/uploads/${piece}`;
    // Sinon supposer que le fichier est dans uploads/quetes/
    return `${base}/uploads/quetes/${piece}`;
  };

  const isImageFile = (piece: string) => {
    if (!piece) return false;
    const name = piece.split('/').pop() || '';
    return !!name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  };

  const filteredQuetes = quetes.filter(quete => {
    const matchesSearch =
      quete.nom_donnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quete.piece_justificatif || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 pt-25">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Quêtes</h1>
          <p className="text-slate-600">Gérez les quêtes et les collectes de l'AKRIFI</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Montant total collecté</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {formatCurrency(totalQuetes)}
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
                <p className="text-slate-600 text-sm font-medium">Nombre de quêtes</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {filteredQuetes.length}
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
                <p className="text-slate-600 text-sm font-medium">Moyenne par quête</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {filteredQuetes.length > 0 ? formatCurrency(totalQuetes / filteredQuetes.length) : formatCurrency(0)}
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
              placeholder="Rechercher une quête..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <button
            onClick={() => {
              setFormData({
                date_quete: new Date().toISOString().split('T')[0],
                nom_donnateur: '',
                montant: 0,
                piece_justificatif: null,
              });
              setEditingId(null);
              setShowModal(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouvelle Quête
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
            <p className="text-slate-600">Chargement des quêtes...</p>
          </div>
        ) : filteredQuetes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">Aucune quête trouvée</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Donateur</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Montant</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Pièce Justificative</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredQuetes.map((quete) => (
                  <tr key={quete.quete_id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-sm text-slate-900">{quete.nom_donnateur}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(quete.date_quete)}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">{formatCurrency(typeof quete.montant_quete === 'string' ? parseFloat(quete.montant_quete) : quete.montant_quete  )}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{quete.piece_justificatif}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewQuete(quete)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditQuete(quete)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuete(quete)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingId ? 'Modifier la quête' : 'Nouvelle quête'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddQuete} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date de la quête
                  </label>
                  <input
                    type="date"
                    value={formData.date_quete}
                    onChange={(e) => setFormData({ ...formData, date_quete: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nom du donateur
                  </label>
                  <input
                    type="text"
                    value={formData.nom_donnateur}
                    onChange={(e) => setFormData({ ...formData, nom_donnateur: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Montant (MGA)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.montant_quete}
                    onChange={(e) => setFormData({ ...formData, montant_quete: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pièce justificative
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-600">
                      {formData.piece_justificatif
                        ? (typeof formData.piece_justificatif === 'string'
                          ? formData.piece_justificatif.split('/').pop()
                          : formData.piece_justificatif.name)
                        : 'Aucun fichier'}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-sm hover:bg-blue-100"
                    >
                      Remplacer
                    </button>
                    {formData.piece_justificatif && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, piece_justificatif: null })}
                        className="px-3 py-1 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm hover:bg-red-100"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                  <input
                    ref={(el) => (fileInputRef.current = el)}
                    type="file"
                    onChange={(e) => setFormData({ ...formData, piece_justificatif: e.target.files?.[0] || null })}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    {editingId ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {showDeleteModal && queteToDelete && (
          <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-xl flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Supprimer la quête</h3>
                <p className="text-slate-600 mb-6">
                  Êtes-vous sûr de vouloir supprimer la quête de {queteToDelete.nom_donnateur} ? Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={cancelDeleteQuete}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDeleteQuete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de détails */}
        {showDetailsModal && queteDetails && (
          <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Détails de la quête</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-1">ID</p>
                  <p className="text-slate-900 font-semibold">{queteDetails.quete_id}</p>
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-1">Nom du donateur</p>
                  <p className="text-slate-900 font-semibold">{queteDetails.nom_donnateur}</p>
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-1">Date</p>
                  <p className="text-slate-900 font-semibold">{formatDate(queteDetails.date_quete)}</p>
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-1">Montant</p>
                  <p className="text-green-600 font-semibold">{formatCurrency(typeof queteDetails.montant_quete === 'string' ? parseFloat(queteDetails.montant_quete) : (queteDetails.montant_quete as number))}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-600 text-sm font-medium mb-1">Pièce justificative</p>
                  <p className="text-slate-900 font-semibold">{(queteDetails.piece_justificatif || '').split('/').pop()}</p>
                </div>
              </div>

              {queteDetails.piece_justificatif && (
                <div className="mb-6">
                  <p className="text-slate-600 text-sm font-medium mb-3">Aperçu</p>
                  {isImageFile(queteDetails.piece_justificatif) ? (
                    <img
                      src={getFileUrl(queteDetails.piece_justificatif)}
                      alt="Pièce justificative"
                      className="max-w-full h-auto rounded-lg"
                    />
                  ) : (
                    <a
                      href={getFileUrl(queteDetails.piece_justificatif)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                    >
                      Télécharger le fichier
                    </a>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => handleEditQuete(queteDetails)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Modifier
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleDeleteQuete(queteDetails);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
