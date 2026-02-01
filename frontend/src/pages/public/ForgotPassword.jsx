import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Reset password for:", email);
        alert("If this email exists, a reset link has been sent. (Demo)");
        navigate("/login");
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

                <h2>Reset Password</h2>
                <h3>Enter your email to continue</h3>

                <div className="form-container">
                    <form onSubmit={handleSubmit} noValidate>
                        {/* email */}
                        <div className="textbox">
                            <input
                                type="email"
                                placeholder=" "
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label>Email</label>
                        </div>

                        <button type="submit" className="submit-btn">
                            Send Reset Link
                        </button>
                    </form>

                    <p className="footer-text">
                        Remember your password?{" "}
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
