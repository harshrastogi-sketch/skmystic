import React, { useState, useEffect } from "react";
import "./Home.css";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

// ✅ IMPORT IMAGES
import banner1 from "../assets/banner-1-1.webp";
import banner2 from "../assets/banner-2-1.webp";
import banner3 from "../assets/banner-3-1.webp";
import banner4 from "../assets/banner-4-1.webp";

const Home = () => {
  const { addToCart } = useCart();

  // ✅ API PRODUCTS STATE
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const reqData = await fetch("http://localhost/CodeIgniter/products");
      const resData = await reqData.json();

      console.log(resData);
      setProducts(resData.data);
    };

    getProducts();
  }, []);


  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const response = await fetch("http://localhost/CodeIgniter/blogs");
        const result = await response.json();

        if (result.status) {
          setBlogs(result.data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    getBlogs();
  }, []);

  // ✅ Banner Slider State
  const banners = [banner1, banner2, banner3, banner4];
  const [currentBanner, setCurrentBanner] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  return (
    <div className="home">

      {/* 🔥 HERO */}
      <div className="hero">
        <img key={currentBanner} src={banners[currentBanner]} alt="banner" className="hero-img" />

        <div className="hero-text">
          {/* <h1>Shri Meru Ring</h1>
          <p>Generate the Positive Vibes that Strengthen you...</p> */}
        </div>

        <button className="prev" onClick={prevBanner}>❮</button>
        <button className="next" onClick={nextBanner}>❯</button>
      </div>

      {/* 🔥 PRODUCTS */}
      <div className="products-section">
        <h2>Our Products</h2>

        <div className="product-grid">
          {products.map((item) => (   // ✅ show only 4 products
            <div className="product-card" key={item.id}>

              <img
                src={`http://localhost/CodeIgniter/uploads/${item.image1}`}
                alt={item.name}
              />

              <h3>{item.name}</h3>

              <div className="rating">
                ⭐⭐⭐⭐⭐ <span>{item.rating}</span>
              </div>

              <div className="price">
                ₹{item.price}
              </div>

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

      <div className="review-section">
        <h2>Customer review</h2>

        <div className="review-grid">
          <div className="review-card">
            <div className="review-top">
              <div className="review-profile">
                <img src="https://i.pravatar.cc/80?img=1" alt="user" />
                <div className="review-user">
                  <h4>Sushmita</h4>
                  <span>Noida</span>
                </div>
              </div>
              <div className="quote">❞</div>
            </div>

            <div className="review-divider"></div>

            <div className="review-content">
              <p>
                I liked all the products here and bought many of them for myself and
                my family. Everyone loved them.
              </p>
              <div className="stars">★★★★★</div>
            </div>
          </div>

          <div className="review-card">
            <div className="review-top">
              <div className="review-profile">
                <img src="https://i.pravatar.cc/80?img=12" alt="user" />
                <div className="review-user">
                  <h4>Prashant</h4>
                  <span>Haridwar</span>
                </div>
              </div>
              <div className="quote">❞</div>
            </div>

            <div className="review-divider"></div>

            <div className="review-content">
              <p>
                Finances were the biggest issue in my life which was never going to
                end. But after wearing the Meru Ring it replaced the problems with
                prosperity.
              </p>
              <div className="stars">★★★★★</div>
            </div>
          </div>

          <div className="review-card">
            <div className="review-top">
              <div className="review-profile">
                <img src="https://i.pravatar.cc/80?img=5" alt="user" />
                <div className="review-user">
                  <h4>Swati Nagar</h4>
                  <span>Nagpur</span>
                </div>
              </div>
              <div className="quote">❞</div>
            </div>

            <div className="review-divider"></div>

            <div className="review-content">
              <p>
                My life was going well but still something always felt missing. And it
                was spirituality which gave me my inner peace back. And it all
                happened due to the blessing of the Meru Ring.
              </p>
              <div className="stars">★★★★★</div>
            </div>
          </div>
        </div>
      </div>
      {/* 🔥 Feature PRODUCTS */}
      <div className="products-section">
        <h2>Featured product</h2>

        <div className="product-grid">
          {products.slice(4, 8).map((item) => (   // ✅ show only 4 products
            <div className="product-card" key={item.id}>

              <img
                src={`http://localhost/CodeIgniter/uploads/${item.image1}`}
                alt={item.name}
              />

              <h3>{item.name}</h3>

              <div className="rating">
                ⭐⭐⭐⭐⭐ <span>{item.rating}</span>
              </div>

              <div className="price">
                ₹{item.price}
              </div>

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


      <div className="home-blog-section">
        <h2 className="home-blog-heading">Latest blog</h2>

        <div className="home-blog-wrapper">
          {blogs.slice(0, 3).map((blog) => (
            <div className="home-blog-card" key={blog.id}>
              <div className="home-blog-image-wrap">
                <img src={blog.image} alt={blog.title} className="home-blog-image" />

                <div className="home-blog-date-badge">
                  {new Date(blog.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="home-blog-content">
                <div className="home-blog-meta">
                  <span className="home-blog-meta-item"><i className="fa fa-user"></i> {blog.author}</span>
                  <span className="home-blog-meta-item"><i className="fa fa-calendar"></i> Updated: {new Date(blog.created_at).toLocaleDateString()}</span>
                </div>

                <h3 className="home-blog-title">{blog.title}</h3>

                <p className="home-blog-description">{blog.description}</p>

                <a href="/" className="home-blog-readmore">
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;