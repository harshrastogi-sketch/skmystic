import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function AddProductImages() {
  const { id } = useParams();
  const BASE_URL = "https://harsh.skmysticastrologer.in/CodeIgniter/";
  // const BASE_URL = "http://localhost/CodeIgniter/";

  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Fetch images
  const fetchImages = async () => {
    try {
      const res = await fetch(`${BASE_URL}products/get_images/${id}`);
      const data = await res.json();

      if (data.status) {
        setImages(data.data || []);
      }
    } catch (err) {
      console.log("Fetch images error:", err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // File select
  const handleChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  // Upload
  const handleUpload = async () => {
    if (!selectedFiles.length) {
      alert("Please select images");
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("images[]", selectedFiles[i]);
    }

    formData.append("product_id", id);

    try {
      const res = await fetch(`${BASE_URL}products/upload_images`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status) {
        alert("Images uploaded successfully");
        setSelectedFiles([]);
        fetchImages();
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.log(err);
      alert("Error uploading images");
    }
  };

  // Delete
  const handleDelete = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      const res = await fetch(
        `${BASE_URL}products/delete_image/${imageId}`,
        { method: "POST" }
      );

      const data = await res.json();

      if (data.status) {
        fetchImages();
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mt-4">
      <h5 className="mb-3">
        <b>PRODUCT IMAGES OF PRODUCT #{id}</b>
      </h5>

      {/* ✅ LIST TABLE */}
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

                    {/* IMAGE */}
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



                    {/* ACTION */}
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
                  <td colSpan="4" className="text-center">
                    No Images Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPLOAD */}
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