import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const fetchBlogs = async () => {
    try {
      const res = await apiRequest(`${BASE_URL}blogs`);
      console.log("Blogs response:", res);
      setBlogs(res.data || []);
    } catch (err) {
      console.log("Fetch blogs error:", err);

      Swal.fire({
        title: "Error!",
        text: "Failed to fetch blogs",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ✅ Toggle Status
  const handleToggleStatus = async (id, currentStatus) => {
    const isActive = String(currentStatus) === "1";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: isActive
        ? "You want to deactivate this blog?"
        : "You want to activate this blog?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      const newStatus = isActive ? 0 : 1;

      // Loading
      Swal.fire({
        title: "Updating...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(`${BASE_URL}blogs/update_status/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      Swal.close();

      if (data.status === true) {
        Swal.fire({
          title: "Success!",
          text: data.message || "Blog status updated",
          icon: "success",
        });

        setBlogs((prev) =>
          prev.map((item) =>
            String(item.id) === String(id)
              ? { ...item, status: String(newStatus) }
              : item
          )
        );
      } else {
        Swal.fire("Failed!", data.message || "Update failed", "error");
      }
    } catch (err) {
      console.log("Toggle error:", err);
      Swal.fire("Error!", "Something went wrong", "error");
    }
  };

  // ✅ Delete Blog
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This blog will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      // Loading
      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(`${BASE_URL}blogs/delete/${id}`, {
        method: "POST",
      });

      const data = await res.json();
      Swal.close();

      if (data.status === true) {
        Swal.fire({
          title: "Deleted!",
          text: data.message || "Blog deleted successfully",
          icon: "success",
        });

        setBlogs((prev) =>
          prev.filter((item) => String(item.id) !== String(id))
        );
      } else {
        Swal.fire("Failed!", data.message || "Delete failed", "error");
      }
    } catch (err) {
      console.log("Delete error:", err);
      Swal.fire("Error!", "Error deleting blog", "error");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Blogs</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/add-blog")}
        >
          + Add Blog
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th>Comments</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs.length > 0 ? (
              blogs.map((item, index) => {
                const isActive = String(item.status) === "1";

                return (
                  <tr key={item.id}>
                    <td>{index + 1}</td>

                    <td>
                      <img
                        src={`${BASE_URL}${item.image}`}
                        alt={item.title}
                        width="70"
                        height="50"
                        style={{
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </td>

                    <td>{item.title}</td>
                    <td>{item.author}</td>
                    <td>{item.date}</td>
                    <td>{item.comments || 0}</td>

                    <td>
                      <button
                        className={`btn btn-sm ${isActive ? "btn-success" : "btn-secondary"
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
                          navigate(`/admin/edit-blog/${item.id}`)
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
                <td colSpan="8" className="text-center">
                  No Blogs Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Blogs;