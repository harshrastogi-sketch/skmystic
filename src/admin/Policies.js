import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Policies() {
  const [policies, setPolicies] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // ✅ FETCH POLICIES
  const fetchPolicies = async () => {
    try {
      const res = await fetch(`${BASE_URL}policies`);
      const data = await res.json(); // ✅ FIXED

      setPolicies(data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch policies", "error");
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // ✅ TOGGLE STATUS
  const handleToggleStatus = async (id, currentStatus) => {
    const isActive = String(currentStatus) === "1";

    const confirm = await Swal.fire({
      title: isActive ? "Deactivate?" : "Activate?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(
        `${BASE_URL}policies/update_status/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: isActive ? 0 : 1 }),
        }
      );

      const data = await res.json();

      if (data.status) {
        fetchPolicies();
        Swal.fire("Success", "Status updated", "success");
      }
    } catch {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Policy?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${BASE_URL}policies/delete/${id}`, {
        method: "POST",
      });

      const data = await res.json();

      if (data.status) {
        setPolicies((prev) => prev.filter((p) => p.id !== id));
        Swal.fire("Deleted", "Policy removed", "success");
      }
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Policies</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/add-policies")}
        >
          + Add Policy
        </button>
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Heading</th>
            <th>Type</th>
            <th>Description</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {policies.length > 0 ? (
            policies.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.heading}</td>
                <td>{item.type}</td>

                <td style={{ maxWidth: "300px" }}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        item.description?.substring(0, 120) + "...",
                    }}
                  />
                </td>

                <td>
                  <button
                    className={`btn btn-sm ${
                      item.status == 1 ? "btn-success" : "btn-secondary"
                    }`}
                    onClick={() =>
                      handleToggleStatus(item.id, item.status)
                    }
                  >
                    {item.status == 1 ? "Active" : "Inactive"}
                  </button>
                </td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() =>
                      navigate(`/admin/edit-policies/${item.id}`)
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
              <td colSpan="6" className="text-center">
                No Policies Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Policies;