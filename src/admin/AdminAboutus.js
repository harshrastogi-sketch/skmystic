import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AboutDescription({ html }) {
  const div = document.createElement("div");
  div.innerHTML = html || "";

  const img = div.querySelector("img");
  const text = div.textContent || "";

  return (
    <div>
      {img && (
        <img
          src={img.getAttribute("src")}
          alt="About Us"
          style={{
            width: "120px",
            height: "70px",
            objectFit: "cover",
            borderRadius: "6px",
            marginBottom: "6px",
            display: "block",
          }}
        />
      )}

      <div>{text.length > 120 ? text.substring(0, 120) + "..." : text}</div>
    </div>
  );
}

function AboutUs() {
  const [aboutList, setAboutList] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const fetchAboutUs = async () => {
    try {
      const res = await fetch(`${BASE_URL}aboutus`);
      const data = await res.json();

      if (data.status) {
        setAboutList(data.data);
      } else {
        setAboutList([]);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to fetch About Us", "error");
    }
  };

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const isActive = String(currentStatus) === "1";

    const confirm = await Swal.fire({
      title: isActive ? "Deactivate About Us?" : "Activate About Us?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${BASE_URL}aboutus/update_status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: isActive ? 0 : 1 }),
      });

      const data = await res.json();

      if (data.status) {
        fetchAboutUs();
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
      title: "Delete About Us?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${BASE_URL}aboutus/delete/${id}`, {
        method: "POST",
      });

      const data = await res.json();

      if (data.status) {
        setAboutList((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Deleted", "About Us removed", "success");
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
        <h2>About Us</h2>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/add-aboutus")}
        >
          + Add About Us
        </button>
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Heading</th>
            <th>Description</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {aboutList.length > 0 ? (
            aboutList.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>

                <td>{item.heading}</td>

                <td style={{ maxWidth: "300px" }}>
                  <AboutDescription html={item.description} />
                </td>

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
                    onClick={() => navigate(`/admin/edit-aboutus/${item.id}`)}
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
              <td colSpan="5" className="text-center">
                No About Us Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AboutUs;