import { useState, useEffect } from "react";
import { getBooks } from "../../api/books.api";
import { Link, useNavigate } from "react-router-dom";
import heroBg from "../../assets/hero-bg.jpg";
import { BookOpen, ShieldCheck, Users, ArrowRight, Library, Search, Clock, Book, Check, Star, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function Home() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await getBooks();
                // Robust data extraction
                let data = [];
                if (Array.isArray(response)) {
                    data = response;
                } else if (Array.isArray(response?.data)) {
                    data = response.data;
                } else if (response?.data?.data && Array.isArray(response.data.data)) {
                    data = response.data.data;
                }

                // Take the last 4 added books (assuming higher ID = newer)
                // We create a copy before reversing to avoid mutating potential props reference if any
                setBooks([...data].reverse().slice(0, 4));
            } catch (error) {
                console.error("Failed to fetch books", error);
            }
        };
        fetchBooks();
    }, []);
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo Section - Reserved Space */}
                        <div className="flex-shrink-0 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#1a1b41] to-[#2a2b51] rounded-xl flex items-center justify-center shadow-lg">
                                {/* Logo Placeholder */}
                                <span className="text-white font-bold text-xl">L</span>
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1a1b41] to-[#3a3b61]">
                                BiblioTech
                            </span>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-[#1a1b41] font-medium transition-colors">
                                Fonctionnalités
                            </a>
                            <a href="#about" className="text-gray-600 hover:text-[#1a1b41] font-medium transition-colors">
                                À propos
                            </a>
                            <div className="flex items-center gap-4 ml-4">
                                <Link
                                    to="/login"
                                    className="text-[#1a1b41] font-semibold hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-[#1a1b41] hover:bg-[#2a2b51] text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg shadow-indigo-900/20 transition-all hover:scale-105 active:scale-95"
                                >
                                    S'inscrire
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }}>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gray-900/60"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-medium text-sm mb-8 animate-fade-in-up backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Nouvelle version disponible v2.0
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-tight drop-shadow-lg">
                            Gérez votre bibliothèque <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-200 to-white">
                                avec élégance et simplicité
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                            Une solution moderne et intuitive pour la gestion de livres, d'emprunts et d'utilisateurs.
                            Conçu pour les bibliothèques d'aujourd'hui.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/login"
                                className="w-full sm:w-auto px-8 py-4 bg-[#1a1b41] hover:bg-[#2a2b51] text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-900/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Commencer maintenant
                                <ArrowRight size={20} />
                            </Link>
                            <Link
                                to="/about"
                                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-bold text-lg transition-all hover:-translate-y-1"
                            >
                                En savoir plus
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pourquoi choisir BiblioTech ?</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Tout ce dont vous avez besoin pour gérer efficacement votre collection et vos membres.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Library className="w-8 h-8 text-white" />}
                            title="Gestion Complète"
                            description="Catalogage facile des livres, suivi des exemplaires et organisation par catégories intuitives."
                        />
                        <FeatureCard
                            icon={<Users className="w-8 h-8 text-white" />}
                            title="Suivi des Membres"
                            description="Gérez les profils utilisateurs, l'historique des emprunts et les droits d'accès en toute simplicité."
                        />
                        <FeatureCard
                            icon={<Clock className="w-8 h-8 text-white" />}
                            title="Emprunts Simplifiés"
                            description="Système de prêt et retour fluide avec calcul automatique des dates d'échéance et de retard."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[#1a1b41] font-semibold tracking-wide uppercase text-sm">Guide Rapide</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">Comment ça marche ?</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Commencez à gérer votre bibliothèque en quelques minutes seulement.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-0"></div>

                        <StepCard
                            number="1"
                            title="Inscrivez-vous"
                            description="Créez votre compte administrateur gratuitement pour accéder au tableau de bord."
                        />
                        <StepCard
                            number="2"
                            title="Ajoutez vos livres"
                            description="Utilisez le catalogueur intelligent pour ajouter rapidement vos ouvrages."
                        />
                        <StepCard
                            number="3"
                            title="Gérez les emprunts"
                            description="Suivez les prêts et les retours en temps réel avec des notifications automatiques."
                        />
                    </div>
                </div>
            </section>

            {/* New Arrivals Preview */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Dernières Acquisitions</h2>
                            <p className="text-gray-600">Explorez les nouveautés de notre catalogue.</p>
                        </div>
                        <Link to="/books" className="text-[#1a1b41] font-semibold flex items-center gap-2 hover:translate-x-1 transition-transform">
                            Voir tout le catalogue <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {books.length > 0 ? (
                            books.map((book) => (
                                <BookCard
                                    key={book.id || book._id}
                                    id={book.id || book._id}
                                    title={book.title}
                                    author={book.author}
                                    image={book.image_url}
                                    category={book.category}
                                    color={['bg-orange-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100'][Math.floor(Math.random() * 4)]}
                                />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500 py-10">Chargement des dernières pépites...</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-[#fafafa] relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ce qu'ils en pensent</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Rejoignez des centaines de bibliothécaires satisfaits.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialCard
                            name="Sophie Martin"
                            role="Bibliothécaire Municipale"
                            content="BiblioTech a révolutionné notre gestion quotidienne. L'interface est si intuitive que nos bénévoles l'ont maîtrisée en une heure !"
                            rating={5}
                        />
                        <TestimonialCard
                            name="Thomas Dubois"
                            role="Directeur d'École"
                            content="Enfin un outil moderne pour notre CDI. Le suivi des retards est particulièrement efficace pour récupérer les livres."
                            rating={5}
                        />
                        <TestimonialCard
                            name="Léa Bernard"
                            role="Gestionnaire de Collection"
                            content="Le design est magnifique et les fonctionnalités sont exactement ce dont nous avions besoin. Un grand bravo à l'équipe."
                            rating={4}
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Questions Fréquentes</h2>
                        <p className="text-lg text-gray-600">
                            Nous avons les réponses à vos questions.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <FaqItem
                            question="Est-ce que BiblioTech est gratuit ?"
                            answer="BiblioTech propose une version gratuite pour les petites bibliothèques associatives. Pour les structures plus importantes, nous proposons des forfaits adaptés."
                        />
                        <FaqItem
                            question="Puis-je importer mes données existantes ?"
                            answer="Oui, nous proposons un outil d'importation compatible avec les formats CSV et Excel pour migrer votre catalogue facilement."
                        />
                        <FaqItem
                            question="L'application fonctionne-t-elle sur mobile ?"
                            answer="Absolument ! BiblioTech est une application web responsive qui fonctionne parfaitement sur tablettes et smartphones."
                        />
                        <FaqItem
                            question="Comment contacter le support ?"
                            answer="Notre équipe de support est disponible 24/7 via le chat intégré ou par email pour répondre à toutes vos interrogations."
                        />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-[#1a1b41] text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <StatCard number="5k+" label="Livres" />
                        <StatCard number="1.2k" label="Membres Actifs" />
                        <StatCard number="15k+" label="Emprunts" />
                        <StatCard number="99%" label="Satisfaction" />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
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
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
                            <a href="#" className="hover:text-white transition-colors">Conditions</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-[#1a1b41] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-900/20 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
}

function StatCard({ number, label }) {
    return (
        <div className="p-6">
            <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{number}</div>
            <div className="text-indigo-200 font-medium">{label}</div>
        </div>
    );
}

function StepCard({ number, title, description }) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative z-10 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#1a1b41] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-md shadow-indigo-900/20">
                {number}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
}


function BookCard({ id, title, author, image, category, color = "bg-indigo-50" }) {
    const navigate = useNavigate();
    
    return (
        <div onClick={() => navigate(`/books/${id}`)} className="group cursor-pointer">
            <div className={`aspect-[2/3] ${!image ? color : 'bg-gray-100'} rounded-xl mb-4 relative overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1`}>
                {image ? (
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <BookOpen size={48} className="text-gray-800/20 mb-4" />
                        <h3 className="font-serif font-bold text-gray-800 text-lg leading-tight mb-1 line-clamp-2">{title}</h3>
                        <p className="text-sm text-gray-600 font-medium">{author}</p>
                    </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#1a1b41]/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-semibold px-4 py-2 border border-white/30 rounded-lg">Voir détails</span>
                </div>
            </div>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-gray-900 line-clamp-1 group-hover:text-[#1a1b41] transition-colors">{title}</h4>
                    <p className="text-sm text-gray-500">{author}</p>
                    {category && <span className="text-xs text-indigo-500 font-semibold mt-1 inline-block">{category}</span>}
                </div>
            </div>
        </div>
    );
}

function TestimonialCard({ name, role, content, rating }) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex gap-1 mb-4 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < rating ? "currentColor" : "none"} className={i < rating ? "" : "text-gray-300"} />
                ))}
            </div>
            <p className="text-gray-700 italic mb-6 leading-relaxed">"{content}"</p>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                    {name.charAt(0)}
                </div>
                <div>
                    <div className="font-bold text-gray-900 text-sm">{name}</div>
                    <div className="text-gray-500 text-xs">{role}</div>
                </div>
            </div>
        </div>
    );
}



function FaqItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 hover:bg-gray-50 transition-colors"
            >
                {question}
                {isOpen ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48' : 'max-h-0'}`}
            >
                <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-100/50">
                    {answer}
                </div>
            </div>
        </div>
    );
}
