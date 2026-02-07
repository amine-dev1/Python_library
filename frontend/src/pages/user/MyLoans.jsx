import { useState, useEffect } from "react";
import { myLoans, returnBook } from "../../api/loans.api";
import { Calendar, BookOpen, Clock, AlertCircle, BookMarked, CheckCircle, XCircle } from "lucide-react";

const STATUS = {
  RETURNED: { color: "green", icon: CheckCircle, label: "Retourné" },
  OVERDUE:  { color: "red",   icon: XCircle,     label: "En retard" },
  BORROWED: { color: "yellow", icon: Clock,       label: "En cours" },
  UNKNOWN:  { color: "gray",  icon: AlertCircle, label: "Statut inconnu" },
};

export default function MyLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [returning, setReturning] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await myLoans();
      const data = res.data || [];
      console.log("[MyLoans] Données reçues :", data);
      setLoans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("[MyLoans] Erreur chargement :", err);
      let message = "Impossible de charger vos emprunts.";
      
      if (err.response) {
        const status = err.response.status;
        if (status === 401 || status === 403) {
          message = "Session expirée ou accès non autorisé. Veuillez vous reconnecter.";
        } else if (status >= 500) {
          message = "Problème sur le serveur. Réessayez plus tard.";
        } else if (status === 404) {
          message = "Endpoint introuvable. Vérifiez la configuration API.";
        }
      } else if (err.request) {
        message = "Impossible de contacter le serveur (serveur arrêté ? problème réseau ?)";
      }
      
      setError(message + " Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId) => {
    if (!window.confirm("Confirmez-vous le retour de ce livre ?")) return;
    
    setReturning(loanId);
    try {
      await returnBook(loanId);
      setNotification("Livre retourné avec succès ✓");
      setTimeout(() => setNotification(null), 4000);
      await loadLoans();
    } catch (err) {
      console.error("[MyLoans] Erreur retour :", err);
      alert("Échec du retour du livre. Veuillez réessayer.");
    } finally {
      setReturning(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Date invalide";
    }
  };

  const active = loans.filter(l => ["BORROWED", "OVERDUE"].includes(l?.status)).length;
  const returned = loans.filter(l => l?.status === "RETURNED").length;
  const overdue = loans.filter(l => l?.status === "OVERDUE").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1a1b41] rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Chargement de vos emprunts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg font-semibold text-sm animate-fadeIn">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1a1b41] to-[#2a2b51] rounded-xl flex items-center justify-center shadow-lg">
              <BookMarked size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mes Emprunts</h1>
              <p className="text-sm text-gray-600">Suivez et gérez vos livres empruntés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[
            { value: active,   label: "En cours",  color: "blue",   Icon: Clock },
            { value: returned, label: "Retournés", color: "green",  Icon: CheckCircle },
            { value: overdue,  label: "En retard", color: "red",    Icon: AlertCircle },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 bg-${stat.color}-50 rounded-lg flex items-center justify-center`}>
                  <stat.Icon className={`text-${stat.color}-600`} size={20} />
                </div>
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-center font-medium">
            {error}
          </div>
        )}

        {/* Loans List */}
        {loans.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {error ? "Erreur de chargement" : "Aucun emprunt"}
            </h3>
            <p className="text-sm text-gray-500">
              {error || "Vous n'avez pas encore emprunté de livres."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => {
              const statusKey = loan?.status?.toUpperCase() || "UNKNOWN";
              const s = STATUS[statusKey] || STATUS.UNKNOWN;
              const StatusIcon = s.icon;

              const isOverdue = statusKey === "OVERDUE";
              let daysLate = 0;
              if (isOverdue && loan.due_date) {
                daysLate = Math.max(0, Math.floor(
                  (new Date() - new Date(loan.due_date)) / (1000 * 60 * 60 * 24)
                ));
              }

              return (
                <div key={loan.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  {/* Top Accent */}
                  <div className={`h-1 ${
                    s.color === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                    s.color === 'red' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                    s.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                    'bg-gradient-to-r from-gray-400 to-gray-500'
                  }`}></div>
                  
                  <div className="p-6">
                    {/* Book Title */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <BookOpen size={22} className="text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#1a1b41] transition-colors">
                          {loan.book?.title || "Livre non disponible"}
                        </h3>
                        {loan.book?.author && (
                          <p className="text-sm text-gray-600">par {loan.book.author}</p>
                        )}
                      </div>
                    </div>

                    {/* Dates Grid */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <Calendar size={16} className="text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Emprunté le</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{formatDate(loan.loan_date)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <Clock size={16} className="text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">À rendre avant</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{formatDate(loan.due_date)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                        <div className={`w-8 h-8 bg-${s.color}-50 rounded-lg flex items-center justify-center`}>
                          <StatusIcon size={16} className={`text-${s.color}-600`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</p>
                          <p className={`text-sm font-bold text-${s.color}-600 truncate`}>
                            {s.label}
                            {isOverdue && daysLate > 0 && ` (${daysLate} jour${daysLate > 1 ? 's' : ''})`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-${s.color}-50 border border-${s.color}-100`}>
                        <StatusIcon className={`text-${s.color}-600`} size={18} />
                        <span className={`text-sm font-bold text-${s.color}-700`}>{s.label}</span>
                      </div>

                      {statusKey === "BORROWED" && (
                        <button
                          disabled={returning === loan.id}
                          onClick={() => handleReturn(loan.id)}
                          className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1b41] text-white font-semibold rounded-lg hover:bg-[#2a2b51] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {returning === loan.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Retour en cours...
                            </>
                          ) : (
                            <>
                              <CheckCircle size={18} />
                              Retourner le livre
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}