import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, loansService, booksService, usersService } from '../api';
import '../components/Dashboard.css';

function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('loans');
    const [loans, setLoans] = useState([]);
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check authentication
        if (!authService.isAuthenticated()) {
            navigate('/login');
            return;
        }

        const currentUser = authService.getStoredUser();

        // Check if user is admin
        if (currentUser.role !== 'admin') {
            navigate('/dashboard');
            return;
        }

        setUser(currentUser);
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        setLoading(true);
        setError('');

        try {
            console.log('Admin Dashboard: Fetching all loans...');
            const [loansData, booksData, usersData] = await Promise.all([
                loansService.getAllLoans(),
                booksService.getAllBooks(),
                usersService.getAllUsers()
            ]);

            console.log('Loans data received:', loansData);
            console.log('Books data received:', booksData);
            console.log('Users data received:', usersData);

            setLoans(loansData);
            setBooks(booksData);
            setUsers(usersData);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.response?.data?.detail || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await authService.logout();
        navigate('/login');
    };

    const handleReturnBook = async (loanId) => {
        if (!confirm('Mark this loan as returned?')) return;

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

    const activeLoans = loans.filter(loan =>
        loan.status === 'borrowed' || loan.status === 'overdue'
    );
    const overdueLoans = loans.filter(loan => loan.status === 'overdue');

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>📚 Admin Dashboard</h1>
                    <div className="user-info">
                        <span className="user-name">👤 {user.username}</span>
                        <span className="user-role admin-badge">ADMIN</span>
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
                        <div className="stat-value">{loans.length}</div>
                        <div className="stat-label">Total Loans</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🔄</div>
                    <div className="stat-info">
                        <div className="stat-value">{activeLoans.length}</div>
                        <div className="stat-label">Active Loans</div>
                    </div>
                </div>
                <div className="stat-card alert">
                    <div className="stat-icon">⚠️</div>
                    <div className="stat-info">
                        <div className="stat-value">{overdueLoans.length}</div>
                        <div className="stat-label">Overdue</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-info">
                        <div className="stat-value">{books.length}</div>
                        <div className="stat-label">Total Books</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <div className="stat-value">{users.length}</div>
                        <div className="stat-label">Total Users</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'loans' ? 'active' : ''}`}
                    onClick={() => setActiveTab('loans')}
                >
                    All Loans
                </button>
                <button
                    className={`tab ${activeTab === 'books' ? 'active' : ''}`}
                    onClick={() => setActiveTab('books')}
                >
                    Books
                </button>
                <button
                    className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
            </div>

            {/* Content */}
            <div className="dashboard-content">
                {error && <div className="error-banner">{error}</div>}

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <>
                        {/* Loans Tab */}
                        {activeTab === 'loans' && (
                            <div className="data-table">
                                <h2>All Loans ({loans.length})</h2>
                                {loans.length === 0 ? (
                                    <p className="empty-state">No loans found in the system. Users haven't borrowed any books yet.</p>
                                ) : (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>User ID</th>
                                                <th>Book ID</th>
                                                <th>Loan Date</th>
                                                <th>Due Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loans.map(loan => (
                                                <tr key={loan.id}>
                                                    <td>{loan.id}</td>
                                                    <td>{loan.user_id}</td>
                                                    <td>{loan.book_id}</td>
                                                    <td>{new Date(loan.loan_date).toLocaleDateString()}</td>
                                                    <td>{new Date(loan.due_date).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className={`status-badge ${loan.status}`}>
                                                            {loan.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {loan.status !== 'returned' && (
                                                            <button
                                                                onClick={() => handleReturnBook(loan.id)}
                                                                className="btn-action"
                                                            >
                                                                Return
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}

                        {/* Books Tab */}
                        {activeTab === 'books' && (
                            <div className="data-table">
                                <h2>All Books ({books.length})</h2>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Title</th>
                                            <th>Author</th>
                                            <th>Category</th>
                                            <th>Available</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {books.map(book => (
                                            <tr key={book.id}>
                                                <td>{book.id}</td>
                                                <td>{book.title}</td>
                                                <td>{book.author}</td>
                                                <td>{book.category}</td>
                                                <td>{book.available_copies}</td>
                                                <td>{book.total_copies}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Users Tab */}
                        {activeTab === 'users' && (
                            <div className="data-table">
                                <h2>All Users ({users.length})</h2>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <span className={`role-badge ${user.role}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                                                        {user.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
