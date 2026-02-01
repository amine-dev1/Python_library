import { useState } from 'react';
import Login from './Login';
import Register from './Register';

function AuthPage() {
    const [showLogin, setShowLogin] = useState(true);
    const [user, setUser] = useState(null);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
    };

    const handleRegisterSuccess = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    };

    // If user is logged in, show welcome screen
    if (user) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '20px'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '40px',
                    maxWidth: '500px',
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto 20px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '40px'
                    }}>
                        👤
                    </div>
                    <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>Welcome, {user.username}!</h2>
                    <p style={{ margin: '0 0 20px 0', color: '#666' }}>
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p style={{ margin: '0 0 20px 0', color: '#666' }}>
                        <strong>Role:</strong> <span style={{
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            color: user.role === 'admin' ? '#e74c3c' : '#3498db'
                        }}>{user.role}</span>
                    </p>
                    <p style={{ margin: '0 0 30px 0', color: '#666' }}>
                        <strong>Status:</strong> {user.is_active ? '✅ Active' : '❌ Inactive'}
                    </p>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '12px 30px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    // Show login or register form
    return showLogin ? (
        <Login
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setShowLogin(false)}
        />
    ) : (
        <Register
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setShowLogin(true)}
        />
    );
}

export default AuthPage;
