import { useAuth } from "../../auth/AuthContext";
import { User, Mail, Shield, Calendar, Edit2 } from "lucide-react";

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
};

const styles = {
  page: { minHeight: "100vh", background: C.bg, position: "relative", overflow: "hidden", fontFamily: "'Segoe UI', system-ui, sans-serif" },
  starfield: { position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" },
  content: { position: "relative", zIndex: 10, padding: "28px 24px", maxWidth: "720px", margin: "0 auto" },

  // header
  headerRow: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" },
  headerIconWrap: { position: "relative", width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center" },
  headerIconGlow: { position: "absolute", inset: 0, background: `${C.accentDark}30`, borderRadius: "50%", filter: "blur(14px)" },
  headerIcon: { position: "relative", width: "48px", height: "48px", borderRadius: "14px", background: `linear-gradient(135deg, ${C.accentDark}40, ${C.pink}30)`, border: `1px solid ${C.accentDark}55`, display: "flex", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: "1.9rem", fontWeight: 800, background: `linear-gradient(90deg, ${C.accent}, ${C.accentDark})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 },
  headerSub: { fontSize: "0.8rem", color: C.textSub, margin: "3px 0 0" },

  // profile card outer
  profileCard: { background: C.card, backdropFilter: "blur(12px)", border: `1px solid ${C.borderPurple}`, borderRadius: "18px", overflow: "hidden" },
  profileBanner: { height: "100px", background: `linear-gradient(135deg, ${C.accentDark}25, ${C.pink}18)`, position: "relative" },
  editBtn: { position: "absolute", top: "12px", right: "14px", width: "34px", height: "34px", borderRadius: "9px", background: "rgba(255,255,255,0.08)", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s, transform 0.15s" },
  profileBody: { padding: "0 24px 24px", marginTop: "-36px", position: "relative", zIndex: 1 },

  // avatar
  avatarWrap: { position: "relative", display: "inline-block", marginBottom: "14px" },
  avatar: { width: "72px", height: "72px", borderRadius: "18px", background: `linear-gradient(135deg, ${C.accentDark}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", fontWeight: 700, color: C.text, boxShadow: `0 4px 18px ${C.accentDark}44`, border: "3px solid #1a1535" },
  onlineDot: { position: "absolute", bottom: "-2px", right: "-2px", width: "18px", height: "18px", borderRadius: "50%", background: C.green, border: "3px solid #1a1535" },
  profileName: { fontSize: "1.2rem", fontWeight: 700, color: C.text, margin: "0 0 6px" },
  memberBadge: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", borderRadius: "20px", background: `${C.green}15`, border: `1px solid ${C.green}30`, marginBottom: "22px" },
  memberDot: { width: "7px", height: "7px", borderRadius: "50%", background: C.green, animation: "pulse 2s ease-in-out infinite" },
  memberText: { fontSize: "0.68rem", fontWeight: 600, color: C.green },

  // info grid
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "22px" },
  infoCard: (color) => ({ background: `${color}0a`, border: `1px solid ${color}20`, borderRadius: "14px", padding: "16px", display: "flex", gap: "14px", alignItems: "flex-start", cursor: "pointer", transition: "background 0.2s, border-color 0.2s, transform 0.15s" }),
  infoIconWrap: (color) => ({ width: "38px", height: "38px", borderRadius: "10px", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "transform 0.2s, background 0.2s" }),
  infoLabel: { fontSize: "0.65rem", color: C.textSub, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px", margin: "0 0 3px" },
  infoValue: { fontSize: "0.82rem", fontWeight: 600, color: C.text, margin: 0 },

  // actions
  actionsRow: { display: "flex", gap: "10px" },
  btnPrimary: { flex: 1, padding: "10px 0", borderRadius: "10px", border: "none", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", background: `linear-gradient(135deg, ${C.accentDark}, ${C.accent})`, color: C.text, boxShadow: `0 4px 14px ${C.accentDark}33`, transition: "opacity 0.2s, transform 0.15s" },
  btnSecondary: { flex: 1, padding: "10px 0", borderRadius: "10px", border: `1px solid ${C.border}`, fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", background: "rgba(255,255,255,0.06)", color: C.text, transition: "background 0.2s, transform 0.15s" },
};

const globalCSS = `
  @keyframes twinkle { 0%{opacity:.25} 100%{opacity:.9} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .profile-info-card:hover { background: rgba(255,255,255,0.1) !important; border-color: rgba(255,255,255,0.28) !important; transform: translateY(-2px); }
  .profile-info-card:hover .profile-info-icon { transform: scale(1.1); background: rgba(255,255,255,0.18) !important; }
  .profile-edit-btn:hover { background: rgba(255,255,255,0.14) !important; transform: scale(1.08); }
  .profile-btn-primary:hover { opacity: 0.82; transform: scale(1.03); }
  .profile-btn-secondary:hover { background: rgba(255,255,255,0.12) !important; transform: scale(1.03); }
`;

const stars = Array.from({ length: 160 }, () => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 3}s`,
  opacity: Math.random() * 0.5 + 0.2,
}));

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  const infoCards = [
    { label: "Email",          value: user.email,                                                                                          color: C.blue,   Icon: Mail },
    { label: "Rôle",           value: user.role?.charAt(0).toUpperCase() + user.role?.slice(1),                                            color: C.accent, Icon: Shield },
    { label: "Membre depuis",  value: user.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "N/A", color: C.green,  Icon: Calendar },
    { label: "Identifiant",    value: `#${user.id || "000"}`,                                                                             color: C.amber,  Icon: User },
  ];

  return (
    <div style={styles.page}>
      <style>{globalCSS}</style>

      {/* stars */}
      <div style={styles.starfield}>
        {stars.map((s, i) => (
          <div key={i} style={{ position: "absolute", width: "2px", height: "2px", borderRadius: "50%", background: "#fff", top: s.top, left: s.left, animation: `twinkle 3s ease-in-out ${s.delay} infinite alternate`, opacity: s.opacity }} />
        ))}
        <div style={{ position: "absolute", top: "8%", right: "6%", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)", filter: "blur(38px)" }} />
        <div style={{ position: "absolute", bottom: "12%", left: "6%", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)", filter: "blur(34px)" }} />
      </div>

      <div style={styles.content}>
        {/* header */}
        <div style={styles.headerRow}>
          <div style={styles.headerIconWrap}>
            <div style={styles.headerIconGlow} />
            <div style={styles.headerIcon}><User size={24} color={C.accent} /></div>
          </div>
          <div>
            <h1 style={styles.headerTitle}>Mon Profil</h1>
            <p style={styles.headerSub}>Gérez vos informations personnelles</p>
          </div>
        </div>

        {/* profile card */}
        <div style={styles.profileCard}>
          {/* banner */}
          <div style={styles.profileBanner}>
            <button className="profile-edit-btn" style={styles.editBtn}><Edit2 size={16} color={C.accent} /></button>
          </div>

          <div style={styles.profileBody}>
            {/* avatar */}
            <div style={styles.avatarWrap}>
              <div style={styles.avatar}>{user.username.charAt(0).toUpperCase()}</div>
              <div style={styles.onlineDot} />
            </div>
            <p style={styles.profileName}>{user.username}</p>
            <div style={styles.memberBadge}>
              <div style={styles.memberDot} />
              <span style={styles.memberText}>Membre actif</span>
            </div>

            {/* info grid */}
            <div style={styles.infoGrid}>
              {infoCards.map((card, i) => (
                <div key={i} className="profile-info-card" style={styles.infoCard(card.color)}>
                  <div className="profile-info-icon" style={styles.infoIconWrap(card.color)}>
                    <card.Icon size={18} color={card.color} />
                  </div>
                  <div>
                    <p style={styles.infoLabel}>{card.label}</p>
                    <p style={{ ...styles.infoValue, fontFamily: card.label === "Identifiant" ? "monospace" : "inherit" }}>{card.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* action buttons */}
            <div style={styles.actionsRow}>
              <button className="profile-btn-primary" style={styles.btnPrimary}>Modifier le profil</button>
              <button className="profile-btn-secondary" style={styles.btnSecondary}>Paramètres</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}