import React, { useContext } from "react";
import { CardContext } from "../Context/CardContext"; // ✅ FIX: was importing CardContext but using CartContext
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(CardContext); // ✅ FIX: was useContext(CartContext) — wrong name

  const total = cart.reduce((acc, item) => acc + (item.price || 0), 0);

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to place an order.");
      return;
    }

    try {
      await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products: cart,
          totalAmount: total,
        }),
      });
      clearCart();
      alert("Order placed successfully!");
    } catch {
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF7F2" }}>
      {/* Page Header */}
      <div
        style={{
          background: "#1A1A1A",
          padding: "60px 40px",
          textAlign: "center",
          marginBottom: "60px",
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
            marginBottom: "10px",
          }}
        >
          Your Selection
        </p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "48px",
            fontWeight: 400,
            color: "#FAF7F2",
            letterSpacing: "0.06em",
          }}
        >
          Shopping Bag
        </h1>
      </div>

      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "0 40px 80px",
        }}
      >
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                border: "1px solid #D9D2C5",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A8073" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "24px",
                color: "#8A8073",
                marginBottom: "24px",
                letterSpacing: "0.06em",
              }}
            >
              Your bag is empty
            </p>
            <Link
              to="/"
              style={{
                display: "inline-block",
                padding: "13px 40px",
                background: "#1A1A1A",
                color: "#FAF7F2",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "48px", alignItems: "start" }}>
            {/* Items */}
            <div>
              {cart.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "24px",
                    padding: "24px 0",
                    borderBottom: "1px solid #D9D2C5",
                  }}
                >
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=120&fit=crop"}
                    alt={item.name}
                    style={{ width: "90px", height: "110px", objectFit: "cover", flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "20px",
                          fontWeight: 500,
                          color: "#1A1A1A",
                          marginBottom: "6px",
                        }}
                      >
                        {item.name}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: "12px",
                          color: "#8A8073",
                          letterSpacing: "0.04em",
                        }}
                      >
                        PKR {item.price?.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      style={{
                        background: "none",
                        border: "none",
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "10px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "#8A8073",
                        cursor: "pointer",
                        padding: 0,
                        textDecoration: "underline",
                        alignSelf: "flex-start",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "20px",
                      color: "#1A1A1A",
                      fontWeight: 500,
                      alignSelf: "center",
                    }}
                  >
                    PKR {item.price?.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div
              style={{
                background: "#fff",
                padding: "36px",
                border: "1px solid #D9D2C5",
                position: "sticky",
                top: "120px",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "22px",
                  fontWeight: 500,
                  color: "#1A1A1A",
                  letterSpacing: "0.06em",
                  marginBottom: "24px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid #D9D2C5",
                }}
              >
                Order Summary
              </h2>

              <div style={{ marginBottom: "16px" }}>
                {[
                  { label: `Subtotal (${cart.length} item${cart.length > 1 ? "s" : ""})`, value: `PKR ${total.toLocaleString()}` },
                  { label: "Shipping", value: total > 5000 ? "Free" : "PKR 250" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "12px",
                      color: "#8A8073",
                      letterSpacing: "0.04em",
                    }}
                  >
                    <span>{label}</span>
                    <span style={{ color: "#1A1A1A" }}>{value}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  borderTop: "1px solid #D9D2C5",
                  paddingTop: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "28px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#1A1A1A",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "22px",
                    fontWeight: 500,
                    color: "#1A1A1A",
                  }}
                >
                  PKR {(total + (total > 5000 ? 0 : 250)).toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "#1A1A1A",
                  color: "#FAF7F2",
                  border: "none",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  marginBottom: "12px",
                  transition: "background 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#C9A84C")}
                onMouseLeave={(e) => (e.target.style.background = "#1A1A1A")}
              >
                Place Order
              </button>

              <Link
                to="/"
                style={{
                  display: "block",
                  textAlign: "center",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "10px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#8A8073",
                  textDecoration: "underline",
                }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
