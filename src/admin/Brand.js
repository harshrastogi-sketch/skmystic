import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Brand() {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const fetchBrands = async () => {
    try {
      const res = await apiRequest(`${BASE_URL}brands`);
      setBrands(res.data || []);
    } catch (err) {
      console.log("Fetch brands error:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch brands",
      });
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // ✅ TOGGLE STATUS
  const handleToggleStatus = async (id, currentStatus) => {
    const isActive = String(currentStatus) === "1";

    const result = await Swal.fire({
      title: isActive ? "Deactivate Brand?" : "Activate Brand?",
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

      // 🔥 Loading
      Swal.fire({
        title: "Updating...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(`${BASE_URL}brands/update_status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      Swal.close();

      if (data.status === true) {
        Swal.fire({
          icon: "success",
          title: data.message || "Status updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        // update UI instantly
        setBrands((prev) =>
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
      console.log("Toggle brand status error:", err);
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Error updating brand status",
      });
    }
  };

  // ✅ DELETE BRAND
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Brand?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) return;

    try {
      // 🔥 Loading
      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(`${BASE_URL}brands/delete/${id}`, {
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

        // remove from UI
        setBrands((prev) =>
          prev.filter((item) => String(item.id) !== String(id))
        );
      } else {
        Swal.fire({
          icon: "error",
          title: data.message || "Delete failed",
        });
      }
    } catch (err) {
      console.log("Delete brand error:", err);
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Error deleting brand",
      });
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Brand</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/add-brand")}
        >
          + Add Brand
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Brand</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {brands.length > 0 ? (
              brands.map((item, index) => {
                const isActive = String(item.status) === "1";

                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>

                    <td>
                      {item.image ? (
                        <img
                          src={`${BASE_URL}${item.image}`}
                          alt={item.name}
                          width="70"
                          height="50"
                          style={{
                            objectFit: "contain",
                            borderRadius: "4px",
                          }}
                        />
                      ) : (
                        item.name
                      )}
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
                          navigate(`/admin/edit-brand/${item.id}`)
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
                <td colSpan="4" className="text-center">
                  No Brands Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Brand;