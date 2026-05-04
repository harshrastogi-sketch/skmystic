import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function EditPolicy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [formData, setFormData] = useState({
    type: "",
    heading: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ FETCH SINGLE POLICY
  const fetchPolicy = async () => {
    try {
      const res = await fetch(`${BASE_URL}policies/getByid/${id}`);
      const data = await res.json();

      if (data) {
        setFormData({
          type: data.type || "",
          heading: data.heading || "",
          description: data.description || "",
        });
      }
    } catch (err) {
      Swal.fire("Error", "Failed to fetch policy", "error");
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // CKEDITOR CHANGE
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();

    setFormData((prev) => ({
      ...prev,
      description: data,
    }));

    setErrors((prev) => ({
      ...prev,
      description: "",
    }));
  };

  // VALIDATION
  const validate = () => {
    let temp = {};

    if (!formData.type) temp.type = "Required";
    if (!formData.heading.trim()) temp.heading = "Required";
    if (!formData.description.trim()) temp.description = "Required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // SUBMIT (UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      Swal.fire({
        title: "Updating...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(`${BASE_URL}policies/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id, // ✅ IMPORTANT
          ...formData,
        }),
      });

      const data = await res.json();
      Swal.close();

      if (data.status) {
        Swal.fire({
          icon: "success",
          title: "Updated Successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/admin/policies");
        }, 1500);
      } else {
        Swal.fire("Error", data.message || "Update failed", "error");
      }
    } catch (err) {
      Swal.close();
      Swal.fire("Error", "Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Edit Policy</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/policies")}
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">

        {/* TYPE */}
        <div className="mb-3">
          <label className="form-label">Policy Type</label>
          <select
            name="type"
            className={`form-control ${errors.type ? "is-invalid" : ""}`}
            value={formData.type}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="privacy">Privacy Policy</option>
            <option value="terms">Terms & Conditions</option>
            <option value="refund">Refund Policy</option>
            <option value="shipping">Shipping Policy</option>
          </select>
          {errors.type && (
            <div className="invalid-feedback">{errors.type}</div>
          )}
        </div>

        {/* HEADING */}
        <div className="mb-3">
          <label className="form-label">Heading</label>
          <input
            type="text"
            name="heading"
            className={`form-control ${errors.heading ? "is-invalid" : ""}`}
            value={formData.heading}
            onChange={handleChange}
          />
          {errors.heading && (
            <div className="invalid-feedback">{errors.heading}</div>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="mb-3">
          <label className="form-label">Description</label>

          <div className={errors.description ? "border border-danger" : ""}>
            <CKEditor
              editor={ClassicEditor}
              data={formData.description}
              onChange={handleEditorChange}
            />
          </div>

          {errors.description && (
            <div className="text-danger">{errors.description}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Updating..." : "Update Policy"}
        </button>

      </form>
    </div>
  );
}

export default EditPolicy;