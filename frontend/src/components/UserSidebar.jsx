import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { BookOpen, Calendar, User, LogOut, LayoutDashboard } from "lucide-react";
import "./UserSidebar.css";

export default function UserSidebar() {
    const { logout, user } = useAuth();
    const location = useLocation();

    return (
        <aside className="user-sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">✦</div>
                <span>BiblioTech</span>
            </div>

            <nav className="sidebar-nav">
                <Link
                    to="/user"
                    className={`nav-link ${location.pathname === "/user" ? "active" : ""}`}
                >
                    <LayoutDashboard size={20} />
                    <span>Tableau de bord</span>
                </Link>

                <Link
                    to="/user/books"
                    className={`nav-link ${location.pathname === "/user/books" ? "active" : ""}`}
                >
                    <BookOpen size={20} />
                    <span>Livres</span>
                </Link>

                <Link
                    to="/user/loans"
                    className={`nav-link ${location.pathname === "/user/loans" ? "active" : ""}`}
                >
                    <Calendar size={20} />
                    <span>Mes Emprunts</span>
                </Link>

                <Link
                    to="/user/profile"
                    className={`nav-link ${location.pathname === "/user/profile" ? "active" : ""}`}
                >
                    <User size={20} />
                    <span>Profil</span>
                </Link>
            </nav>

            <div className="sidebar-footer">
                <button onClick={logout} className="logout-btn">
                    <LogOut size={18} />
                    <span>Déconnexion</span>
                </button>
            </div>
        </aside>
    );
}
