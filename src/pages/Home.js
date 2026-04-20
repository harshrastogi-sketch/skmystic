import React, { useState, useEffect } from "react";
import "./Home.css";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { addToCart } = useCart();

  const BASE_URL = "https://harsh.skmysticastrologer.in/CodeIgniter/";

  // Products state
  const [products, setProducts] = useState([]);

  // Blogs state
  const [blogs, setBlogs] = useState([]);

  // Banners state
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Fetch products
  useEffect(() => {
    const getProducts = async () => {
      try {
        const reqData = await fetch("https://harsh.skmysticastrologer.in/CodeIgniter/products");
        const resData = await reqData.json();

        if (resData.status) {
          setProducts(resData.data || []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.log("Product fetch error:", error);
      }
    };

    getProducts();
  }, []);

  // Fetch blogs
  useEffect(() => {
    const getBlogs = async () => {
      try {
        const response = await fetch("https://harsh.skmysticastrologer.in/CodeIgniter/blogs");
        const result = await response.json();

        if (result.status) {
          setBlogs(result.data || []);
        } else {
          setBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    getBlogs();
  }, []);

  // Fetch banners from database
  useEffect(() => {
    const getBanners = async () => {
      try {
        const res = await fetch("https://harsh.skmysticastrologer.in/CodeIgniter/api/all-banners");
        const data = await res.json();
        if (data.status) {
          setBanners(data.data || []);
        } else {
          setBanners([]);
        }
      } catch (error) {
        console.log("Banner fetch error:", error);
      }
    };

    getBanners();
  }, []);

  // Auto slider for banners
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [banners]);

  const nextBanner = () => {
    if (banners.length === 0) return;
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    if (banners.length === 0) return;
    setCurrentBanner((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  const getBannerImage = (imagePath) => {
    if (!imagePath) return "";

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    return `${BASE_URL}${imagePath}`;
  };

  return (
    <div className="home">
      {/* HERO */}
      <div className="hero">
        {banners.length > 0 ? (
          <img
            key={currentBanner}
            src={getBannerImage(banners[currentBanner].image)}
            alt={banners[currentBanner].title || "banner"}
            className="hero-img"
          />
        ) : (
          <div
            className="hero-img d-flex align-items-center justify-content-center bg-light"
            style={{ minHeight: "300px" }}
          >
            <p className="text-muted mb-0">No banners available</p>
          </div>
        )}

        <div className="hero-text">
          {/* <h1>Shri Meru Ring</h1>
          <p>Generate the Positive Vibes that Strengthen you...</p> */}
        </div>

        {banners.length > 1 && (
          <>
            <button className="prev" onClick={prevBanner}>
              ❮
            </button>
            <button className="next" onClick={nextBanner}>
              ❯
            </button>
          </>
        )}
      </div>

      {/* PRODUCTS */}
      <div className="products-section">
        <h2>Our Products</h2>

        <div className="product-grid">
          {products.map((item) => (
            <div className="product-card" key={item.id}>
              <img
                src={`https://harsh.skmysticastrologer.in/CodeIgniter/uploads/${item.image1}`}
                alt={item.name}
              />

              <h3>{item.name}</h3>

              <div className="rating">
                ⭐⭐⭐⭐⭐ <span>{item.rating}</span>
              </div>

              <div className="price">₹{item.price}</div>

              <button onClick={() => addToCart(item)}>ADD TO CART</button>
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

      {/* FEATURED PRODUCTS */}
      <div className="products-section">
        <h2>Featured product</h2>

        <div className="product-grid">
          {products.slice(4, 8).map((item) => (
            <div className="product-card" key={item.id}>
              <img
                src={`https://harsh.skmysticastrologer.in/CodeIgniter/uploads/${item.image1}`}
                alt={item.name}
              />

              <h3>{item.name}</h3>

              <div className="rating">
                ⭐⭐⭐⭐⭐ <span>{item.rating}</span>
              </div>

              <div className="price">₹{item.price}</div>

              <button onClick={() => addToCart(item)}>ADD TO CART</button>
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
                <img
                  src={`https://harsh.skmysticastrologer.in/CodeIgniter/${blog.image}`}
                  alt={blog.title}
                  className="home-blog-image"
                />

                <div className="home-blog-date-badge">
                  {new Date(blog.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="home-blog-content">
                <div className="home-blog-meta">
                  <span className="home-blog-meta-item">
                    <i className="fa fa-user"></i> {blog.author}
                  </span>
                  <span className="home-blog-meta-item">
                    <i className="fa fa-calendar"></i> Updated:{" "}
                    {new Date(blog.created_at).toLocaleDateString()}
                  </span>
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