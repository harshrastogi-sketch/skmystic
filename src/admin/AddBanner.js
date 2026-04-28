import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

function AddBanner() {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [title, setTitle] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    if (!token || !user || user.role !== "admin") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBannerImage(file || null);

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!title.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Title is required",
      });
    }

    if (!bannerImage) {
      return Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Banner image is required",
      });
    }

    try {
      setLoading(true);

      Swal.fire({
        title: "Saving banner...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("image", bannerImage);

      const res = await fetch(`${BASE_URL}api/add-banner`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      Swal.close();

      if (data.status) {
        Swal.fire({
          icon: "success",
          title: "Banner added successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/admin/banner");
        }, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: data.message || "Add banner failed",
        });
      }
    } catch (error) {
      console.log("Add banner error:", error);
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong while adding banner",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <h3 className="mb-0 text-info fw-bold">Add Banner</h3>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3 row align-items-center">
              <label className="col-sm-2 col-form-label">Title</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter banner title"
                />
              </div>
            </div>

            <div className="mb-3 row align-items-center">
              <label className="col-sm-2 col-form-label">Banner</label>
              <div className="col-sm-10">
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {preview && (
              <div className="mb-3 row">
                <label className="col-sm-2 col-form-label">Preview</label>
                <div className="col-sm-10">
                  <img
                    src={preview}
                    alt="Banner Preview"
                    style={{
                      width: "220px",
                      height: "110px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-sm-10 offset-sm-2 d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-info text-white px-4"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={() => navigate("/admin/banner")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddBanner;