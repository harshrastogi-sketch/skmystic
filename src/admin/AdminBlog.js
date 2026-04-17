import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const res = await apiRequest("https://harsh.skmysticastrologer.in/CodeIgniter/blogs");
      console.log("Blogs response:", res);
      setBlogs(res.data || []);
    } catch (err) {
      console.log("Fetch blogs error:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const isActive = String(currentStatus) === "1";

    const confirmChange = window.confirm(
      isActive
        ? "Are you sure you want to deactivate this blog?"
        : "Are you sure you want to activate this blog?"
    );

    if (!confirmChange) return;

    try {
      const newStatus = isActive ? 0 : 1;

      const res = await fetch(
        `https://harsh.skmysticastrologer.in/CodeIgniter/blogs/update_status/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();
      console.log("Toggle response:", data);

      if (data.status === true) {
        alert(data.message || "Blog status updated successfully");

        setBlogs((prev) =>
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
      console.log("Toggle error:", err);
      alert("Error updating blog status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch(
        `https://harsh.skmysticastrologer.in/CodeIgniter/blogs/delete/${id}`,
        {
          method: "POST",
        }
      );

      const data = await res.json();
      console.log("Delete response:", data);

      if (data.status === true) {
        alert(data.message || "Blog deleted successfully");

        setBlogs((prev) =>
          prev.filter((item) => String(item.id) !== String(id))
        );
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.log("Delete error:", err);
      alert("Error deleting blog");
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
                        src={`https://harsh.skmysticastrologer.in/CodeIgniter/${item.image}`}
                        alt={item.title}
                        width="70"
                        height="50"
                        style={{ objectFit: "cover", borderRadius: "4px" }}
                      />
                    </td>

                    <td>{item.title}</td>
                    <td>{item.author}</td>
                    <td>{item.date}</td>
                    <td>{item.comments || 0}</td>

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
                        onClick={() => navigate(`/admin/edit-blog/${item.id}`)}
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