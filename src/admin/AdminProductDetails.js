import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [product, setProduct] = useState(null);

  const fetchProduct = async () => {
    try {
      const res = await apiRequest(`${BASE_URL}api/admin-product/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.log("Error fetching product:", err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Product Details</h3>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <table className="table table-bordered">
        <tbody>
          <tr>
            <th>Name</th>
            <td>{product.name}</td>
          </tr>

          <tr>
            <th>Category</th>
            <td>{product.category_name}</td>
          </tr>

          <tr>
            <th>Price</th>
            <td>₹{product.price}</td>
          </tr>

          <tr>
            <th>Discount</th>
            <td>{product.discount}%</td>
          </tr>

          <tr>
            <th>Availability</th>
            <td><span className={`badge ${product.stock_status === "in_stock" ? "bg-success" : "bg-danger"}`}>
              {product.stock_status === "in_stock" ? "In Stock" : "Out of Stock"}</span></td>
          </tr>

          <tr>
            <th>Description</th>
            <td>{product.description}</td>
          </tr>

          <tr>
            <th>Images</th>
            <td>
              {product.images && product.images.length > 0 ? (
                product.images.map((img, i) => (
                  <img
                    key={i}
                    src={`${BASE_URL}${img}`}
                    alt="product"
                    width="80"
                    className="me-2 mb-2"
                  />
                ))
              ) : (
                "No Images"
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ProductDetails;