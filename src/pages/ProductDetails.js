import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";
import { FaTruck } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { HiOutlineIdentification } from "react-icons/hi";


const BASE_URL = process.env.REACT_APP_BASE_URL;

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [message, setMessage] = useState("");

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
  }, [product]);

  // ✅ Add to cart handler (reusable)
  const handleAddToCart = (item) => {
    addToCart(item);
    setMessage("Product has been added!");
    setTimeout(() => setMessage(""), 2000);
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
              <img src={selectedImage} alt={product.name} />
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
              ⭐⭐⭐⭐⭐{" "}
              <span className="rating-badge">
                {product.rating}★
              </span>
            </div>

            <p className="availability">
              Availability: <span
                className={`badge ${product.stock_status === "in_stock"
                    ? "bg-success"
                    : "bg-danger"
                  }`}
              >
                {product.stock_status === "in_stock"
                  ? "In Stock"
                  : "Out of Stock"}
              </span>
            </p>

            <div className="price-wrapper">
              <div className="price-row">
                <span className="new-price">
                  ₹ {Number(product.price).toLocaleString()}
                </span>

                {product.discount > 0 && (
                  <>
                    <span className="old-price">
                      ₹{" "}
                      {oldPrice.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                    <span className="discount-tag">
                      -{product.discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="buttons">
              <button
                className="add-to-cart"
                onClick={() => handleAddToCart(product)}
              >
                ADD TO CART
              </button>

              <button
                className="add-to-cart"
                onClick={() => handleAddToCart(product)}
              >
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

                <img
                  src={getFirstImage(item)}
                  alt={item.name}
                />

                <h4>{item.name}</h4>

                <p className="related-price">
                  ₹ {Number(item.price).toLocaleString()}
                </p>

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