import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function EditFaq() {
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [formData, setFormData] = useState({
    heading: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchFaq = async () => {
    try {
      const res = await fetch(`${BASE_URL}faq/getByid/${id}`);
      const data = await res.json();

      if (data.status) {
        setFormData({
          heading: data.data.heading || "",
          description: data.data.description || "",
        });
      } else {
        Swal.fire("Error", "FAQ not found", "error");
        navigate("/admin/faq");
      }
    } catch {
      Swal.fire("Error", "Failed to fetch FAQ", "error");
    }
  };

  useEffect(() => {
    fetchFaq();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();

    setFormData({
      ...formData,
      description: data,
    });

    setErrors({ ...errors, description: "" });
  };

  const isEmptyHTML = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent.trim() === "" && div.querySelector("img") === null;
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.heading.trim()) {
      newErrors.heading = "Heading is required";
    }

    if (!formData.description || isEmptyHTML(formData.description)) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}faq/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status) {
        Swal.fire("Success", "FAQ updated successfully", "success");
        navigate("/admin/faq");
      } else {
        Swal.fire("Error", data.message || "Update failed", "error");
      }
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }

    setLoading(false);
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
          const formData = new FormData();
          formData.append("image", file);

          return fetch(`${BASE_URL}api/editor-image`, {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .then((res) => {
              if (!res.status) {
                throw new Error(res.message || "Image upload failed");
              }

              return {
                default: res.url, // ✅ same as before
              };
            });
        });
      },

      abort: () => {
        // optional: handle cancel upload
      },
    };
  }

  return (
    <div className="container mt-4">
      <h2>Edit FAQ</h2>

      <form onSubmit={handleSubmit} className="card p-4">
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
            <div className="text-danger">{errors.heading}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>

          <div className={errors.description ? "border border-danger p-1" : ""}>
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

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Updating..." : "Update FAQ"}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/admin/faq")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditFaq;