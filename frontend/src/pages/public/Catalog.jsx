import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Search, ArrowRight, Library, LogIn, User, LayoutDashboard, BookmarkPlus, X } from "lucide-react";
import { getBooks } from "../../api/books.api";
import { createLoan, borrowBook } from "../../api/loans.api";
import toast, { Toaster } from "react-hot-toast";

export default function Catalog() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem("access_token");

    // Borrow Modal State
    const [showBorrowModal, setShowBorrowModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [returnDate, setReturnDate] = useState("");

    // Calculate default return date (14 days)
    useEffect(() => {
        const date = new Date();
        date.setDate(date.getDate() + 14);
        setReturnDate(date.toISOString().split('T')[0]);
    }, []);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await getBooks();
            // Logging for debug
            console.log("Fetched books response:", response);

            // Handle different response structures gracefully
            let data = [];
            if (Array.isArray(response)) {
                data = response;
            } else if (Array.isArray(response?.data)) {
                data = response.data;
            } else if (response?.data?.data && Array.isArray(response.data.data)) {
                // nested data case
                data = response.data.data;
            }

            setBooks(data);

            if (data.length === 0) {
                console.warn("No books found in the response");
            }

        } catch (error) {
            console.error("Failed to fetch books", error);
            toast.error("Impossible de charger le catalogue.");
        } finally {
            setLoading(false);
        }
    };

    const handleBorrowClick = (book) => {
        if (!isAuthenticated) {
            toast.error("Veuillez vous connecter pour emprunter ce livre.");
            setTimeout(() => navigate("/login"), 1500);
            return;
        }

        // Open modal for logged in users
        setSelectedBook(book);
        setShowBorrowModal(true);
    };

    const confirmBorrow = async () => {
        if (!selectedBook) return;

        const loadingToast = toast.loading("Traitement de l'emprunt...");

        try {
            // Use borrowBook for standard users (default 14 days)
            await borrowBook(selectedBook.id || selectedBook._id, 14);

            toast.success("Livre emprunté avec succès !", { id: loadingToast });
            setShowBorrowModal(false);

            // Refresh books to update availability
            fetchBooks();

        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.detail || "Erreur lors de l'emprunt.";
            toast.error(errorMsg, { id: loadingToast });
        }
    };

    const filteredBooks = books.filter(book => {
        const query = searchQuery.toLowerCase();
        return (
            (book.title && book.title.toLowerCase().includes(query)) ||
            (book.author && book.author.toLowerCase().includes(query)) ||
            (book.category && book.category.toLowerCase().includes(query))
        );
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            <Toaster position="top-right" />

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#1a1b41] to-[#2a2b51] rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">L</span>
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1a1b41] to-[#3a3b61]">
                                BiblioTech
                            </span>
                        </Link>

                        <div className="flex items-center gap-4">
                            {isAuthenticated ? (
                                <Link to="/user" className="flex items-center gap-2 text-[#1a1b41] font-medium hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">
                                    <LayoutDashboard size={20} />
                                    <span>Mon Espace</span>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="flex items-center gap-2 text-[#1a1b41] font-medium hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">
                                        <LogIn size={20} />
                                        <span>Connexion</span>
                                    </Link>
                                    <Link to="/register" className="bg-[#1a1b41] hover:bg-[#2a2b51] text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-indigo-900/20 transition-all hover:scale-105">
                                        S'inscrire
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header / Search */}
            <div className="bg-[#1a1b41] py-16 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Notre Catalogue</h1>
                    <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
                        Explorez notre collection complète d'ouvrages et empruntez vos prochains coups de cœur.
                    </p>

                    <div className="max-w-2xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un livre, un auteur..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-indigo-200/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Books Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow w-full">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-[#1a1b41] mb-4"></div>
                        <p className="text-gray-500 font-medium">Chargement de la bibliothèque...</p>
                    </div>
                ) : filteredBooks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredBooks.map((book) => (
                            <CatalogBookCard
                                key={book.id || book._id}
                                book={book}
                                onBorrow={() => handleBorrowClick(book)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun résultat trouvé</h3>
                        <p className="text-gray-500">Essayez de modifier votre recherche.</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">B</span>
                            </div>
                            <span className="text-xl font-bold text-white">BiblioTech</span>
                        </div>
                        <div className="text-sm">
                            © 2026 BiblioTech Inc. Tous droits réservés.
                        </div>
                    </div>
                </div>
            </footer>

            {/* Borrow Modal */}
            {showBorrowModal && selectedBook && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                        <div className="p-6 bg-[#1a1b41] text-white relative">
                            <button
                                onClick={() => setShowBorrowModal(false)}
                                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                            <h3 className="text-2xl font-bold mb-1">Confirmer l'emprunt</h3>
                            <p className="text-indigo-200 text-sm">Vous êtes sur le point d'emprunter :</p>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-4 mb-6">
                                <div className={`w-20 h-28 rounded-lg shadow-md flex-shrink-0 bg-gray-200 overflow-hidden`}>
                                    {selectedBook.image_url ? (
                                        <img src={selectedBook.image_url} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-900">
                                            <BookOpen size={24} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg leading-tight mb-1">{selectedBook.title}</h4>
                                    <p className="text-gray-500 text-sm mb-2">{selectedBook.author}</p>
                                    <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md">
                                        {selectedBook.category || "Général"}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-sm font-medium text-gray-600">Date de retour prévue :</span>
                                    <span className="font-bold text-[#1a1b41]">{new Date(returnDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={confirmBorrow}
                                className="w-full py-3.5 bg-[#1a1b41] hover:bg-[#2a2b51] text-white font-bold rounded-xl shadow-lg shadow-indigo-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <BookmarkPlus size={20} />
                                Confirmer l'emprunt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function CatalogBookCard({ book, onBorrow }) {
    return (
        <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
            <div className="aspect-[2/3] bg-gray-100 relative overflow-hidden">
                {book.image_url ? (
                    <img src={book.image_url} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-gray-50 to-gray-200">
                        <BookOpen size={40} className="text-gray-300 mb-3" />
                        <h3 className="font-serif font-bold text-gray-400 text-base leading-tight line-clamp-2">{book.title}</h3>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${book.available !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {book.available !== false ? 'Disponible' : 'Indisponible'}
                    </span>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-4 flex-grow">
                    <div className="text-xs font-bold text-indigo-500 mb-1 uppercase tracking-wide">{book.category}</div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 line-clamp-2" title={book.title}>{book.title}</h3>
                    <p className="text-gray-500 text-sm font-medium">{book.author}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="text-xs text-gray-400 font-medium">ISBN: {book.isbn || 'N/A'}</div>
                </div>

                <button
                    onClick={onBorrow}
                    disabled={book.available === false}
                    className={`mt-4 w-full py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2
                        ${book.available !== false
                            ? 'bg-[#1a1b41] text-white hover:bg-[#2a2b51] shadow-md shadow-indigo-900/10'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                    {book.available !== false ? (
                        <>
                            <BookmarkPlus size={18} />
                            Emprunter
                        </>
                    ) : (
                        'Déjà emprunté'
                    )}
                </button>
            </div>
        </div>
    );
}
