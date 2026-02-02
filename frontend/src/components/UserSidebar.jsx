import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  BookOpen,
  Calendar,
  User,
  LogOut,
  LayoutDashboard,
  Sparkles,
  Users,
  Book,
  Library,
} from "lucide-react";

// ─── Shared palette ───
const C = {
  bg: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
  card: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.15)",
  borderPurple: "rgba(167,139,250,0.3)",
  text: "#ffffff",
  textSub: "rgba(255,255,255,0.55)",
  accent: "#a78bfa",
  accentDark: "#6c63ff",
  pink: "#ec4899",
  green: "#34d399",
  blue: "#60a5fa",
  amber: "#fbbf24",
  red: "#f87171",
};

// ─── Menus selon le rôle ───
const getNavItems = (isAdmin) => {
  if (isAdmin) {
    return [
      { path: "/admin", Icon: LayoutDashboard, label: "Dashboard Admin", color: C.accentDark },
      { path: "/admin/users",     Icon: Users,           label: "Utilisateurs",     color: C.pink },
      { path: "/admin/books",     Icon: Book,            label: "Livres",           color: C.blue },
      { path: "/admin/loans",     Icon: Library,         label: "Emprunts",         color: C.green },
    ];
  }

  return [
    { path: "/user",            Icon: LayoutDashboard, label: "Tableau de bord", color: C.accentDark },
    { path: "/user/books",      Icon: BookOpen,        label: "Livres",          color: C.blue },
    { path: "/user/loans",      Icon: Calendar,        label: "Mes Emprunts",    color: C.green },
    { path: "/user/profile",    Icon: User,            label: "Profil",          color: C.amber },
  ];
};

