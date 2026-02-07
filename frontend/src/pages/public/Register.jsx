import { register as registerApi } from "../../api/auth.api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, ArrowLeft } from "lucide-react";
import authBg from "../../assets/wooden-surface-with-books-glasses-pen.jpg";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await registerApi(formData);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans">
      {/* Left Side - Background Image with Overlay */}
      <div 
        className="lg:w-1/2 min-h-[300px] lg:min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: `url(${authBg})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1b41]/95 to-[#2a2b51]/90"></div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-white">
          <div className="max-w-md text-center">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center justify-center gap-3 mb-6 hover:opacity-80 transition-opacity">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border border-white/20">
                <span className="text-white font-bold text-3xl">L</span>
              </div>
              <span className="text-4xl font-bold text-white">
                BiblioTech
              </span>
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Rejoignez notre communauté
            </h1>
            <p className="text-xl text-indigo-200 leading-relaxed">
              Créez votre compte et commencez à gérer votre bibliothèque dès aujourd'hui.
            </p>

            {/* Features */}
            <div className="mt-10 space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-indigo-100">Interface intuitive et facile à utiliser</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-indigo-100">Support 24/7 pour vous accompagner</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-indigo-100">Sécurité et confidentialité garanties</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link - Visible on mobile */}
        <Link 
          to="/" 
          className="absolute top-6 left-6 lg:hidden inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium z-20"
        >
          <ArrowLeft size={20} />
          Retour
        </Link>
      </div>

      {/* Right Side - Register Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Back Link - Desktop */}
          <Link 
            to="/" 
            className="hidden lg:inline-flex items-center gap-2 text-gray-600 hover:text-[#1a1b41] transition-colors font-medium mb-8"
          >
            <ArrowLeft size={20} />
            Retour à l'accueil
          </Link>

          {/* Register Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mt-8 lg:mt-0">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Créer un compte</h2>
              <p className="text-gray-600">Rejoignez-nous dès aujourd'hui</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a1b41] focus:ring-2 focus:ring-[#1a1b41]/20 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Choisissez un nom d'utilisateur"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a1b41] focus:ring-2 focus:ring-[#1a1b41]/20 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                  placeholder="votre@email.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a1b41] focus:ring-2 focus:ring-[#1a1b41]/20 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Créez un mot de passe sécurisé"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Minimum 6 caractères recommandés
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a1b41] hover:bg-[#2a2b51] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Inscription...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    S'inscrire
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-600 text-sm">
                Vous avez déjà un compte ?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-[#1a1b41] hover:text-[#2a2b51] font-bold transition-colors"
                >
                  Connectez-vous
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}