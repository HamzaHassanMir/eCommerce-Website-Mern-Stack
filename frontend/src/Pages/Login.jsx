import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data || "Login failed. Please check your credentials.");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/");
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #D9D2C5",
    background: "#FAF7F2",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "12px",
    letterSpacing: "0.04em",
    color: "#1A1A1A",
    outline: "none",
    marginBottom: "16px",
    transition: "border-color 0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF7F2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#C9A84C",
              marginBottom: "12px",
            }}
          >
            Welcome Back
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "40px",
              fontWeight: 400,
              color: "#1A1A1A",
              letterSpacing: "0.04em",
              marginBottom: "12px",
            }}
          >
            Sign In
          </h1>
          <div style={{ width: "36px", height: "1px", background: "#C9A84C", margin: "0 auto" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                padding: "12px 16px",
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#B91C1C",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.04em",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label
              style={{
                display: "block",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#8A8073",
                marginBottom: "8px",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#1A1A1A")}
              onBlur={(e) => (e.target.style.borderColor = "#D9D2C5")}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "9px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#8A8073",
                marginBottom: "8px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#1A1A1A")}
              onBlur={(e) => (e.target.style.borderColor = "#D9D2C5")}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: loading ? "#8A8073" : "#1A1A1A",
              color: "#FAF7F2",
              border: "none",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "8px",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) => { if (!loading) e.target.style.background = "#C9A84C"; }}
            onMouseLeave={(e) => { if (!loading) e.target.style.background = "#1A1A1A"; }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            margin: "28px 0",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "#D9D2C5" }} />
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.1em",
              color: "#8A8073",
            }}
          >
            OR
          </span>
          <div style={{ flex: 1, height: "1px", background: "#D9D2C5" }} />
        </div>

        <p style={{ textAlign: "center", fontFamily: "'Montserrat', sans-serif", fontSize: "12px", color: "#8A8073" }}>
          New to Mir?{" "}
          <Link
            to="/register"
            style={{ color: "#1A1A1A", fontWeight: 500, textDecoration: "underline" }}
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
