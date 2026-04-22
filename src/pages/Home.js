import React, { useState, useEffect } from "react";
import "./Home.css";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Home = () => {

  const { addToCart, message } = useCart();

   const BASE_URL = "https://harsh.skmysticastrologer.in/CodeIgniter/";
  //const BASE_URL = "http://localhost/CodeIgniter/";

  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  // ✅ GET IMAGE HELPER (IMPORTANT)
  const getImage = (item) => {
    if (item.images && item.images.length > 0) {
      return BASE_URL + item.images[0].image;
    }
    return "https://via.placeholder.com/300x300?text=No+Image";
  };

  // PRODUCTS
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}products`);
        const data = await res.json();

        if (data.status) {
          setProducts(data.data || []);
        }
      } catch (error) {
        console.log("Product fetch error:", error);
      }
    };

    getProducts();
  }, []);

  // BLOGS
  useEffect(() => {
    const getBlogs = async () => {
      try {
        const res = await fetch(`${BASE_URL}blogs`);
        const data = await res.json();

        if (data.status) {
          setBlogs(data.data || []);
        }
      } catch (error) {
        console.log("Blog fetch error:", error);
      }
    };

    getBlogs();
  }, []);

  // BANNERS
  useEffect(() => {
    const getBanners = async () => {
      try {
        const res = await fetch(`${BASE_URL}api/all-banners`);
        const data = await res.json();

        if (data.status) {
          setBanners(data.data || []);
        }
      } catch (error) {
        console.log("Banner fetch error:", error);
      }
    };

    getBanners();
  }, []);

  // AUTO SLIDER
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [banners]);

  const getBannerImage = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return BASE_URL + img;
  };

  return (
    <div className="home">

      {message && <div className="success-msg">{message}</div>}

      {/* HERO */}
      <div className="hero">
        {banners.length > 0 ? (
          <img
            src={getBannerImage(banners[currentBanner].image)}
            alt="banner"
            className="hero-img"
          />
        ) : (
          <div className="hero-img">No banners</div>
        )}
      </div>

      {/* PRODUCTS */}
      <div className="products-section">
        <h2>Our Products</h2>

        <div className="product-grid">
          {products.map((item) => (
            <div className="product-card" key={item.id}>

              {/* ✅ FIXED IMAGE */}
              <img src={getImage(item)} alt={item.name} />

              <h3>{item.name}</h3>

              <div className="rating">
                ⭐⭐⭐⭐⭐ <span>{item.rating}</span>
              </div>

              <div className="price">₹{item.price}</div>

              <button onClick={() => addToCart(item)}>
                ADD TO CART
              </button>
            </div>
          ))}
        </div>

        <Link to="/collection" className="see-all-btn">
          See All Products →
        </Link>
      </div>

      {/* FEATURED */}
      <div className="products-section">
        <h2>Featured product</h2>

        <div className="product-grid">
          {products.slice(4, 8).map((item) => (
            <div className="product-card" key={item.id}>

              {/* ✅ FIXED IMAGE */}
              <img src={getImage(item)} alt={item.name} />

              <h3>{item.name}</h3>

              <div className="rating">
                ⭐⭐⭐⭐⭐ <span>{item.rating}</span>
              </div>

              <div className="price">₹{item.price}</div>

              <button onClick={() => addToCart(item)}>
                ADD TO CART
              </button>
            </div>
          ))}
        </div>

        <Link to="/collection" className="see-all-btn">
          See All
        </Link>
      </div>

      {/* BLOGS */}
      <div className="home-blog-section">
        <h2>Latest blog</h2>

        <div className="home-blog-wrapper">
          {blogs.slice(0, 3).map((blog) => (
            <div className="home-blog-card" key={blog.id}>
              <img
                src={BASE_URL + blog.image}
                alt={blog.title}
                className="home-blog-image"
              />

              <h3>{blog.title}</h3>
              <p>{blog.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;