import { useAuth } from "../../auth/AuthContext";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function Profile() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div>
            <h1 style={{ marginBottom: "24px", fontSize: "28px", fontWeight: "bold" }}>Mon Profil</h1>

            <div style={{
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "24px",
                padding: "32px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                maxWidth: "600px"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px" }}>
                    <div style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #a855f7, #9333ea)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "32px",
                        fontWeight: "bold"
                    }}>
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 style={{ fontSize: "24px", fontWeight: "600" }}>{user.username}</h2>
                        <span style={{ color: "#9ca3af" }}>Membre actif</span>
                    </div>
                </div>

                <div style={{ display: "grid", gap: "24px" }}>
                    <div style={{ display: "flex", gap: "16px", paddingBottom: "16px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                        <Mail style={{ color: "#a855f7" }} />
                        <div>
                            <div style={{ fontSize: "14px", color: "#9ca3af" }}>Email</div>
                            <div style={{ fontSize: "16px" }}>{user.email}</div>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "16px", paddingBottom: "16px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                        <Shield style={{ color: "#a855f7" }} />
                        <div>
                            <div style={{ fontSize: "14px", color: "#9ca3af" }}>Rôle</div>
                            <div style={{ fontSize: "16px" }}>{user.role}</div>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "16px" }}>
                        <Calendar style={{ color: "#a855f7" }} />
                        <div>
                            <div style={{ fontSize: "14px", color: "#9ca3af" }}>Membre depuis</div>
                            <div style={{ fontSize: "16px" }}>
                                {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : "N/A"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
