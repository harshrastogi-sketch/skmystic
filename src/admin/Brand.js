import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";

function Brand() {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const fetchBrands = async () => {
    try {
      const res = await apiRequest(`${BASE_URL}brands`);
      console.log("Brands response:", res);
      setBrands(res.data || []);
    } catch (err) {
      console.log("Fetch brands error:", err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const isActive = String(currentStatus) === "1";

    const confirmChange = window.confirm(
      isActive
        ? "Are you sure you want to deactivate this brand?"
        : "Are you sure you want to activate this brand?"
    );

    if (!confirmChange) return;

    try {
      const newStatus = isActive ? 0 : 1;

      const res = await fetch(`${BASE_URL}brands/update_status/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();
      console.log("Toggle brand status response:", data);

      if (data.status === true) {
        alert(data.message || "Brand status updated successfully");

        setBrands((prev) =>
          prev.map((item) =>
            String(item.id) === String(id)
              ? { ...item, status: String(newStatus) }
              : item
          )
        );
      } else {
        alert(data.message || "Failed to update brand status");
      }
    } catch (err) {
      console.log("Toggle brand status error:", err);
      alert("Error updating brand status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    try {
      const res = await fetch(`${BASE_URL}brands/delete/${id}`, {
          method: "POST",
        }
      );

      const data = await res.json();
      console.log("Delete brand response:", data);

      if (data.status === true) {
        alert(data.message || "Brand deleted successfully");

        setBrands((prev) =>
          prev.filter((item) => String(item.id) !== String(id))
        );
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.log("Delete brand error:", err);
      alert("Error deleting brand");
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
                          style={{ objectFit: "contain", borderRadius: "4px" }}
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
                        onClick={() => handleToggleStatus(item.id, item.status)}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => navigate(`/admin/edit-brand/${item.id}`)}
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
                <td colSpan="5" className="text-center">
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