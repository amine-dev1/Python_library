import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getBooks } from "../../api/books.api";
import { myLoans, borrowBook } from "../../api/loans.api";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  User as UserIcon,
  Calendar,
  CheckCircle,
  Clock,
  Search,
  TrendingUp,
  AlertCircle,
  LogOut,
} from "lucide-react";

// ─── Shared palette (matches Login / Register) ───
const C = {
  bg: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
  card: "rgba(255,255,255,0.07)",
  cardHover: "rgba(255,255,255,0.12)",
  border: "rgba(255,255,255,0.15)",
  borderPurple: "rgba(167,139,250,0.3)",
  text: "#ffffff",
  textSub: "rgba(255,255,255,0.55)",
  accent: "#a78bfa",
  accentDark: "#6c63ff",
  pink: "#ec4899",
  green: "#34d399",
  blue: "#60a5fa",
  red: "#f87171",
};

const styles = {
  // ── layout ──
  page: {
    minHeight: "100vh",
    background: C.bg,
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  starfield: { position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" },
  content: { position: "relative", zIndex: 10, padding: "28px 24px", maxWidth: "1100px", margin: "0 auto" },

  // ── header ──
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" },
  headerLeft: {},
  headerTitle: { fontSize: "1.75rem", fontWeight: 700, color: C.text, margin: 0 },
  headerSub: { fontSize: "0.85rem", color: C.textSub, marginTop: "4px" },
  headerSubAccent: { color: C.accent, fontWeight: 600 },

  // ── user card (top-right) ──
  userCard: {
    display: "flex", alignItems: "center", gap: "12px",
    background: C.card, backdropFilter: "blur(12px)",
    border: `1px solid ${C.borderPurple}`, borderRadius: "14px",
    padding: "10px 16px", transition: "background 0.2s",
  },
  avatarWrap: { position: "relative" },
  avatar: {
    width: "42px", height: "42px", borderRadius: "10px",
    background: `linear-gradient(135deg, ${C.accentDark}, ${C.pink})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1.1rem", fontWeight: 700, color: C.text,
    boxShadow: `0 4px 14px ${C.accentDark}44`,
  },
  onlineDot: {
    position: "absolute", bottom: "-2px", right: "-2px",
    width: "11px", height: "11px", borderRadius: "50%",
    background: C.green, border: "2px solid #1a1535",
  },
  userInfo: {},
  userName: { fontSize: "0.82rem", fontWeight: 600, color: C.text, margin: 0 },
  userRole: { fontSize: "0.7rem", color: C.textSub, margin: 0 },

  // ── logout btn ──
  logoutBtn: {
    background: "none", border: `1px solid ${C.border}`, borderRadius: "10px",
    color: C.textSub, cursor: "pointer", padding: "8px 10px",
    display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem",
    transition: "all 0.2s",
  },

  // ── stats grid ──
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "28px" },
  statCard: (color) => ({
    background: C.card, backdropFilter: "blur(12px)",
    border: `1px solid ${color}33`, borderRadius: "16px",
    padding: "20px", transition: "transform 0.2s, background 0.2s",
  }),
  statIcon: (color) => ({
    width: "40px", height: "40px", borderRadius: "10px",
    background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: "14px",
  }),
  statValue: { fontSize: "2rem", fontWeight: 700, color: C.text, margin: "0 0 2px" },
  statLabel: (color) => ({ fontSize: "0.75rem", color, fontWeight: 500, margin: 0 }),
  statBadge: (color) => ({
    display: "inline-block", fontSize: "0.6rem", fontWeight: 700,
    color, background: `${color}18`, padding: "2px 7px", borderRadius: "6px",
    marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px",
  }),

  // ── two-col ──
  twoCol: { display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "18px", marginBottom: "28px" },

  // ── glass card (reusable) ──
  glass: {
    background: C.card, backdropFilter: "blur(12px)",
    border: `1px solid ${C.borderPurple}`, borderRadius: "16px", padding: "22px",
  },
  glassTitleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" },
  glassTitle: { fontSize: "1rem", fontWeight: 700, color: C.text, margin: 0 },
  glassTitleBtn: {
    background: "none", border: "none", color: C.accent,
    fontSize: "0.72rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px",
    fontWeight: 600,
  },

  // ── activity item ──
  activityItem: {
    display: "flex", alignItems: "center", gap: "12px",
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px", padding: "12px", marginBottom: "10px", transition: "background 0.2s",
  },
  activityIcon: (color) => ({
    width: "36px", height: "36px", borderRadius: "9px", flexShrink: 0,
    background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center",
  }),
  activityTitle: { fontSize: "0.8rem", fontWeight: 600, color: C.text, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  activityDate: (color) => ({ fontSize: "0.68rem", color, margin: 0 }),

  // ── quick action btn ──
  quickBtn: (grad, shadow, borderColor) => ({
    width: "100%", background: grad, backdropFilter: "blur(12px)",
    border: `1px solid ${borderColor}`, borderRadius: "14px",
    padding: "14px 16px", cursor: "pointer", marginBottom: "10px",
    display: "flex", alignItems: "center", gap: "14px",
    transition: "transform 0.2s, background 0.2s", textAlign: "left",
  }),
  quickBtnIcon: (grad, shadow) => ({
    width: "42px", height: "42px", borderRadius: "10px", flexShrink: 0,
    background: grad, display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: shadow,
  }),
  quickBtnTitle: { fontSize: "0.8rem", fontWeight: 600, color: C.text, margin: "0 0 1px" },
  quickBtnSub: (color) => ({ fontSize: "0.68rem", color, margin: 0 }),

  // ── search ──
  searchWrap: { position: "relative", maxWidth: "320px", width: "100%" },
  searchInput: {
    width: "100%", padding: "9px 12px 9px 34px", borderRadius: "10px",
    border: `1px solid ${C.borderPurple}`, background: "rgba(255,255,255,0.06)",
    color: C.text, fontSize: "0.78rem", outline: "none", boxSizing: "border-box",
  },
  searchIcon: { position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" },

  // ── book card ──
  bookCard: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px", padding: "14px", display: "flex", gap: "12px",
    transition: "background 0.2s, transform 0.2s",
  },
  bookCover: {
    width: "56px", height: "78px", flexShrink: 0, borderRadius: "8px",
    background: `linear-gradient(135deg, ${C.accentDark}, ${C.pink})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: `0 4px 12px ${C.accentDark}33`,
  },
  bookTitle: { fontSize: "0.78rem", fontWeight: 600, color: C.text, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  bookAuthor: { fontSize: "0.68rem", color: C.textSub, margin: "0 0 6px" },
  bookBadge: (available) => ({
    display: "inline-block", fontSize: "0.6rem", fontWeight: 600, padding: "2px 7px", borderRadius: "5px",
    background: available ? `${C.green}18` : `${C.red}18`,
    color: available ? C.green : C.red, marginRight: "6px",
  }),
  bookCopies: { fontSize: "0.6rem", color: C.textSub },
  borrowBtn: (available) => ({
    marginTop: "8px", width: "100%", padding: "5px 0", borderRadius: "7px", border: "none",
    fontSize: "0.72rem", fontWeight: 600, cursor: available ? "pointer" : "not-allowed",
    background: available ? C.accentDark : "rgba(255,255,255,0.08)",
    color: available ? C.text : C.textSub, transition: "opacity 0.2s",
  }),

  // ── empty state ──
  empty: { textAlign: "center", padding: "36px 0" },
  emptyIcon: { opacity: 0.35, marginBottom: "10px" },
  emptyText: { fontSize: "0.78rem", color: C.textSub, margin: 0 },
};

// ── tiny keyframes injected once ──
const globalCSS = `
  @keyframes twinkle { 0%{opacity:.25} 100%{opacity:.9} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  .dash-stat:hover { transform: translateY(-3px) !important; background: rgba(255,255,255,0.11) !important; }
  .dash-quick:hover { transform: translateY(-2px) !important; }
  .dash-book:hover { background: rgba(255,255,255,0.09) !important; transform: translateY(-2px) !important; }
  .dash-activity:hover { background: rgba(255,255,255,0.08) !important; }
  .dash-input:focus { border-color: rgba(167,139,250,0.6) !important; box-shadow: 0 0 8px rgba(167,139,250,0.25); }
  .dash-borrow:hover:not(:disabled) { opacity: 0.82; }
`;

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [userLoans, setUserLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [borrowing, setBorrowing] = useState(null);
  const [showBooks, setShowBooks] = useState(false);

  const totalBorrowed = userLoans.length;
  const activeLoan = userLoans.filter((l) => !l.return_date).length;
  const returned = userLoans.filter((l) => l.return_date).length;
  const overdue = userLoans.filter((l) => {
    if (l.return_date) return false;
    return new Date(l.due_date) < new Date();
  }).length;

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const booksPromise = getBooks().catch(err => {
        console.error("[getBooks] failed", err?.response?.status, err?.response?.data);
        return { data: [] };
      });

      const loansPromise = myLoans().catch(err => {
        console.error("[myLoans] failed", err?.response?.status, err?.response?.data);
        return { data: [] };
      });

      const [booksRes, loansRes] = await Promise.all([booksPromise, loansPromise]);

      const booksData = booksRes?.data ?? booksRes ?? [];
      const loansData = loansRes?.data ?? loansRes ?? [];

      const sortedLoans = Array.isArray(loansData)
        ? [...loansData].sort((a, b) => {
            const dateA = new Date(a.created_at || a.borrow_date || a.due_date || 0);
            const dateB = new Date(b.created_at || b.borrow_date || b.due_date || 0);
            return dateB - dateA;
          })
        : [];

      setBooks(Array.isArray(booksData) ? booksData : []);
      setUserLoans(sortedLoans);
    } catch (err) {
      console.error("Global load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowBook = async (bookId) => {
    try {
      setBorrowing(bookId);
      await borrowBook(bookId);
      await loadData();
    } catch (e) {
      console.error("Borrow failed:", e);
      alert("Erreur lors de l'emprunt");
    } finally {
      setBorrowing(null);
    }
  };

  const filteredAndSortedBooks = books
    .filter(
      (b) =>
        (b.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.author || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const statusA = (a.available_copies || 0) > 0 ? 1 : 0;
      const statusB = (b.available_copies || 0) > 0 ? 1 : 0;
      return statusB - statusA;
    });

  const recentLoans = userLoans.slice(0, 2);

  // ── Détermine si l'utilisateur connecté a déjà ce livre en cours ──
  const isBorrowedByCurrentUser = (bookId) => {
    return userLoans.some(
      (loan) =>
        loan.book?.id === bookId && !loan.return_date
    );
  };

  const stars = Array.from({ length: 160 }, (_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    opacity: Math.random() * 0.5 + 0.2,
  }));

  if (loading) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{globalCSS}</style>
        <p style={{ color: C.text, fontSize: "1rem" }}>Chargement…</p>
      </div>
    );
  }

  const loanColor = (loan) => {
    if (loan.return_date) return C.green;
    return new Date(loan.due_date) < new Date() ? C.red : C.blue;
  };

  const LoanIcon = ({ loan }) => {
    if (loan.return_date) return <CheckCircle size={18} color={C.green} />;
    if (new Date(loan.due_date) < new Date()) return <AlertCircle size={18} color={C.red} />;
    return <Clock size={18} color={C.blue} />;
  };

  return (
    <div style={styles.page}>
      <style>{globalCSS}</style>

      <div style={styles.starfield}>
        {stars.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute", width: "2px", height: "2px", borderRadius: "50%",
              background: "#fff", top: s.top, left: s.left,
              animation: `twinkle 3s ease-in-out ${s.delay} infinite alternate`,
              opacity: s.opacity,
            }}
          />
        ))}
        <div style={{ position: "absolute", top: "10%", right: "5%", width: "260px", height: "260px", borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "15%", left: "8%", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)", filter: "blur(36px)" }} />
      </div>

      <div style={styles.content}>

        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.headerTitle}>Tableau de bord</h1>
            <p style={styles.headerSub}>
              Bienvenue, <span style={styles.headerSubAccent}>{user?.username || "Invité"}</span>
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={styles.userCard}>
              <div style={styles.avatarWrap}>
                <div style={styles.avatar}>{user?.username?.charAt(0).toUpperCase() || "I"}</div>
                <div style={styles.onlineDot} />
              </div>
              <div style={styles.userInfo}>
                <p style={styles.userName}>{user?.username || "Invité"}</p>
                <p style={styles.userRole}>Membre actif</p>
              </div>
            </div>
            <button style={styles.logoutBtn} onClick={logout}>
              <LogOut size={13} /> Déconnexion
            </button>
          </div>
        </div>

        <div style={styles.statsGrid}>
          {[
            { value: totalBorrowed, label: "Livres empruntés", badge: "Total", color: C.accent, Icon: BookOpen },
            { value: activeLoan, label: "En cours", badge: "Actif", color: C.blue, Icon: Clock },
            { value: returned, label: "Retournés", badge: "OK", color: C.green, Icon: CheckCircle },
            { value: overdue, label: "En retard", badge: "!", color: C.red, Icon: AlertCircle },
          ].map((s, i) => (
            <div key={i} className="dash-stat" style={styles.statCard(s.color)}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={styles.statIcon(s.color)}>
                  <s.Icon size={20} color={s.color} />
                </div>
                <span style={styles.statBadge(s.color)}>{s.badge}</span>
              </div>
              <p style={styles.statValue}>{s.value}</p>
              <p style={styles.statLabel(s.color)}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={styles.twoCol}>
          <div style={styles.glass}>
            <div style={styles.glassTitleRow}>
              <h2 style={styles.glassTitle}>Activité récente</h2>
              <button className="dash-quick" style={styles.glassTitleBtn} onClick={() => setShowBooks(!showBooks)}>
                <TrendingUp size={13} />
                {showBooks ? "Masquer" : "Explorer les livres"}
              </button>
            </div>

            {recentLoans.length > 0 ? (
              recentLoans.map((loan) => (
                <div key={loan.id} className="dash-activity" style={styles.activityItem}>
                  <div style={styles.activityIcon(loanColor(loan))}>
                    <LoanIcon loan={loan} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={styles.activityTitle}>
                      {loan.return_date ? "Retourné" : "Emprunté"} «{loan.book?.title || "Livre inconnu"}»
                    </p>
                    <p style={styles.activityDate(loanColor(loan))}>
                      {loan.return_date
                        ? new Date(loan.return_date).toLocaleDateString()
                        : `À rendre : ${new Date(loan.due_date).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.empty}>
                <BookOpen size={40} color={C.accent} style={styles.emptyIcon} />
                <p style={styles.emptyText}>Aucun emprunt récent</p>
              </div>
            )}
          </div>

          <div>
            <h2 style={{ ...styles.glassTitle, marginBottom: "14px" }}>Actions rapides</h2>

            {[
              { label: "Explorer les livres", sub: `Parcourir ${books.length} livres`, route: "/user/books", grad: `linear-gradient(135deg, ${C.accentDark}22, ${C.pink}18)`, iconGrad: `linear-gradient(135deg, ${C.accentDark}, ${C.pink})`, shadow: `0 4px 14px ${C.accentDark}33`, border: `${C.accentDark}44`, subColor: C.accent, Icon: BookOpen },
              { label: "Mes emprunts", sub: `${activeLoan} en cours`, route: "/user/loans", grad: `linear-gradient(135deg, ${C.blue}22, #06b6d422)`, iconGrad: `linear-gradient(135deg, ${C.blue}, #06b6d4)`, shadow: `0 4px 14px ${C.blue}33`, border: `${C.blue}44`, subColor: C.blue, Icon: Calendar },
              { label: "Mon profil", sub: "Gérer mes infos", route: "/user/profile", grad: `linear-gradient(135deg, ${C.green}22, #10b98122)`, iconGrad: `linear-gradient(135deg, ${C.green}, #10b981)`, shadow: `0 4px 14px ${C.green}33`, border: `${C.green}44`, subColor: C.green, Icon: UserIcon },
            ].map((a, i) => (
              <button key={i} className="dash-quick" style={styles.quickBtn(a.grad, a.shadow, a.border)} onClick={() => navigate(a.route)}>
                <div style={styles.quickBtnIcon(a.iconGrad, a.shadow)}>
                  <a.Icon size={20} color="#fff" />
                </div>
                <div>
                  <p style={styles.quickBtnTitle}>{a.label}</p>
                  <p style={styles.quickBtnSub(a.subColor)}>{a.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {showBooks && (
          <div style={{ ...styles.glass, animation: "fadeUp 0.3s ease-out" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "18px" }}>
              <h2 style={styles.glassTitle}>Explorer les livres</h2>
              <div style={styles.searchWrap}>
                <Search size={15} color={C.accent} style={styles.searchIcon} />
                <input
                  className="dash-input"
                  type="text"
                  placeholder="Rechercher…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value || "")}
                  style={styles.searchInput}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
              {filteredAndSortedBooks.map((book) => {
                const alreadyBorrowedByUser = isBorrowedByCurrentUser(book.id);
                const canBorrow = book.available_copies > 0 && !alreadyBorrowedByUser;

                return (
                  <div key={book.id} className="dash-book" style={styles.bookCard}>
                    <div style={styles.bookCover}>
                      <BookOpen size={22} color="#fff" />
                    </div>
                    <div style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
                      <p style={styles.bookTitle}>{book.title || "Sans titre"}</p>
                      <p style={styles.bookAuthor}>{book.author || "Auteur inconnu"}</p>
                      <div>
                        <span style={styles.bookBadge(canBorrow)}>
                          {alreadyBorrowedByUser
                            ? "Déjà emprunté par vous"
                            : canBorrow
                            ? "Disponible"
                            : "Indisponible"}
                        </span>
                        <span style={styles.bookCopies}>
                          {book.available_copies ?? 0}/{book.total_copies ?? "?"}
                        </span>
                      </div>
                      <button
                        className="dash-borrow"
                        style={styles.borrowBtn(canBorrow)}
                        disabled={!canBorrow || borrowing === book.id}
                        onClick={() => handleBorrowBook(book.id)}
                      >
                        {borrowing === book.id
                          ? "Emprunt…"
                          : alreadyBorrowedByUser
                          ? "Déjà emprunté"
                          : "Emprunter"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredAndSortedBooks.length === 0 && (
              <div style={styles.empty}>
                <Search size={36} color={C.accent} style={styles.emptyIcon} />
                <p style={styles.emptyText}>
                  {searchTerm ? "Aucun livre trouvé" : "Aucun livre disponible"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}