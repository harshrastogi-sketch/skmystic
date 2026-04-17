import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

// 🔥 get user from token
const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.data;
  } catch {
    return null;
  }
};

function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const user = getUserFromToken();

  // ✅ Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // ✅ Handle checkout
  const handleCheckout = () => {
    if (user?.role === "admin") {
      alert("❌ Admin cannot checkout");
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">My Cart</h3>

      <div className="row">
        {/* LEFT SIDE */}
        <div className="col-md-8">
          {cartItems.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item d-flex mb-3 p-3 border rounded">

                {/* IMAGE */}
                <img
                  src={`https://harsh.skmysticastrologer.in/CodeIgniter/uploads/${item.image1}`}
                  alt={item.name}
                  width="80"
                  height="80"
                  style={{ objectFit: "cover" }}
                />

                {/* DETAILS */}
                <div className="ms-3 flex-grow-1">
                  <h5>{item.name}</h5>
                  <p>₹{item.price}</p>

                  {/* QUANTITY */}
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  {/* REMOVE */}
                  <button
                    className="btn btn-link text-danger p-0 mt-2"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>

                {/* PRICE */}
                <div className="text-end">
                  <strong>₹{item.price * item.quantity}</strong>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h5>Cart Summary</h5>

            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between">
              <strong>Total</strong>
              <strong>₹{subtotal}</strong>
            </div>

            <button
              className="btn btn-dark mt-3 w-100"
              onClick={handleCheckout}
              disabled={user?.role === "admin"}
            >
              {user?.role === "admin" ? "Admin Cannot Checkout" : "Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;