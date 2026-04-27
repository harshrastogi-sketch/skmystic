import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";

function Products() {

  const BASE_URL = "http://localhost/CodeIgniter/";
  // const BASE_URL = "https://harsh.skmysticastrologer.in/CodeIgniter/";
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await apiRequest(`${BASE_URL}api/admin-product`);
      console.log("Products response:", res);
      setProducts(res.data || []);
    } catch (err) {
      console.log("Fetch products error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Toggle Status
  const handleToggleStatus = async (id, currentStatus) => {
    const isActive = String(currentStatus) === "1";

    const confirmChange = window.confirm(
      isActive
        ? "Are you sure you want to deactivate this product?"
        : "Are you sure you want to activate this product?"
    );

    if (!confirmChange) return;

    try {
      const newStatus = isActive ? 0 : 1;

      const res = await fetch(`${BASE_URL}products/update_status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();

      if (data.status === true) {
        alert(data.message || "Product status updated successfully");

        setProducts((prev) =>
          prev.map((item) =>
            String(item.id) === String(id)
              ? { ...item, status: String(newStatus) }
              : item
          )
        );
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.log("Toggle status error:", err);
      alert("Error updating product status");
    }
  };

  // ✅ Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${BASE_URL}products/delete/${id}`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (data.status === true) {
        alert(data.message || "Product deleted successfully");

        setProducts((prev) =>
          prev.filter((item) => String(item.id) !== String(id))
        );
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.log("Delete product error:", err);
      alert("Error deleting product");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Products</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/add-product")}
        >
          + Add Product
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Images</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Availability</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {products.length > 0 ? (
              products.map((item, index) => {
                const isActive = String(item.status) === "1";
                console.log(products);
                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>

                    {/* ✅ MULTIPLE IMAGES */}
                    <td>
                      {item.images && item.images.length > 0 ? (
                        <div style={{ display: "flex", gap: "5px" }}>
                          {item.images.slice(0, 10).map((img, i) => (
                            <img
                              key={i}
                              src={`${BASE_URL}${img}`}
                              alt={item.name}
                              width="45"
                              height="45"
                              style={{
                                objectFit: "cover",
                                borderRadius: "4px",
                                border: "1px solid #ddd",
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        "No Image"
                      )}
                    </td>

                    <td>{item.name}</td>
                    <td>{item.category_name || item.category || "-"}</td>
                    <td>₹{Number(item.price || 0).toLocaleString()}</td>
                    <td>{item.discount || 0}%</td>
                    <td><span className={`badge ${item.stock_status === "in_stock" ? "bg-success" : "bg-danger"}`}>
                      {item.stock_status === "in_stock" ? "In Stock" : "Out of Stock"}</span></td>

                    {/* STATUS */}
                    <td>
                      <button className={`btn btn-sm ${isActive ? "btn-success" : "btn-secondary"}`} onClick={() => handleToggleStatus(item.id, item.status)}>
                        {isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* ACTIONS */}
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => navigate(`/admin/edit-product/${item.id}`)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-info me-2" onClick={() => navigate(`/admin/add-product-images/${item.id}`)}>Add Images</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No Products Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;