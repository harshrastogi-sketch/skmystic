import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function AddPolicy() {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [formData, setFormData] = useState({
    type: "",
    heading: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ validation errors
  const [errors, setErrors] = useState({});

  // handle input change
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

  // CKEditor change
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

  // ✅ validation
  const validate = () => {
    let tempErrors = {};

    if (!formData.type) {
      tempErrors.type = "Policy type is required";
    }

    if (!formData.heading.trim()) {
      tempErrors.heading = "Policy heading is required";
    }

    if (!formData.description.trim()) {
      tempErrors.description = "Policy description is required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      Swal.fire({
        title: "Saving policy...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(`${BASE_URL}policies/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      Swal.close();

      if (result.status === true) {
        Swal.fire({
          icon: "success",
          title: result.message || "Policy added successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/admin/policies");
        }, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: result.message || "Failed to add policy",
        });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Server Error",
      });
    } finally {
      setLoading(false);
    }
  };

  function MyUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return createUploadAdapter(loader);
    };
  }

  function createUploadAdapter(loader) {
    return {
      upload: () => {
        return loader.file.then((file) => {
          const imageFormData = new FormData();
          imageFormData.append("image", file);

          return fetch(`${BASE_URL}api/editor-image`, {
            method: "POST",
            body: imageFormData,
          })
            .then((res) => res.json())
            .then((res) => {
              if (!res.status) {
                throw new Error(res.message || "Image upload failed");
              }

              return {
                default: res.url,
              };
            });
        });
      },

      abort: () => { },
    };
  }
  
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Add Policies</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/policies")}
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">

        {/* POLICY TYPE */}
        <div className="mb-3">
          <label className="form-label">Policies Type</label>
          <select
            name="type"
            className={`form-control ${errors.type ? "is-invalid" : ""}`}
            value={formData.type}
            onChange={handleChange}
          >
            <option value="">Select Policy Type</option>
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
          <label className="form-label">Policy Heading</label>
          <input
            type="text"
            name="heading"
            className={`form-control ${errors.heading ? "is-invalid" : ""}`}
            value={formData.heading}
            onChange={handleChange}
            placeholder="Policy Heading"
          />
          {errors.heading && (
            <div className="invalid-feedback">{errors.heading}</div>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="mb-3">
          <label className="form-label">Policy Description</label>

          <div className={errors.description ? "border border-danger" : ""}>
            <CKEditor
              editor={ClassicEditor}
              data={formData.description}
              config={{
                extraPlugins: [MyUploadAdapterPlugin],
              }}
              onChange={handleEditorChange}
            />
          </div>

          {errors.description && (
            <div className="text-danger mt-1">{errors.description}</div>
          )}
        </div>

        {/* SUBMIT */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Add Policy"}
        </button>

      </form>
    </div>
  );
}

export default AddPolicy;