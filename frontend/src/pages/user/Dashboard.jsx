import { useAuth } from "../../auth/AuthContext";

export default function UserDashboard() {
    const { user } = useAuth();

    return (
        <div>
            <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px" }}>Tableau de bord</h1>
            <p style={{ fontSize: "18px", color: "#d1d5db" }}>
                Bienvenue, <span style={{ color: "#a855f7", fontWeight: "600" }}>{user?.username || "Invité"}</span> !
            </p>
            <p style={{ marginTop: "8px", color: "#9ca3af" }}>
                Ceci est votre tableau de bord personnel. Utilisez le menu latéral pour naviguer.
            </p>
        </div>
    );
}
