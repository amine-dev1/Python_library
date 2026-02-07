import { useState, useEffect } from "react";
import { getBooks } from "../../api/books.api";
import { borrowBook } from "../../api/loans.api";
import {
  BookOpen,
  User as UserIcon,
  Calendar,
  Search,
  Filter,
  BookMarked,
  Sparkles,
  Library,
  ChevronDown,
} from "lucide-react";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (e) {
      console.error("Erreur chargement livres :", e);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId) => {
    setBorrowing(bookId);
    try {
      await borrowBook(bookId);
      await loadBooks();
      setNotification("✓  Livre emprunté avec succès !");
      setTimeout(() => setNotification(null), 3000);
    } catch (e) {
      console.error(e);
      alert("Impossible d'emprunter ce livre.");
    } finally {
      setBorrowing(null);
    }
  };

  const filteredBooks = books.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === "all" || b.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const categories = ["all", ...new Set(books.map((b) => b.category))];
  const availCount = filteredBooks.filter((b) => b.available_copies > 0).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1a1b41] rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Chargement des livres...</p>
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
              <Library size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bibliothèque</h1>
              <p className="text-sm text-gray-600">Explorez notre collection de livres</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search & Filter Row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre ou auteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a1b41] focus:ring-2 focus:ring-[#1a1b41]/20 outline-none transition-all text-sm"
            />
          </div>
          <div className="relative min-w-[200px]">
            <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 focus:border-[#1a1b41] focus:ring-2 focus:ring-[#1a1b41]/20 outline-none transition-all text-sm appearance-none cursor-pointer bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "📚 Toutes les catégories" : cat}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 flex-wrap bg-white border border-gray-100 rounded-2xl p-4 mb-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <BookMarked size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {filteredBooks.length} <span className="text-xs text-gray-500 font-normal">livre{filteredBooks.length !== 1 ? "s" : ""} trouvé{filteredBooks.length !== 1 ? "s" : ""}</span>
              </p>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Sparkles size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-600">
                {availCount} <span className="text-xs text-gray-500 font-normal">disponible{availCount !== 1 ? "s" : ""}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun livre trouvé</h3>
            <p className="text-sm text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => {
              const avail = book.available_copies > 0;
              const pct = (book.available_copies / book.total_copies) * 100;

              return (
                <div key={book.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col">
                  {/* Top Accent */}
                  <div className={`h-1 ${avail ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}></div>
                  
                  {/* Book Cover Image */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                    {book.image_url ? (
                      <img 
                        src={book.image_url} 
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`absolute inset-0 ${book.image_url ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br from-[#1a1b41] to-[#2a2b51]`}>
                      <BookOpen size={48} className="text-white/40" />
                    </div>
                    {/* Category Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-sm text-indigo-700 border border-indigo-100 shadow-sm">
                        {book.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    {/* Title */}
                    <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-3 group-hover:text-[#1a1b41] transition-colors">
                      {book.title}
                    </h3>

                    {/* Author */}
                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
                      <UserIcon size={14} />
                      <span className="truncate">{book.author}</span>
                    </div>

                    {/* Year */}
                    <div className="flex items-center gap-2 mb-4 text-xs text-gray-600">
                      <Calendar size={14} />
                      <span>{book.publication_year}</span>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-auto">
                      {/* Availability */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-600">Disponibilité</span>
                        <span className={`text-xs font-bold ${avail ? 'text-green-600' : 'text-red-600'}`}>
                          {book.available_copies} / {book.total_copies}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${avail ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>

                      {/* Borrow Button */}
                      <button
                        disabled={!avail || borrowing === book.id}
                        onClick={() => handleBorrow(book.id)}
                        className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                          avail
                            ? 'bg-[#1a1b41] text-white hover:bg-[#2a2b51] active:scale-95'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {borrowing === book.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Traitement...
                          </>
                        ) : avail ? (
                          <>
                            <BookOpen size={16} />
                            Emprunter
                          </>
                        ) : (
                          "Indisponible"
                        )}
                      </button>
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