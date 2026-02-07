import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getBooks, createBook, updateBook, deleteBook } from "../../api/books.api";
import { BookOpen, Plus, Edit2, Trash2, X, Search, Book, Upload, Image as ImageIcon } from "lucide-react";
import axios from "axios";

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
    image_url: "",
  });
  const [uploading, setUploading] = useState(false);

  // Delete Confirmation Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

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
    setFormData({ title: "", author: "", category: "", isbn: "", description: "", image_url: "" });
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
      image_url: book.image_url || "",
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    setUploading(true);
    const loadingToast = toast.loading("Téléchargement de l'image...");

    try {
      const response = await axios.post("http://localhost:8000/upload", formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setFormData({ ...formData, image_url: response.data.url });
      toast.success("Image téléchargée avec succès!", { id: loadingToast });
    } catch (error) {
      console.error("Erreur upload:", error);
      toast.error("Erreur lors du téléchargement de l'image", { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(
      modalMode === "create" ? "Création du livre..." : "Mise à jour du livre..."
    );

    try {
      if (modalMode === "create") {
        await createBook(formData);
        toast.success("Livre créé avec succès!", {
          id: loadingToast,
          style: { background: '#10b981', color: '#fff', fontWeight: '600' }
        });
      } else {
        await updateBook(selectedBook._id || selectedBook.id, formData);
        toast.success("Livre mis à jour!", {
          id: loadingToast,
          style: { background: '#3b82f6', color: '#fff', fontWeight: '600' }
        });
      }
      setShowModal(false);
      fetchBooks();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Erreur lors de l'opération", {
        id: loadingToast,
        style: { background: '#ef4444', color: '#fff', fontWeight: '600' }
      });
    }
  };

  const openDeleteModal = (book) => {
    setBookToDelete(book);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;
    setShowConfirmModal(false);

    const loadingToast = toast.loading("Suppression du livre...");

    try {
      await deleteBook(bookToDelete._id || bookToDelete.id);
      toast.success("Livre supprimé avec succès!", {
        id: loadingToast,
        style: { background: '#ef4444', color: '#fff', fontWeight: '600' }
      });
      fetchBooks();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Impossible de supprimer ce livre", {
        id: loadingToast,
        style: { background: '#ef4444', color: '#fff', fontWeight: '600' }
      });
    } finally {
      setBookToDelete(null);
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
        <Toaster containerStyle={{ zIndex: 99999 }} />
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
          <div className="rounded-2xl p-4 shadow-sm border border-gray-100" style={{ background: '#1a1b41' }}>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1" style={{ color: '#ffffff' }}>Total Livres</p>
            <p className="text-2xl font-bold text-purple-600">{books.length}</p>
          </div>
          <div className=" rounded-2xl p-4 shadow-sm border border-gray-100" style={{ background: '#1a1b41' }}>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1" style={{ color: '#ffffff' }}>Disponibles</p>
            <p className="text-2xl font-bold text-green-600">
              {books.filter(b => b.available !== false).length}
            </p>
          </div>
          <div className=" rounded-2xl p-4 shadow-sm border border-gray-100" style={{ background: '#1a1b41' }}>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1" style={{ color: '#ffffff' }}>Empruntés</p>
            <p className="text-2xl font-bold text-orange-600">
              {books.filter(b => b.available === false).length}
            </p>
          </div>
          <div className=" rounded-2xl p-4 shadow-sm border border-gray-100" style={{ background: '#1a1b41' }}>
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1" style={{ color: '#ffffff' }}>Catégories</p>
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
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1b41] focus:border-transparent transition-all placeholder:text-gray-400 text-sm font-medium text-gray-900"
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
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
              >
                {/* Book Image Cover */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  {book.image_url ? (
                    <img 
                      src={book.image_url} 
                      alt={book.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                      <BookOpen size={48} className="mb-2 opacity-20" />
                      <span className="text-xs font-medium opacity-40 uppercase tracking-wider">Pas d'image</span>
                    </div>
                  )}
                  
                  {/* Overlay gradien */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center text-xs font-bold bg-white/90 backdrop-blur-sm text-[#1a1b41] px-2.5 py-1 rounded-full shadow-sm">
                      {book.category}
                    </span>
                  </div>

                  {/* Status Badge */}
                   <div className="absolute top-3 right-3">
                    {book.available !== undefined && (
                      <span
                        className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm ${book.available
                            ? "bg-green-500/90 text-white"
                            : "bg-orange-500/90 text-white"
                          }`}
                      >
                        {book.available ? "Disponible" : "Emprunté"}
                      </span>
                    )}
                  </div>

                  {/* Title & Author on image (bottom) */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-lg leading-tight mb-1 drop-shadow-md line-clamp-2">
                       {book.title}
                    </h3>
                    <p className="text-white/80 text-sm font-medium drop-shadow-md truncate">{book.author}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* ISBN */}
                  {book.isbn && (
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
                      <span className="uppercase font-semibold">ISBN</span>
                      <span className="font-mono font-bold text-gray-700">{book.isbn}</span>
                    </div>
                  )}

                  {/* Description */}
                  {book.description && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">{book.description}</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 mt-auto">
                    <button
                      onClick={() => handleEdit(book)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-[#1a1b41] text-gray-700 hover:text-white rounded-lg font-semibold transition-all duration-200 group/btn"
                    >
                      <Edit2 size={16} className="group-hover/btn:rotate-12 transition-transform" />
                      <span className="text-xs">Modifier</span>
                    </button>
                    <button
                      onClick={() => openDeleteModal(book)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-lg font-semibold transition-all duration-200 group/btn"
                    >
                      <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                      <span className="text-xs">Supprimer</span>
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
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in flex flex-col">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#1a1b41] to-[#2a2b51] text-white p-6 relative overflow-hidden shrink-0">
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
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Left Column - Image Upload */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Couverture</label>
                    <div className="relative group">
                       <div className={`aspect-[2/3] rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center overflow-hidden transition-all ${!formData.image_url ? 'hover:border-[#1a1b41] hover:bg-gray-100' : 'border-none'}`}>
                          {formData.image_url ? (
                            <div className="relative w-full h-full">
                              <img src={formData.image_url} alt="Cover preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/50">Modifier</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center p-4">
                              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-400 group-hover:bg-[#1a1b41] group-hover:text-white transition-colors">
                                <ImageIcon size={24} />
                              </div>
                              <p className="text-xs text-gray-500 font-medium">Glisser ou cliquer pour ajouter</p>
                            </div>
                          )}
                          
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploading}
                          />
                       </div>
                       {uploading && (
                         <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                           <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#1a1b41]"></div>
                         </div>
                       )}
                    </div>
                    
                    {formData.image_url && (
                       <button 
                        type="button" 
                        onClick={() => setFormData({...formData, image_url: ""})}
                        className="w-full mt-2 text-xs text-red-500 hover:text-red-700 font-semibold flex items-center justify-center gap-1"
                      >
                        <Trash2 size={12} /> Supprimer l'image
                      </button>
                    )}
                  </div>

                  {/* Right Column - Form Fields */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">
                        Titre du livre <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1b41] focus:border-transparent transition-all font-medium text-gray-900"
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
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1b41] focus:border-transparent transition-all font-medium text-gray-900"
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
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1b41] focus:border-transparent transition-all font-medium text-gray-900"
                          placeholder="Ex: Programming"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">ISBN</label>
                        <input
                          type="text"
                          value={formData.isbn}
                          onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1b41] focus:border-transparent transition-all font-medium font-mono text-sm text-gray-900"
                          placeholder="978-0132350884"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a1b41] focus:border-transparent transition-all resize-none font-medium text-gray-900"
                        placeholder="Décrivez brièvement le livre..."
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 pt-6 mt-2 border-t border-gray-100">
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

        {/* Delete Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center animate-scale-in">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Supprimer ce livre ?</h3>
              <p className="text-gray-500 mb-6">
                Êtes-vous sûr de vouloir supprimer <span className="font-bold text-gray-800">"{bookToDelete?.title}"</span> ? <br />
                Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                >
                  Supprimer
                </button>
              </div>
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