import { useState, useEffect } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
  updateUserRole,
} from "../../api/users.api";
import { Users, Plus, Edit2, Trash2, X, Search, User, Shield, UserCheck, UserX } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "", // Pas de valeur par défaut
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      const usersData = Array.isArray(response) ? response : response?.data || [];
      setUsers(usersData);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setModalMode("create");
    setFormData({ username: "", email: "", password: "", role: "" }); // Pas de valeur par défaut
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    setFormData({
      username: user.username || "",
      email: user.email || "",
      password: "",
      role: user.role || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        await createUser(formData);
      } else {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await updateUser(selectedUser._id || selectedUser.id, updateData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleToggleActive = async (user) => {
    try {
      if (user.is_active === false) {
        await activateUser(user._id || user.id);
      } else {
        await deactivateUser(user._id || user.id);
      }
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors du changement de rôle:", error);
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <Shield size={14} />;
      default:
        return <User size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#1a1b41] mx-auto mb-4"></div>
            <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#1a1b41]" size={24} />
          </div>
          <p className="text-gray-600 font-medium">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header avec animation */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-[#1a1b41] to-[#2a2b51] p-3 rounded-2xl shadow-lg">
              <Users className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Gestion des Utilisateurs
              </h1>
              <p className="text-gray-500 text-sm sm:text-base mt-1">
                Gérez les membres de votre bibliothèque
              </p>
            </div>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100" style={{background:'#1a1b41'}}>
            <p className="text-xs text-[#ffff] uppercase font-semibold mb-1">Total Utilisateurs</p>
            <p className="text-2xl font-bold text-[#ffff]">{users.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100" style={{background:'#1a1b41'}}>
            <p className="text-xs text-[#ffff] uppercase font-semibold mb-1">Actifs</p>
            <p className="text-2xl font-bold text-[#ffff]">
              {users.filter(u => u.is_active !== false).length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100" style={{background:'#1a1b41'}}>
            <p className="text-xs text-[#ffff] uppercase font-semibold mb-1" >Admins</p>
            <p className="text-2xl font-bold text-[#ffff]">
              {users.filter(u => u.role?.toLowerCase() === "admin").length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100" style={{background:'#1a1b41'}}>
            <p className="text-xs text-[#ffff] uppercase font-semibold mb-1">Membres</p>
            <p className="text-2xl font-bold text-[#ffff]">
              {users.filter(u => u.role?.toLowerCase() === "user").length}
            </p>
          </div>
        </div>

        {/* Barre de recherche et bouton ajout */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Rechercher par nom, email ou rôle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1b41] focus:border-transparent transition-all placeholder:text-gray-400 text-sm font-medium"
              />
            </div>

            {/* Bouton Ajouter */}
            <button
              onClick={handleCreate}
              className="bg-gradient-to-r from-[#1a1b41] to-[#2a2b51] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
              <span>Ajouter un utilisateur</span>
            </button>
          </div>
        </div>

        {/* Grille d'utilisateurs */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-16 text-center">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun utilisateur trouvé</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? "Essayez une autre recherche" : "Commencez par ajouter votre premier utilisateur"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreate}
                className="bg-[#1a1b41] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#252753] transition-colors inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Ajouter un utilisateur
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredUsers.map((user) => (
              <div
                key={user._id || user.id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-br from-[#1a1b41] to-[#2a2b51] p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="bg-white/10 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center mb-3">
                      <User size={24} className="text-white" />
                    </div>
                    <h3 className="font-bold text-white text-lg mb-1 line-clamp-1">
                      {user.username}
                    </h3>
                    <p className="text-white/70 text-sm font-medium truncate">{user.email}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role?.toUpperCase() || "USER"}
                    </span>
                    <span
                      className={`inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full ${
                        user.is_active !== false
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.is_active !== false ? "✓ Actif" : "⊗ Inactif"}
                    </span>
                  </div>

                  {/* Info supplémentaires */}
                  <div className="mb-4 bg-gray-50 rounded-lg p-3 space-y-2">
                    {user.created_at && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-0.5">Membre depuis</p>
                        <p className="text-xs font-bold text-gray-700">
                          {new Date(user.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="mb-3">
                    <label className="block text-xs text-gray-500 uppercase font-semibold mb-2">Changer le rôle</label>
                    <select
                      value={user.role || ""}
                      onChange={(e) => handleChangeRole(user._id || user.id, e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-100 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1a1b41] focus:border-transparent transition-all"
                    >
                      <option value="">Sélectionner un rôle</option>
                      <option value="user">USER</option>
                      <option value="admin">ADMIN</option>
                    </select>
                  </div>

                  {/* Actions principales */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-semibold transition-all duration-200 text-xs ${
                        user.is_active !== false
                          ? "bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white"
                          : "bg-green-50 hover:bg-green-500 text-green-600 hover:text-white"
                      }`}
                    >
                      {user.is_active !== false ? <UserX size={14} /> : <UserCheck size={14} />}
                    </button>
                    <button
                      onClick={() => handleEdit(user)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gray-50 hover:bg-[#1a1b41] text-gray-700 hover:text-white rounded-xl font-semibold transition-all duration-200 text-xs"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id || user.id)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl font-semibold transition-all duration-200 text-xs"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-scale-in">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#1a1b41] to-[#2a2b51] text-white p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl">
                      {modalMode === "create" ? <Plus size={24} /> : <Edit2 size={24} />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {modalMode === "create" ? "Nouvel utilisateur" : "Modifier l'utilisateur"}
                      </h2>
                      <p className="text-white/70 text-sm mt-0.5">
                        {modalMode === "create" ? "Ajoutez un nouveau membre" : "Mettez à jour les informations"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#1a1b41]">
                    Nom d'utilisateur <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1b41] focus:border-transparent transition-all font-medium text-[#1a1b41]"
                    placeholder="Ex: johndoe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#1a1b41]">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1b41] focus:border-transparent transition-all font-medium text-[#1a1b41]"
                    placeholder="Ex: john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#1a1b41]">
                    Mot de passe {modalMode === "create" && <span className="text-red-500">*</span>}
                    {modalMode === "edit" && <span className="text-gray-400 text-xs font-normal">(laisser vide pour ne pas changer)</span>}
                  </label>
                  <input
                    type="password"
                    required={modalMode === "create"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1b41] focus:border-transparent transition-all font-medium text-[#1a1b41]"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#1a1b41]">
                    Rôle <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1b41] focus:border-transparent transition-all font-medium text-[#1a1b41]"
                  >
                    <option value="">Sélectionner un rôle</option>
                    <option value="user">USER</option>
                    <option value="admin">ADMIN</option>
                  </select>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-5 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-5 py-3 bg-gradient-to-r from-[#1a1b41] to-[#2a2b51] text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    {modalMode === "create" ? "Créer l'utilisateur" : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}