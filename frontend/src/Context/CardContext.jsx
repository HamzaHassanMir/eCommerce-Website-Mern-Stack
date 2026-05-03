import React, { createContext, useState, useContext } from "react";

// Create the context
export const CardContext = createContext(null);

// Custom hook for easy access
export const useCart = () => useContext(CardContext);

// Provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CardContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CardContext.Provider>
  );
};

export default CardContext;