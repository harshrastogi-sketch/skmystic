import React, { useEffect, useState } from "react";
import "./Header.css";
import { FaSearch, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../api";

const Header = ({ setIsCartOpen }) => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [categories, setCategories] = useState([]);
  const [showAstrology, setShowAstrology] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const token = localStorage.getItem("token");
  const user = getUser();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}categories`);
      const data = await res.json();

      if (data.status === true) {
        const activeCategories = (data.data || []).filter(
          (item) => String(item.status) === "1"
        );
        setCategories(activeCategories);
      }
    } catch (error) {
      console.log("Header category fetch error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="top-bar">
        <div className="top-left">Free shipping orders from all item</div>

        <div className="top-right">
          <Link to="/about">ABOUT US</Link>
          <Link to="/contact">CONTACT US</Link>

          <div
            className="custom-dropdown"
            onMouseEnter={() => setShowAccount(true)}
            onMouseLeave={() => setShowAccount(false)}
          >
            <span className="dropdown-titleq">ACCOUNT ▾</span>

            {showAccount && (
              <div className="custom-dropdown-menu account-menu">
                {!token ? (
                  <>
                    <Link to="/register">Register</Link>
                    <Link to="/login">Login</Link>
                  </>
                ) : (
                  <>
                    {!isAdmin && <Link to="/dashboard">My Profile</Link>}
                    {isAdmin && <Link to="/admin">Admin Panel</Link>}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="logout-btn"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <Link to="/language">LANGUAGE ▾</Link>
        </div>
      </div>

      <div className="middle-bar">
        <div className="logo">
          <img
            src="https://www.skmystic.com/assets/image/skmystic/skmystic-logo.png"
            alt="SK Mystic Logo"
          />
        </div>

        <div className="search-box">
          <input type="text" placeholder="Search Product." />
          <button type="button">
            <FaSearch />
          </button>
        </div>

        {!isAdmin && (
          <div
            className="cart"
            onClick={() => setIsCartOpen(true)}
            style={{ cursor: "pointer" }}
          >
            <FaShoppingBag />
            <span className="cart-count">{cartItems.length}</span>
          </div>
        )}
      </div>

      <nav className="nav-bar">
        <Link to="/">HOME</Link>
        <Link to="/collection">PRODUCT</Link>

        <div
          className="custom-dropdown"
          onMouseEnter={() => setShowAstrology(true)}
          onMouseLeave={() => setShowAstrology(false)}
        >
          <span className="dropdown-title">ASTROLOGY ▾</span>

          {showAstrology && (
            <div className="custom-dropdown-menu astrology-menu">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/collection?category=${encodeURIComponent(
                      category.slug || category.name || category.id
                    )}`}
                  >
                    {category.name}
                  </Link>
                ))
              ) : (
                <span className="menu-empty">No categories</span>
              )}
            </div>
          )}
        </div>

        <Link to="/blogs">BLOGS</Link>

        <Link to="/collection" className="hot">
          BUY ASTROLOGY <span className="hot-badge">HOT</span>
        </Link>

        <div className="hotline">Hotline: +91-9654225511</div>
      </nav>
    </header>
  );
};

export default Header;