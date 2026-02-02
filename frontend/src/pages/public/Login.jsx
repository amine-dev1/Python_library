import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, me as apiMe } from "../../api/auth.api";
import { useAuth } from "../../auth/AuthContext";
import "./Auth.css";

const styles = {
  loginPage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
  },
  authContainer: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: "340px",
    padding: "32px 28px",
    borderRadius: "16px",
    backdropFilter: "blur(12px)",
    backgroundColor: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    textAlign: "center",
    color: "#fff",
  },
  logo: {
    fontSize: "1.8rem",
    marginBottom: "12px",
    display: "block",
  },
  h2: {
    fontSize: "1.3rem",
    margin: "0 0 4px",
  },
  h3: {
    fontSize: "0.8rem",
    margin: "0 0 20px",
    opacity: 0.6,
    fontWeight: 400,
  },
  textbox: {
    position: "relative",
    marginBottom: "16px",
  },
  input: {
    width: "100%",
    height: "40px",
    fontSize: "0.85rem",
    padding: "0 10px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#fff",
    outline: "none",
    boxSizing: "border-box",
  },
  label: {
    position: "absolute",
    top: "50%",
    left: "10px",
    transform: "translateY(-50%)",
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.5)",
    pointerEvents: "none",
    transition: "all 0.2s ease",
  },
  errorMessage: {
    color: "#ff6b6b",
    fontSize: "0.75rem",
    marginBottom: "8px",
    textAlign: "left",
  },
  forgotLink: {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.5)",
    fontSize: "0.75rem",
    cursor: "pointer",
    padding: "4px 0",
    display: "block",
    textAlign: "right",
    marginBottom: "12px",
  },
  submitBtn: {
    width: "100%",
    height: "38px",
    fontSize: "0.85rem",
    fontWeight: 600,
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
    color: "#fff",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  footerText: {
    fontSize: "0.75rem",
    marginTop: "18px",
    opacity: 0.6,
  },
  signUpLink: {
    background: "none",
    border: "none",
    color: "#a78bfa",
    fontSize: "0.75rem",
    cursor: "pointer",
    padding: 0,
    fontWeight: 600,
  },
  // ── background elements ──
  starfield: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
  },
  moon: {
    position: "absolute",
    top: "8%",
    right: "12%",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "radial-gradient(circle at 35% 35%, #ffe8a3, #d4a017)",
    boxShadow: "0 0 30px rgba(255,220,100,0.4)",
    zIndex: 1,
  },
  crater: {
    position: "absolute",
    borderRadius: "50%",
    background: "rgba(0,0,0,0.15)",
  },
  nebula: {
    position: "absolute",
    top: "20%",
    left: "10%",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)",
    zIndex: 1,
    filter: "blur(40px)",
  },
  orbit: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.05)",
    transform: "translate(-50%, -50%)",
    zIndex: 1,
  },
  shootingStar: {
    position: "absolute",
    width: "80px",
    height: "2px",
    background: "linear-gradient(to right, #fff, transparent)",
    zIndex: 1,
    opacity: 0,
    animation: "shoot 4s linear infinite",
  },
  planet: {
    position: "absolute",
    borderRadius: "50%",
    zIndex: 1,
  },
  star: {
    position: "absolute",
    width: "2px",
    height: "2px",
    borderRadius: "50%",
    background: "#fff",
    animation: "twinkle 3s ease-in-out infinite alternate",
  },
};

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
      star.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        border-radius: 50%;
        background: #fff;
        animation: twinkle 3s ease-in-out infinite alternate;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 3}s;
        opacity: ${Math.random() * 0.7 + 0.3};
      `;
      container.appendChild(star);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await apiLogin({ username, password });
      const { access_token } = response.data;

      localStorage.setItem("access_token", access_token);
      const userResponse = await apiMe();
      const user = userResponse.data || userResponse;

      login(access_token, user);

      if (user.role === "ADMIN") {
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
    <>
      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }
        @keyframes shoot {
          0% { top: 10%; left: -10%; opacity: 1; transform: rotate(35deg); }
          100% { top: 40%; left: 110%; opacity: 0; transform: rotate(35deg); }
        }
        .login-input:focus {
          border-color: rgba(167,139,250,0.6) !important;
          box-shadow: 0 0 8px rgba(167,139,250,0.3);
        }
        .login-input:focus + .login-label,
        .login-input:not(:placeholder-shown) + .login-label {
          top: -8px;
          font-size: 0.65rem;
          background: rgba(30,20,60,0.8);
          padding: 0 6px;
          border-radius: 4px;
        }
        .submit-btn-login:hover {
          opacity: 0.85;
        }
      `}</style>

      <div style={{ ...styles.loginPage, background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}>
        {/* ── starfield ── */}
        <div style={styles.starfield} ref={starfieldRef} />

        {/* ── moon ── */}
        <div style={styles.moon}>
          <div style={{ ...styles.crater, width: "18px", height: "18px", top: "22%", left: "25%" }} />
          <div style={{ ...styles.crater, width: "10px", height: "10px", top: "55%", left: "60%" }} />
          <div style={{ ...styles.crater, width: "14px", height: "14px", top: "65%", left: "20%" }} />
          <div style={{ ...styles.crater, width: "8px", height: "8px", top: "30%", left: "65%" }} />
        </div>

        {/* ── nebula ── */}
        <div style={styles.nebula} />

        {/* ── orbit ── */}
        <div style={styles.orbit} />

        {/* ── shooting stars ── */}
        <div style={{ ...styles.shootingStar, animationDelay: "0s" }} />
        <div style={{ ...styles.shootingStar, animationDelay: "2s", top: "30%", left: "20%" }} />
        <div style={{ ...styles.shootingStar, animationDelay: "4s", top: "60%", left: "50%" }} />

        {/* ── planets ── */}
        <div style={{ ...styles.planet, width: "40px", height: "40px", bottom: "15%", left: "8%", background: "radial-gradient(circle at 35% 35%, #e88a6a, #c0392b)" }} />
        <div style={{ ...styles.planet, width: "24px", height: "24px", top: "60%", right: "15%", background: "radial-gradient(circle at 35% 35%, #6abfce, #2e86ab)" }} />

        {/* ── auth card ── */}
        <div style={styles.authContainer}>
          <span style={styles.logo}>✦</span>
          <h2 style={styles.h2}>Welcome Back</h2>
          <h3 style={styles.h3}>Sign in to continue</h3>

          <form onSubmit={handleSubmit} noValidate>
            {/* username */}
            <div style={styles.textbox}>
              <input
                className="login-input"
                type="text"
                placeholder=" "
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
              />
              <label className="login-label" style={styles.label}>Username</label>
            </div>

            {/* password */}
            <div style={styles.textbox}>
              <input
                className="login-input"
                type="password"
                placeholder=" "
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
              <label className="login-label" style={styles.label}>Password</label>
            </div>

            {error && <p style={styles.errorMessage}>{error}</p>}

            <button
              type="button"
              className="forgot-link-login"
              style={styles.forgotLink}
              onClick={() => navigate("/forgot-password")}
              onMouseEnter={(e) => (e.target.style.color = "#a78bfa")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.5)")}
            >
              Forgot Password?
            </button>

            <button
              type="submit"
              className="submit-btn-login"
              style={styles.submitBtn}
            >
              Sign In
            </button>
          </form>

          <p style={styles.footerText}>
            Don't have an account?{" "}
            <button
              type="button"
              style={styles.signUpLink}
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </>
  );
}