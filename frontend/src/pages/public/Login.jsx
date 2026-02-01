import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, me as apiMe } from "../../api/auth.api";
import { useAuth } from "../../auth/AuthContext";
import "./Auth.css";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const starfieldRef = useRef(null);

    // Generate 200 random stars once on mount
    useEffect(() => {
        const container = starfieldRef.current;
        if (!container || container.children.length > 0) return;

        for (let i = 0; i < 200; i++) {
            const star = document.createElement("div");
            star.className = "star";
            star.style.left = Math.random() * 100 + "%";
            star.style.top = Math.random() * 100 + "%";
            star.style.animationDelay = Math.random() * 3 + "s";
            star.style.opacity = Math.random() * 0.7 + 0.3;
            container.appendChild(star);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await apiLogin({ username, password });
            const { access_token } = response.data;

            // Set token temporarily to fetch user profile
            localStorage.setItem("access_token", access_token);
            const userResponse = await apiMe();
            const user = userResponse.data || userResponse;

            // Update Auth Context
            login(access_token, user);

            // Redirect based on role
            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/user");
            }
        } catch (err) {
            console.error(err);
            setError("Invalid credentials. Please try again.");
            localStorage.removeItem("access_token");
        }
    };

    return (
        <div className="login-page">
            {/* ── background layers ── */}
            <div className="starfield" ref={starfieldRef} />

            <div className="moon">
                <div className="crater" />
                <div className="crater" />
                <div className="crater" />
                <div className="crater" />
            </div>

            <div className="nebula" />
            <div className="orbit" />

            <div className="shooting-star" />
            <div className="shooting-star" />
            <div className="shooting-star" />

            <div className="planet" />
            <div className="planet" />

            {/* ── auth card ── */}
            <div className="auth-container">
                <div className="logo">✦</div>

                <h2>Welcome Back</h2>
                <h3>Sign in to continue</h3>

                <div className="form-container">
                    <form onSubmit={handleSubmit} noValidate>
                        {/* username */}
                        <div className="textbox">
                            <input
                                type="text"
                                placeholder=" "
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <label>Username</label>
                        </div>

                        {/* password */}
                        <div className="textbox">
                            <input
                                type="password"
                                placeholder=" "
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label>Password</label>
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        {/* forgot password nav */}
                        <button
                            type="button"
                            className="forgot-link"
                            onClick={() => navigate("/forgot-password")}
                        >
                            Forgot Password?
                        </button>

                        <button type="submit" className="submit-btn">
                            Sign In
                        </button>
                    </form>

                    <p className="footer-text">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            className="link"
                            onClick={() => navigate("/register")}
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}