const styles = {
  sidebar: {
    width: "250px",
    height: "100vh",
    background: "#0f0c29",
    backdropFilter: "blur(20px)",
    borderRight: `1px solid ${C.borderPurple}`,
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 100,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },

  blobTop: { position: "absolute", top: "-60px", left: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(circle, ${C.accentDark}12 0%, transparent 70%)`, filter: "blur(30px)", pointerEvents: "none" },
  blobBottom: { position: "absolute", bottom: "-60px", right: "-60px", width: "180px", height: "180px", borderRadius: "50%", background: `radial-gradient(circle, ${C.pink}0a 0%, transparent 70%)`, filter: "blur(28px)", pointerEvents: "none" },

  logoRow: { display: "flex", alignItems: "center", gap: "12px", padding: "0 8px", marginBottom: "28px", position: "relative", zIndex: 1 },
  logoIconWrap: { position: "relative", width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center" },
  logoIconGlow: { position: "absolute", inset: "-4px", background: `${C.accentDark}28`, borderRadius: "50%", filter: "blur(10px)" },
  logoIcon: { position: "relative", width: "40px", height: "40px", borderRadius: "12px", background: `linear-gradient(135deg, ${C.accentDark}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 14px ${C.accentDark}44`, transition: "transform 0.2s" },
  logoTitle: { fontSize: "1.15rem", fontWeight: 800, background: `linear-gradient(90deg, #fff, ${C.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 },
  logoSub: { fontSize: "0.62rem", color: C.textSub, margin: "1px 0 0", fontWeight: 500 },

  userCard: { position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "10px", background: C.card, backdropFilter: "blur(12px)", border: `1px solid ${C.borderPurple}`, borderRadius: "12px", padding: "10px 12px", marginBottom: "24px", transition: "background 0.2s" },
  userAvatar: { width: "36px", height: "36px", borderRadius: "9px", background: `linear-gradient(135deg, ${C.accentDark}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem", fontWeight: 700, color: C.text, flexShrink: 0, boxShadow: `0 3px 10px ${C.accentDark}33` },
  userName: { fontSize: "0.78rem", fontWeight: 600, color: C.text, margin: "0 0 1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  userRole: { fontSize: "0.62rem", color: C.textSub, margin: 0 },

  nav: { flex: 1, display: "flex", flexDirection: "column", gap: "4px", position: "relative", zIndex: 1 },

  // ── IMPORTANT : navLink est bien une FONCTION ──
  navLink: (isActive, color) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "10px",
    textDecoration: "none",
    position: "relative",
    overflow: "hidden",
    background: isActive ? `${color}12` : "transparent",
    border: isActive ? `1px solid ${color}30` : "1px solid transparent",
    transition: "background 0.2s, border-color 0.2s, transform 0.15s",
    cursor: "pointer",
  }),

  navActiveBar: (color) => ({
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: "3px",
    height: "28px",
    borderRadius: "0 4px 4px 0",
    background: color,
    boxShadow: `0 0 8px ${color}44`,
  }),

  navIconWrap: (isActive, color) => ({
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    flexShrink: 0,
    background: isActive ? `${color}22` : "rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s, transform 0.15s",
  }),

  navLabel: (isActive, color) => ({
    fontSize: "0.78rem",
    fontWeight: 600,
    color: isActive ? color : C.textSub,
    transition: "color 0.2s",
    flex: 1,
  }),

  navDot: (color) => ({
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: color,
    boxShadow: `0 0 6px ${color}66`,
    animation: "pulse 2s ease-in-out infinite",
  }),

  footer: { position: "relative", zIndex: 1, paddingTop: "16px", borderTop: `1px solid ${C.border}` },
  logoutBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "10px",
    background: "transparent",
    border: `1px solid ${C.red}33`,
    color: C.red,
    cursor: "pointer",
    fontSize: "0.78rem",
    fontWeight: 600,
    transition: "background 0.2s, border-color 0.2s, transform 0.15s",
  },
  logoutIconWrap: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: `${C.red}12`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s",
  },
};

const globalCSS = `
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
  .sidebar-logo-icon:hover { transform: scale(1.08); }
  .sidebar-user-card:hover { background: rgba(255,255,255,0.1) !important; }
  .sidebar-nav-link:hover { background: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.18) !important; transform: translateX(3px); }
  .sidebar-nav-link:hover .sidebar-nav-icon { background: rgba(255,255,255,0.12) !important; transform: scale(1.08); }
  .sidebar-nav-link:hover .sidebar-nav-label { color: #fff !important; }
  .sidebar-logout:hover { background: rgba(247,129,129,0.1) !important; border-color: ${C.red} !important; transform: translateX(3px); }
  .sidebar-logout:hover .sidebar-logout-icon { background: rgba(247,129,129,0.22) !important; }
`;

export default function UserSidebar() {
  const { logout, user } = useAuth();
  const location = useLocation();

  // Vérifie si l'utilisateur est admin
  // Adaptez cette condition selon votre structure réelle de user
  const isAdmin = user?.role === "admin" || user?.role === "ADMIN" || user?.isAdmin === true;

  const NAV_ITEMS = getNavItems(isAdmin);

  return (
    <aside style={styles.sidebar}>
      <style>{globalCSS}</style>

      {/* decorative blobs */}
      <div style={styles.blobTop} />
      <div style={styles.blobBottom} />

      {/* logo */}
      <div style={styles.logoRow}>
        <div style={styles.logoIconWrap}>
          <div style={styles.logoIconGlow} />
          <div className="sidebar-logo-icon" style={styles.logoIcon}>
            <Sparkles size={20} color="#fff" strokeWidth={2.5} />
          </div>
        </div>
        <div>
          <h1 style={styles.logoTitle}>BiblioTech</h1>
          <p style={styles.logoSub}>Système de gestion</p>
        </div>
      </div>

      {/* user card */}
      {user && (
        <div className="sidebar-user-card" style={styles.userCard}>
          <div style={styles.userAvatar}>{user.username?.charAt(0)?.toUpperCase() || "?"}</div>
          <div style={{ minWidth: 0 }}>
            <p style={styles.userName}>{user.username || "Utilisateur"}</p>
            <p style={styles.userRole}>{isAdmin ? "Administrateur" : "Membre actif"}</p>
          </div>
        </div>
      )}

      {/* navigation */}
      <nav style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="sidebar-nav-link"
              style={styles.navLink(isActive, item.color)} // ← fonction appelée correctement
            >
              {isActive && <div style={styles.navActiveBar(item.color)} />}

              <div className="sidebar-nav-icon" style={styles.navIconWrap(isActive, item.color)}>
                <item.Icon size={17} color={isActive ? item.color : C.textSub} strokeWidth={2.2} />
              </div>

              <span className="sidebar-nav-label" style={styles.navLabel(isActive, item.color)}>
                {item.label}
              </span>

              {isActive && <div style={styles.navDot(item.color)} />}
            </Link>
          );
        })}
      </nav>

      {/* logout */}
      <div style={styles.footer}>
        <button className="sidebar-logout" style={styles.logoutBtn} onClick={logout}>
          <div className="sidebar-logout-icon" style={styles.logoutIconWrap}>
            <LogOut size={17} color={C.red} strokeWidth={2.2} />
          </div>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}