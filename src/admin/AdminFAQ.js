import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // ✅ FETCH FAQ
  const fetchFaqs = async () => {
    try {
      const res = await fetch(`${BASE_URL}faq`);
      const data = await res.json();

      if (data.status) {
        setFaqs(data.data);   // ✅ FIXED
      } else {
        setFaqs([]);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to fetch FAQs", "error");
    }
  };
  useEffect(() => {
    fetchFaqs();
  }, []);

  // ✅ TOGGLE STATUS
  const handleToggleStatus = async (id, currentStatus) => {
    const isActive = String(currentStatus) === "1";

    const confirm = await Swal.fire({
      title: isActive ? "Deactivate FAQ?" : "Activate FAQ?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${BASE_URL}faq/update_status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: isActive ? 0 : 1 }),
      });

      const data = await res.json();

      if (data.status) {
        fetchFaqs();
        Swal.fire("Success", "Status updated", "success");
      }
    } catch {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  // ✅ DELETE FAQ
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete FAQ?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${BASE_URL}faq/delete/${id}`, {
        method: "POST",
      });

      const data = await res.json();

      if (data.status) {
        setFaqs((prev) => prev.filter((f) => f.id !== id));
        Swal.fire("Deleted", "FAQ removed", "success");
      }
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>FAQs</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/add-faq")}
        >
          + Add FAQ
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
          {faqs.length > 0 ? (
            faqs.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>

                <td>{item.heading}</td>

                <td style={{ maxWidth: "300px" }}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        item.description?.substring(0, 120) + "...",
                    }}
                  />
                </td>

                {/* ✅ STATUS BUTTON */}
                <td>
                  <button
                    className={`btn btn-sm ${item.status == 1 ? "btn-success" : "btn-secondary"
                      }`}
                    onClick={() =>
                      handleToggleStatus(item.id, item.status)
                    }
                  >
                    {item.status == 1 ? "Active" : "Inactive"}
                  </button>
                </td>

                {/* ✅ ACTION BUTTONS */}
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() =>
                      navigate(`/admin/edit-faq/${item.id}`)
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
              <td colSpan="5" className="text-center">
                No FAQs Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FAQ;