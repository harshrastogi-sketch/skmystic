import React, { useState, useEffect } from "react";
import "./Home.css";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {

  const { addToCart, message } = useCart();

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [reviews, setReviews] = useState([]);

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
  // CUSTOMER REVIEWS
  useEffect(() => {
    const getReviews = async () => {
      try {
        const res = await fetch(`${BASE_URL}api/customerreview_users`);
        const data = await res.json();

        if (data.status) {
          setReviews(data.data || []);
        }
      } catch (error) {
        console.log("Customer review fetch error:", error);
      }
    };

    getReviews();
  }, []);

  const getReviewImage = (img) => {
    if (!img) return "https://via.placeholder.com/80x80?text=User";
    if (img.startsWith("http")) return img;
    return BASE_URL + img;
  };

  const reviewSettings = {
  dots: false,
  infinite: true,
  speed: 600,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  autoplay: true,
  autoplaySpeed: 4000,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
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

     <div className="review-section">
  <h2>Customer review</h2>

  {reviews.length > 0 ? (
    <Slider {...reviewSettings} className="review-slider">
      {reviews.map((review) => (
        <div key={review.id}>
          <div className="review-card">
            <div className="review-top">
              <div className="review-profile">
                <img
                  src={getReviewImage(review.image)}
                  alt={review.name}
                />

                <div className="review-user">
                  <h4>{review.name}</h4>
                  <span>{review.title}</span>
                </div>
              </div>

              <div className="quote">❞</div>
            </div>

            <div className="review-divider"></div>

            <div className="review-content">
              <p>{review.description}</p>

              <div className="stars">★★★★★</div>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  ) : (
    <p className="no-review">No customer reviews found.</p>
  )}
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
        <h2 className="home-blog-heading">Latest blog</h2>

        <div className="home-blog-wrapper">
          {blogs.slice(0, 3).map((blog) => (
            <div className="home-blog-card" key={blog.id}>
              <div className="home-blog-image-wrap">
                <img src={BASE_URL + blog.image} alt={blog.title} className="home-blog-image" />

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

                <Link to={`/blog/${blog.slug || blog.id}`} className="read-more-btn">Read more</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;