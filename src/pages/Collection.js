import React, { useState, useEffect } from "react";
import "./Collection.css";
import { useCart } from "../context/CartContext";
import { Link, useLocation } from "react-router-dom";

const Collection = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  const { addToCart } = useCart();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromURL = queryParams.get("category");

  // ✅ IMAGE HELPER
  const getImage = (item, index = 0) => {
    if (item.images && item.images.length > index) {
      return BASE_URL + item.images[index].image;
    }
    return "https://via.placeholder.com/300x300?text=No+Image";
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          fetch(`${BASE_URL}products`),
          fetch(`${BASE_URL}categories`),
        ]);

        const productData = await productRes.json();
        const categoryData = await categoryRes.json();

        const productList = productData.data || [];
        const categoryList = (categoryData.data || []).filter(
          (item) => String(item.status) === "1"
        );

        setProducts(productList);
        setCategories(categoryList);

        if (categoryFromURL) {
          const matchedCategory = categoryList.find(
            (cat) =>
              String(cat.id) === String(categoryFromURL) ||
              String(cat.name).toLowerCase() === categoryFromURL.toLowerCase() ||
              String(cat.slug).toLowerCase() === categoryFromURL.toLowerCase()
          );

          if (matchedCategory) {
            setSelectedCategories([String(matchedCategory.id)]);
          }
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    getData();
  }, [categoryFromURL]);

  const handleCategoryChange = (categoryId) => {
    const id = String(categoryId);

    if (selectedCategories.includes(id)) {
      setSelectedCategories((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedCategories((prev) => [...prev, id]);
    }
  };

  const filteredProducts =
    selectedCategories.length === 0
      ? products
      : products.filter((product) => {
        const productCategoryId = String(product.category_id || "");
        const productCategoryName = String(
          product.category_name || product.category || ""
        ).toLowerCase();

        return selectedCategories.some((selectedId) => {
          const matchedCategory = categories.find(
            (cat) => String(cat.id) === String(selectedId)
          );

          if (!matchedCategory) return false;

          return (
            productCategoryId === String(matchedCategory.id) ||
            productCategoryName === String(matchedCategory.name).toLowerCase()
          );
        });
      });

  return (
    <div className="collection-container">

      {/* SIDEBAR */}
      <aside className="collection-sidebar">
        <h3>Categories</h3>
        <hr />

        {categories.length > 0 ? (
          categories.map((category) => (
            <label key={category.id}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(String(category.id))}
                onChange={() => handleCategoryChange(category.id)}
              />
              <span>{category.name}</span>
            </label>
          ))
        ) : (
          <p>No categories found</p>
        )}

        <div className="banner-wrapper">
          <img
            src="https://www.skmystic.com/assets/image/LIGHT-UP-FOR-LIFE.webp"
            alt="Sidebar Banner"
            className="collection-sidebar-banner"
          />
        </div>
      </aside>

      {message && <div className="success-msg">{message}</div>}

      {/* PRODUCTS */}
      <div className="products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <div className="card" key={item.id}>

              <div className="discount">{item.discount}%</div>

              <Link to={`/product/${item.id}`}>
                <div className="image-wrapper">

                  {/* ✅ FIRST IMAGE */}
                  <img
                    src={getImage(item, 0)}
                    alt={item.name}
                    className="img1"
                  />

                  {/* ✅ SECOND IMAGE (HOVER) */}
                  <img
                    src={getImage(item, 1)}
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

                <p className="price">
                  ₹ {Number(item.price || 0).toLocaleString()}
                </p>

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
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>

    </div>
  );
};

export default Collection;