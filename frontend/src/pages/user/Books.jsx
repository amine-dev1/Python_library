import { useState, useEffect } from "react";
import { getBooks } from "../../api/books.api";
import { borrowBook } from "../../api/loans.api";
import { BookOpen, User as UserIcon, Calendar, CheckCircle } from "lucide-react";

export default function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [borrowing, setBorrowing] = useState(null);

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            const res = await getBooks();
            setBooks(res.data);
        } catch (error) {
            console.error("Erreur lors du chargement des livres:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBorrow = async (bookId) => {
        setBorrowing(bookId);
        try {
            await borrowBook(bookId);
            // Refresh books to update availability
            await loadBooks();
            alert("Livre emprunté avec succès !");
        } catch (error) {
            console.error("Erreur lors de l'emprunt:", error);
            alert("Impossible d'emprunter ce livre.");
        } finally {
            setBorrowing(null);
        }
    };

    if (loading) return <div style={{ color: "white" }}>Chargement...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: "24px", fontSize: "28px", fontWeight: "bold" }}>Livres Disponibles</h1>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
                {books.map((book) => (
                    <div
                        key={book.id}
                        style={{
                            background: "rgba(255, 255, 255, 0.05)",
                            borderRadius: "16px",
                            padding: "20px",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#fff" }}>{book.title}</h3>
                            <span style={{
                                fontSize: "12px",
                                background: "rgba(168, 85, 247, 0.2)",
                                color: "#d8b4fe",
                                padding: "4px 8px",
                                borderRadius: "999px"
                            }}>
                                {book.category}
                            </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#9ca3af", fontSize: "14px" }}>
                            <UserIcon size={16} />
                            <span>{book.author}</span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#9ca3af", fontSize: "14px" }}>
                            <Calendar size={16} />
                            <span>{book.publication_year}</span>
                        </div>

                        <div style={{ marginTop: "auto", paddingTop: "16px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                <span style={{ color: "#9ca3af", fontSize: "14px" }}>Disponibilité:</span>
                                <span style={{
                                    color: book.available_copies > 0 ? "#4ade80" : "#ef4444",
                                    fontWeight: "500"
                                }}>
                                    {book.available_copies} / {book.total_copies}
                                </span>
                            </div>

                            <button
                                onClick={() => handleBorrow(book.id)}
                                disabled={book.available_copies === 0 || borrowing === book.id}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    border: "none",
                                    background: book.available_copies > 0
                                        ? "linear-gradient(135deg, #a855f7, #9333ea)"
                                        : "rgba(255, 255, 255, 0.1)",
                                    color: book.available_copies > 0 ? "#fff" : "#6b7280",
                                    cursor: book.available_copies > 0 ? "pointer" : "not-allowed",
                                    fontWeight: "500",
                                    transition: "all 0.2s"
                                }}
                            >
                                {borrowing === book.id ? "Traitement..." :
                                    book.available_copies > 0 ? "Emprunter" : "Indisponible"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
