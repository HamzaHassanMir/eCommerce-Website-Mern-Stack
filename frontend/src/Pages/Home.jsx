import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF7F2" }}>
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          height: "70vh",
          minHeight: "480px",
          background: "linear-gradient(135deg, #1A1A1A 0%, #2C2418 100%)",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          marginBottom: "80px",
        }}
      >
        {/* Decorative background text */}
        <div
          style={{
            position: "absolute",
            right: "-40px",
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(80px, 15vw, 200px)",
            fontWeight: 300,
            color: "rgba(201,168,76,0.06)",
            letterSpacing: "0.1em",
            userSelect: "none",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          Hamza Mir
        </div>

        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 60px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#C9A84C",
              marginBottom: "20px",
            }}
          >
            New Season · 2026
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(48px, 7vw, 96px)",
              fontWeight: 300,
              color: "#FAF7F2",
              lineHeight: 1.05,
              letterSpacing: "0.02em",
              marginBottom: "24px",
              maxWidth: "600px",
            }}
          >
            Crafted for the<br />
            <em style={{ fontStyle: "italic", color: "#E2C97E" }}>Discerning</em>
          </h1>
          <div
            style={{
              width: "48px",
              height: "1px",
              background: "#C9A84C",
              marginBottom: "24px",
            }}
          />
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "13px",
              fontWeight: 300,
              color: "rgba(250,247,242,0.6)",
              letterSpacing: "0.06em",
              marginBottom: "40px",
              maxWidth: "420px",
              lineHeight: 1.8,
            }}
          >
            Timeless silhouettes. Premium fabrics. A wardrobe curated for those who understand the difference.
          </p>
          <a
            href="#collection"
            style={{
              display: "inline-block",
              padding: "14px 44px",
              background: "transparent",
              border: "1px solid #C9A84C",
              color: "#C9A84C",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#C9A84C";
              e.target.style.color = "#1A1A1A";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#C9A84C";
            }}
          >
            Explore Collection
          </a>
        </div>

        {/* Bottom gradient */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "80px",
            background: "linear-gradient(to top, #FAF7F2, transparent)",
          }}
        />
      </section>

      {/* Collection Header */}
      <div
        id="collection"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 40px",
          marginBottom: "48px",
          textAlign: "center",
        }}
      >
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
          Our Collection
        </p>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 400,
            color: "#1A1A1A",
            letterSpacing: "0.04em",
            marginBottom: "16px",
          }}
        >
          The New Arrivals
        </h2>
        <div
          style={{
            width: "48px",
            height: "1px",
            background: "#C9A84C",
            margin: "0 auto",
          }}
        />
      </div>

      {/* Product Grid */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 40px 80px",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "32px",
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  background: "#F0EBE3",
                  height: "440px",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "24px",
                color: "#8A8073",
                letterSpacing: "0.06em",
              }}
            >
              Collection coming soon
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "32px",
            }}
          >
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Brand strip */}
      <section
        style={{
          background: "#1A1A1A",
          padding: "60px 40px",
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#C9A84C",
            marginBottom: "16px",
          }}
        >
          Our Promise
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(32px, 6vw, 80px)",
            flexWrap: "wrap",
          }}
        >
          {["Premium Fabric", "Handcrafted Details", "Timeless Design", "Free Returns"].map((item) => (
            <div key={item} style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "18px",
                  color: "#FAF7F2",
                  letterSpacing: "0.06em",
                  fontWeight: 400,
                }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
