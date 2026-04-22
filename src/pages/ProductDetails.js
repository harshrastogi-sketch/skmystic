import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";
import { FaTruck } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { HiOutlineIdentification } from "react-icons/hi";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Fetch Single Product
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(
          `https://harsh.skmysticastrologer.in/CodeIgniter/products/view/${id}`
        );
        const data = await res.json();

        setProduct(data.data);
        setSelectedImage(
          `https://harsh.skmysticastrologer.in/CodeIgniter/uploads/${data.data.image1}`
        );
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    getProduct();
  }, [id]);

  // ✅ Fetch All Products (Related)
  useEffect(() => {
    if (!product?.category_id) return;

    const getRelatedProducts = async () => {
      try {
        const res = await fetch(
          `https://harsh.skmysticastrologer.in/CodeIgniter/products?category_id=${product.category_id}`
        );
        const data = await res.json();
        setAllProducts(data.data);
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };

    getRelatedProducts();
  }, [product]);

  if (!product) {
    return <h2 className="not-found">Loading...</h2>;
  }

  return (
    <>
      {message && <div className="success-msg">{message}</div>}

      {/* ✅ MAIN SECTION */}
      <div className="product-details-container">

        {/* LEFT SIDE */}
        <div className="left-section">

          {/* IMAGE SECTION */}
          <div className="product-image-section">
            <div className="main-image">
              <img src={selectedImage} alt={product.name} />
            </div>

            <div className="thumbnail-row">
              {[product.image1, product.image2]
                .filter(Boolean)
                .map((img, index) => {
                  const fullPath = `https://harsh.skmysticastrologer.in/CodeIgniter/uploads/${img}`;
                  return (
                    <img
                      key={index}
                      src={fullPath}
                      alt={`thumb-${index}`}
                      className={
                        selectedImage === fullPath ? "active" : ""
                      }
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
              ⭐⭐⭐⭐⭐ <span className="rating-badge">4.5★</span>
            </div>

            <p className="availability">
              Availability: <span>In stock</span>
            </p>

            <div className="price-wrapper">
              <div className="price-row">
                <span className="new-price">
                  ₹ {Number(product.price).toLocaleString()}
                </span>
                <span className="old-price">₹ 5,000.00</span>
                <span className="discount-tag">-50%</span>
              </div>
            </div>

            <div className="buttons">
              <button
                className="add-to-cart"
                onClick={() => {
                  addToCart(product);
                  setMessage("Product has been added!");
                  setTimeout(() => setMessage(""), 2000);
                }}
              >
                ADD TO CART
              </button>

              <button
                className="add-to-cart"
                onClick={() => {
                  addToCart(product);
                  setMessage("Product has been added!");
                  setTimeout(() => setMessage(""), 2000);
                }}
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>

        {/* ✅ RIGHT SIDE INFO SECTION */}
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

      {/* ✅ RELATED PRODUCTS */}
      <div className="related-section">
        <h2 className="related-title">Related Products</h2>

        <div className="related-grid">
          {allProducts
            .filter((item) => item.id !== product.id)
            .slice(0, 4)
            .map((item) => (
              <div key={item.id} className="related-card">
                <div className="discount-badge">10%</div>

                <img
                  src={`https://harsh.skmysticastrologer.in/CodeIgniter/uploads/${item.image1}`}
                  alt={item.name}
                />

                <h4>{item.name}</h4>

                <p className="related-price">
                  ₹ {Number(item.price).toLocaleString()}
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
            ))}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;