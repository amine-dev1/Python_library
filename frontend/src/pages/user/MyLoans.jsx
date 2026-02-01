import { useState, useEffect } from "react";
import { myLoans, returnBook } from "../../api/loans.api";
import { Calendar, BookOpen, Clock, AlertCircle } from "lucide-react";

export default function MyLoans() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [returning, setReturning] = useState(null);

    useEffect(() => {
        loadLoans();
    }, []);

    const loadLoans = async () => {
        try {
            const res = await myLoans();
            setLoans(res.data);
        } catch (error) {
            console.error("Erreur lors du chargement des emprunts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (loanId) => {
        if (!confirm("Voulez-vous vraiment retourner ce livre ?")) return;

        setReturning(loanId);
        try {
            await returnBook(loanId);
            await loadLoans();
        } catch (error) {
            console.error("Erreur lors du retour:", error);
            alert("Erreur lors du retour du livre.");
        } finally {
            setReturning(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'RETURNED': return '#4ade80';
            case 'OVERDUE': return '#ef4444';
            default: return '#fbbf24';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'RETURNED': return 'Retourné';
            case 'OVERDUE': return 'En retard';
            default: return 'En cours';
        }
    };

    if (loading) return <div style={{ color: "white" }}>Chargement...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: "24px", fontSize: "28px", fontWeight: "bold" }}>Mes Emprunts</h1>

            <div style={{ display: "grid", gap: "16px" }}>
                {loans.map((loan) => (
                    <div
                        key={loan.id}
                        style={{
                            background: "rgba(255, 255, 255, 0.05)",
                            borderRadius: "16px",
                            padding: "20px",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                            gap: "16px",
                            alignItems: "center"
                        }}
                    >
                        <div>
                            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#fff", marginBottom: "8px" }}>
                                {loan.book ? loan.book.title : "Livre inconnu"}
                            </h3>

                            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#9ca3af", fontSize: "14px" }}>
                                    <Calendar size={16} />
                                    <span>Emprunté le: {formatDate(loan.loan_date)}</span>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#9ca3af", fontSize: "14px" }}>
                                    <Clock size={16} />
                                    <span>Date limite: {formatDate(loan.due_date)}</span>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
                                    <AlertCircle size={16} color={getStatusColor(loan.status)} />
                                    <span style={{ color: getStatusColor(loan.status) }}>
                                        {getStatusText(loan.status)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {loan.status === 'BORROWED' && (
                            <button
                                onClick={() => handleReturn(loan.id)}
                                disabled={returning === loan.id}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "8px",
                                    border: "1px solid rgba(168, 85, 247, 0.5)",
                                    background: "rgba(168, 85, 247, 0.1)",
                                    color: "#a855f7",
                                    cursor: "pointer",
                                    fontWeight: "500",
                                    transition: "all 0.2s"
                                }}
                            >
                                {returning === loan.id ? "..." : "Retourner"}
                            </button>
                        )}
                    </div>
                ))}

                {loans.length === 0 && (
                    <div style={{ textAlign: "center", padding: "48px", color: "#6b7280" }}>
                        Vous n'avez aucun emprunt en cours.
                    </div>
                )}
            </div>
        </div>
    );
}
