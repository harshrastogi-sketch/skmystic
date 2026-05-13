import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";
import { FaTruck } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { HiOutlineIdentification } from "react-icons/hi";
import { verifyTokenRequest } from "../api";


const BASE_URL = process.env.REACT_APP_BASE_URL;

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);

  // ✅ Helper: Get first image safely
  const getFirstImage = (item) => {
    return item?.images && item.images.length > 0
      ? `${BASE_URL}${item.images[0].image}`
      : "/no-image.png";
  };

  // ✅ Fetch Single Product
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}products/view/${id}`
        );
        const data = await res.json();
        const productData = data.data;
        setProduct(productData);

        // ✅ Set default image
        setSelectedImage(getFirstImage(productData));
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    getProduct();
  }, [id]);

  // ✅ Fetch Reviews
  useEffect(() => {
    const getReviews = async () => {
      try {
        const res = await fetch(`${BASE_URL}Product_reviews/index/${id}`);
        const data = await res.json();

        if (data.status) {
          setReviews(data.data || []);
        }
      } catch (err) {
        console.error("Review fetch error:", err);
      }
    };

    getReviews();
  }, [id]);
  // ✅ Fetch Related Products
  useEffect(() => {
    if (!product?.category_id) return;

    const getRelatedProducts = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}products?category_id=${product.category_id}`
        );
        const data = await res.json();
        setAllProducts(data.data || []);
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };

    getRelatedProducts();
  }, [product?.category_id]);

  // ✅ Add to cart handler (reusable)
  const handleAddToCart = (item) => {
    addToCart(item);
    setMessage("Product has been added!");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");

      const isValid = await verifyTokenRequest(token);

      if (!isValid) {
        navigate("/login");
        return;
      }

      addToCart(product);

      navigate("/checkout");
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  if (!product) {
    return <h2 className="not-found">Loading...</h2>;
  }

  // ✅ Calculate old price (based on discount)
  const oldPrice =
    product.discount > 0
      ? product.price / (1 - product.discount / 100)
      : product.price;



  return (
    <>
      {message && <div className="success-msg">{message}</div>}

      <div className="product-details-container">

        {/* LEFT SIDE */}
        <div className="left-section">

          {/* IMAGE SECTION */}
          <div className="product-image-section">
            <div className="main-image">
              <img src={selectedImage || "/no-image.png"} alt={product.name} />
            </div>

            <div className="thumbnail-row">
              {product.images?.map((imgObj, index) => {
                const fullPath = `${BASE_URL}${imgObj.image}`;

                return (
                  <img
                    key={index}
                    src={fullPath}
                    alt={`thumb-${index}`}
                    className={selectedImage === fullPath ? "active" : ""}
                    onClick={() => setSelectedImage(fullPath)}
                  />
                );
              })}
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="product-info-section">
            <h2>{product.name}</h2>

            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                  {product.rating >= star ? "★" : "☆"}
                </span>
              ))}

              <span className="rate-box ms-1">
                {product.rating}
              </span>
            </div>

            <p className="availability">
              Availability:{" "}

              {product.stock_status === "in_stock" && (
                <span className="badge bg-success">
                  In Stock
                </span>
              )}

              {product.stock_status === "low_stock" && (
                <span className="badge bg-warning text-dark">
                  Low Stock
                </span>
              )}

              {product.stock_status === "out_of_stock" && (
                <span className="badge bg-danger">
                  Out of Stock
                </span>
              )}
            </p>

            <div className="price-wrapper">
              <div className="price-row">

                {/* SELLING PRICE */}
                <span className="new-price">
                  ₹ {Number(product.price).toLocaleString()}
                </span>

                {/* CUT PRICE */}
                {product.product_cut_price &&
                  Number(product.product_cut_price) > Number(product.price) && (
                    <span className="old-price">
                      ₹ {Number(product.product_cut_price).toLocaleString()}
                    </span>
                  )}

                {/* DISCOUNT */}
                {product.product_cut_price &&
                  Number(product.product_cut_price) > Number(product.price) && (
                    <span className="discount-tag">
                      -
                      {Math.round(
                        ((Number(product.product_cut_price) - Number(product.price)) /
                          Number(product.product_cut_price)) *
                        100
                      )}
                      %
                    </span>
                  )}

              </div>
            </div>

            {/* ✅ PRODUCT HURRY UP */}
            {product.product_hurry_up && (
              <div className="product-hurry-up">
                {product.product_hurry_up}
              </div>
            )}

            {/* ✅ SHORT DESCRIPTION */}
            {product.product_short_description && (
              <div
                className="product-short-description"
                dangerouslySetInnerHTML={{
                  __html: product.product_short_description,
                }}
              />
            )}

            <div className="buttons">
              <button
                className="add-to-cart"
                onClick={() => handleAddToCart(product)}
              >
                ADD TO CART
              </button>

              <button className="checkout-btn" onClick={handleCheckout}>
                BUY NOW
              </button>
            </div>
          </div>
        </div>



        {/* RIGHT SIDE INFO */}
        <div className="right-info-section">

          <div className="info-box">
            <h4>
              <FaTruck className="icon" />
              DELIVERY INFO
            </h4>
            <p>
              The orders are dispatched within 24 hours of the order being placed. In metropolitan areas the shipping time is 3-5 business days and other areas of it may take around 5-7 business days. In a few particular cases, it may take a longer time than this due to certain circumstances. Hence, if it happens there is nothing to worry about.
            </p>
          </div>

          <div className="info-box">
            <h4>
              <FiRefreshCw className="icon" />
              AMERIO CERTIFIED
            </h4>
            <p>
              SK Mystic’s all Gemstones and Rudrakshas are Amerio Certified which gives the user satisfaction of purity.
            </p>
          </div>

          <div className="info-box">
            <h4>
              <HiOutlineIdentification className="icon" />
              EVOKED ITEMS
            </h4>
            <p>
              SK Mystic’s all products are Evoked and Energized by the Maha Pandits so that the wearer or the user get the full blessings and benefits of the products.
            </p>
          </div>

        </div>
      </div>


      <div className="product-tabs-section">

        {/* TABS */}
        <div className="product-tabs">

          <button
            className={activeTab === "description" ? "active" : ""}
            onClick={() => setActiveTab("description")}
          >
            DESCRIPTION
          </button>

          <button
            className={activeTab === "reviews" ? "active" : ""}
            onClick={() => setActiveTab("reviews")}
          >
            REVIEWS
          </button>

          <button
            className={activeTab === "video" ? "active" : ""}
            onClick={() => setActiveTab("video")}
          >
            VIDEO
          </button>

        </div>

        {/* DESCRIPTION */}
        {activeTab === "description" && (
          <div className="tab-content">
            <h3>More details</h3>

            {product.description && (
              <div
                className="description-content"
                dangerouslySetInnerHTML={{
                  __html: product.description,
                }}
              />
            )}
          </div>
        )}

        {/* REVIEWS */}
        {activeTab === "reviews" && (
          <div className="tab-content review-tab-content">
            <h3>Customer reviews</h3>

            <div className="customer-review-list">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div className="customer-review-item" key={review.id}>
                    <div className="review-user-row">
                      <span className="review-rating">
                        {product.rating || "5"}★
                      </span>

                      <strong>
                        {review.user_name}
                      </strong>
                    </div>

                    <p>{review.description}</p>

                    <div className="review-bottom-row">
                      <strong>
                        {review.post_date
                          ? new Date(review.post_date).toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          : ""}
                      </strong>
                    </div>
                  </div>
                ))
              ) : (
                <p>No reviews found.</p>
              )}
            </div>
          </div>
        )}

        {/* VIDEO */}
        {activeTab === "video" && (
          <div className="tab-content">
            <h3>Product Video</h3>

            <div className="video-wrapper">
              <iframe
                width="100%"
                height="450"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Product Video"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

      </div>
      {/* RELATED PRODUCTS */}
      <div className="related-section">
        <h2 className="related-title">Related Products</h2>

        <div className="related-grid">
          {allProducts
            .filter((item) => item.id !== product.id)
            .slice(0, 4)
            .map((item) => (
              <div key={item.id} className="related-card">

                {item.discount > 0 && (
                  <div className="discount-badge">
                    {item.discount}%
                  </div>
                )}
                <Link to={`/product/${item.id}`} className="product-link">
                  <img
                    src={getFirstImage(item)}
                    alt={item.name}
                  />

                  <h4>{item.name}</h4>

                  <p className="related-price">
                    ₹ {Number(item.price).toLocaleString()}
                  </p>
                </Link>
                <button
                  className="cart-btn"
                  onClick={() => handleAddToCart(item)}
                >
                  ADD TO CART
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;