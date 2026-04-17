import React, { useEffect } from "react"; // ✅ add useEffect
import { useCart } from "../context/CartContext";
import "../context/CartDrawer.css";
import { useNavigate } from "react-router-dom";
import { verifyTokenRequest } from "../api";

const CartDrawer = ({ isOpen, setIsOpen }) => {
  const { cartItems, removeFromCart, subtotal } = useCart();
  const navigate = useNavigate();

  // ✅ AUTO CLOSE WHEN CART EMPTY
  useEffect(() => {
    if (cartItems.length === 0 && isOpen) {
      setIsOpen(false);
    }
  }, [cartItems, isOpen, setIsOpen]);

    const handleCheckout = () => {
  const token = localStorage.getItem("token");

  const res = verifyTokenRequest(token);

  if (!res) return; // behaves like apiRequest

  navigate("/checkout");
};

  return (
    <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h3>There are {cartItems.length} Products</h3>
        <button onClick={() => setIsOpen(false)}>X</button>
      </div>

      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={`https://harsh.skmysticastrologer.in/CodeIgniter/uploads/${item.image1}`} alt={item.name} />
            <div>
              <p>{item.name}</p>
              <p>
                {item.quantity} × ₹{item.price}
              </p>
            </div>
            <button onClick={() => removeFromCart(item.id)}>🗑</button>
          </div>
        ))
      ) : (
        <p style={{ padding: "10px" }}>Cart is empty</p>
      )}

      <div className="cart-footer">
        <h4>Subtotal: ₹{subtotal.toLocaleString("en-IN")}</h4>

        <button className="view-btn" onClick={() => navigate("/viewCart")}>
          View Cart
        </button>

        <button className="checkout-btn" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartDrawer;