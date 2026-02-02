import { useState, useEffect } from "react";
import { myLoans, returnBook } from "../../api/loans.api";
import { Calendar, BookOpen, Clock, AlertCircle, BookMarked, CheckCircle, XCircle } from "lucide-react";

// ─── Palette partagée ───
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
  red: "#f87171",
  yellow: "#fbbf24",
};

const STATUS = {
  RETURNED: { color: C.green, icon: CheckCircle, label: "Retourné", accent: `linear-gradient(90deg, ${C.green}, #10b981)` },
  OVERDUE:  { color: C.red,   icon: XCircle,     label: "En retard", accent: `linear-gradient(90deg, ${C.red}, #ef4444)` },
  BORROWED: { color: C.yellow,icon: Clock,       label: "En cours",  accent: `linear-gradient(90deg, ${C.yellow}, #f59e0b)` },
  // statut par défaut si le backend envoie quelque chose d'inconnu
  UNKNOWN:  { color: C.textSub, icon: AlertCircle, label: "Statut inconnu", accent: `linear-gradient(90deg, #9ca3af, #6b7280)` },
};

// ─── Styles (inchangés) ───
const styles = {
  page: { minHeight: "100vh", background: C.bg, position: "relative", overflow: "hidden", fontFamily: "'Segoe UI', system-ui, sans-serif" },
  starfield: { position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" },
  content: { position: "relative", zIndex: 10, padding: "28px 24px", maxWidth: "900px", margin: "0 auto" },

  headerRow: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" },
  headerIconWrap: { position: "relative", width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center" },
  headerIconGlow: { position: "absolute", inset: 0, background: `${C.accentDark}30`, borderRadius: "50%", filter: "blur(14px)" },
  headerIcon: { position: "relative", width: "48px", height: "48px", borderRadius: "14px", background: `linear-gradient(135deg, ${C.accentDark}40, ${C.pink}30)`, border: `1px solid ${C.accentDark}55`, display: "flex", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: "1.9rem", fontWeight: 800, background: `linear-gradient(90deg, ${C.accent}, ${C.accentDark})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 },
  headerSub: { fontSize: "0.8rem", color: C.textSub, margin: "3px 0 0" },

  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "28px" },
  statCard: (color) => ({ background: C.card, backdropFilter: "blur(12px)", border: `1px solid ${color}33`, borderRadius: "16px", padding: "18px", transition: "transform 0.2s, background 0.2s" }),
  statTop: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" },
  statBubble: (color) => ({ width: "34px", height: "34px", borderRadius: "9px", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }),
  statLabel: { fontSize: "0.72rem", color: C.textSub, fontWeight: 600 },
  statValue: { fontSize: "1.8rem", fontWeight: 700, color: C.text, margin: 0 },

  loanCard: { background: C.card, backdropFilter: "blur(12px)", border: `1px solid ${C.border}`, borderRadius: "16px", overflow: "hidden", marginBottom: "14px", transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s" },
  loanAccent: (grad) => ({ height: "3px", background: grad }),
  loanBody: { padding: "20px" },
  loanTitleRow: { display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" },
  loanIconWrap: { width: "40px", height: "40px", borderRadius: "10px", background: `${C.accentDark}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "transform 0.2s" },
  loanTitle: { fontSize: "1rem", fontWeight: 700, color: C.text, margin: "0 0 3px", transition: "color 0.2s" },
  loanAuthor: { fontSize: "0.72rem", color: C.textSub, margin: 0 },

  datesRow: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" },
  dateItem: { flex: "1 1 140px", display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "10px", transition: "background 0.2s" },
  dateIconWrap: { width: "30px", height: "30px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  dateLabel: { fontSize: "0.6rem", color: C.textSub, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px", margin: "0 0 1px" },
  dateValue: { fontSize: "0.72rem", color: C.text, fontWeight: 600, margin: 0 },

  bottomRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" },
  statusBadge: (color) => ({ display: "inline-flex", alignItems: "center", gap: "7px", padding: "7px 14px", borderRadius: "9px", background: `${color}18`, border: `1px solid ${color}33` }),
  statusText: (color) => ({ fontSize: "0.75rem", fontWeight: 700, color, margin: 0 }),

  returnBtn: { padding: "9px 22px", borderRadius: "10px", border: "none", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", background: `linear-gradient(135deg, ${C.accentDark}, ${C.accent})`, color: C.text, display: "flex", alignItems: "center", gap: "7px", boxShadow: `0 4px 14px ${C.accentDark}33`, transition: "opacity 0.2s, transform 0.15s" },

  empty: { textAlign: "center", padding: "64px 0" },
  emptyIconWrap: { position: "relative", display: "inline-block", marginBottom: "16px" },
  emptyGlow: { position: "absolute", inset: "-8px", background: "rgba(255,255,255,0.06)", borderRadius: "50%", filter: "blur(16px)" },
  emptyTitle: { fontSize: "1.1rem", fontWeight: 700, color: C.text, margin: "0 0 6px" },
  emptyText: { fontSize: "0.78rem", color: C.textSub, margin: 0 },

  loadingWrap: { minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" },
  spinnerOuter: { width: "52px", height: "52px", borderRadius: "50%", border: `3px solid ${C.accentDark}30`, position: "relative", marginBottom: "18px" },
  spinnerInner: { position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid transparent", borderTopColor: C.accent, animation: "spin 0.7s linear infinite" },
  loadingTitle: { fontSize: "1rem", color: C.text, fontWeight: 600, margin: "0 0 4px", textAlign: "center" },
  loadingSubTitle: { fontSize: "0.72rem", color: C.textSub, margin: 0, textAlign: "center" },

  errorMessage: { 
    background: "rgba(239,68,68,0.15)", 
    border: "1px solid rgba(239,68,68,0.4)", 
    color: C.red, 
    padding: "16px 24px", 
    borderRadius: "12px", 
    margin: "20px 0", 
    textAlign: "center", 
    fontWeight: 500 
  },
};

const globalCSS = `
  @keyframes twinkle { 0%{opacity:.25} 100%{opacity:.9} }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  .loan-card:hover { transform: translateY(-3px) !important; border-color: rgba(167,139,250,0.4) !important; box-shadow: 0 8px 28px rgba(108,99,255,0.18) !important; }
  .loan-card:hover .loan-title { color: ${C.accent} !important; }
  .loan-card:hover .loan-icon-wrap { transform: scale(1.08); }
  .loan-card:hover .date-item { background: rgba(255,255,255,0.07); }
  .loan-stat:hover { transform: translateY(-2px) !important; background: rgba(255,255,255,0.11) !important; }
  .loan-return-btn:hover { opacity: 0.82; transform: scale(1.04); }
`;

const stars = Array.from({ length: 160 }, () => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 3}s`,
  opacity: Math.random() * 0.5 + 0.2,
}));

export default function MyLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [returning, setReturning] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await myLoans();
      const data = res.data || [];
      console.log("[MyLoans] Données reçues :", data); // ← pour debug
      setLoans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("[MyLoans] Erreur chargement :", err);
      let message = "Impossible de charger vos emprunts.";
      
      if (err.response) {
        const status = err.response.status;
        if (status === 401 || status === 403) {
          message = "Session expirée ou accès non autorisé. Veuillez vous reconnecter.";
        } else if (status >= 500) {
          message = "Problème sur le serveur. Réessayez plus tard.";
        } else if (status === 404) {
          message = "Endpoint introuvable. Vérifiez la configuration API.";
        }
      } else if (err.request) {
        message = "Impossible de contacter le serveur (serveur arrêté ? problème réseau ?)";
      }
      
      setError(message + " Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId) => {
    if (!window.confirm("Confirmez-vous le retour de ce livre ?")) return;
    
    setReturning(loanId);
    try {
      await returnBook(loanId);
      setNotification("Livre retourné avec succès ✓");
      setTimeout(() => setNotification(null), 4000);
      await loadLoans();
    } catch (err) {
      console.error("[MyLoans] Erreur retour :", err);
      alert("Échec du retour du livre. Veuillez réessayer.");
    } finally {
      setReturning(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Date invalide";
    }
  };

  // Statistiques
  const active = loans.filter(l => ["BORROWED", "OVERDUE"].includes(l?.status)).length;
  const returned = loans.filter(l => l?.status === "RETURNED").length;
  const overdue = loans.filter(l => l?.status === "OVERDUE").length;

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <style>{globalCSS}</style>
        <div style={{ textAlign: "center" }}>
          <div style={styles.spinnerOuter}><div style={styles.spinnerInner} /></div>
          <p style={styles.loadingTitle}>Chargement de vos emprunts…</p>
          <p style={styles.loadingSubTitle}>Patientez un instant</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{globalCSS}</style>

      {notification && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 1000,
          background: `linear-gradient(135deg, ${C.green}, #10b981)`,
          color: "white", padding: "12px 24px", borderRadius: 12,
          boxShadow: "0 6px 20px rgba(52,211,153,0.4)",
          fontWeight: 600, fontSize: "0.9rem",
        }}>
          {notification}
        </div>
      )}

      {/* Étoiles de fond */}
      <div style={styles.starfield}>
        {stars.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: "2px",
              height: "2px",
              background: "#fff",
              borderRadius: "50%",
              top: s.top,
              left: s.left,
              animation: `twinkle 3s ease-in-out ${s.delay} infinite alternate`,
              opacity: s.opacity,
            }}
          />
        ))}
        <div style={{ position: "absolute", top: "8%", right: "6%", width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)", filter: "blur(38px)" }} />
        <div style={{ position: "absolute", bottom: "12%", left: "6%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)", filter: "blur(34px)" }} />
      </div>

      <div style={styles.content}>
        {/* En-tête */}
        <div style={styles.headerRow}>
          <div style={styles.headerIconWrap}>
            <div style={styles.headerIconGlow} />
            <div style={styles.headerIcon}>
              <BookMarked size={24} color={C.accent} />
            </div>
          </div>
          <div>
            <h1 style={styles.headerTitle}>Mes Emprunts</h1>
            <p style={styles.headerSub}>Suivez et gérez vos livres empruntés</p>
          </div>
        </div>

        {/* Cartes stats */}
        <div style={styles.statsGrid}>
          {[
            { value: active,   label: "En cours",  color: C.blue,   Icon: Clock },
            { value: returned, label: "Retournés", color: C.green,  Icon: CheckCircle },
            { value: overdue,  label: "En retard", color: C.red,    Icon: AlertCircle },
          ].map((stat, idx) => (
            <div key={idx} className="loan-stat" style={styles.statCard(stat.color)}>
              <div style={styles.statTop}>
                <div style={styles.statBubble(stat.color)}>
                  <stat.Icon size={17} color={stat.color} />
                </div>
                <span style={styles.statLabel}>{stat.label}</span>
              </div>
              <p style={styles.statValue}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Message d'erreur */}
        {error && <div style={styles.errorMessage}>{error}</div>}

        {/* Contenu principal */}
        {loans.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIconWrap}>
              <div style={styles.emptyGlow} />
              <BookOpen size={56} color={C.textSub} strokeWidth={1.2} style={{ position: "relative" }} />
            </div>
            <h3 style={styles.emptyTitle}>
              {error ? "Erreur de chargement" : "Aucun emprunt"}
            </h3>
            <p style={styles.emptyText}>
              {error || "Vous n'avez pas encore emprunté de livres."}
            </p>
          </div>
        ) : (
          loans.map((loan) => {
            const statusKey = loan?.status?.toUpperCase() || "UNKNOWN";
            const s = STATUS[statusKey] || STATUS.UNKNOWN;
            const StatusIcon = s.icon;

            const isOverdue = statusKey === "OVERDUE";
            let daysLate = 0;
            if (isOverdue && loan.due_date) {
              daysLate = Math.max(0, Math.floor(
                (new Date() - new Date(loan.due_date)) / (1000 * 60 * 60 * 24)
              ));
            }

            return (
              <div key={loan.id} className="loan-card" style={styles.loanCard}>
                <div style={styles.loanAccent(s.accent)} />
                <div style={styles.loanBody}>
                  {/* Titre livre */}
                  <div style={styles.loanTitleRow}>
                    <div className="loan-icon-wrap" style={styles.loanIconWrap}>
                      <BookOpen size={20} color={C.accent} />
                    </div>
                    <div>
                      <p className="loan-title" style={styles.loanTitle}>
                        {loan.book?.title || "Livre non disponible"}
                      </p>
                      {loan.book?.author && (
                        <p style={styles.loanAuthor}>par {loan.book.author}</p>
                      )}
                    </div>
                  </div>

                  {/* Infos dates + statut */}
                  <div style={styles.datesRow}>
                    <div className="date-item" style={styles.dateItem}>
                      <div style={styles.dateIconWrap}>
                        <Calendar size={14} color={C.accent} />
                      </div>
                      <div>
                        <p style={styles.dateLabel}>Emprunté le</p>
                        <p style={styles.dateValue}>{formatDate(loan.loan_date)}</p>
                      </div>
                    </div>

                    <div className="date-item" style={styles.dateItem}>
                      <div style={styles.dateIconWrap}>
                        <Clock size={14} color={C.accent} />
                      </div>
                      <div>
                        <p style={styles.dateLabel}>À rendre avant</p>
                        <p style={styles.dateValue}>{formatDate(loan.due_date)}</p>
                      </div>
                    </div>

                    <div className="date-item" style={styles.dateItem}>
                      <div style={{ ...styles.dateIconWrap, background: `${s.color}18` }}>
                        <StatusIcon size={14} color={s.color} />
                      </div>
                      <div>
                        <p style={styles.dateLabel}>Statut</p>
                        <p style={{ ...styles.dateValue, color: s.color }}>
                          {s.label}
                          {isOverdue && daysLate > 0 && ` (${daysLate} jour${daysLate > 1 ? 's' : ''})`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={styles.bottomRow}>
                    <div style={styles.statusBadge(s.color)}>
                      <StatusIcon size={15} color={s.color} />
                      <span style={styles.statusText(s.color)}>{s.label}</span>
                    </div>

                    {statusKey === "BORROWED" && (
                      <button
                        className="loan-return-btn"
                        style={styles.returnBtn}
                        disabled={returning === loan.id}
                        onClick={() => handleReturn(loan.id)}
                      >
                        {returning === loan.id ? (
                          <>
                            <div style={{
                              width: 16, height: 16, borderRadius: "50%",
                              border: `2px solid ${C.text}44`, borderTopColor: C.text,
                              animation: "spin 0.6s linear infinite"
                            }} />
                            <span>Retour en cours...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={16} /> Retourner le livre
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}