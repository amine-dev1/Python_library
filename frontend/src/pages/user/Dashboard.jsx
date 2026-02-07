import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getBooks } from "../../api/books.api";
import { myLoans, borrowBook } from "../../api/loans.api";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  User as UserIcon,
  Calendar,
  CheckCircle,
  Clock,
  Search,
  TrendingUp,
  AlertCircle,
  LogOut,
  ArrowRight,
  Package,
} from "lucide-react";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [userLoans, setUserLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [borrowing, setBorrowing] = useState(null);
  const [showBooks, setShowBooks] = useState(false);

  const totalBorrowed = userLoans.length;
  const activeLoan = userLoans.filter((l) => !l.return_date).length;
  const returned = userLoans.filter((l) => l.return_date).length;
  const overdue = userLoans.filter((l) => {
    if (l.return_date) return false;
    return new Date(l.due_date) < new Date();
  }).length;

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const booksPromise = getBooks().catch(err => {
        console.error("[getBooks] failed", err?.response?.status, err?.response?.data);
        return { data: [] };
      });

      const loansPromise = myLoans().catch(err => {
        console.error("[myLoans] failed", err?.response?.status, err?.response?.data);
        return { data: [] };
      });

      const [booksRes, loansRes] = await Promise.all([booksPromise, loansPromise]);

      const booksData = booksRes?.data ?? booksRes ?? [];
      const loansData = loansRes?.data ?? loansRes ?? [];

      const sortedLoans = Array.isArray(loansData)
        ? [...loansData].sort((a, b) => {
            const dateA = new Date(a.created_at || a.borrow_date || a.due_date || 0);
            const dateB = new Date(b.created_at || b.borrow_date || b.due_date || 0);
            return dateB - dateA;
          })
        : [];

      setBooks(Array.isArray(booksData) ? booksData : []);
      setUserLoans(sortedLoans);
    } catch (err) {
      console.error("Global load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowBook = async (bookId) => {
    try {
      setBorrowing(bookId);
      await borrowBook(bookId);
      await loadData();
    } catch (e) {
      console.error("Borrow failed:", e);
      alert("Erreur lors de l'emprunt");
    } finally {
      setBorrowing(null);
    }
  };

  const filteredAndSortedBooks = books
    .filter(
      (b) =>
        (b.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.author || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const statusA = (a.available_copies || 0) > 0 ? 1 : 0;
      const statusB = (b.available_copies || 0) > 0 ? 1 : 0;
      return statusB - statusA;
    });

  const recentLoans = userLoans.slice(0, 3);

  const isBorrowedByCurrentUser = (bookId) => {
    return userLoans.some(
      (loan) =>
        loan.book?.id === bookId && !loan.return_date
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1a1b41] rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  const getLoanStatus = (loan) => {
    if (loan.return_date) return { color: "green", label: "Retourné", Icon: CheckCircle };
    if (new Date(loan.due_date) < new Date()) return { color: "red", label: "En retard", Icon: AlertCircle };
    return { color: "blue", label: "En cours", Icon: Clock };
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-sm text-gray-600 mt-1">
                Bienvenue, <span className="text-[#1a1b41] font-semibold">{user?.username || "Invité"}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* User Card */}
              <div className="hidden sm:flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#1a1b41] to-[#2a2b51] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{user?.username?.charAt(0).toUpperCase() || "I"}</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user?.username || "Invité"}</p>
                  <p className="text-xs text-gray-500">Membre actif</p>
                </div>
              </div>
              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#1a1b41] bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { value: totalBorrowed, label: "Livres empruntés", badge: "Total", color: "indigo", Icon: BookOpen },
            { value: activeLoan, label: "En cours", badge: "Actif", color: "blue", Icon: Clock },
            { value: returned, label: "Retournés", badge: "OK", color: "green", Icon: CheckCircle },
            { value: overdue, label: "En retard", badge: "!", color: "red", Icon: AlertCircle },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center`}>
                  <stat.Icon className={`text-${stat.color}-600`} size={24} />
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold bg-${stat.color}-50 text-${stat.color}-700`}>
                  {stat.badge}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className={`text-sm font-medium text-${stat.color}-600`}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Activité récente</h2>
              <button
                onClick={() => setShowBooks(!showBooks)}
                className="flex items-center gap-2 text-sm font-medium text-[#1a1b41] hover:text-[#2a2b51] transition-colors"
              >
                <TrendingUp size={16} />
                {showBooks ? "Masquer" : "Explorer les livres"}
              </button>
            </div>

            {recentLoans.length > 0 ? (
              <div className="space-y-3">
                {recentLoans.map((loan) => {
                  const status = getLoanStatus(loan);
                  return (
                    <div key={loan.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className={`w-10 h-10 rounded-lg bg-${status.color}-50 flex items-center justify-center flex-shrink-0`}>
                        <status.Icon className={`text-${status.color}-600`} size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {loan.return_date ? "Retourné" : "Emprunté"} «{loan.book?.title || "Livre inconnu"}»
                        </p>
                        <p className={`text-xs text-${status.color}-600 mt-0.5`}>
                          {loan.return_date
                            ? new Date(loan.return_date).toLocaleDateString()
                            : `À rendre : ${new Date(loan.due_date).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">Aucun emprunt récent</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 px-1">Actions rapides</h2>
            
            {[
              { label: "Explorer les livres", sub: `Parcourir ${books.length} livres`, route: "/user/books", color: "indigo", Icon: BookOpen },
              { label: "Mes emprunts", sub: `${activeLoan} en cours`, route: "/user/loans", color: "blue", Icon: Calendar },
              { label: "Mon profil", sub: "Gérer mes infos", route: "/user/profile", color: "green", Icon: UserIcon },
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={() => navigate(action.route)}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 hover:border-[#1a1b41] rounded-xl shadow-sm hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 rounded-lg bg-${action.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.Icon className={`text-${action.color}-600`} size={22} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-gray-900">{action.label}</p>
                  <p className={`text-xs text-${action.color}-600 mt-0.5`}>{action.sub}</p>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-[#1a1b41] transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Books Explorer */}
        {showBooks && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fadeIn">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <h2 className="text-lg font-bold text-gray-900">Explorer les livres</h2>
              <div className="relative max-w-xs w-full">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un livre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value || "")}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#1a1b41] focus:ring-2 focus:ring-[#1a1b41]/20 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedBooks.slice(0, 6).map((book) => {
                const alreadyBorrowedByUser = isBorrowedByCurrentUser(book.id);
                const canBorrow = book.available_copies > 0 && !alreadyBorrowedByUser;

                return (
                  <div key={book.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-16 h-22 bg-gradient-to-br from-[#1a1b41] to-[#2a2b51] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                      {book.image_url ? (
                        <img src={book.image_url} alt={book.title} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <BookOpen size={24} className="text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <p className="text-sm font-bold text-gray-900 truncate">{book.title || "Sans titre"}</p>
                      <p className="text-xs text-gray-500 mb-2">{book.author || "Auteur inconnu"}</p>
                      <div className="mt-auto">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${canBorrow ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                            {alreadyBorrowedByUser ? "Déjà emprunté" : canBorrow ? "Disponible" : "Indisponible"}
                          </span>
                          <span className="text-xs text-gray-500">{book.available_copies ?? 0}/{book.total_copies ?? "?"}</span>
                        </div>
                        <button
                          disabled={!canBorrow || borrowing === book.id}
                          onClick={() => handleBorrowBook(book.id)}
                          className="w-full py-1.5 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[#1a1b41] text-white hover:bg-[#2a2b51]"
                        >
                          {borrowing === book.id ? "Emprunt..." : alreadyBorrowedByUser ? "Déjà emprunté" : "Emprunter"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredAndSortedBooks.length === 0 && (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">
                  {searchTerm ? "Aucun livre trouvé" : "Aucun livre disponible"}
                </p>
              </div>
            )}

            {filteredAndSortedBooks.length > 6 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate("/user/books")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1b41] text-white font-semibold rounded-xl hover:bg-[#2a2b51] transition-colors"
                >
                  Voir tous les livres
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}