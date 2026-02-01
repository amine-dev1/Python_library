import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, loansService, booksService } from '../api';
import '../components/Dashboard.css';

function UserDashboard() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('books');
    const [myLoans, setMyLoans] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check authentication
        if (!authService.isAuthenticated()) {
            navigate('/login');
            return;
        }

        const currentUser = authService.getStoredUser();
        setUser(currentUser);
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        setLoading(true);
        setError('');

        try {
            const [loansData, booksData] = await Promise.all([
                loansService.getMyLoans(),
                booksService.getAllBooks()
            ]);

            setMyLoans(loansData);
            setBooks(booksData);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await authService.logout();
        navigate('/login');
    };

    const handleBorrowBook = async (bookId) => {
        if (!confirm('Borrow this book for 14 days?')) return;

        try {
            await loansService.borrowBook(bookId, 14);
            alert('Book borrowed successfully!');
            fetchData();
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to borrow book');
        }
    };

    const handleReturnBook = async (loanId) => {
        if (!confirm('Return this book?')) return;

        try {
            await loansService.returnBook(loanId);
            alert('Book returned successfully!');
            fetchData();
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to return book');
        }
    };

    if (!user) {
        return <div className="loading">Loading...</div>;
    }

    const activeLoans = myLoans.filter(loan =>
        loan.status === 'borrowed' || loan.status === 'overdue'
    );
    const loanHistory = myLoans.filter(loan => loan.status === 'returned');

    const filteredBooks = searchQuery
        ? books.filter(book =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : books;

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>📚 My Library</h1>
                    <div className="user-info">
                        <span className="user-name">👤 {user.username}</span>
                        <button onClick={handleLogout} className="btn-logout">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📖</div>
                    <div className="stat-info">
                        <div className="stat-value">{activeLoans.length}</div>
                        <div className="stat-label">Active Loans</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <div className="stat-value">{loanHistory.length}</div>
                        <div className="stat-label">Returned</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-info">
                        <div className="stat-value">{books.filter(b => b.available_copies > 0).length}</div>
                        <div className="stat-label">Available Books</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'books' ? 'active' : ''}`}
                    onClick={() => setActiveTab('books')}
                >
                    Browse Books
                </button>
                <button
                    className={`tab ${activeTab === 'loans' ? 'active' : ''}`}
                    onClick={() => setActiveTab('loans')}
                >
                    My Loans
                </button>
            </div>

            {/* Content */}
            <div className="dashboard-content">
                {error && <div className="error-banner">{error}</div>}

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <>
                        {/* Books Tab */}
                        {activeTab === 'books' && (
                            <div>
                                <div className="search-bar">
                                    <input
                                        type="text"
                                        placeholder="Search by title, author, or category..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <div className="books-grid">
                                    {filteredBooks.map(book => (
                                        <div key={book.id} className="book-card">
                                            <h3>{book.title}</h3>
                                            <p className="book-author">by {book.author}</p>
                                            <p className="book-category">{book.category}</p>
                                            <p className="book-availability">
                                                Available: {book.available_copies} / {book.total_copies}
                                            </p>
                                            {book.description && (
                                                <p className="book-description">{book.description}</p>
                                            )}
                                            <button
                                                onClick={() => handleBorrowBook(book.id)}
                                                disabled={book.available_copies === 0}
                                                className="btn-borrow"
                                            >
                                                {book.available_copies > 0 ? 'Borrow' : 'Not Available'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Loans Tab */}
                        {activeTab === 'loans' && (
                            <div>
                                <h2>Active Loans ({activeLoans.length})</h2>
                                {activeLoans.length === 0 ? (
                                    <p className="empty-state">No active loans</p>
                                ) : (
                                    <div className="loans-list">
                                        {activeLoans.map(loan => (
                                            <div key={loan.id} className="loan-card">
                                                <div className="loan-info">
                                                    <p><strong>Book ID:</strong> {loan.book_id}</p>
                                                    <p><strong>Borrowed:</strong> {new Date(loan.loan_date).toLocaleDateString()}</p>
                                                    <p><strong>Due:</strong> {new Date(loan.due_date).toLocaleDateString()}</p>
                                                    <p>
                                                        <strong>Status:</strong>{' '}
                                                        <span className={`status-badge ${loan.status}`}>
                                                            {loan.status}
                                                        </span>
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleReturnBook(loan.id)}
                                                    className="btn-return"
                                                >
                                                    Return
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <h2 style={{ marginTop: '40px' }}>Loan History ({loanHistory.length})</h2>
                                {loanHistory.length === 0 ? (
                                    <p className="empty-state">No loan history</p>
                                ) : (
                                    <div className="history-list">
                                        {loanHistory.slice(0, 10).map(loan => (
                                            <div key={loan.id} className="history-item">
                                                <span>Book ID: {loan.book_id}</span>
                                                <span>Borrowed: {new Date(loan.loan_date).toLocaleDateString()}</span>
                                                <span>Returned: {loan.return_date ? new Date(loan.return_date).toLocaleDateString() : 'N/A'}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default UserDashboard;
