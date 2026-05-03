import React, { useParams, useEffect, useState, useContext } from "react";
import { CardContext } from "../Context/CardContext";
import { Link } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart } = useContext(CardContext);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]); // ✅ FIX: `id` was missing from dependency array

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", color: "#8A8073", letterSpacing: "0.1em" }}>
          Loading...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", color: "#8A8073" }}>
          Product not found
        </p>
        <Link to="/" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#1A1A1A", textDecoration: "underline" }}>
          Back to Collections
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF7F2" }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 40px" }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "10px", letterSpacing: "0.14em", color: "#8A8073" }}>
          <Link to="/" style={{ color: "#8A8073", textDecoration: "none" }}>Collections</Link>
          {" / "}
          <span style={{ color: "#1A1A1A" }}>{product.name}</span>
        </p>
      </div>

      {/* Product Layout */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 40px 80px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "start",
        }}
      >
        {/* Image */}
        <div style={{ position: "sticky", top: "120px" }}>
          <img
            src={product.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=720&fit=crop"}
            alt={product.name}
            style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover" }}
          />
        </div>

        {/* Details */}
        <div style={{ paddingTop: "20px" }}>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#C9A84C",
              marginBottom: "16px",
            }}
          >
            New Season
          </p>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "48px",
              fontWeight: 400,
              color: "#1A1A1A",
              letterSpacing: "0.04em",
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            {product.name}
          </h1>

          <div style={{ width: "36px", height: "1px", background: "#C9A84C", marginBottom: "20px" }} />

          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "28px",
              fontWeight: 400,
              color: "#1A1A1A",
              letterSpacing: "0.02em",
              marginBottom: "28px",
            }}
          >
            PKR {product.price?.toLocaleString()}
          </p>

          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "13px",
              fontWeight: 300,
              color: "#8A8073",
              lineHeight: 1.9,
              letterSpacing: "0.04em",
              marginBottom: "40px",
              maxWidth: "440px",
            }}
          >
            {product.description || "A masterfully crafted piece from our latest collection. Designed to transcend seasons, this piece embodies our commitment to timeless elegance and uncompromising quality."}
          </p>

          <button
            onClick={handleAdd}
            style={{
              width: "100%",
              padding: "18px",
              background: added ? "#C9A84C" : "#1A1A1A",
              color: "#FAF7F2",
              border: "none",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 0.3s",
              marginBottom: "16px",
            }}
          >
            {added ? "✓ Added to Bag" : "Add to Bag"}
          </button>

          <Link
            to="/cart"
            style={{
              display: "block",
              textAlign: "center",
              padding: "17px",
              background: "transparent",
              border: "1px solid #1A1A1A",
              color: "#1A1A1A",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => { e.target.style.background = "#1A1A1A"; e.target.style.color = "#FAF7F2"; }}
            onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#1A1A1A"; }}
          >
            View Bag
          </Link>

          {/* Care info */}
          <div style={{ marginTop: "48px", borderTop: "1px solid #D9D2C5", paddingTop: "28px" }}>
            {[
              { icon: "✦", label: "Premium Quality Fabric" },
              { icon: "✦", label: "Free shipping over PKR 5,000" },
              { icon: "✦", label: "Easy 14-day returns" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <span style={{ color: "#C9A84C", fontSize: "8px" }}>{icon}</span>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", letterSpacing: "0.08em", color: "#8A8073" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
