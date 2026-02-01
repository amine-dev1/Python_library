import { register as registerApi } from "../../api/auth.api";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
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
            await registerApi(formData);
            navigate("/login");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Registration failed");
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

                <h2>Create Account</h2>
                <h3>Join us today</h3>

                <div className="form-container">
                    <form onSubmit={handleSubmit} noValidate>
                        {/* username */}
                        <div className="textbox">
                            <input
                                type="text"
                                placeholder=" "
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                            <label>Username</label>
                        </div>

                        {/* email */}
                        <div className="textbox">
                            <input
                                type="email"
                                placeholder=" "
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <label>Email</label>
                        </div>

                        {/* password */}
                        <div className="textbox">
                            <input
                                type="password"
                                placeholder=" "
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <label>Password</label>
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" className="submit-btn">
                            Sign Up
                        </button>
                    </form>

                    <p className="footer-text">
                        Already have an account?{" "}
                        <button
                            type="button"
                            className="link"
                            onClick={() => navigate("/login")}
                        >
                            Log in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
