import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  allLoans,
  returnBook,
  createLoan,
  updateLoan,
  getBooks,
  getUsers,
} from "../../api/loans.api";

import {
  BookOpen,
  Search,
  RotateCcw,
  Plus,
  Edit2,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  User,
} from "lucide-react";

export default function AdminLoans() {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedLoan, setSelectedLoan] = useState(null);

  // Confirmation Modal for Return
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loanToReturn, setLoanToReturn] = useState(null);

  const [formData, setFormData] = useState({
    book_id: "",
    user_id: "",
    loan_date: "",
    due_date: "",
    days: 14,
    status: "BORROWED",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const [loansRes, booksRes, usersRes] = await Promise.all([
        allLoans(),
        getBooks(),
        getUsers(),
      ]);

      setLoans(Array.isArray(loansRes) ? loansRes : loansRes?.data || []);
      setBooks(Array.isArray(booksRes) ? booksRes : booksRes?.data || []);
      setUsers(Array.isArray(usersRes) ? usersRes : usersRes?.data || []);
    } catch (error) {
      console.error("Erreur chargement :", error);
      setErrorMsg("Impossible de charger les données. Vérifiez votre API.");
    } finally {
      setLoading(false);
    }
  };

  const filteredLoans = loans.filter(
    (loan) =>
      loan.book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusInfo = (status) => {
    const s = (status || "").toUpperCase();
    switch (s) {
      case "BORROWED":
        return { label: "Emprunté", color: "bg-blue-100 text-blue-800", icon: <Clock size={14} /> };
      case "OVERDUE":
        return { label: "En retard", color: "bg-red-100 text-red-800", icon: <AlertCircle size={14} /> };
      case "RETURNED":
        return { label: "Retourné", color: "bg-green-100 text-green-800", icon: <CheckCircle size={14} /> };
      default:
        return { label: s || "Inconnu", color: "bg-gray-100 text-gray-800", icon: null };
    }
  };

  const calculateDueDate = (startDate, days) => {
    if (!startDate) return "";
    const date = new Date(startDate);
    date.setDate(date.getDate() + Number(days));
    return date.toISOString().split("T")[0];
  };

  const openCreate = () => {
    const today = new Date().toISOString().split("T")[0];
    const defaultDue = calculateDueDate(today, 14);

    setFormData({
      book_id: "",
      user_id: "",
      loan_date: today,
      due_date: defaultDue,
      days: 14,
      status: "BORROWED",
    });
    setModalMode("create");
    setShowModal(true);
  };

  const openEdit = (loan) => {
    const days =
      loan.loan_date && loan.due_date
        ? Math.round((new Date(loan.due_date) - new Date(loan.loan_date)) / (1000 * 60 * 60 * 24))
        : 14;

    setFormData({
      book_id: loan.book_id || loan.book?.id || "",
      user_id: loan.user_id || loan.user?.id || "",
      loan_date: loan.loan_date ? new Date(loan.loan_date).toISOString().split("T")[0] : "",
      due_date: loan.due_date ? new Date(loan.due_date).toISOString().split("T")[0] : "",
      days,
      status: loan.status || "BORROWED",
    });
    setSelectedLoan(loan);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const loadingToast = toast.loading(
      modalMode === "create" ? "Création de l'emprunt..." : "Mise à jour de l'emprunt..."
    );

    try {
      const payload = {
        book_id: Number(formData.book_id),
        user_id: Number(formData.user_id),
        loan_date: formData.loan_date || new Date().toISOString(),
        due_date: formData.due_date,
        status: formData.status,
      };

      if (modalMode === "create") {
        await createLoan(payload);
        toast.success("Emprunt créé avec succès!", {
          id: loadingToast,
          duration: 4000,
          style: {
            background: '#10b981',
            color: '#fff',
            fontWeight: '600',
            padding: '16px',
            borderRadius: '12px',
          },
        });
      } else if (selectedLoan?.id) {
        await updateLoan(selectedLoan.id, payload);
        toast.success("Emprunt mis à jour!", {
          id: loadingToast,
          duration: 4000,
          style: {
            background: '#3b82f6',
            color: '#fff',
            fontWeight: '600',
            padding: '16px',
            borderRadius: '12px',
          },
        });
      }

      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      const errorMessage = err.response?.data?.message ||
        "Échec de l'enregistrement. Vérifiez la console et les champs.";

      toast.error(errorMessage, {
        id: loadingToast,
        duration: 5000,
        style: {
          background: '#ef4444',
          color: '#fff',
          fontWeight: '600',
          padding: '16px',
          borderRadius: '12px',
        },
      });
      setErrorMsg(errorMessage);
    }
  };

  const openReturnModal = (loan) => {
    setLoanToReturn(loan);
    setShowConfirmModal(true);
  };

  const confirmReturn = async () => {
    if (!loanToReturn) return;
    setShowConfirmModal(false);

    const loadingToast = toast.loading("Traitement du retour...", {
      style: {
        background: '#3b82f6',
        color: '#fff',
        fontWeight: '600',
        padding: '16px',
        borderRadius: '12px',
      },
    });

    try {
      await returnBook(loanToReturn.id);
      toast.success("📚 Livre retourné avec succès!", {
        id: loadingToast,
        duration: 4000,
        style: {
          background: '#10b981',
          color: '#fff',
          fontWeight: '600',
          padding: '16px',
          borderRadius: '12px',
        },
      });
      fetchData();
    } catch (err) {
      toast.error("❌ Échec du retour du livre", {
        id: loadingToast,
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#fff',
          fontWeight: '600',
          padding: '16px',
          borderRadius: '12px',
        },
      });
      setErrorMsg("Échec du retour du livre");
    } finally {
      setLoanToReturn(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerStyle={{
          top: 80,
          right: 20,
          zIndex: 99999,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: '14px',
            maxWidth: '500px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-900 p-4 rounded-2xl shadow-lg" style={{ background: '#1a1b41' }}>
              <BookOpen className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Gestion des Emprunts</h1>
              <p className="text-gray-600 mt-1">Suivi complet des prêts</p>
            </div>
          </div>

          <button
            onClick={openCreate}
            className="bg-indigo-800 hover:bg-indigo-900 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-md transition-all"
            style={{ background: '#1a1b41' }}>
            <Plus size={20} /> Nouvel emprunt
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
            {errorMsg}
          </div>
        )}

        {/* Stats */}
        {/* →→→ ICI SEULEMENT : les petites cartes stats en #1a1b41 ←←← */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a1b41] p-5 rounded-xl shadow border border-gray-700 text-white">
            <p className="text-sm text-gray-300 font-medium">Total</p>
            <p className="text-3xl font-bold text-white">{loans.length}</p>
          </div>
          <div className="bg-[#1a1b41] p-5 rounded-xl shadow border border-gray-700 text-white">
            <p className="text-sm text-gray-300 font-medium">En cours</p>
            <p className="text-3xl font-bold text-white">
              {loans.filter((l) => l.status === "BORROWED").length}
            </p>
          </div>
          <div className="bg-[#1a1b41] p-5 rounded-xl shadow border border-gray-700 text-white">
            <p className="text-sm text-gray-300 font-medium">En retard</p>
            <p className="text-3xl font-bold text-white">
              {loans.filter((l) => l.status === "OVERDUE").length}
            </p>
          </div>
          <div className="bg-[#1a1b41] p-5 rounded-xl shadow border border-gray-700 text-white">
            <p className="text-sm text-gray-300 font-medium">Terminés</p>
            <p className="text-3xl font-bold text-white">
              {loans.filter((l) => l.status === "RETURNED").length}
            </p>
          </div>
        </div>
        {/* Recherche */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Livre, utilisateur, email ou statut..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            />
          </div>
        </div>

        {/* Liste des emprunts */}
        {filteredLoans.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow border border-gray-200">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900">Aucun emprunt trouvé</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLoans.map((loan) => {
              const statusInfo = getStatusInfo(loan.status);
              return (
                <div
                  key={loan.id}
                  className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="bg-indigo-900 px-6 py-5" style={{ background: '#1a1b41' }}>
                    <h3 className="text-white font-semibold text-lg line-clamp-2">
                      {loan.book?.title || `Livre #${loan.book_id}`}
                    </h3>
                    <p className="text-indigo-200 text-sm mt-1 flex items-center gap-1">
                      <User size={14} />
                      {loan.user?.username || loan.user?.email || `User #${loan.user_id}`}
                    </p>
                  </div>

                  <div className="p-5 space-y-4">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.color}`}
                    >
                      {statusInfo.icon}
                      {statusInfo.label}
                    </div>

                    <div className="text-sm space-y-2 text-gray-800">
                      <div className="flex justify-between">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Calendar size={14} /> Emprunté le
                        </span>
                        <span>
                          {loan.loan_date
                            ? new Date(loan.loan_date).toLocaleString("fr-FR", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                            : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">À rendre le</span>
                        <span className={loan.status === "OVERDUE" ? "text-red-700 font-semibold" : ""}>
                          {loan.due_date ? new Date(loan.due_date).toLocaleDateString("fr-FR") : "—"}
                        </span>
                      </div>
                      {loan.return_date && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Retourné le</span>
                          <span>
                            {new Date(loan.return_date).toLocaleString("fr-FR", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-5">
                      {loan.status !== "RETURNED" && (
                        <button
                          onClick={() => openReturnModal(loan)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <RotateCcw size={16} /> Retour
                        </button>
                      )}
                      <button
                        onClick={() => openEdit(loan)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <Edit2 size={16} /> Modifier
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="bg-indigo-900 text-white px-6 py-5 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {modalMode === "create" ? "Nouvel emprunt" : "Modifier l'emprunt"}
                </h2>
                <button onClick={() => setShowModal(false)}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {errorMsg && <p className="text-red-600 bg-red-50 p-3 rounded">{errorMsg}</p>}

                <div>
                  <label className="block text-gray-900 font-medium mb-2">Livre *</label>
                  <select
                    required
                    value={formData.book_id}
                    onChange={(e) => setFormData({ ...formData, book_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 font-medium"
                  >
                    <option value="">— Choisir un livre —</option>
                    {books.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title} {b.author ? ` – ${b.author}` : ""} {b.isbn ? `(${b.isbn})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-900 font-medium mb-2">Utilisateur *</label>
                  <select
                    required
                    value={formData.user_id}
                    onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 font-medium"
                  >
                    <option value="">— Choisir un utilisateur —</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username} – {u.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-900 font-medium mb-2">Date d'emprunt</label>
                    <input
                      type="date"
                      value={formData.loan_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          loan_date: e.target.value,
                          due_date: calculateDueDate(e.target.value, formData.days),
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-900 font-medium mb-2">Durée (jours)</label>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={formData.days}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          days: e.target.value,
                          due_date: calculateDueDate(formData.loan_date, e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-900 font-medium mb-2">Date limite de retour *</label>
                  <input
                    type="date"
                    required
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 font-medium mb-2">Statut *</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 font-medium"
                  >
                    <option value="BORROWED">Emprunté (BORROWED)</option>
                    <option value="OVERDUE">En retard (OVERDUE)</option>
                    <option value="RETURNED">Retourné (RETURNED)</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-900 hover:bg-gray-100"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-medium shadow"
                  >
                    {modalMode === "create" ? "Créer l'emprunt" : "Enregistrer les modifications"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CONFIRMATION MODAL */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 opacity-100">
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6">
                  <RotateCcw className="h-8 w-8 text-indigo-900" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirmer le retour ?</h3>
                <p className="text-gray-500 mb-6">
                  Vous êtes sur le point de marquer le livre <br />
                  <span className="font-semibold text-indigo-900">"{loanToReturn?.book?.title}"</span> <br />
                  comme retourné. Cette action est irréversible.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmReturn}
                    className="flex-1 py-3 px-4 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl font-semibold shadow-lg transition-transform active:scale-95"
                    style={{ background: '#1a1b41' }}
                  >
                    Confirmer
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