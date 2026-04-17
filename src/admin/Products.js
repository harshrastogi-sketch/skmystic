import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await apiRequest(
        "https://harsh.skmysticastrologer.in/CodeIgniter/api/product"
      );
      console.log("Products response:", res);
      setProducts(res.data || []);
    } catch (err) {
      console.log("Fetch products error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

      const res = await fetch(
        `https://harsh.skmysticastrologer.in/CodeIgniter/products/update_status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();
      console.log("Toggle product status response:", data);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(
        `https://harsh.skmysticastrologer.in/CodeIgniter/products/delete/${id}`,
        {
          method: "POST",
        }
      );

      const data = await res.json();
      console.log("Delete product response:", data);

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
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((item, index) => {
                const isActive = String(item.status) === "1";

                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>

                    <td>
                      {item.image1 ? (
                        <img
                          src={`https://harsh.skmysticastrologer.in/CodeIgniter/uploads/${item.image1}`}
                          alt={item.name}
                          width="50"
                          height="50"
                          style={{ objectFit: "cover", borderRadius: "4px" }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>

                    <td>{item.name}</td>
                    <td>{item.category_name || item.category || "-"}</td>
                    <td>₹{Number(item.price || 0).toLocaleString()}</td>
                    <td>{item.discount || 0}%</td>

                    <td>
                      <button
                        className={`btn btn-sm ${
                          isActive ? "btn-success" : "btn-secondary"
                        }`}
                        onClick={() => handleToggleStatus(item.id, item.status)}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => navigate(`/admin/edit-product/${item.id}`)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(item.id)}
                      >
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