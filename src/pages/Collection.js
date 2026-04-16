import React, { useState, useEffect } from "react";
import "./Collection.css";
import { useCart } from "../context/CartContext";
import { Link, useLocation } from "react-router-dom";

const Collection = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [products, setUserData] = useState([]);
  const [message, setMessage] = useState("");

  const { addToCart } = useCart();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromURL = queryParams.get("category");

  useEffect(() => {
    const getProducts = async () => {
      const reqData = await fetch("http://localhost/CodeIgniter/products");
      const resData = await reqData.json();

      setUserData(resData.data);

      if (categoryFromURL) {
        setSelectedCategories([categoryFromURL]);
      }
    };

    getProducts();
  }, [categoryFromURL]);

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const filteredProducts =
    selectedCategories.length === 0
      ? products
      : products.filter((product) =>
          selectedCategories.includes(product.category)
        );

  return (
    <div className="collection-container">
      {/* Sidebar */}
      <aside className="collection-sidebar">
        <h3>Categories</h3>
        <hr />

        <label>
          <input
            type="checkbox"
            checked={selectedCategories.includes("ISHT DEV")}
            onChange={() => handleCategoryChange("ISHT DEV")}
          />
          <span>ISHT DEV</span>
        </label>

        <label>
          <input
            type="checkbox"
            checked={selectedCategories.includes("GEMS AND RINGS")}
            onChange={() => handleCategoryChange("GEMS AND RINGS")}
          />
          <span>GEMS AND RINGS</span>
        </label>

        <label>
          <input
            type="checkbox"
            checked={selectedCategories.includes("RUDRAKSH")}
            onChange={() => handleCategoryChange("RUDRAKSH")}
          />
          <span>RUDRAKSH</span>
        </label>

        <div className="banner-wrapper">
          <img
            src="https://www.skmystic.com/assets/image/LIGHT-UP-FOR-LIFE.webp"
            alt="Sidebar Banner"
            className="collection-sidebar-banner"
          />
        </div>
      </aside>

      {/* Success Message */}
      {message && <div className="success-msg">{message}</div>}

      {/* Products */}
      <div className="products">
        {filteredProducts.map((item) => (
          <div className="card" key={item.id}>
            <div className="discount">{item.discount}</div>

            <Link to={`/product/${item.id}`}>
              <div className="image-wrapper">
                <img
                  src={`http://localhost/CodeIgniter/uploads/${item.image1}`}
                  alt={item.name}
                  className="img1"
                />
                <img
                  src={`http://localhost/CodeIgniter/uploads/${item.image2}`}
                  alt={item.name}
                  className="img2"
                />
              </div>
            </Link>

            <div className="card-body">
              <h4>{item.name}</h4>

              <div className="rating">
                ⭐⭐⭐⭐⭐ <span className="rate-box">{item.rating}</span>
              </div>

              <p className="price">₹ {item.price.toLocaleString()}</p>

              <button
                className="cart-btn"
                onClick={() => {
                  addToCart(item);
                  setMessage("Product has been added!");
                  setTimeout(() => setMessage(""), 2000);
                }}
              >
                ADD TO CART
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collection;