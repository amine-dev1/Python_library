import { useState, useEffect } from "react";
import { getBooks } from "../../api/books.api";
import { borrowBook } from "../../api/loans.api";
import {
  BookOpen,
  User as UserIcon,
  Calendar,
  Search,
  Filter,
  BookMarked,
  Sparkles,
  Library,
} from "lucide-react";

// ─── Shared palette (matches Login / Register / Dashboard) ───
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
  starfield: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
  },
  content: {
    position: "relative",
    zIndex: 10,
    padding: "28px 24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  // ── header ──
  headerRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "28px",
  },
  headerIconWrap: {
    position: "relative",
    width: "52px",
    height: "52px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconGlow: {
    position: "absolute",
    inset: 0,
    background: `${C.accentDark}30`,
    borderRadius: "50%",
    filter: "blur(14px)",
  },
  headerIcon: {
    position: "relative",
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: `linear-gradient(135deg, ${C.accentDark}40, ${C.pink}30)`,
    border: `1px solid ${C.accentDark}55`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: "1.9rem",
    fontWeight: 800,
    background: `linear-gradient(90deg, ${C.accent}, ${C.accentDark})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },
  headerSub: {
    fontSize: "0.8rem",
    color: C.textSub,
    margin: "3px 0 0",
  },

  // ── search / filter row ──
  searchRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "14px",
    flexWrap: "wrap",
  },
  searchWrap: {
    flex: "1 1 240px",
    position: "relative",
  },
  searchInput: {
    width: "100%",
    padding: "11px 14px 11px 38px",
    borderRadius: "12px",
    border: `1px solid ${C.borderPurple}`,
    background: "rgba(255,255,255,0.06)",
    color: C.text,
    fontSize: "0.8rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },
  filterWrap: {
    position: "relative",
    minWidth: "200px",
    flex: "0 1 220px",
  },
  filterSelect: {
    width: "100%",
    padding: "11px 36px 11px 38px",
    borderRadius: "12px",
    border: `1px solid ${C.borderPurple}`,
    background: "rgba(255,255,255,0.06)",
    color: C.text,
    fontSize: "0.8rem",
    outline: "none",
    appearance: "none",
    cursor: "pointer",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  filterIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },
  filterArrow: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },

  // ── stats bar ──
  statsBar: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    background: `linear-gradient(135deg, ${C.accentDark}12, ${C.pink}0a)`,
    border: `1px solid ${C.borderPurple}`,
    borderRadius: "12px",
    padding: "12px 18px",
    marginBottom: "24px",
  },
  statItem: { display: "flex", alignItems: "center", gap: "10px" },
  statBubble: (color) => ({
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    background: `${color}18`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  statNum: (color) => ({
    fontSize: "1.05rem",
    fontWeight: 700,
    color,
    margin: 0,
  }),
  statTxt: {
    fontSize: "0.7rem",
    color: C.textSub,
    margin: 0,
  },
  statDivider: {
    width: "1px",
    height: "28px",
    background: C.borderPurple,
  },

  // ── book card ──
  bookCard: {
    background: C.card,
    backdropFilter: "blur(12px)",
    border: `1px solid ${C.border}`,
    borderRadius: "16px",
    overflow: "hidden",
    transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
    display: "flex",
    flexDirection: "column",
  },
  cardAccent: (available) => ({
    height: "3px",
    background: available
      ? `linear-gradient(90deg, ${C.green}, #10b981)`
      : `linear-gradient(90deg, ${C.red}, #ef4444)`,
  }),
  cardBody: {
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  cardTitleRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "12px",
  },
  cardTitle: {
    fontSize: "0.88rem",
    fontWeight: 700,
    color: C.text,
    margin: 0,
    lineHeight: 1.3,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    flex: 1,
  },
  cardCategory: {
    fontSize: "0.58rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: C.accent,
    background: `${C.accentDark}22`,
    border: `1px solid ${C.accentDark}44`,
    borderRadius: "6px",
    padding: "3px 8px",
    whiteSpace: "nowrap",
  },
  cardMeta: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.72rem",
    color: C.textSub,
    marginBottom: "6px",
  },
  cardMetaIcon: (color) => ({
    width: "26px",
    height: "26px",
    borderRadius: "7px",
    background: "rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  cardSpacer: { flex: 1 },
  cardDivider: {
    height: "1px",
    background: "rgba(255,255,255,0.08)",
    margin: "14px 0 12px",
  },
  availRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "0.7rem",
    marginBottom: "8px",
  },
  availLabel: { color: C.textSub, fontWeight: 600 },
  availNum: (available) => ({
    fontWeight: 700,
    fontSize: "0.8rem",
    color: available ? C.green : C.red,
  }),
  progressBg: {
    width: "100%",
    height: "5px",
    borderRadius: "3px",
    background: "rgba(255,255,255,0.08)",
    marginBottom: "14px",
    overflow: "hidden",
  },
  progressFill: (pct, available) => ({
    height: "100%",
    width: `${pct}%`,
    borderRadius: "3px",
    background: available
      ? `linear-gradient(90deg, ${C.green}, #10b981)`
      : `linear-gradient(90deg, ${C.red}, #ef4444)`,
    transition: "width 0.5s ease",
  }),
  borrowBtn: (available) => ({
    width: "100%",
    padding: "9px 0",
    borderRadius: "10px",
    border: "none",
    fontSize: "0.78rem",
    fontWeight: 700,
    cursor: available ? "pointer" : "not-allowed",
    background: available
      ? `linear-gradient(135deg, ${C.accentDark}, ${C.accent})`
      : "rgba(255,255,255,0.07)",
    color: available ? C.text : C.textSub,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    transition: "opacity 0.2s, transform 0.15s",
    boxShadow: available ? `0 4px 14px ${C.accentDark}33` : "none",
  }),

  // ── empty state ──
  empty: { textAlign: "center", padding: "64px 0" },
  emptyIconWrap: { position: "relative", display: "inline-block", marginBottom: "16px" },
  emptyGlow: {
    position: "absolute",
    inset: "-8px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "50%",
    filter: "blur(16px)",
  },
  emptyTitle: { fontSize: "1.1rem", fontWeight: 700, color: C.text, margin: "0 0 6px" },
  emptyText: { fontSize: "0.78rem", color: C.textSub, margin: 0 },

  // ── loading ──
  loadingWrap: {
    minHeight: "100vh",
    background: C.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerOuter: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    border: `3px solid ${C.accentDark}30`,
    position: "relative",
    marginBottom: "18px",
  },
  spinnerInner: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: `3px solid transparent`,
    borderTopColor: C.accent,
    animation: "spin 0.7s linear infinite",
  },
  loadingTitle: { fontSize: "1rem", color: C.text, fontWeight: 600, margin: "0 0 4px", textAlign: "center" },
  loadingSubTitle: { fontSize: "0.72rem", color: C.textSub, margin: 0, textAlign: "center" },
};

