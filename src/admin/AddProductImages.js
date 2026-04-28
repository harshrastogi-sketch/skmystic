import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function AddProductImages() {
  const { id } = useParams();
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // ✅ Fetch images
  const fetchImages = async () => {
    try {
      const res = await fetch(`${BASE_URL}products/get_images/${id}`);
      const data = await res.json();

      if (data.status) {
        setImages(data.data || []);
      } else {
        setImages([]);
      }
    } catch (err) {
      console.log("Fetch images error:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch images",
      });
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // ✅ File select
  const handleChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  // ✅ Upload Images
  const handleUpload = async () => {
    if (!selectedFiles.length) {
      Swal.fire({
        icon: "warning",
        title: "No Files Selected",
        text: "Please select images to upload",
      });
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("images[]", selectedFiles[i]);
    }

    formData.append("product_id", id);

    try {
      // 🔥 Loading
      Swal.fire({
        title: "Uploading...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(`${BASE_URL}products/upload_images`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      Swal.close();

      if (data.status) {
        Swal.fire({
          icon: "success",
          title: "Images uploaded successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        setSelectedFiles([]);
        fetchImages();
      } else {
        Swal.fire({
          icon: "error",
          title: data.message || "Upload failed",
        });
      }
    } catch (err) {
      console.log(err);
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Error uploading images",
      });
    }
  };

  // ✅ Delete Image
  const handleDelete = async (imageId) => {
    const result = await Swal.fire({
      title: "Delete Image?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) return;

    try {
      // 🔥 Loading
      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(
        `${BASE_URL}products/delete_image/${imageId}`,
        { method: "POST" }
      );

      const data = await res.json();
      Swal.close();

      if (data.status) {
        Swal.fire({
          icon: "success",
          title: "Image deleted successfully",
          timer: 1200,
          showConfirmButton: false,
        });

        fetchImages();
      } else {
        Swal.fire({
          icon: "error",
          title: "Delete failed",
        });
      }
    } catch (err) {
      console.log(err);
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Error deleting image",
      });
    }
  };

  return (
    <div className="container mt-4">
      <h5 className="mb-3">
        <b>PRODUCT IMAGES OF PRODUCT #{id}</b>
      </h5>

      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      {/* ✅ IMAGE LIST */}
      <div className="card mb-4">
        <div className="card-body p-0">
          <table className="table table-bordered align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "60px" }}>#</th>
                <th style={{ width: "120px" }}>Image</th>
                <th style={{ width: "120px" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {images.length > 0 ? (
                images.map((img, index) => (
                  <tr key={img.id}>
                    <td>{index + 1}</td>

                    <td>
                      <img
                        src={`${BASE_URL}${img.image}`}
                        alt="product"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          border: "1px solid #ddd",
                        }}
                      />
                    </td>

                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(img.id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No Images Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ UPLOAD */}
      <div className="card">
        <div className="card-header bg-light">
          <b>➕ Add Product Images</b>
        </div>

        <div className="card-body">
          <input
            type="file"
            multiple
            className="form-control mb-3"
            onChange={handleChange}
          />

          <button className="btn btn-info" onClick={handleUpload}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddProductImages;