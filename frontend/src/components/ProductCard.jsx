import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CardContext } from "../Context/CardContext"; // ✅ FIX: addToCart from context, not prop

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CardContext); // ✅ FIX: was received as a prop but never passed
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 16px 40px rgba(0,0,0,0.1)"
          : "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      {/* Image */}
      <Link to={`/product/${product._id}`} style={{ display: "block", position: "relative" }}>
        <div style={{ overflow: "hidden", height: "320px" }}>
          <img
            src={product.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop"}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.5s ease",
              transform: hovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        </div>

        {/* Hover overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(26,26,26,0.2)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 500,
              borderBottom: "1px solid rgba(255,255,255,0.6)",
              paddingBottom: "2px",
            }}
          >
            View Details
          </span>
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: "20px 20px 24px" }}>
        <div
          style={{
            width: "24px",
            height: "1px",
            background: "#C9A84C",
            marginBottom: "12px",
          }}
        />
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "18px",
            fontWeight: 500,
            color: "#1A1A1A",
            marginBottom: "4px",
            letterSpacing: "0.04em",
          }}
        >
          {product.name}
        </h2>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "12px",
            color: "#8A8073",
            letterSpacing: "0.06em",
            marginBottom: "16px",
          }}
        >
          PKR {product.price?.toLocaleString()}
        </p>

        <button
          onClick={handleAdd}
          style={{
            width: "100%",
            padding: "11px",
            background: added ? "#C9A84C" : "#1A1A1A",
            color: "#fff",
            border: "none",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          {added ? "✓ Added to Bag" : "Add to Bag"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
