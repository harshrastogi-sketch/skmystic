import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [message, setMessage] = useState("");


  useEffect(() => {
    const getProduct = async () => {
      const res = await fetch(
        `http://localhost/CodeIgniter/products/view/${id}`
      );
      const data = await res.json();

      setProduct(data.data);
      setSelectedImage(
        `http://localhost/CodeIgniter/uploads/${data.data.image1}`
      );
    };

    getProduct();
  }, [id]);

  // ✅ Fetch All Products (for Related section)
  useEffect(() => {
    const getAllProducts = async () => {
      const res = await fetch(
        "http://localhost/CodeIgniter/products"
      );
      const data = await res.json();
      setAllProducts(data.data);
    };

    getAllProducts();
  }, []);

  if (!product) {
    return <h2 className="not-found">Loading...</h2>;
  }

  return (
    <>
      {message && <div className="success-msg">{message}</div>}

      <div className="product-details-container">
        <div className="product-image-section">
          <div className="main-image">
            <img src={selectedImage} alt={product.name} />
          </div>

          <div className="thumbnail-row">
            {[product.image1, product.image2]
              .filter(Boolean)
              .map((img, index) => {
                const fullPath = `http://localhost/CodeIgniter/uploads/${img}`;
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
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Related Products */}
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
                  src={`http://localhost/CodeIgniter/uploads/${item.image1}`}
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