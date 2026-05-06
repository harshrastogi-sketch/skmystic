import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AdminCustomerreview() {
  const [reviewList, setReviewList] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${BASE_URL}customerreview`);
      const data = await res.json();

      if (data.status) {
        setReviewList(data.data || []);
      } else {
        setReviewList([]);
      }
    } catch {
      Swal.fire("Error", "Failed to fetch Customer Reviews", "error");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "";
    return image.startsWith("http") ? image : `${BASE_URL}${image}`;
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const isActive = String(currentStatus) === "1";

    const confirm = await Swal.fire({
      title: isActive ? "Deactivate Customer Review?" : "Activate Customer Review?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${BASE_URL}api/updatecustomer_status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: isActive ? 0 : 1 }),
      });

      const data = await res.json();

      if (data.status) {
        fetchReviews();
        Swal.fire("Success", "Status updated", "success");
      } else {
        Swal.fire("Error", data.message || "Status update failed", "error");
      }
    } catch {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Customer Review?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${BASE_URL}api/review-delete/${id}`, {
        method: "POST",
      });

      const data = await res.json();

      if (data.status) {
        setReviewList((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Deleted", "Customer Review removed", "success");
      } else {
        Swal.fire("Error", data.message || "Delete failed", "error");
      }
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Customer Review</h2>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/add-customerreview")}
        >
          + Add Customer Review
        </button>
      </div>

      <table className="table table-bordered table-striped align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {reviewList.length > 0 ? (
            reviewList.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>

                <td>
                  {item.image ? (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      style={{
                        width: "90px",
                        height: "55px",
                        objectFit: "cover",
                        borderRadius: "50px",
                      }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>

                <td>{item.name}</td>
                <td>{item.title}</td>
                <td style={{ maxWidth: "500px" }}>{item.description}</td>

                <td>
                  <button
                    className={`btn btn-sm ${
                      String(item.status) === "1"
                        ? "btn-success"
                        : "btn-secondary"
                    }`}
                    onClick={() => handleToggleStatus(item.id, item.status)}
                  >
                    {String(item.status) === "1" ? "Active" : "Inactive"}
                  </button>
                </td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() =>
                      navigate(`/admin/edit-customerreview/${item.id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No Customer Review Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCustomerreview;