import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Products() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await apiRequest(`${BASE_URL}api/admin-product`);
      setProducts(res.data || []);
    } catch (err) {
      console.log("Fetch products error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Toggle Status (SweetAlert)
  const handleToggleStatus = async (id, currentStatus) => {
    const isActive = String(currentStatus) === "1";

    const result = await Swal.fire({
      title: isActive ? "Deactivate Product?" : "Activate Product?",
      text: "Are you sure you want to change status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      const newStatus = isActive ? 0 : 1;

      Swal.fire({
        title: "Updating...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(
        `${BASE_URL}products/update_status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();
      Swal.close();

      if (data.status === true) {
        Swal.fire({
          icon: "success",
          title: data.message || "Status updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        setProducts((prev) =>
          prev.map((item) =>
            String(item.id) === String(id)
              ? { ...item, status: String(newStatus) }
              : item
          )
        );
      } else {
        Swal.fire({
          icon: "error",
          title: data.message || "Failed to update status",
        });
      }
    } catch (err) {
      console.log("Toggle status error:", err);
      Swal.fire({
        icon: "error",
        title: "Error updating product status",
      });
    }
  };

  // ✅ Delete Product (SweetAlert)
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Product?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(`${BASE_URL}products/delete/${id}`, {
        method: "POST",
      });

      const data = await res.json();
      Swal.close();

      if (data.status === true) {
        Swal.fire({
          icon: "success",
          title: data.message || "Deleted successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        setProducts((prev) =>
          prev.filter((item) => String(item.id) !== String(id))
        );
      } else {
        Swal.fire({
          icon: "error",
          title: data.message || "Delete failed",
        });
      }
    } catch (err) {
      console.log("Delete product error:", err);
      Swal.fire({
        icon: "error",
        title: "Error deleting product",
      });
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

                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>

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
                    <td>{item.category_name || "-"}</td>
                    <td>₹{Number(item.price || 0).toLocaleString()}</td>
                    <td>{item.discount || 0}%</td>

                    <td>
                      <span
                        className={`badge ${
                          item.stock_status === "in_stock"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {item.stock_status === "in_stock"
                          ? "In Stock"
                          : "Out of Stock"}
                      </span>
                    </td>

                    <td>
                      <button
                        className={`btn btn-sm ${
                          isActive ? "btn-success" : "btn-secondary"
                        }`}
                        onClick={() =>
                          handleToggleStatus(item.id, item.status)
                        }
                      >
                        {isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() =>
                          navigate(`/admin/edit-product/${item.id}`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() =>
                          navigate(`/admin/add-product-images/${item.id}`)
                        }
                      >
                        Add Images
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
                <td colSpan="9" className="text-center">
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