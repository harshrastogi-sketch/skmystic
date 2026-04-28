import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Category() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const fetchCategories = async () => {
    try {
      const res = await apiRequest(`${BASE_URL}categories`);
      console.log("Categories response:", res);
      setCategories(res.data || []);
    } catch (err) {
      console.log("Fetch categories error:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch categories",
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ TOGGLE STATUS (SWEETALERT)
  const handleToggleStatus = async (id, currentStatus) => {
    const isActive = String(currentStatus) === "1";

    const result = await Swal.fire({
      title: isActive
        ? "Deactivate Category?"
        : "Activate Category?",
      text: "Are you sure?",
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
        `${BASE_URL}categories/update_status/${id}`,
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
          title: data.message || "Status updated",
          timer: 1500,
          showConfirmButton: false,
        });

        setCategories((prev) =>
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
      console.log("Toggle category status error:", err);
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Error updating category status",
      });
    }
  };

  // ✅ DELETE (SWEETALERT)
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Category?",
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

      const res = await fetch(
        `${BASE_URL}categories/delete/${id}`,
        {
          method: "POST",
        }
      );

      const data = await res.json();
      Swal.close();

      if (data.status === true) {
        Swal.fire({
          icon: "success",
          title: data.message || "Deleted successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        setCategories((prev) =>
          prev.filter((item) => String(item.id) !== String(id))
        );
      } else {
        Swal.fire({
          icon: "error",
          title: data.message || "Delete failed",
        });
      }
    } catch (err) {
      console.log("Delete category error:", err);
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Error deleting category",
      });
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Category</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/add-category")}
        >
          + Add Category
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length > 0 ? (
              categories.map((item, index) => {
                const isActive = String(item.status) === "1";

                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>

                    <td>
                      <img
                        src={`${BASE_URL}${item.image}`}
                        alt={item.name}
                        width="70"
                        height="50"
                        style={{
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </td>

                    <td>{item.name}</td>
                    <td>{item.slug}</td>

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
                          navigate(`/admin/edit-category/${item.id}`)
                        }
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
                <td colSpan="6" className="text-center">
                  No Categories Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Category;