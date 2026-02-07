import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBookById } from "../../api/books.api";
import { ArrowLeft, BookOpen, Calendar, User, Tag, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function BookDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await getBookById(id);
                // Handle response structure
                let data = response;
                if (response?.data) data = response.data;
                
                setBook(data);
            } catch (error) {
                console.error("Failed to fetch book details", error);
                toast.error("Impossible de charger les détails du livre.");
                navigate("/books"); // Redirect back to catalog/books on error
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBook();
        }
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-[#1a1b41] mb-4"></div>
                <p className="text-gray-500 font-medium">Chargement des détails...</p>
            </div>
        );
    }

    if (!book) return null;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1a1b41] mb-8 transition-colors font-medium"
                >
                    <ArrowLeft size={20} />
                    Retour à l'accueil
                </Link>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="md:flex">
                        {/* Image Section */}
                        <div className="md:w-1/3 bg-gray-100 relative min-h-[400px]">
                            {book.image_url ? (
                                <img 
                                    src={book.image_url} 
                                    alt={book.title} 
                                    className="w-full h-full object-cover absolute inset-0"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-8">
                                    <BookOpen size={64} className="mb-4 opacity-50" />
                                    <p className="font-serif font-bold text-center">Pas d'image disponible</p>
                                </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="md:w-2/3 p-8 md:p-12 flex flex-col">
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wide mb-3">
                                    {book.category}
                                </span>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                                    {book.title}
                                </h1>
                                <div className="flex items-center gap-2 text-gray-500 font-medium text-lg">
                                    <User size={18} />
                                    <span>{book.author}</span>
                                </div>
                            </div>

                            <div className="prose prose-indigo max-w-none text-gray-600 mb-8 leading-relaxed">
                                <h3 className="text-gray-900 font-bold text-lg mb-2">Description</h3>
                                <p>
                                    {book.description || "Aucune description disponible pour ce livre."}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-indigo-500">
                                        <Tag size={20} />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs font-bold uppercase">ISBN</p>
                                        <p className="font-semibold text-gray-700">{book.isbn || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-indigo-500">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs font-bold uppercase">Année</p>
                                        <p className="font-semibold text-gray-700">{book.publication_year || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${book.available_copies > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className={`font-bold ${book.available_copies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {book.available_copies > 0 ? 'Disponible' : 'Indisponible'}
                                    </span>
                                    <span className="text-gray-400 text-sm ml-1">
                                        ({book.available_copies} sur {book.total_copies} ex.)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
