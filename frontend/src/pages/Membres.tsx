import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit } from 'lucide-react';

interface Member {
  membre_id: number;
  nom_membre: string;
  prenom_membre: string;
  contact: string;
}

export default function Membres() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nom_membre: '', prenom_membre: '', contact: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  // Effacer l'erreur automatiquement après 5 secondes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  // Charger les membres au montage du composant
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/members?page=${page}&limit=10`);
      if (!response.ok) throw new Error('Erreur lors de la récupération');
      const data = await response.json();
      setMembers(data);
      setError('');
    } catch (err) {
      setError('Impossible de charger les membres');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = editingId
        ? `${import.meta.env.VITE_BACKEND_URL}/members/update/${editingId}`
        : `${import.meta.env.VITE_BACKEND_URL}/members/add`;
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'opération');
      
      setFormData({ nom_membre: '', prenom_membre: '', contact: '' });
      setEditingId(null);
      setShowModal(false);
      fetchMembers();
    } catch (err) {
      setError('Erreur lors de l\'ajout/modification');
      console.error(err);
    }
  };

  const handleDeleteMember = (member: Member) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/members/delete/${memberToDelete.membre_id}`, {
        method: 'DELETE',
      });
      if (response.status === 409) {
        const errorData = await response.json();
        setError(errorData.error);
        setShowDeleteModal(false);
        setMemberToDelete(null);
        return;
      }
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      fetchMembers();
      setShowDeleteModal(false);
      setMemberToDelete(null);
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error(err);
      setShowDeleteModal(false);
      setMemberToDelete(null);
    }
  };

  const cancelDeleteMember = () => {
    setShowDeleteModal(false);
    setMemberToDelete(null);
  };

  const formatContact = (value: string) => {
    // Enlever tous les espaces et caractères non numériques
    const cleaned = value.replace(/\D/g, '');
    // Formater : 3-2-3-2
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)}`;
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatContact(e.target.value);
    setFormData({ ...formData, contact: formatted });
  };

  const filteredMembers = members.filter(member =>
    member.nom_membre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.prenom_membre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditMember = (member: Member) => {
    console.log('Editing member:', member);
    setFormData({
      nom_membre: member.nom_membre,
      prenom_membre: member.prenom_membre,
      contact: formatContact(member.contact),
    });
    setEditingId(member.membre_id);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 pt-25">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Membres</h1>
          <p className="text-slate-600">Gérez les membres de l'AKRIFI</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un membre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <button
            onClick={() => {
              setFormData({ nom_membre: '', prenom_membre: '', contact: '' });
              setEditingId(null);
              setShowModal(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouveau Membre
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
            <p className="text-slate-600">Chargement des membres...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">Aucun membre trouvé</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Identifiant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Prénom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredMembers.map((member) => (
                  <tr key={member.membre_id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {member.membre_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {member.nom_membre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {member.prenom_membre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {member.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditMember(member)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Éditer"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member)}
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
                {editingId ? 'Modifier le membre' : 'Nouveau membre'}
              </h2>

              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={formData.nom_membre}
                    onChange={(e) => setFormData({ ...formData, nom_membre: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={formData.prenom_membre}
                    onChange={(e) => setFormData({ ...formData, prenom_membre: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Contact
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="03X XX XXX XX"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setFormData({ nom_membre: '', prenom_membre: '', contact: '' });
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
        {showDeleteModal && memberToDelete && (
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
                  Êtes-vous sûr de vouloir supprimer le membre <strong>"{memberToDelete.prenom_membre} {memberToDelete.nom_membre}"</strong> ? 
                  Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={cancelDeleteMember}
                    className="flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg font-medium hover:bg-slate-300 transition"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDeleteMember}
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
