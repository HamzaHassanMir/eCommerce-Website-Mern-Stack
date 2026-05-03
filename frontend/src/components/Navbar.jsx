import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CardContext } from "../Context/CardContext"

const Navbar = () => {
  const { cart } = useContext(CardContext);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: scrolled ? "rgba(250,247,242,0.97)" : "#FAF7F2",
          borderBottom: "1px solid #D9D2C5",
          backdropFilter: "blur(8px)",
          transition: "all 0.3s ease",
          boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.06)" : "none",
        }}
      >
        {/* Top announcement bar */}
        <div
          style={{
            backgroundColor: "#1A1A1A",
            color: "#E2C97E",
            textAlign: "center",
            padding: "8px",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 500,
          }}
        >
          Free shipping on orders above PKR 5,000 &nbsp;|&nbsp; New Collection Available Now
        </div>

        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "72px",
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "26px",
              fontWeight: 600,
              color: "#1A1A1A",
              textDecoration: "none",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Mir
            <span style={{ color: "#C9A84C", marginLeft: "2px" }}>.</span>
          </Link>

          {/* Desktop Nav Links */}
          <div
            style={{
              display: "flex",
              gap: "36px",
              alignItems: "center",
            }}
            className="desktop-nav"
          >
            {[
              { to: "/", label: "Collections" },
              { to: "/login", label: "Account" },
              { to: "/register", label: "Register" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: location.pathname === to ? "#C9A84C" : "#1A1A1A",
                  textDecoration: "none",
                  transition: "color 0.2s",
                  paddingBottom: "2px",
                  borderBottom: location.pathname === to ? "1px solid #C9A84C" : "1px solid transparent",
                }}
              >
                {label}
              </Link>
            ))}

            {/* Cart Icon */}
            <Link
              to="/cart"
              style={{
                position: "relative",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#1A1A1A",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cart.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-10px",
                    backgroundColor: "#C9A84C",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "16px",
                    height: "16px",
                    fontSize: "9px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacer to push content below fixed navbar */}
      <div style={{ height: "108px" }} />
    </>
  );
};

export default Navbar;
