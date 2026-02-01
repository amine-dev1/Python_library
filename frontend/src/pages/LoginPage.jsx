import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';

function LoginPage() {
    const [showLogin, setShowLogin] = useState(true);
    const navigate = useNavigate();

    const handleLoginSuccess = (user) => {
        // Redirect based on user role
        if (user.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
    };

    const handleRegisterSuccess = (user) => {
        // Redirect based on user role
        if (user.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
    };

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

export default LoginPage;
