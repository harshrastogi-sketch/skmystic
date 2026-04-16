import React, { useState } from "react";
import "./Header.css";
import { FaSearch, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../api";


const Header = ({ setIsCartOpen }) => {
  const { cartItems } = useCart();

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // remove token + user
    navigate("/login");
  };

  const user = getUser();
  const isAdmin = user?.role === "admin";
  
  return (
    <header className="header">

      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-left">
          Free shipping orders from all item
        </div>
        <div className="top-right">
          <Link to="/about">ABOUT US</Link>
          <Link to="/contact">CONTACT US</Link>

          <div className="dropdown">
            <span className="dropdown-titleq">ACCOUNT ▾</span>

            <div className="dropdown-menuq">
              {!token ? (
                <>
                  <Link to="/register">Register</Link>
                  <Link to="/login">Login</Link>
                </>
              ) : (
                <>
                  {!isAdmin && <Link to="/dashboard">My Profile</Link>}

                  {isAdmin && <Link to="/admin">Admin Panel</Link>}

                  <Link to="/login" onClick={handleLogout} className="logout-btn">
                    Logout
                  </Link>
                </>
              )}
            </div>
          </div>
          <Link to="/language">LANGUAGE ▾</Link>
        </div>
      </div>

      {/* Middle Section */}
      <div className="middle-bar">
        <div className="logo">
          <img
            src="https://www.skmystic.com/assets/image/skmystic/skmystic-logo.png"
            alt="SK Mystic Logo"
          />
        </div>

        <div className="search-box">
          <input type="text" placeholder="Search Product." />
          <button>
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

      {/* Navigation */}
      <nav className="nav-bar">
        <Link to="/">HOME</Link>
        <Link to="/collection">PRODUCT</Link>
        <div className="dropdown">
          <span className="dropdown-title">ASTROLOGY ▾</span>

          <div className="dropdown-menu">
            <Link to="/collection?category=GEMS AND RINGS">GEMS AND RINGS</Link>
            <Link to="/collection?category=ISHT DEV">ISHT DEV</Link>
            <Link to="/collection?category=RUDRAKSH">Rudraksh</Link>
          </div>
        </div>
        <Link to="/blogs">BLOGS</Link>
        <Link to="/collection" className="hot">
          BUY ASTROLOGY <span className="hot-badge">HOT</span>
        </Link>

        <div className="hotline">
          Hotline: +91-9654225511
        </div>
      </nav>
    </header>
  );
};

export default Header;