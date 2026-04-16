import React, { useMemo, useState, useEffect } from "react";
import "./Checkout.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

const Checkout = () => {
  const { cartItems = [], clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    postcode: "",
    paymentMethod: "cod",
  });

  const [errors, setErrors] = useState({});

  // ✅ Login check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Autofill
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, []);

  // ✅ Empty cart redirect
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/");
    }
  }, [cartItems, navigate]);

  // ✅ Total
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      return sum + Number(item.price) * Number(item.quantity || 1);
    }, 0);
  }, [cartItems]);

  const shipping = 0;
  const orderTotal = subtotal + shipping;

  // ✅ Input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ✅ Validation
  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email required";
    if (!/^[6-9]\d{9}$/.test(formData.mobile))
      newErrors.mobile = "Valid mobile required";
    if (!formData.address.trim()) newErrors.address = "Address required";
    if (!/^\d{6}$/.test(formData.postcode))
      newErrors.postcode = "Valid PIN required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const data = await apiRequest(
        "http://localhost/CodeIgniter/api/order-create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            cartItems,
            subtotal,
            shipping,
            orderTotal,
          }),
        },
        navigate
      );

      setLoading(false);

      // 🔥 if token expired → helper already redirected
      if (!data) return;

      if (data.status) {
        alert("Order placed successfully ✅");
        clearCart();
        navigate("/my-order");
      } else {
        alert(data.message || "Failed ❌");
      }
    } catch (err) {
      setLoading(false);
      alert("Server error ❌");
    }

    console.log(cartItems);
  };
  return (
    <section className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Secure checkout</h1>

        <div className="checkout-grid">

          {/* ✅ CART */}
          <div className="checkout-card">
            <div className="checkout-card-header">
              1. In your cart ({cartItems.length})
            </div>

            <div className="checkout-card-body">
              {cartItems.map((item, i) => (
                <div className="checkout-product" key={i}>

                  <div className="checkout-product-image">
                    <img
                      src={`http://localhost/CodeIgniter/uploads/${item.image1}`}
                      alt={item.name}
                    />
                  </div>

                  <div className="checkout-product-info">
                    <h4>{item.name}</h4>
                    <p>
                      ₹ {Number(item.price).toLocaleString("en-IN")} ×{" "}
                      {item.quantity}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* ✅ ADDRESS + PAYMENT */}
          <div className="checkout-card">
            <div className="checkout-card-header">
              2. Delivery Address
            </div>

            <form onSubmit={handleSubmit} className="checkout-form">

              <div className="checkout-field">
                <label>Name</label>
                <input name="name" value={formData.name} onChange={handleChange} />
                {errors.name && <p className="error">{errors.name}</p>}
              </div>

              <div className="checkout-field">
                <label>Email address</label>
                <input name="email" value={formData.email} onChange={handleChange} />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>

              <div className="checkout-field">
                <label>Mobile</label>
                <input name="mobile" value={formData.mobile} onChange={handleChange} />
                {errors.mobile && <p className="error">{errors.mobile}</p>}
              </div>

              <div className="checkout-field">
                <label>Delivery address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} />
                {errors.address && <p className="error">{errors.address}</p>}
              </div>

              <div className="checkout-field">
                <label>Postcode / ZIP Code</label>
                <input name="postcode" value={formData.postcode} onChange={handleChange} />
                {errors.postcode && <p className="error">{errors.postcode}</p>}
              </div>

              {/* ✅ PAYMENT METHOD (FIXED) */}
              <div className="checkout-field">
                <label>Payment Method</label>

                <div className="checkout-payment-options">

                  <label className="checkout-radio">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleChange}
                    />
                    COD
                  </label>

                  <label className="checkout-radio">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === "online"}
                      onChange={handleChange}
                    />
                    Payment
                  </label>

                </div>
              </div>

              <button className="checkout-btn" disabled={loading}>
                {loading ? "Placing Order..." : "Complete order"}
              </button>

            </form>
          </div>

          {/* ✅ SUMMARY */}
          <div className="checkout-card">
            <div className="checkout-card-header">
              3. Order summary
            </div>

            <div className="checkout-summary">
              <div className="checkout-summary-row">
                <span>Total</span>
                <span>₹ {subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="checkout-summary-row">
                <span>Shipping to India</span>
                <span>₹ {shipping}</span>
              </div>

              <div className="checkout-summary-row checkout-summary-total">
                <span>Order total</span>
                <span>₹ {orderTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Checkout;