const globalCSS = `
  @keyframes twinkle { 0%{opacity:.25} 100%{opacity:.9} }
  @keyframes spin { to { transform: rotate(360deg); } }
  .book-card:hover { transform: translateY(-4px) !important; border-color: rgba(167,139,250,0.45) !important; box-shadow: 0 8px 28px rgba(108,99,255,0.18) !important; }
  .book-card:hover .book-title { color: ${C.accent} !important; }
  .book-borrow:hover:not(:disabled) { opacity: 0.82; transform: scale(1.03); }
  .books-input:focus { border-color: rgba(167,139,250,0.6) !important; box-shadow: 0 0 8px rgba(167,139,250,0.25); }
  .books-select:focus { border-color: rgba(167,139,250,0.6) !important; }
  .books-select option { background: #1a1535; color: #fff; }
`;

// ─── stars (stable per mount) ───
const stars = Array.from({ length: 160 }, () => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 3}s`,
  opacity: Math.random() * 0.5 + 0.2,
}));

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (e) {
      console.error("Erreur chargement livres :", e);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId) => {
    setBorrowing(bookId);
    try {
      await borrowBook(bookId);
      await loadBooks();
      setNotification("✓  Livre emprunté avec succès !");
      setTimeout(() => setNotification(null), 3000);
    } catch (e) {
      console.error(e);
      alert("Impossible d'emprunter ce livre.");
    } finally {
      setBorrowing(null);
    }
  };

  const filteredBooks = books.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === "all" || b.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const categories = ["all", ...new Set(books.map((b) => b.category))];
  const availCount = filteredBooks.filter((b) => b.available_copies > 0).length;

  // ── loading ──
  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <style>{globalCSS}</style>
        <div style={{ textAlign: "center" }}>
          <div style={styles.spinnerOuter}>
            <div style={styles.spinnerInner} />
          </div>
          <p style={styles.loadingTitle}>Chargement des livres…</p>
          <p style={styles.loadingSubTitle}>Veuillez patienter</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{globalCSS}</style>

      {/* ── notification toast ── */}
      {notification && (
        <div style={{
          position: "fixed", top: "20px", right: "20px", zIndex: 100,
          background: `linear-gradient(135deg, ${C.green}, #10b981)`,
          color: "#fff", padding: "12px 22px", borderRadius: "12px",
          fontSize: "0.78rem", fontWeight: 600, boxShadow: "0 6px 20px rgba(52,211,153,0.35)",
          animation: "fadeUp 0.25s ease-out",
        }}>
          {notification}
        </div>
      )}

      {/* ── stars bg ── */}
      <div style={styles.starfield}>
        {stars.map((s, i) => (
          <div key={i} style={{
            position: "absolute", width: "2px", height: "2px", borderRadius: "50%",
            background: "#fff", top: s.top, left: s.left,
            animation: `twinkle 3s ease-in-out ${s.delay} infinite alternate`,
            opacity: s.opacity,
          }} />
        ))}
        <div style={{ position: "absolute", top: "8%", right: "6%", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)", filter: "blur(38px)" }} />
        <div style={{ position: "absolute", bottom: "12%", left: "6%", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)", filter: "blur(34px)" }} />
      </div>

      {/* ── main content ── */}
      <div style={styles.content}>

        {/* header */}
        <div style={styles.headerRow}>
          <div style={styles.headerIconWrap}>
            <div style={styles.headerIconGlow} />
            <div style={styles.headerIcon}>
              <Library size={24} color={C.accent} />
            </div>
          </div>
          <div>
            <h1 style={styles.headerTitle}>Bibliothèque</h1>
            <p style={styles.headerSub}>Explorez notre collection de livres</p>
          </div>
        </div>

        {/* search + filter */}
        <div style={styles.searchRow}>
          <div style={styles.searchWrap}>
            <Search size={16} color={C.accent} style={styles.searchIcon} />
            <input
              className="books-input"
              type="text"
              placeholder="Rechercher par titre ou auteur…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.filterWrap}>
            <Filter size={16} color={C.accent} style={styles.filterIcon} />
            <select
              className="books-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={styles.filterSelect}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "📚 Toutes les catégories" : cat}
                </option>
              ))}
            </select>
            <svg style={styles.filterArrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSub} strokeWidth="2.5">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* stats bar */}
        <div style={styles.statsBar}>
          <div style={styles.statItem}>
            <div style={styles.statBubble(C.accent)}>
              <BookMarked size={17} color={C.accent} />
            </div>
            <div>
              <p style={styles.statNum(C.text)}>{filteredBooks.length} <span style={{ fontSize: "0.68rem", fontWeight: 500, color: C.textSub }}>livre{filteredBooks.length !== 1 ? "s" : ""} trouvé{filteredBooks.length !== 1 ? "s" : ""}</span></p>
            </div>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <div style={styles.statBubble(C.green)}>
              <Sparkles size={17} color={C.green} />
            </div>
            <div>
              <p style={styles.statNum(C.green)}>{availCount} <span style={{ fontSize: "0.68rem", fontWeight: 500, color: C.textSub }}>disponible{availCount !== 1 ? "s" : ""}</span></p>
            </div>
          </div>
        </div>

        {/* ── books grid ── */}
        {filteredBooks.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIconWrap}>
              <div style={styles.emptyGlow} />
              <BookOpen size={56} color={C.textSub} strokeWidth={1.2} style={{ position: "relative" }} />
            </div>
            <h3 style={styles.emptyTitle}>Aucun livre trouvé</h3>
            <p style={styles.emptyText}>Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px" }}>
            {filteredBooks.map((book) => {
              const avail = book.available_copies > 0;
              const pct = (book.available_copies / book.total_copies) * 100;
              return (
                <div key={book.id} className="book-card" style={styles.bookCard}>
                  {/* top accent */}
                  <div style={styles.cardAccent(avail)} />

                  <div style={styles.cardBody}>
                    {/* title + category */}
                    <div style={styles.cardTitleRow}>
                      <h3 className="book-title" style={styles.cardTitle}>{book.title}</h3>
                      <span style={styles.cardCategory}>{book.category}</span>
                    </div>

                    {/* author */}
                    <div style={styles.cardMeta}>
                      <div style={styles.cardMetaIcon()}>
                        <UserIcon size={13} color={C.textSub} />
                      </div>
                      <span>{book.author}</span>
                    </div>

                    {/* year */}
                    <div style={styles.cardMeta}>
                      <div style={styles.cardMetaIcon()}>
                        <Calendar size={13} color={C.textSub} />
                      </div>
                      <span>{book.publication_year}</span>
                    </div>

                    <div style={styles.cardSpacer} />
                    <div style={styles.cardDivider} />

                    {/* availability */}
                    <div style={styles.availRow}>
                      <span style={styles.availLabel}>Disponibilité</span>
                      <span style={styles.availNum(avail)}>{book.available_copies} / {book.total_copies}</span>
                    </div>
                    <div style={styles.progressBg}>
                      <div style={styles.progressFill(pct, avail)} />
                    </div>

                    {/* borrow btn */}
                    <button
                      className="book-borrow"
                      style={styles.borrowBtn(avail)}
                      disabled={!avail || borrowing === book.id}
                      onClick={() => handleBorrow(book.id)}
                    >
                      {borrowing === book.id ? (
                        <>
                          <div style={{
                            width: "16px", height: "16px", borderRadius: "50%",
                            border: `2px solid ${C.text}44`, borderTopColor: C.text,
                            animation: "spin 0.6s linear infinite",
                          }} />
                          Traitement…
                        </>
                      ) : avail ? (
                        <>
                          <BookOpen size={16} /> Emprunter
                        </>
                      ) : (
                        "Indisponible"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}