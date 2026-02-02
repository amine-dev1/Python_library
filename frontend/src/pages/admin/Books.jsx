import { useState, useEffect } from "react";
import { getBooks, createBook, updateBook, deleteBook } from "../../api/books.api";
import { BookOpen, Plus, Edit2, Trash2, X, Search, Book } from "lucide-react";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    description: "",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getBooks();
      const booksData = Array.isArray(response) ? response : response?.data || [];
      setBooks(booksData);
    } catch (error) {
      console.error("Erreur lors du chargement des livres:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setModalMode("create");
    setFormData({ title: "", author: "", category: "", isbn: "", description: "" });
    setShowModal(true);
  };

  const handleEdit = (book) => {
    setModalMode("edit");
    setSelectedBook(book);
    setFormData({
      title: book.title || "",
      author: book.author || "",
      category: book.category || "",
      isbn: book.isbn || "",
      description: book.description || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        await createBook(formData);
      } else {
        await updateBook(selectedBook._id || selectedBook.id, formData);
      }
      setShowModal(false);
      fetchBooks();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) return;
    try {
      await deleteBook(id);
      fetchBooks();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#1a1b41] mx-auto mb-4"></div>
            <BookOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#1a1b41]" size={24} />
          </div>
          <p className="text-gray-600 font-medium">Chargement des livres...</p>
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
              <Book className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Gestion des Livres
              </h1>
              <p className="text-gray-500 text-sm sm:text-base mt-1">
                Gérez votre bibliothèque de livres
              </p>
            </div>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-2xl p-4 shadow-sm border border-gray-100" style={{background:'#1a1b41'}}>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1"style={{color:'#ffffff'}}>Total Livres</p>
            <p className="text-2xl font-bold text-purple-600">{books.length}</p>
          </div>
          <div className=" rounded-2xl p-4 shadow-sm border border-gray-100" style={{background:'#1a1b41'}}>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1"style={{color:'#ffffff'}}>Disponibles</p>
            <p className="text-2xl font-bold text-green-600">
              {books.filter(b => b.available !== false).length}
            </p>
          </div>
          <div className=" rounded-2xl p-4 shadow-sm border border-gray-100" style={{background:'#1a1b41'}}>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1"style={{color:'#ffffff'}}>Empruntés</p>
            <p className="text-2xl font-bold text-orange-600">
              {books.filter(b => b.available === false).length}
            </p>
          </div>
          <div className=" rounded-2xl p-4 shadow-sm border border-gray-100" style={{background:'#1a1b41'}}>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1"style={{color:'#ffffff'}}>Catégories</p>
            <p className="text-2xl font-bold text-purple-600">
              {new Set(books.map(b => b.category)).size}
            </p>
          </div>
        </div>

        {/* Barre de recherche et bouton ajout */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Bar améliorée */}
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Rechercher par titre, auteur ou catégorie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1b41] focus:border-transparent transition-all placeholder:text-gray-400 text-sm font-medium"
              />
            </div>

            {/* Bouton Ajouter stylisé */}
            <button
              onClick={handleCreate}
              className="bg-gradient-to-r from-[#1a1b41] to-[#2a2b51] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
              <span>Ajouter un livre</span>
            </button>
          </div>
        </div>

        {/* Grille de livres améliorée */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-16 text-center">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun livre trouvé</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? "Essayez une autre recherche" : "Commencez par ajouter votre premier livre"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreate}
                className="bg-[#1a1b41] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#252753] transition-colors inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Ajouter un livre
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredBooks.map((book) => (
              <div
                key={book._id || book.id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Card Header avec icône */}
                <div className="bg-gradient-to-br from-[#1a1b41] to-[#2a2b51] p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="bg-white/10 backdrop-blur-sm w-14 h-14 rounded-xl flex items-center justify-center mb-3">
                      <BookOpen size={24} className="text-white" />
                    </div>
                    <h3 className="font-bold text-white text-lg mb-1 line-clamp-2 leading-tight">
                      {book.title}
                    </h3>
                    <p className="text-white/70 text-sm font-medium">{book.author}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  {/* Category Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center text-xs font-bold bg-[#1a1b41] text-white px-3 py-1.5 rounded-full">
                      {book.category}
                    </span>
                    {book.available !== undefined && (
                      <span
                        className={`inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full ${
                          book.available
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {book.available ? "✓ Disponible" : "⊗ Emprunté"}
                      </span>
                    )}
                  </div>

                  {/* ISBN */}
                  {book.isbn && (
                    <div className="mb-4 bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">ISBN</p>
                      <p className="text-xs font-mono font-bold text-gray-700">{book.isbn}</p>
                    </div>
                  )}

                  {/* Description */}
                  {book.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{book.description}</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(book)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-[#1a1b41] text-gray-700 hover:text-white rounded-xl font-semibold transition-all duration-200 group/btn"
                    >
                      <Edit2 size={16} className="group-hover/btn:rotate-12 transition-transform" />
                      <span className="text-sm">Modifier</span>
                    </button>
                    <button
                      onClick={() => handleDelete(book._id || book.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl font-semibold transition-all duration-200 group/btn"
                    >
                      <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                      <span className="text-sm">Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal amélioré */}
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
                        {modalMode === "create" ? "Nouveau livre" : "Modifier le livre"}
                      </h2>
                      <p className="text-white/70 text-sm mt-0.5">
                        {modalMode === "create" ? "Ajoutez un livre à votre bibliothèque" : "Mettez à jour les informations"}
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
                  <label className="block text-sm font-bold text-gray-700">
                    Titre du livre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1b41] focus:border-transparent transition-all font-medium"
                    placeholder="Ex: Clean Code"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Auteur <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1b41] focus:border-transparent transition-all font-medium"
                    placeholder="Ex: Robert C. Martin"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Catégorie <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1b41] focus:border-transparent transition-all font-medium"
                      placeholder="Ex: Programming"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">ISBN</label>
                    <input
                      type="text"
                      value={formData.isbn}
                      onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1b41] focus:border-transparent transition-all font-medium font-mono text-sm"
                      placeholder="978-0132350884"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1b41] focus:border-transparent transition-all resize-none font-medium"
                    placeholder="Décrivez brièvement le livre..."
                  />
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
                    {modalMode === "create" ? "Créer le livre" : "Enregistrer"}
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