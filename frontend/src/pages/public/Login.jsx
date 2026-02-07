import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as apiLogin, me as apiMe } from "../../api/auth.api";
import { useAuth } from "../../auth/AuthContext";
import { LogIn, ArrowLeft } from "lucide-react";
import authBg from "../../assets/wooden-surface-with-books-glasses-pen.jpg";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await apiLogin({ username, password });
      const { access_token } = response.data;

      localStorage.setItem("access_token", access_token);
      const userResponse = await apiMe();
      const user = userResponse.data || userResponse;

      login(access_token, user);

      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Please try again.");
      localStorage.removeItem("access_token");
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
              Gérez votre bibliothèque avec élégance
            </h1>
            <p className="text-xl text-indigo-200 leading-relaxed">
              Une solution moderne et intuitive pour la gestion de livres, d'emprunts et d'utilisateurs.
            </p>

            {/* Features */}
            <div className="mt-10 space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-indigo-100">Catalogage facile et suivi des exemplaires</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-indigo-100">Gestion des membres et historique complet</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-indigo-100">Système de prêt automatisé et intuitif</p>
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

      {/* Right Side - Login Form */}
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

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mt-8 lg:mt-0">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Bon retour !</h2>
              <p className="text-gray-600">Connectez-vous pour accéder à votre espace</p>
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a1b41] focus:ring-2 focus:ring-[#1a1b41]/20 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Votre nom d'utilisateur"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a1b41] focus:ring-2 focus:ring-[#1a1b41]/20 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Votre mot de passe"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-[#1a1b41] hover:text-[#2a2b51] font-medium transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a1b41] hover:bg-[#2a2b51] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Connexion...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    Se connecter
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-600 text-sm">
                Pas encore de compte ?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-[#1a1b41] hover:text-[#2a2b51] font-bold transition-colors"
                >
                  Inscrivez-vous
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}